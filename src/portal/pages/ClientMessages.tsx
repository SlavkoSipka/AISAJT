import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useMessages } from '../hooks/useMessages';
import { MessageThread } from '../components/client/MessageThread';
import { Topbar } from '../components/layout/Topbar';
import { Loader2 } from 'lucide-react';
import '../portal.css';

export function ClientMessages() {
  const { profile } = useAuth();
  const { messages, loading: messagesLoading, sendMessage, markAsRead } = useMessages(profile?.id);

  useEffect(() => {
    if (profile?.id) markAsRead();
  }, [profile?.id, messages.length, markAsRead]);

  if (!profile) {
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
          style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden', maxWidth: 860 }}
        >
          {/* Chat header */}
          <div style={{
            padding: '14px 18px', borderBottom: '1px solid #e3e7ee',
            display: 'flex', alignItems: 'center', gap: 10,
            background: '#fff', borderRadius: '10px 10px 0 0',
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: '50%',
              background: '#1a1f4e', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, color: '#fff', letterSpacing: 0.5,
            }}>
              AI
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#1a2030' }}>AiSajt tim</p>
              <p style={{ margin: 0, fontSize: 11, color: '#9aa3b2' }}>AiSajt podrška</p>
            </div>
          </div>

          {/* Thread */}
          {messagesLoading ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5' }}>
              <Loader2 className="w-5 h-5 text-[#00bcd4] animate-spin" />
            </div>
          ) : (
            <MessageThread
              messages={messages}
              currentUserId={profile?.id || ''}
              onSend={sendMessage}
            />
          )}
        </div>
      </main>
    </>
  );
}
