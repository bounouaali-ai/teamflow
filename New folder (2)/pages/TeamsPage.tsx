import React from 'react';
import { TeamDivision, User, Match, AttendanceRecord } from '../types';
import TeamDivisionPanel from '../components/TeamDivisionPanel';
import Spinner from '../components/Spinner';

interface TeamsPageProps {
    division: TeamDivision | null;
    currentUser: User;
    match: Match | null;
    attendance: AttendanceRecord[];
    isGeneratingTeams: boolean;
    onGenerateTeams: () => void;
    onSubmitDivisionVote: (matchId: string, rating: number, comment: string) => void;
}


const TeamsPage: React.FC<TeamsPageProps> = ({ division, currentUser, match, attendance, isGeneratingTeams, onGenerateTeams, onSubmitDivisionVote }) => {
    return (
        <div className="animate-fade-in">
            <h1 className="text-3xl font-bold text-white mb-8">تشكيلة الفرق</h1>
            
            <TeamDivisionPanel
                division={division}
                currentUser={currentUser}
                match={match}
                attendance={attendance}
                onGenerateTeams={onGenerateTeams}
                onSubmitDivisionVote={onSubmitDivisionVote}
            />

            {isGeneratingTeams && (
              <div className="flex items-center justify-center gap-3 text-cyan-400 mt-6">
                <Spinner />
                <span>الذكاء الاصطناعي يقوم بالتقسيم الآن...</span>
              </div>
            )}
        </div>
    );
};

export default TeamsPage;