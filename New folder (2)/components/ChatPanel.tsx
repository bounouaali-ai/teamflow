import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, User } from '../types';
import ChatBubble from './ChatBubble';
import ChatInput from './ChatInput';

interface ChatPanelProps {
  messages: ChatMessage[];
  currentUser: User;
  onSendMessage: (text: string) => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ messages, currentUser, onSendMessage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 left-6 z-40 w-16 h-16 rounded-full text-white shadow-lg flex items-center justify-center transition-all duration-300 ${
          isOpen ? 'bg-red-500 hover:bg-red-600 rotate-180' : 'bg-cyan-500 hover:bg-cyan-600'
        }`}
        aria-label={isOpen ? 'إغلاق الدردشة' : 'فتح الدردشة'}
      >
        <i className={`fa-solid ${isOpen ? 'fa-times' : 'fa-comments'} text-2xl`}></i>
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 left-6 z-40 w-full max-w-sm h-[60vh] bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 flex flex-col animate-fade-in-bubble">
          <header className="p-4 bg-slate-900/50 rounded-t-2xl border-b border-slate-700">
            <h3 className="text-lg font-bold text-white text-center">
              <i className="fa-solid fa-users-line mr-2 text-cyan-400"></i>
              دردشة الفريق
            </h3>
          </header>
          
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map(msg => (
              <ChatBubble key={msg.id} message={msg} isCurrentUser={msg.senderId === currentUser.id} />
            ))}
            <div ref={messagesEndRef} />
          </div>

          <ChatInput onSendMessage={onSendMessage} />
        </div>
      )}
    </>
  );
};

export default ChatPanel;