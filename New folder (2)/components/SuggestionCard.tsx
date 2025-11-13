import React from 'react';
import { Suggestion, User } from '../types';

interface SuggestionCardProps {
  suggestion: Suggestion & { proposerName?: string };
  currentUser: User | null;
  onVote: (suggestionId: string) => void;
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({ suggestion, currentUser, onVote }) => {
  const hasVoted = currentUser ? suggestion.voters.includes(currentUser.id) : false;

  const formatDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleString('ar-EG', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return "تاريخ غير صالح";
    }
  };

  return (
    <div className="bg-slate-900/70 p-4 rounded-lg border border-slate-700 transition-shadow hover:shadow-cyan-500/10 hover:border-slate-600">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className="font-bold text-lg text-white">{suggestion.location}</h3>
          <p className="text-sm text-cyan-400">{formatDate(suggestion.matchDateISO)}</p>
          <p className="text-xs text-slate-400 mt-2">مقترح من: {suggestion.proposerName || suggestion.proposerId}</p>
          {suggestion.notes && <p className="text-sm text-slate-300 mt-1 italic">"{suggestion.notes}"</p>}
        </div>
        <button
          onClick={() => onVote(suggestion.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors duration-200 text-sm whitespace-nowrap ${
            hasVoted
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
          }`}
        >
          {hasVoted ? <i className="fa-solid fa-check"></i> : <i className="fa-solid fa-thumbs-up"></i>}
          <span>{hasVoted ? 'تم التصويت' : 'صوّت'} ({suggestion.votesCount})</span>
        </button>
      </div>
    </div>
  );
};

export default SuggestionCard;