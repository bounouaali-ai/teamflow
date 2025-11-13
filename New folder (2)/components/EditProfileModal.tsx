import React, { useState, useEffect } from 'react';
import { User } from '../types';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newName: string) => void;
  isSubmitting: boolean;
  currentUser: User;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, onSubmit, isSubmitting, currentUser }) => {
  const [name, setName] = useState(currentUser.name);

  useEffect(() => {
    if (isOpen) {
      setName(currentUser.name);
    }
  }, [isOpen, currentUser.name]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
        alert("يرجى إدخال اسم");
        return;
    }
    onSubmit(name.trim());
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
        <h2 className="text-xl font-bold text-white mb-4">تعديل الملف الشخصي</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="editPlayerName" className="block text-sm font-medium text-slate-300 mb-1">الاسم</label>
              <input
                type="text"
                id="editPlayerName"
                placeholder="اسمك الجديد"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                required
              />
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
              {isSubmitting ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
