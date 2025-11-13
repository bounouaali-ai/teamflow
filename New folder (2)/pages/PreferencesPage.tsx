import React, { useState, useEffect } from 'react';
import { Match, User, PlayerMatchPreferences, AttendanceStatus, AttendanceRecord } from '../types';

interface PreferencesPageProps {
  match: Match | null;
  currentUser: User;
  allPlayers: User[];
  attendance: AttendanceRecord[];
  myAttendanceStatus: AttendanceStatus | undefined;
  myPreferences: PlayerMatchPreferences;
  onSetMatchPreferences: (matchId: string, preferences: Partial<PlayerMatchPreferences>) => void;
}

const PreferencesPage: React.FC<PreferencesPageProps> = ({ match, currentUser, allPlayers, attendance, myAttendanceStatus, myPreferences, onSetMatchPreferences }) => {
    
    const [currentPrefs, setCurrentPrefs] = useState<PlayerMatchPreferences>(myPreferences || {
        position: 'MIDFIELDER', side: 'ANY', preferredColor: 'ANY', equivalents: []
    });

    useEffect(() => {
        setCurrentPrefs(myPreferences || { position: 'MIDFIELDER', side: 'ANY', preferredColor: 'ANY', equivalents: [] });
    }, [myPreferences]);

    const handlePrefChange = (key: keyof PlayerMatchPreferences, value: any) => {
        const newPrefs = { ...currentPrefs, [key]: value };
        setCurrentPrefs(newPrefs);
        onSetMatchPreferences(match!.id, { [key]: value });
    };

    const handleEquivalentToggle = (playerId: string) => {
        const currentEquivalents = currentPrefs.equivalents || [];
        let newEquivalents: string[];

        if (currentEquivalents.includes(playerId)) {
            newEquivalents = currentEquivalents.filter(id => id !== playerId);
        } else {
            if (currentEquivalents.length < 3) {
                newEquivalents = [...currentEquivalents, playerId];
            } else {
                return; // Max 3 reached
            }
        }
        handlePrefChange('equivalents', newEquivalents);
    };

    if (!match || myAttendanceStatus !== 'ATTENDING') {
        return (
            <div className="animate-fade-in">
                <h1 className="text-3xl font-bold text-white mb-8">تفضيلات المباراة</h1>
                <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 h-fit text-center">
                    <p className="text-slate-400">يجب تأكيد حضورك في المباراة القادمة أولاً لتتمكن من تحديد تفضيلاتك.</p>
                </div>
            </div>
        );
    }
    
    const attendingPlayers = attendance.filter(a => a.status === 'ATTENDING');
    const equivalentOptions = allPlayers.filter(p => p.id !== currentUser.id && attendingPlayers.some(a => a.userId === p.id));

    return (
        <div className="animate-fade-in">
            <h1 className="text-3xl font-bold text-white mb-8">تفضيلات المباراة</h1>
            <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 max-w-2xl mx-auto">
                <p className="text-slate-400 mb-6 text-center">ساعد المنظم على تقسيم الفرق بشكل أفضل عن طريق تحديد تفضيلاتك لهذه المباراة.</p>
                
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">المركز الأساسي الذي تفضل اللعب فيه</label>
                        <select value={currentPrefs.position} onChange={e => handlePrefChange('position', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-cyan-500">
                            <option value="GOALKEEPER">حارس مرمى</option>
                            <option value="DEFENDER">مدافع</option>
                            <option value="MIDFIELDER">لاعب وسط</option>
                            <option value="ATTACKER">مهاجم</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">لاعبون بنفس مستواك تقريباً (اختر حتى 3)</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {equivalentOptions.map(p => {
                                const isSelected = currentPrefs.equivalents?.includes(p.id);
                                return (
                                    <button
                                        key={p.id}
                                        onClick={() => handleEquivalentToggle(p.id)}
                                        type="button"
                                        className={`p-3 rounded-lg text-sm text-center truncate border transition-colors duration-200 ${
                                            isSelected
                                                ? 'bg-cyan-500 text-slate-900 font-bold border-cyan-400 ring-2 ring-cyan-300'
                                                : 'bg-slate-700 text-slate-200 border-slate-600 hover:bg-slate-600'
                                        }`}
                                    >
                                        {p.name}
                                    </button>
                                );
                            })}
                        </div>
                         {equivalentOptions.length === 0 && <p className="text-xs text-slate-500 italic mt-2">لا يوجد لاعبون آخرون مؤكدون حالياً.</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">الجانب المفضل</label>
                            <select value={currentPrefs.side} onChange={e => handlePrefChange('side', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-cyan-500">
                                <option value="ANY">لا أفضلية</option>
                                <option value="LEFT">يسار</option>
                                <option value="RIGHT">يمين</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">لون الفريق المفضل</label>
                            <select value={currentPrefs.preferredColor} onChange={e => handlePrefChange('preferredColor', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-cyan-500">
                                <option value="ANY">لا أفضلية</option>
                                <option value="YELLOW">أصفر 🟡</option>
                                <option value="BLUE">أزرق 🔵</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PreferencesPage;
