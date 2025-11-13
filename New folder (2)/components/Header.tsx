import React from 'react';
import { User } from '../types';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
  onOpenEditProfileModal: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, onOpenEditProfileModal }) => {
  if (!user) {
    return null;
  }
  
  return (
    <header className="flex justify-end items-center gap-4">
        <div className="flex items-center gap-2">
            <div className="bg-slate-800 p-2 pl-4 rounded-full flex items-center gap-3 shadow-md border border-slate-700">
                <div className="text-right">
                    <div className="font-bold text-white flex items-center gap-2">
                      <span>{user.name}</span>
                      <button 
                        onClick={onOpenEditProfileModal} 
                        className="text-slate-400 hover:text-cyan-400 transition-colors"
                        title="تعديل الاسم"
                        aria-label="تعديل الاسم"
                      >
                        <i className="fa-solid fa-pencil text-xs"></i>
                      </button>
                    </div>
                    <div className="text-xs text-slate-400">{user.email || '...'}</div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${user.role === 'ORGANIZER' ? 'bg-cyan-400 text-slate-900' : 'bg-slate-600 text-slate-200'}`}>
                    {user.role === 'ORGANIZER' ? 'منظم' : 'لاعب'}
                </div>
            </div>
            <button 
                onClick={onLogout} 
                className="bg-slate-700 hover:bg-red-500 text-slate-300 hover:text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200"
                aria-label="تسجيل الخروج"
                title="تسجيل الخروج"
            >
                <i className="fa-solid fa-right-from-bracket"></i>
            </button>
        </div>
    </header>
  );
};

export default Header;