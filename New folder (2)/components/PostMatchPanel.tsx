import React, { useState, useMemo } from 'react';
import { Match, MatchAwards, User, MatchAwardCategory, AttendanceRecord, MatchEvaluations } from '../types';

interface PostMatchPanelProps {
    match: Match;
    awards: MatchAwards | null;
    evaluations: MatchEvaluations | null;
    attendance: AttendanceRecord[];
    currentUser: User | null;
    allPlayers: User[];
    onSubmitVote: (matchId: string, votes: Partial<Record<MatchAwardCategory, string>>) => void;
    onSubmitEvaluation: (matchId: string, rating: number, comment: string) => void;
}

const awardCategories: { id: MatchAwardCategory, title: string, icon: string }[] = [
    { id: 'MVP', title: 'أفضل لاعب في المباراة', icon: 'fa-trophy' },
    { id: 'PLAYMAKER', title: 'صانع اللعب', icon: 'fa-brain' },
    { id: 'THE_ROCK', title: 'الصخرة الدفاعية', icon: 'fa-shield-halved' },
    { id: 'THE_ENGINE', title: 'اللاعب الحيوي', icon: 'fa-person-running' },
    { id: 'LEADER', title: 'قائد الفريق', icon: 'fa-bullhorn' },
    { id: 'TACKLER', title: 'أقوى تدخل', icon: 'fa-bolt' },
];

