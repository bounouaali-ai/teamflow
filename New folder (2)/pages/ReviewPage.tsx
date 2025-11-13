import React from 'react';
import { Match, MatchAwards, User, AttendanceRecord, MatchAwardCategory, MatchEvaluations } from '../types';
import PostMatchPanel from '../components/PostMatchPanel';

interface ReviewPageProps {
    completedMatches: Match[];
    matchAwards: { [matchId: string]: MatchAwards | null };
    matchEvaluations: { [matchId: string]: MatchEvaluations | null };
    attendance: { [matchId: string]: AttendanceRecord[] };
    currentUser: User;
    allPlayers: User[];
    onSubmitVote: (matchId: string, votes: Partial<Record<MatchAwardCategory, string>>) => void;
    onSubmitEvaluation: (matchId: string, rating: number, comment: string) => void;
}

const ReviewPage: React.FC<ReviewPageProps> = ({ completedMatches, matchAwards, matchEvaluations, attendance, currentUser, allPlayers, onSubmitVote, onSubmitEvaluation }) => {
    // The API sorts completed matches by date descending, so the first one is the latest.
    const latestMatch = completedMatches.length > 0 ? completedMatches[0] : null;

    return (
        <div className="animate-fade-in">
            <h1 className="text-3xl font-bold text-white mb-8">تقييم المباراة الأخيرة</h1>

            {!latestMatch && (
                <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 h-fit text-center">
                    <p className="text-slate-400">لا توجد مباريات مكتملة لتقييمها.</p>
                </div>
            )}

            {latestMatch && (
                 <PostMatchPanel
                    key={latestMatch.id}
                    match={latestMatch}
                    awards={matchAwards[latestMatch.id] || null}
                    evaluations={matchEvaluations[latestMatch.id] || null}
                    attendance={attendance[latestMatch.id] || []}
                    currentUser={currentUser}
                    allPlayers={allPlayers}
                    onSubmitVote={onSubmitVote}
                    onSubmitEvaluation={onSubmitEvaluation}
                />
            )}
        </div>
    );
};

export default ReviewPage;