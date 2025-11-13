import React, { useState } from 'react';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [text, setText] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const emojis = ['👍', '😂', '🔥', '⚽️', '🙏', '👏', '😮', '💪'];

  const handleEmojiClick = (emoji: string) => {
    setText(prev => prev + emoji);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSendMessage(text.trim());
      setText('');
      setShowEmojis(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 bg-slate-800/50 border-t border-slate-700 relative">
      {showEmojis && (
        <div className="absolute bottom-full left-0 right-0 p-2 bg-slate-900 border-b border-t border-slate-700 rounded-t-lg grid grid-cols-8 gap-1 animate-fade-in">
          {emojis.map(emoji => (
            <button key={emoji} type="button" onClick={() => handleEmojiClick(emoji)} className="text-xl p-1 rounded-md hover:bg-slate-700 transition-colors">
              {emoji}
            </button>
          ))}
        </div>
      )}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowEmojis(!showEmojis)}
          className="text-slate-400 hover:text-cyan-400 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 flex-shrink-0"
          aria-label="إظهار الايموجي"
        >
          <i className="fa-regular fa-face-smile text-xl"></i>
        </button>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="اكتب رسالتك هنا..."
          className="w-full bg-slate-700 border border-slate-600 rounded-full py-2 px-4 text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 focus:outline-none text-sm"
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="bg-cyan-500 hover:bg-cyan-600 text-slate-900 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed flex-shrink-0"
          aria-label="إرسال"
        >
          <i className="fa-solid fa-paper-plane"></i>
        </button>
      </div>
    </form>
  );
};

export default ChatInput;