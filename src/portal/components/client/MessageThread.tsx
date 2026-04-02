import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import type { Message } from '../../lib/types';

interface MessageThreadProps {
  messages: Message[];
  currentUserId: string;
  onSend: (body: string) => Promise<void>;
  compact?: boolean;
}

export function MessageThread({ messages, currentUserId, onSend, compact }: MessageThreadProps) {
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setSending(true);
    setInput('');
    try {
      await onSend(text);
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

  return (
    <div className="flex flex-col h-full">
      <div className={`flex-1 overflow-y-auto portal-scrollbar space-y-3 ${compact ? 'max-h-[280px]' : 'max-h-[500px]'} p-1`}>
        {messages.length === 0 && (
          <p className="text-[13px] text-[#9aa3b2] text-center py-8">
            Još nema poruka. Započnite konverzaciju!
          </p>
        )}
        {messages.map(msg => {
          const isOwn = msg.sender_id === currentUserId;
          const senderName = msg.sender?.full_name || (msg.sender?.role === 'admin' ? 'AiSajt tim' : 'Klijent');

          return (
            <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] ${isOwn ? 'order-2' : ''}`}>
                <div className={`flex items-center gap-2 mb-1 ${isOwn ? 'justify-end' : ''}`}>
                  <span className="text-[11px] text-[#9aa3b2]">
                    {senderName}
                  </span>
                  <span className="text-[11px] text-[#9aa3b2]">
                    {new Date(msg.created_at).toLocaleTimeString('sr-Latn', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {!isOwn && !msg.is_read && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00bcd4]" />
                  )}
                </div>
                <div
                  className="px-3.5 py-2.5 text-[13px] leading-[1.5]"
                  style={{
                    background: isOwn ? '#e6f7fa' : '#f7f8fa',
                    color: '#1a2030',
                    borderRadius: isOwn ? '10px 10px 3px 10px' : '10px 10px 10px 3px',
                  }}
                >
                  {msg.body}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="flex items-end gap-2 mt-3 pt-3 border-t border-[#e3e7ee]">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Napišite poruku..."
          rows={1}
          className="portal-input resize-none min-h-[40px] max-h-[120px] text-[13px]"
          style={{ height: 'auto' }}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || sending}
          className="h-[34px] w-[34px] rounded-lg bg-[#00bcd4] flex items-center justify-center shrink-0 disabled:opacity-40 transition-all hover:bg-[#0097a7]"
        >
          <Send size={14} color="white" />
        </button>
      </div>
    </div>
  );
}
