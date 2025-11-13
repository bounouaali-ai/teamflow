import React, { useMemo, useState } from 'react';
import { Team, User, Match, TeamPlayer, Position, AttendanceRecord, TeamDivision } from '../types';

interface TeamDivisionPanelProps {
    division: TeamDivision | null;
    currentUser: User | null;
    match: Match | null;
    attendance: AttendanceRecord[];
    onGenerateTeams: () => void;
    onSubmitDivisionVote: (matchId: string, rating: number, comment: string) => void;
}

const SkillRating: React.FC<{ rating: number }> = ({ rating }) => {
    return (
        <div className="flex items-center gap-0.5" aria-label={`Skill rating: ${rating} out of 5`}>
            {[...Array(5)].map((_, i) => (
                <i
                    key={i}
                    className={`fa-solid fa-star text-xs ${i < rating ? 'text-amber-400' : 'text-slate-600'}`}
                ></i>
            ))}
        </div>
    );
};

const positionLabels: Record<Position, string> = {
    GOALKEEPER: 'حارس',
    DEFENDER: 'مدافع',
    MIDFIELDER: 'وسط',
    ATTACKER: 'مهاجم',
};

const TeamDivisionPanel: React.FC<TeamDivisionPanelProps> = ({ division, currentUser, match, attendance, onGenerateTeams, onSubmitDivisionVote }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    
    const isOrganizer = currentUser?.role === 'ORGANIZER';
    const CORE_PLAYER_LIMIT = 7;

    const attendingPlayers = useMemo(() => attendance.filter(a => a.status === 'ATTENDING'), [attendance]);
    
    const unassignedPlayers = useMemo(() => {
        if (!division || !division.teams) return [];
        const dividedPlayerIds = new Set(division.teams.flatMap(t => t.players.map(p => p.userId)));
        return attendingPlayers.filter(p => !dividedPlayerIds.has(p.userId));
    }, [division, attendingPlayers]);
    
    const teams = division?.teams;
    const hasDivision = teams && teams.length > 0;

    const myVote = division?.votes.find(v => v.userId === currentUser?.id);
    const isAttending = attendingPlayers.some(p => p.userId === currentUser?.id);
    
    const averageRating = useMemo(() => {
        if (!division || !division.votes || division.votes.length === 0) return 0;
        const total = division.votes.reduce((sum, vote) => sum + vote.rating, 0);
        return total / division.votes.length;
    }, [division]);

    const handleVoteSubmit = () => {
        if (rating > 0 && match) {
            onSubmitDivisionVote(match.id, rating, ''); // comment is empty for now
            setRating(0);
        }
    };

    const calculateAverageSkill = (players: TeamPlayer[]): string => {
        if (players.length === 0) return '0';
        const totalSkill = players.reduce((sum, player) => sum + player.skillLevel, 0);
        return (totalSkill / players.length).toFixed(1);
    };
    
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
        <div className="bg-slate-800/50 p-4 sm:p-6 rounded-xl shadow-lg border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4">تقسيم الفرق والقواعد</h2>
            
            {!match && <p className="text-slate-400 text-center py-4">لا توجد مباراة قادمة لعرض تقسيم الفرق.</p>}

            {match && !hasDivision && (
                <div className="text-center py-4">
                    <p className="text-slate-400 mb-4">لم يتم تقسيم الفرق بعد. سيتم التقسيم بذكاء لضمان التوازن.</p>
                    {isOrganizer && (
                        <button
                            onClick={onGenerateTeams}
                            className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 mx-auto"
                        >
                            <i className="fa-solid fa-people-arrows"></i>
                            <span>قسم الفرق بذكاء</span>
                        </button>
                    )}
                </div>
            )}
            
            {match && hasDivision && (
                 <>
                    {isOrganizer && unassignedPlayers.length > 0 && (
                        <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-sm p-3 rounded-lg mb-4 text-center animate-fade-in">
                            <p className="font-bold mb-1">
                                <i className="fa-solid fa-triangle-exclamation mr-2"></i>
                                تنبيه: {unassignedPlayers.length} لاعب جديد حضر بعد التقسيم.
                            </p>
                             <p className="text-xs mt-2">يوصى بإعادة تقسيم الفرق لضمان التوازن.</p>
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {teams.map((team) => {
                            const corePlayers = team.players.slice(0, CORE_PLAYER_LIMIT);
                            const substitutes = team.players.slice(CORE_PLAYER_LIMIT);
                            const goalkeeperRotation = [...team.players].sort((a,b) => new Date(a.confirmedAt!).getTime() - new Date(b.confirmedAt!).getTime())

                            return (
                                <div key={team.name} className={`p-4 rounded-lg border flex flex-col ${team.color === 'YELLOW' ? 'bg-amber-500/10 border-amber-500/30' : 'bg-sky-500/10 border-sky-500/30'}`}>
                                    <div className={`flex justify-between items-center border-b pb-2 mb-3 ${team.color === 'YELLOW' ? 'border-amber-500/30' : 'border-sky-500/30'}`}>
                                        <h3 className={`font-bold text-lg ${team.color === 'YELLOW' ? 'text-amber-400' : 'text-sky-400'}`}>{team.name} ({team.players.length})</h3>
                                        <span className={`text-xs font-mono px-2 py-1 rounded ${team.color === 'YELLOW' ? 'bg-amber-900/50 text-amber-300' : 'bg-sky-900/50 text-sky-300'}`}>
                                            Ø {calculateAverageSkill(team.players)}
                                        </span>
                                    </div>
                                    <h4 className="text-sm font-semibold text-slate-300 mb-2">اللاعبون الأساسيون ({corePlayers.length})</h4>
                                    <ul className="space-y-2 mb-4">
                                        {corePlayers.map(player => (
                                            <li key={player.userId} className="text-slate-300 flex justify-between items-center text-sm">
                                                <div className="flex items-center gap-2">
                                                <span className="font-semibold">{player.userName}</span>
                                                <span className="text-xs bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded">{positionLabels[player.position]}</span>
                                                </div>
                                                <SkillRating rating={player.skillLevel} />
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="border-t border-slate-700/50 pt-3 mt-auto space-y-3">
                                        <div>
                                            <h4 className="font-semibold text-amber-400 mb-2 flex items-center gap-2 text-sm">
                                                <i className="fa-solid fa-users"></i>
                                                <span>البدلاء ({substitutes.length})</span>
                                            </h4>
                                            {substitutes.length > 0 ? (
                                                <ol className="list-decimal list-inside space-y-1 text-xs text-slate-400">
                                                {substitutes.map(player => <li key={player.userId} className="truncate">{player.userName}</li>)}
                                                </ol>
                                            ) : (
                                                <p className="text-xs text-slate-500 italic">لا يوجد بدلاء لهذا الفريق.</p>
                                            )}
                                        </div>
                                         <div>
                                            <h4 className="font-semibold text-cyan-400 mb-2 flex items-center gap-2 text-sm">
                                                <i className="fa-solid fa-arrows-rotate"></i>
                                                <span>ترتيب حراس المرمى</span>
                                            </h4>
                                            <ol className="list-decimal list-inside space-y-1 text-xs text-slate-400 max-h-24 overflow-y-auto">
                                                {goalkeeperRotation.map(player => (
                                                    <li key={player.userId} className="truncate">{player.userName}</li>
                                                ))}
                                            </ol>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                     {isOrganizer && (
                        <button
                            onClick={onGenerateTeams}
                            className="bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 mx-auto mt-6"
                        >
                            <i className="fa-solid fa-arrows-rotate"></i>
                            <span>إعادة تقسيم الفرق بذكاء</span>
                        </button>
                    )}
                    
                    {/* Team Division Voting Section */}
                    <div className="border-t border-slate-700 mt-6 pt-6 text-center">
                        <h3 className="text-lg font-bold text-white mb-2">تقييم توازن الفرق</h3>
                        {division.votes.length > 0 && (
                            <p className="text-sm text-slate-400 mb-4">
                                متوسط التقييم: <span className="font-bold text-amber-400">{averageRating.toFixed(1)}</span>/5
                                <span className="mx-2 text-slate-600">|</span>
                                ({division.votes.length} أصوات)
                            </p>
                        )}

                        {isAttending ? (
                            myVote ? (
                                <div className="bg-slate-900/50 p-4 rounded-lg max-w-sm mx-auto">
                                    <p className="text-cyan-400 text-sm mb-2">شكراً لتقييمك!</p>
                                    <StarRating rating={myVote.rating} />
                                </div>
                            ) : (
                                <div className="bg-slate-900/50 p-4 rounded-lg max-w-sm mx-auto">
                                    <p className="text-slate-300 text-sm mb-3">ما هو تقييمك لتوازن الفريقين؟</p>
                                    <StarRating rating={rating} onRate={setRating} hoverRating={hoverRating} onHover={setHoverRating} />
                                    <button
                                        onClick={handleVoteSubmit}
                                        disabled={rating === 0}
                                        className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
                                    >
                                        إرسال التقييم
                                    </button>
                                </div>
                            )
                        ) : (
                             <p className="text-xs text-slate-500 italic mt-2">يجب تأكيد حضورك لتتمكن من التقييم.</p>
                        )}
                    </div>
                 </>
            )}

        </div>
    );
};

export default TeamDivisionPanel;