import React from 'react';
import { Suggestion, User, Match } from '../types';
import SuggestionList from '../components/SuggestionList';

interface DashboardPageProps {
  suggestions: Suggestion[];
  currentUser: User;
  onVote: (suggestionId: string) => void;
  upcomingMatch: Match | null;
  onOpenSuggestionModal: () => void;
  onOpenAddPlayerModal: () => void;
}

const formatDate = (isoString: string) => new Date(isoString).toLocaleString('ar-EG', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
});

const DashboardPage: React.FC<DashboardPageProps> = ({ suggestions, currentUser, onVote, upcomingMatch, onOpenSuggestionModal, onOpenAddPlayerModal }) => {
  const isOrganizer = currentUser.role === 'ORGANIZER';
  
  return (
    <div className="space-y-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-white">لوحة المعلومات</h1>

      {upcomingMatch && (
         <section>
            <h2 className="text-xl font-bold text-white mb-4">المباراة القادمة</h2>
            <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700">
                <p className="font-bold text-2xl text-cyan-400">{upcomingMatch.location}</p>
                <p className="text-lg text-slate-300 mb-2">{formatDate(upcomingMatch.dateISO)}</p>
                <p className="text-sm text-slate-400 italic">"{upcomingMatch.notes}"</p>
            </div>
        </section>
      )}
     
      <section>
        <div className="flex justify-between items-center mb-4 gap-2 flex-wrap">
          <h2 className="text-xl font-bold text-white">اقتراحات المباريات</h2>
          <div className="flex items-center gap-2">
            {isOrganizer && (
                <button
                    onClick={onOpenAddPlayerModal}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2"
                >
                    <i className="fa-solid fa-user-plus"></i>
                    <span className="hidden sm:inline">إضافة لاعب</span>
                </button>
            )}
            <button
                onClick={onOpenSuggestionModal}
                className="bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-bold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
                <i className="fa-solid fa-plus"></i>
                <span>إضافة اقتراح</span>
            </button>
          </div>
        </div>
        <SuggestionList
          suggestions={suggestions}
          currentUser={currentUser}
          onVote={onVote}
        />
      </section>
    </div>
  );
};

export default DashboardPage;