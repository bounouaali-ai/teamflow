
import React from 'react';
import { Suggestion, User } from '../types';
import SuggestionCard from './SuggestionCard';

interface SuggestionListProps {
  suggestions: Suggestion[];
  currentUser: User | null;
  onVote: (suggestionId: string) => void;
}

const SuggestionList: React.FC<SuggestionListProps> = ({ suggestions, currentUser, onVote }) => {
  if (suggestions.length === 0) {
    return <p className="text-center text-slate-400 py-8">لا توجد اقتراحات حالياً. كن أول من يقترح موعداً!</p>;
  }

  return (
    <div className="space-y-4">
      {suggestions.map((suggestion) => (
        <SuggestionCard
          key={suggestion.id}
          suggestion={suggestion}
          currentUser={currentUser}
          onVote={onVote}
        />
      ))}
    </div>
  );
};

export default SuggestionList;
