
import React, { useState } from 'react';

interface SuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (details: { date: string; location: string; notes: string }) => void;
}

const SuggestionModal: React.FC<SuggestionModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !location) {
        alert("يرجى ملء التاريخ والمكان");
        return;
    }
    onSubmit({ date, location, notes });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-40 transition-opacity"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 p-6 rounded-xl shadow-2xl w-full max-w-md border border-slate-700 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-white mb-4">إضافة اقتراح مباراة جديد</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="suggestionDate" className="block text-sm font-medium text-slate-300 mb-1">التاريخ والوقت</label>
              <input
                type="datetime-local"
                id="suggestionDate"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label htmlFor="suggestionLocation" className="block text-sm font-medium text-slate-300 mb-1">المكان</label>
              <input
                type="text"
                id="suggestionLocation"
                placeholder="مثال: ملعب الجامعة"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label htmlFor="suggestionNotes" className="block text-sm font-medium text-slate-300 mb-1">ملاحظات (اختياري)</label>
              <textarea
                id="suggestionNotes"
                placeholder="أي تفاصيل إضافية..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none h-24"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-bold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              إرسال الاقتراح
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SuggestionModal;
