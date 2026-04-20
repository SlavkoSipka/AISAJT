import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Paperclip, X, FileText, Download, Check, CheckCheck, AlertCircle, Loader2, Clock } from 'lucide-react';
import type { Message } from '../../lib/types';

// Max file sizes
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;  // 10 MB
const MAX_FILE_SIZE  = 20 * 1024 * 1024;  // 20 MB

interface MessageThreadProps {
  messages: Message[];
  currentUserId: string;
  onSend: (body: string, attachment?: File) => Promise<void>;
  compact?: boolean;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('sr-Latn', { hour: '2-digit', minute: '2-digit' });
}

function formatDateSeparator(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return 'Danas';
  if (d.toDateString() === yesterday.toDateString()) return 'Juče';
  return d.toLocaleDateString('sr-Latn', { day: 'numeric', month: 'long', year: 'numeric' });
}

function isSameDay(a: string, b: string) {
  return new Date(a).toDateString() === new Date(b).toDateString();
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getInitials(name: string | null | undefined) {
  if (!name) return 'A';
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

// ── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ name, isAdmin }: { name: string | null | undefined; isAdmin: boolean }) {
  return (
    <div
      style={{
        width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, fontWeight: 700, letterSpacing: 0.3,
        background: isAdmin ? '#1a1f4e' : '#e3e7ee',
        color: isAdmin ? '#fff' : '#5a6478',
      }}
    >
      {getInitials(name)}
    </div>
  );
}

// ── Attachment preview in bubble ─────────────────────────────────────────────
function AttachmentPreview({ msg }: { msg: Message }) {
  if (!msg.attachment_url) return null;
  const isImage = msg.attachment_type === 'image';

  if (isImage) {
    return (
      <a href={msg.attachment_url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', marginBottom: msg.body ? 8 : 0 }}>
        <img
          src={msg.attachment_url}
          alt={msg.attachment_name || 'slika'}
          style={{
            maxWidth: 240, maxHeight: 200, borderRadius: 10,
            display: 'block', objectFit: 'cover',
            border: '1px solid rgba(0,0,0,0.06)',
          }}
        />
      </a>
    );
  }

  const Icon = msg.attachment_type === 'pdf' ? FileText : FileText;
  return (
    <a
      href={msg.attachment_url}
      target="_blank"
      rel="noopener noreferrer"
      download={msg.attachment_name}
      style={{
        display: 'flex', alignItems: 'center', gap: 10, marginBottom: msg.body ? 8 : 0,
        padding: '10px 12px', borderRadius: 10,
        background: 'rgba(0,0,0,0.05)',
        textDecoration: 'none',
      }}
    >
      <div style={{ width: 36, height: 36, borderRadius: 8, background: '#00bcd4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={18} color="#fff" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: '#1a2030', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {msg.attachment_name || 'Fajl'}
        </p>
        {msg.attachment_size && (
          <p style={{ fontSize: 10, color: '#9aa3b2', margin: '2px 0 0' }}>
            {formatFileSize(msg.attachment_size)}
          </p>
        )}
      </div>
      <Download size={15} style={{ color: '#9aa3b2', flexShrink: 0 }} />
    </a>
  );
}

// ── File attachment preview (before send) ────────────────────────────────────
function PendingAttachment({ file, onRemove }: { file: File; onRemove: () => void }) {
  const isImage = file.type.startsWith('image/');
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!isImage) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file, isImage]);

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '8px 12px', background: '#e6f7fa', borderRadius: 10,
      border: '1px solid #b2e8f0', marginBottom: 8, position: 'relative',
    }}>
      {isImage && preview ? (
        <img src={preview} alt="" style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 6 }} />
      ) : (
        <div style={{ width: 44, height: 44, borderRadius: 6, background: '#00bcd4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FileText size={20} color="#fff" />
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: '#1a2030', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {file.name}
        </p>
        <p style={{ fontSize: 10, color: '#5a6478', margin: '2px 0 0' }}>{formatFileSize(file.size)}</p>
      </div>
      <button
        onClick={onRemove}
        style={{ padding: 4, border: 'none', background: 'none', cursor: 'pointer', color: '#9aa3b2', borderRadius: 4 }}
      >
        <X size={16} />
      </button>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export function MessageThread({ messages, currentUserId, onSend, compact }: MessageThreadProps) {
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-grow textarea
  const adjustTextarea = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, []);

  useEffect(() => {
    adjustTextarea();
  }, [input, adjustTextarea]);

  const handleSend = async () => {
    const text = input.trim();
    if ((!text && !attachment) || sending) return;
    setSending(true);
    const file = attachment;
    setInput('');
    setAttachment(null);
    setFileError(null);
    try {
      await onSend(text, file ?? undefined);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!fileInputRef.current) return;
    fileInputRef.current.value = '';
    if (!file) return;
    setFileError(null);

    const isImage = file.type.startsWith('image/');
    const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_FILE_SIZE;

    if (file.size > maxSize) {
      setFileError(`Fajl je prevelik. Maksimum: ${isImage ? '10 MB za slike' : '20 MB za dokumente'}.`);
      return;
    }
    setAttachment(file);
  };

  // Build grouped messages: [{date, messages, showAvatar}]
  // Group consecutive messages from same sender together
  const grouped: { msg: Message; showDate: boolean; showAvatar: boolean; isLastInGroup: boolean }[] = messages.map((msg, i) => {
    const prev = messages[i - 1];
    const next = messages[i + 1];
    const showDate = !prev || !isSameDay(prev.created_at, msg.created_at);
    const sameAsPrev = prev && prev.sender_id === msg.sender_id && !showDate;
    const sameAsNext = next && next.sender_id === msg.sender_id && isSameDay(msg.created_at, next.created_at);
    return {
      msg,
      showDate,
      showAvatar: !sameAsNext, // show avatar only on last message in group
      isLastInGroup: !sameAsNext,
    };
  });

  const chatHeight = compact ? 280 : 'calc(100vh - 220px)';
  const minChatHeight = compact ? 280 : 420;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* ── Messages area ─────────────────────────────────────────────── */}
      <div
        className="portal-scrollbar"
        style={{
          flex: 1,
          overflowY: 'auto',
          minHeight: minChatHeight,
          maxHeight: chatHeight,
          padding: '16px 12px 8px',
          background: '#f0f2f5',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e3e7ee' fill-opacity='0.5'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      >
        {messages.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 8 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#e3e7ee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Send size={22} style={{ color: '#9aa3b2' }} />
            </div>
            <p style={{ fontSize: 13, color: '#9aa3b2', margin: 0 }}>Još nema poruka. Započnite konverzaciju!</p>
          </div>
        )}

        {grouped.map(({ msg, showDate, showAvatar, isLastInGroup }, i) => {
          const isOwn = msg.sender_id === currentUserId;
          const senderName = msg.sender?.full_name || (msg.sender?.role === 'admin' ? 'AiSajt tim' : 'Klijent');
          const isAdmin = msg.sender?.role === 'admin';
          const hasAttachment = !!msg.attachment_url;
          const hasBody = !!msg.body?.trim();

          // Show sender name if first in group and not own message
          const showSenderName = !isOwn && (i === 0 || grouped[i - 1]?.msg.sender_id !== msg.sender_id || showDate);

          return (
            <div key={msg.id}>
              {/* Date separator */}
              {showDate && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '8px 0 12px' }}>
                  <span style={{
                    fontSize: 11, fontWeight: 500, color: '#5a6478',
                    background: 'rgba(255,255,255,0.85)', padding: '3px 12px',
                    borderRadius: 99, boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
                  }}>
                    {formatDateSeparator(msg.created_at)}
                  </span>
                </div>
              )}

              {/* Message row */}
              <div style={{
                display: 'flex',
                flexDirection: isOwn ? 'row-reverse' : 'row',
                alignItems: 'flex-end',
                gap: 6,
                marginBottom: isLastInGroup ? 10 : 3,
              }}>
                {/* Avatar (other side only) */}
                {!isOwn && (
                  <div style={{ width: 32, flexShrink: 0 }}>
                    {showAvatar && <Avatar name={senderName} isAdmin={isAdmin} />}
                  </div>
                )}

                {/* Bubble */}
                <div style={{ maxWidth: compact ? '85%' : '68%' }}>
                  {/* Sender name */}
                  {showSenderName && (
                    <p style={{ fontSize: 11, fontWeight: 600, color: '#00bcd4', margin: '0 0 3px 12px' }}>
                      {senderName}
                    </p>
                  )}

                  <div style={{
                    padding: (hasAttachment && !hasBody) ? '4px 4px 6px' : '8px 12px 6px',
                    borderRadius: isOwn
                      ? (isLastInGroup ? '16px 16px 4px 16px' : '16px 16px 16px 16px')
                      : (isLastInGroup ? '16px 16px 16px 4px' : '16px 16px 16px 16px'),
                    background: isOwn ? '#1a1f4e' : '#ffffff',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                    position: 'relative',
                  }}>
                    {/* Attachment */}
                    {hasAttachment && (
                      <div style={{ padding: hasBody ? '4px 4px 0' : '4px' }}>
                        <AttachmentPreview msg={msg} />
                      </div>
                    )}

                    {/* Text body */}
                    {hasBody && (
                      <p style={{
                        fontSize: 13.5, lineHeight: 1.5, margin: 0,
                        color: isOwn ? '#e8f4f8' : '#1a2030',
                        wordBreak: 'break-word', whiteSpace: 'pre-wrap',
                        paddingBottom: 2,
                        paddingLeft: hasAttachment ? 4 : 0,
                        paddingRight: hasAttachment ? 4 : 0,
                      }}>
                        {msg.body}
                      </p>
                    )}

                    {/* Timestamp + read receipt */}
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                      gap: 3, marginTop: 3,
                      paddingLeft: hasAttachment ? 4 : 0,
                      paddingRight: hasAttachment ? 4 : 0,
                    }}>
                      <span style={{ fontSize: 10, color: isOwn ? 'rgba(255,255,255,0.5)' : '#9aa3b2' }}>
                        {formatTime(msg.created_at)}
                      </span>
                      {isOwn && (
                        msg._pending
                          ? <Clock size={12} style={{ color: 'rgba(255,255,255,0.35)' }} />
                          : msg.is_read
                            ? <CheckCheck size={13} style={{ color: '#00bcd4' }} />
                            : <Check size={13} style={{ color: 'rgba(255,255,255,0.4)' }} />
                      )}
                    </div>
                  </div>
                </div>

                {/* Own side spacer */}
                {isOwn && <div style={{ width: 32, flexShrink: 0 }} />}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* ── Input area ────────────────────────────────────────────────── */}
      <div style={{
        background: '#f7f8fa',
        borderTop: '1px solid #e3e7ee',
        padding: '10px 12px 12px',
      }}>
        {/* File error */}
        {fileError && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 10px', marginBottom: 8,
            background: '#fff0f0', border: '1px solid #ffcdd2', borderRadius: 8,
            fontSize: 12, color: '#e53e3e',
          }}>
            <AlertCircle size={13} />
            {fileError}
            <button onClick={() => setFileError(null)} style={{ marginLeft: 'auto', border: 'none', background: 'none', cursor: 'pointer', color: '#e53e3e', padding: 0 }}>
              <X size={13} />
            </button>
          </div>
        )}

        {/* Pending attachment preview */}
        {attachment && (
          <PendingAttachment file={attachment} onRemove={() => setAttachment(null)} />
        )}

        {/* Input row */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
          {/* Paperclip */}
          <button
            onClick={() => fileInputRef.current?.click()}
            title="Priloži fajl (maks. 10 MB za slike, 20 MB za dokumente)"
            style={{
              width: 40, height: 40, borderRadius: '50%', border: 'none',
              background: '#e3e7ee', cursor: 'pointer', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#5a6478', transition: 'background 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#d0d5e0'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#e3e7ee'; }}
          >
            <Paperclip size={18} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.zip,.txt"
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />

          {/* Textarea */}
          <div style={{
            flex: 1, background: '#fff', borderRadius: 24,
            border: '1px solid #e3e7ee', display: 'flex', alignItems: 'flex-end',
            padding: '6px 12px', gap: 0,
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Napišite poruku..."
              rows={1}
              style={{
                flex: 1, border: 'none', outline: 'none', background: 'transparent',
                fontSize: 13.5, lineHeight: '22px', resize: 'none',
                color: '#1a2030', fontFamily: 'inherit',
                minHeight: 28, maxHeight: 120, overflowY: 'auto',
                padding: '2px 0',
              }}
            />
          </div>

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={(!input.trim() && !attachment) || sending}
            style={{
              width: 40, height: 40, borderRadius: '50%', border: 'none',
              background: (!input.trim() && !attachment) || sending ? '#e3e7ee' : '#00bcd4',
              cursor: (!input.trim() && !attachment) || sending ? 'not-allowed' : 'pointer',
              flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.15s, transform 0.1s',
              transform: 'scale(1)',
            }}
            onMouseEnter={e => {
              if (!e.currentTarget.disabled) (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.08)';
            }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
          >
            {sending ? (
              <Loader2 size={16} color="#fff" className="animate-spin" />
            ) : (
              <Send size={16} color={(!input.trim() && !attachment) ? '#9aa3b2' : '#fff'} style={{ marginLeft: 2 }} />
            )}
          </button>
        </div>

        <p style={{ fontSize: 10, color: '#c0c5d0', marginTop: 6, textAlign: 'center', margin: '6px 0 0' }}>
          Enter = pošalji &nbsp;·&nbsp; Shift+Enter = novi red &nbsp;·&nbsp; Maks. 10 MB slike, 20 MB dokumenti
        </p>
      </div>
    </div>
  );
}