const PostMatchPanel: React.FC<PostMatchPanelProps> = ({ match, awards, evaluations, attendance, currentUser, allPlayers, onSubmitVote, onSubmitEvaluation }) => {
    const [currentVotes, setCurrentVotes] = useState<Partial<Record<MatchAwardCategory, string>>>({});
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [hoverRating, setHoverRating] = useState(0);

    const votingEligiblePlayers = useMemo(() => {
        if (!currentUser) return [];
        const attendingPlayerIds = new Set(
            attendance
                .filter(a => a.status === 'ATTENDING')
                .map(a => a.userId)
        );
        return allPlayers.filter(p => p.id !== currentUser.id && attendingPlayerIds.has(p.id));
    }, [attendance, allPlayers, currentUser]);

    if (!currentUser || !awards) {
        return null; // Don't render if no user or no award data for this match
    }
    
    const myVote = awards.votes.find(v => v.voterId === currentUser.id);
    const myEvaluation = evaluations?.evaluations.find(e => e.userId === currentUser.id);
    
    const handleVoteChange = (category: MatchAwardCategory, playerId: string) => {
        setCurrentVotes(prev => ({ ...prev, [category]: playerId }));
    };

    const handleSubmit = () => {
        onSubmitVote(match.id, currentVotes);
        setCurrentVotes({});
    };

    const handleEvaluationSubmit = () => {
        if (rating > 0) {
            onSubmitEvaluation(match.id, rating, comment);
        }
    };

    const findWinnerName = (winnerId: string | undefined) => {
        if (!winnerId) return 'لا يوجد';
        return allPlayers.find(p => p.id === winnerId)?.name || 'لاعب غير معروف';
    };
    
    const formatDate = (isoString: string) => new Date(isoString).toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const StarRating: React.FC<{
        rating: number;
        onRate?: (rating: number) => void;
        onHover?: (rating: number) => void;
        hoverRating?: number;
    }> = ({ rating, onRate, onHover, hoverRating = 0 }) => {
        const isInteractive = !!onRate;
        return (
            <div className="flex items-center justify-center gap-1 text-3xl" dir="ltr" onMouseLeave={() => onHover && onHover(0)}>
                {[...Array(5)].map((_, i) => {
                    const ratingValue = i + 1;
                    return (
                        <button
                            key={ratingValue}
                            type="button"
                            onClick={() => onRate && onRate(ratingValue)}
                            onMouseEnter={() => onHover && onHover(ratingValue)}
                            className={`transition-colors duration-200 ${isInteractive ? 'cursor-pointer' : ''} ${ratingValue <= (hoverRating || rating) ? 'text-amber-400' : 'text-slate-600 hover:text-slate-500'}`}
                        >
                            <i className="fa-solid fa-star"></i>
                        </button>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="bg-slate-800/50 p-4 sm:p-6 rounded-xl shadow-lg border border-slate-700 space-y-6">
            {/* Match Details Section */}
            <div>
                <div className="flex justify-between items-start gap-4">
                    <div>
                        <h3 className="text-lg font-bold text-white">تفاصيل وتقييم المباراة</h3>
                        <p className="text-sm text-slate-400">{match.location} - {formatDate(match.dateISO)}</p>
                    </div>
                    {match.score && (
                        <div className="bg-slate-900/50 p-2 rounded-lg text-center border border-slate-700 flex-shrink-0">
                            <p className="text-xs text-slate-400 font-semibold mb-1">النتيجة النهائية</p>
                            <p className="font-bold text-xl text-white tracking-wider">
                                <span className="text-amber-400">{match.score.teamYellow}</span>
                                <span className="mx-2">-</span>
                                <span className="text-sky-400">{match.score.teamBlue}</span>
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Awards Section */}
            <div className="border-t border-slate-700 pt-6">
                 <h3 className="text-lg font-bold text-white text-center mb-4">جوائز اللاعبين</h3>
                {myVote ? (
                    // Results View
                    <div>
                        <p className="text-center text-cyan-400 mb-4 text-sm">شكراً لك، تم تسجيل تصويتك! إليك النتائج الحالية:</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {awardCategories.map(cat => {
                                const result = awards.results[cat.id];
                                const hasVotes = result && result.voteCount > 0;

                                return (
                                    <div key={cat.id} className="bg-slate-900/50 p-3 rounded-lg text-center">
                                        <i className={`fa-solid ${cat.icon} text-amber-400 text-2xl mb-2`}></i>
                                        <h4 className="text-sm font-bold text-slate-300">{cat.title}</h4>
                                        {hasVotes ? (
                                            <>
                                                <p className="text-lg font-bold text-white truncate mt-1">{findWinnerName(result.winnerId)}</p>
                                                <span className="text-xs text-slate-400">
                                                    ({result.voteCount} أصوات)
                                                </span>
                                            </>
                                        ) : (
                                            <p className="text-sm text-slate-500 italic mt-2">بانتظار الأصوات</p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    // Voting View
                    <div>
                        <p className="text-center text-slate-400 mb-4 text-sm">شارك في تقييم أداء اللاعبين في المباراة الأخيرة. لا يمكنك التصويت لنفسك.</p>
                        <div className="space-y-4">
                            {awardCategories.map(cat => (
                            <div key={cat.id}>
                                    <label className="block text-md font-semibold text-slate-200 mb-1 flex items-center gap-2">
                                        <i className={`fa-solid ${cat.icon} text-cyan-400`}></i>
                                        <span>{cat.title}</span>
                                    </label>
                                    <select 
                                        value={currentVotes[cat.id] || ''}
                                        onChange={(e) => handleVoteChange(cat.id, e.target.value)}
                                        className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                                    >
                                        <option value="" disabled>اختر لاعباً...</option>
                                        {votingEligiblePlayers.map(p => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                            </div>
                            ))}
                        </div>
                        <button
                            onClick={handleSubmit}
                            disabled={Object.keys(currentVotes).length === 0}
                            className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:bg-slate-600 disabled:cursor-not-allowed"
                        >
                            <i className="fa-solid fa-paper-plane"></i>
                            <span>إرسال التصويت</span>
                        </button>
                    </div>
                )}
            </div>

            {/* New Evaluation Section */}
            <div className="border-t border-slate-700 pt-6">
                <h3 className="text-lg font-bold text-white text-center mb-4">تقييم المباراة العام</h3>
                {myEvaluation ? (
                    <div className="bg-slate-900/50 p-4 rounded-lg text-center">
                        <p className="text-cyan-400 text-sm mb-3">شكراً لتقييمك!</p>
                        <StarRating rating={myEvaluation.rating} />
                        {myEvaluation.comment && (
                            <p className="text-slate-300 italic mt-4 text-sm bg-slate-800 p-2 rounded-md">"{myEvaluation.comment}"</p>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4 max-w-lg mx-auto">
                        <p className="text-center text-slate-400 text-sm">ما هو تقييمك للمباراة من حيث التنظيم والمستوى؟</p>
                        <StarRating rating={rating} onRate={setRating} hoverRating={hoverRating} onHover={setHoverRating} />
                        <textarea
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                            placeholder="أضف تعليقاً (اختياري)..."
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-cyan-500 h-20"
                        />
                        <button
                            onClick={handleEvaluationSubmit}
                            disabled={rating === 0}
                            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
                        >
                            إرسال التقييم
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostMatchPanel;