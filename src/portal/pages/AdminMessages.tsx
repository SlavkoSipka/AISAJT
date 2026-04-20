import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { useMessages } from '../hooks/useMessages';
import { MessageThread } from '../components/client/MessageThread';
import { Topbar } from '../components/layout/Topbar';
import { Loader2, User, Search, MessageSquare, ArrowLeft } from 'lucide-react';
import type { Profile, Message } from '../lib/types';
import '../portal.css';

interface ConversationRow {
  client: Profile;
  lastMessage: Message | null;
  unreadCount: number;
}

function formatPreviewTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString('sr-Latn', { hour: '2-digit', minute: '2-digit' });
  }
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return 'Juče';
  return d.toLocaleDateString('sr-Latn', { day: 'numeric', month: 'short' });
}

function getInitials(name: string | null | undefined) {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

export function AdminMessages() {
  const { profile: adminProfile } = useAuth();
  const [conversations, setConversations] = useState<ConversationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const fetchConversations = useCallback(async () => {
    setLoading(true);

    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'client')
      .order('created_at', { ascending: false });

    const clientList = (profiles as Profile[]) || [];
    if (clientList.length === 0) {
      setConversations([]);
      setLoading(false);
      return;
    }

    const ids = clientList.map(p => p.id);

    const [{ data: lastMsgs }, { data: unreadRows }] = await Promise.all([
      supabase
        .from('messages')
        .select('*')
        .in('client_id', ids)
        .order('created_at', { ascending: false }),
      supabase
        .from('messages')
        .select('client_id, sender_id')
        .eq('is_read', false)
        .in('client_id', ids),
    ]);

    const lastByClient = new Map<string, Message>();
    ((lastMsgs as Message[]) || []).forEach(m => {
      if (!lastByClient.has(m.client_id)) lastByClient.set(m.client_id, m);
    });

    const unreadByClient = new Map<string, number>();
    ((unreadRows as { client_id: string; sender_id: string }[]) || []).forEach(m => {
      if (adminProfile && m.sender_id === adminProfile.id) return;
      unreadByClient.set(m.client_id, (unreadByClient.get(m.client_id) || 0) + 1);
    });

    const rows: ConversationRow[] = clientList.map(c => ({
      client: c,
      lastMessage: lastByClient.get(c.id) || null,
      unreadCount: unreadByClient.get(c.id) || 0,
    }));

    rows.sort((a, b) => {
      const ta = a.lastMessage?.created_at || '';
      const tb = b.lastMessage?.created_at || '';
      if (ta && tb) return tb.localeCompare(ta);
      if (ta) return -1;
      if (tb) return 1;
      return 0;
    });

    setConversations(rows);
    setLoading(false);
  }, [adminProfile]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Refresh conversation list whenever any message changes
  useEffect(() => {
    const channel = supabase
      .channel('admin-messages-list')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => {
        fetchConversations();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchConversations]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter(c =>
      (c.client.full_name || '').toLowerCase().includes(q),
    );
  }, [conversations, search]);

  const selectedClient = conversations.find(c => c.client.id === selectedClientId)?.client || null;
  const { messages, sendMessage, markAsRead, loading: threadLoading } = useMessages(selectedClientId || undefined);

  // Mark as read when opening a thread
  useEffect(() => {
    if (selectedClientId && messages.length > 0) {
      markAsRead();
    }
  }, [selectedClientId, messages.length, markAsRead]);

  if (!adminProfile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 text-[#00bcd4] animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Topbar title="Poruke" />
      <main style={{ padding: '20px 24px', height: 'calc(100vh - 54px)', display: 'flex', flexDirection: 'column' }}>
        <div
          className="portal-card portal-animate-in"
          style={{
            flex: 1,
            display: 'flex',
            padding: 0,
            overflow: 'hidden',
          }}
        >
          {/* ── Conversations list ─────────────────────────────────────── */}
          <aside
            style={{
              width: 320,
              borderRight: '1px solid #e3e7ee',
              display: 'flex',
              flexDirection: 'column',
              background: '#fff',
            }}
            className={`admin-msgs-list ${selectedClientId ? 'has-selection' : ''}`}
          >
            <div style={{ padding: '14px 16px', borderBottom: '1px solid #e3e7ee' }}>
              <div style={{ position: 'relative' }}>
                <Search
                  size={14}
                  style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9aa3b2' }}
                />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Pretraži klijente..."
                  style={{
                    width: '100%',
                    padding: '8px 10px 8px 32px',
                    fontSize: 13,
                    border: '1px solid #e3e7ee',
                    borderRadius: 8,
                    outline: 'none',
                    background: '#f7f8fa',
                    color: '#1a2030',
                  }}
                />
              </div>
            </div>

            <div className="portal-scrollbar" style={{ flex: 1, overflowY: 'auto' }}>
              {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 0' }}>
                  <Loader2 className="w-5 h-5 text-[#00bcd4] animate-spin" />
                </div>
              ) : filtered.length === 0 ? (
                <div style={{ padding: '32px 16px', textAlign: 'center' }}>
                  <MessageSquare size={28} style={{ color: '#c0c5d0', margin: '0 auto 8px' }} />
                  <p style={{ fontSize: 13, color: '#9aa3b2', margin: 0 }}>
                    {search ? 'Nema rezultata' : 'Nema klijenata'}
                  </p>
                </div>
              ) : (
                filtered.map(({ client, lastMessage, unreadCount }) => {
                  const isSelected = client.id === selectedClientId;
                  const isOwnLast = lastMessage?.sender_id === adminProfile.id;
                  const previewBody = lastMessage?.body
                    || (lastMessage?.attachment_name ? `📎 ${lastMessage.attachment_name}` : '');
                  return (
                    <button
                      key={client.id}
                      onClick={() => setSelectedClientId(client.id)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '12px 16px',
                        border: 'none',
                        borderBottom: '1px solid #f0f2f5',
                        background: isSelected ? '#e6f7fa' : 'transparent',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background 0.12s',
                      }}
                      onMouseEnter={e => {
                        if (!isSelected) (e.currentTarget as HTMLButtonElement).style.background = '#f7f8fa';
                      }}
                      onMouseLeave={e => {
                        if (!isSelected) (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                      }}
                    >
                      <div
                        style={{
                          width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                          background: '#e3e7ee', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 12, fontWeight: 700, color: '#5a6478',
                        }}
                      >
                        {getInitials(client.full_name)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                          <p style={{
                            fontSize: 13, fontWeight: unreadCount > 0 ? 700 : 600,
                            color: '#1a2030', margin: 0,
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          }}>
                            {client.full_name || 'Bez imena'}
                          </p>
                          {lastMessage && (
                            <span style={{
                              fontSize: 10,
                              color: unreadCount > 0 ? '#00bcd4' : '#9aa3b2',
                              fontWeight: unreadCount > 0 ? 600 : 400,
                              flexShrink: 0,
                            }}>
                              {formatPreviewTime(lastMessage.created_at)}
                            </span>
                          )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, marginTop: 2 }}>
                          <p style={{
                            fontSize: 12,
                            color: unreadCount > 0 ? '#1a2030' : '#9aa3b2',
                            fontWeight: unreadCount > 0 ? 500 : 400,
                            margin: 0,
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          }}>
                            {previewBody
                              ? `${isOwnLast ? 'Vi: ' : ''}${previewBody}`
                              : <span style={{ fontStyle: 'italic', color: '#c0c5d0' }}>Nema poruka</span>}
                          </p>
                          {unreadCount > 0 && (
                            <span style={{
                              minWidth: 18, height: 18, borderRadius: 9,
                              background: '#00bcd4', color: '#fff',
                              fontSize: 10, fontWeight: 700,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              padding: '0 5px', flexShrink: 0,
                            }}>
                              {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </aside>

          {/* ── Thread area ────────────────────────────────────────────── */}
          <section
            className={`admin-msgs-thread ${selectedClientId ? 'has-selection' : ''}`}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}
          >
            {selectedClient ? (
              <>
                <div style={{
                  padding: '14px 18px', borderBottom: '1px solid #e3e7ee',
                  display: 'flex', alignItems: 'center', gap: 10, background: '#fff',
                }}>
                  <button
                    onClick={() => setSelectedClientId(null)}
                    className="admin-msgs-back"
                    style={{
                      display: 'none',
                      border: 'none', background: 'transparent', cursor: 'pointer',
                      padding: 4, color: '#5a6478', borderRadius: 6,
                    }}
                    aria-label="Nazad"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <div style={{
                    width: 38, height: 38, borderRadius: '50%',
                    background: '#e3e7ee', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 700, color: '#5a6478', letterSpacing: 0.5,
                  }}>
                    {getInitials(selectedClient.full_name)}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#1a2030' }}>
                      {selectedClient.full_name || 'Bez imena'}
                    </p>
                    <p style={{ margin: 0, fontSize: 11, color: '#9aa3b2' }}>Klijent</p>
                  </div>
                </div>

                {threadLoading ? (
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5' }}>
                    <Loader2 className="w-5 h-5 text-[#00bcd4] animate-spin" />
                  </div>
                ) : (
                  <MessageThread
                    messages={messages}
                    currentUserId={adminProfile.id}
                    onSend={sendMessage}
                  />
                )}
              </>
            ) : (
              <div style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 12,
                background: '#f7f8fa', padding: 24, textAlign: 'center',
              }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: '#e3e7ee', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <User size={28} style={{ color: '#9aa3b2' }} />
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#1a2030', margin: 0 }}>
                    Izaberite klijenta
                  </p>
                  <p style={{ fontSize: 12, color: '#9aa3b2', margin: '4px 0 0' }}>
                    Otvorite razgovor sa bilo kojim klijentom iz liste sa leve strane.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      <style>{`
        @media (max-width: 768px) {
          .admin-msgs-list {
            width: 100% !important;
          }
          .admin-msgs-list.has-selection {
            display: none !important;
          }
          .admin-msgs-thread:not(.has-selection) {
            display: none !important;
          }
          .admin-msgs-back {
            display: inline-flex !important;
          }
        }
      `}</style>
    </>
  );
}
