import React, { useState } from 'react';

interface AddPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (details: { name: string; skillLevel: number }) => void;
  isSubmitting: boolean;
}

const AddPlayerModal: React.FC<AddPlayerModalProps> = ({ isOpen, onClose, onSubmit, isSubmitting }) => {
  const [name, setName] = useState('');
  const [skillLevel, setSkillLevel] = useState(3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
        alert("يرجى إدخال اسم اللاعب");
        return;
    }
    onSubmit({ name: name.trim(), skillLevel });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-40"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 p-6 rounded-xl shadow-2xl w-full max-w-md border border-slate-700 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-white mb-4">إضافة لاعب جديد</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="playerName" className="block text-sm font-medium text-slate-300 mb-1">اسم اللاعب</label>
              <input
                type="text"
                id="playerName"
                placeholder="الاسم الكامل للاعب"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label htmlFor="playerSkill" className="block text-sm font-medium text-slate-300 mb-1">مستوى المهارة (1=مبتدئ, 5=محترف)</label>
              <select
                id="playerSkill"
                value={skillLevel}
                onChange={(e) => setSkillLevel(Number(e.target.value))}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              >
                <option value={1}>1 - مبتدئ</option>
                <option value={2}>2 - أساسي</option>
                <option value={3}>3 - متوسط</option>
                <option value={4}>4 - جيد</option>
                <option value={5}>5 - محترف</option>
              </select>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-slate-500 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'جاري الإضافة...' : 'إضافة اللاعب'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPlayerModal;
