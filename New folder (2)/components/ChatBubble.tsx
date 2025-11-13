import React from 'react';
import { ChatMessage } from '../types';

interface ChatBubbleProps {
  message: ChatMessage;
  isCurrentUser: boolean;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isCurrentUser }) => {
  const formatDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleTimeString('ar-EG', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  return (
    <div className={`flex items-end gap-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs md:max-w-md p-3 rounded-xl ${
        isCurrentUser 
          ? 'bg-cyan-600 text-white rounded-br-none' 
          : 'bg-slate-700 text-slate-200 rounded-bl-none'
      }`}>
        {!isCurrentUser && (
            <p className="text-xs font-bold text-cyan-400 mb-1">{message.senderName}</p>
        )}
        <p className="text-sm">{message.text}</p>
        <p className={`text-xs mt-1 ${isCurrentUser ? 'text-cyan-200' : 'text-slate-400'} text-left`}>
            {formatDate(message.timestamp)}
        </p>
      </div>
    </div>
  );
};

export default ChatBubble;
