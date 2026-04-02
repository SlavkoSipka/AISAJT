import { MessageThread } from '../client/MessageThread';
import type { Message } from '../../lib/types';

interface MessageReplyProps {
  messages: Message[];
  currentUserId: string;
  onSend: (body: string) => Promise<void>;
}

export function MessageReply({ messages, currentUserId, onSend }: MessageReplyProps) {
  return (
    <div>
      <h4 className="text-[13px] font-medium text-[#1a2030] mb-3">
        Poruke sa klijentom
      </h4>
      <MessageThread
        messages={messages}
        currentUserId={currentUserId}
        onSend={onSend}
      />
    </div>
  );
}
