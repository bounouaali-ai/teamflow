import React from 'react';
import { Match, AttendanceRecord, User, AttendanceStatus } from '../types';

interface AttendancePageProps {
  match: Match | null;
  attendance: AttendanceRecord[];
  currentUser: User;
  onSetAttendance: (matchId: string, status: AttendanceStatus) => void;
}

const formatDate = (isoString: string) => {
  try {
    return new Date(isoString).toLocaleString('ar-EG', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  } catch (e) { return "تاريخ غير صالح"; }
};


const AttendancePage: React.FC<AttendancePageProps> = ({ match, attendance, currentUser, onSetAttendance }) => {
  
  const PlayerList: React.FC<{ title: string, players: AttendanceRecord[], color: string }> = ({ title, players, color }) => (
    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 h-fit">
      <h4 className={`font-semibold text-${color}-400 mb-3 border-b border-slate-700 pb-2`}>{title} ({players.length})</h4>
      {players.length > 0 ? (
        <ul className="text-sm text-slate-300 space-y-2 max-h-60 overflow-y-auto pr-2">{players.map(p => <li key={p.userId} className="truncate">{p.userName}</li>)}</ul>
      ) : (<p className="text-xs text-slate-500 italic">لا يوجد لاعبون</p>)}
    </div>
  );

  const AttendanceButton: React.FC<{ status: AttendanceStatus, label: string, icon: string, color: string }> = ({ status, label, icon, color }) => {
    const myStatus = attendance.find(a => a.userId === currentUser?.id)?.status;
    const isActive = myStatus === status;
    const activeClasses = `bg-${color}-500 text-white ring-2 ring-white shadow-lg`;
    const inactiveClasses = 'bg-slate-700 hover:bg-slate-600';
    return (
      <button onClick={() => onSetAttendance(match!.id, status)} className={`w-full font-bold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-lg ${isActive ? activeClasses : inactiveClasses}`}>
        <i className={`fa-solid ${icon}`}></i><span>{label}</span>
      </button>
    );
  };

  return (
    <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-white mb-8">تسجيل الحضور للمباراة القادمة</h1>
        
        {!match && (
             <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 h-fit text-center">
                <p className="text-slate-400">لا توجد مباريات قادمة مؤكدة لتسجيل الحضور.</p>
            </div>
        )}

        {match && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Panel */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700">
                        <p className="font-bold text-2xl text-cyan-400">{match.location}</p>
                        <p className="text-lg text-slate-300 mb-2">{formatDate(match.dateISO)}</p>
                    </div>
                     <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700">
                        <h3 className="text-xl font-bold text-white mb-4">حدد حالة حضورك</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <AttendanceButton status="ATTENDING" label="سأحضر" icon="fa-check" color="green" />
                            <AttendanceButton status="UNSURE" label="غير متأكد" icon="fa-question" color="yellow" />
                            <AttendanceButton status="ABSENT" label="لن أحضر" icon="fa-times" color="red" />
                        </div>
                    </div>
                </div>

                {/* Player Lists */}
                <div className="space-y-4">
                    <PlayerList title="حاضرون" players={attendance.filter(a => a.status === 'ATTENDING')} color="green" />
                    <PlayerList title="غير متأكدين" players={attendance.filter(a => a.status === 'UNSURE')} color="yellow" />
                    <PlayerList title="غائبون" players={attendance.filter(a => a.status === 'ABSENT')} color="red" />
                </div>
            </div>
        )}
    </div>
  );
};

export default AttendancePage;
