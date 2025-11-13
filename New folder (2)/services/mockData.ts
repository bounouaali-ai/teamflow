import { User, Suggestion, Match, AttendanceRecord, PlayerMatchPreferences, MatchAwards, ChatMessage, MatchEvaluations, TeamDivision } from '../types';

// --- USERS ---
export const MOCK_USERS: User[] = [
    { id: 'u_1', email: 'ali.b@example.com', name: 'بونوة علي', role: 'ORGANIZER', skillLevel: 4 },
    { id: 'u_2', email: 'hamza.m@example.com', name: 'معمري حمزة', role: 'PLAYER', skillLevel: 5 },
    { id: 'u_3', email: 'raouf.b@example.com', name: 'بن سلامة رؤوف', role: 'PLAYER', skillLevel: 3 },
    { id: 'u_4', email: 'faradj.c@example.com', name: 'شيخي فرج', role: 'PLAYER', skillLevel: 4 },
    { id: 'u_5', email: 'salah.s@example.com', name: 'سعدين صلاح', role: 'PLAYER', skillLevel: 2 },
    { id: 'u_6', email: 'raouf.a@example.com', name: 'عبادة رؤوف', role: 'PLAYER', skillLevel: 5 },
    { id: 'u_7', email: 'farid.b@example.com', name: 'بن عربة فريد', role: 'PLAYER', skillLevel: 3 },
    { id: 'u_8', email: 'ahmed.b@example.com', name: 'بوتمجت أحمد', role: 'PLAYER', skillLevel: 4 },
    { id: 'u_9', email: 'salim.m@example.com', name: 'سليم مدور', role: 'PLAYER', skillLevel: 3 },
    { id: 'u_10', email: 'saleh.l@example.com', name: 'العقون صالح', role: 'PLAYER', skillLevel: 2 },
    { id: 'u_11', email: 'abdelhafid.a@example.com', name: 'عوادي عبد الحفيظ', role: 'PLAYER', skillLevel: 4 },
    { id: 'u_12', email: 'khedir.k@example.com', name: 'خلاف خذير', role: 'PLAYER', skillLevel: 5 },
    { id: 'u_13', email: 'said.b@example.com', name: 'بوعامر سعيد', role: 'PLAYER', skillLevel: 3 },
    { id: 'u_14', email: 'moamar.o@example.com', name: 'أولاد أحمد معمر', role: 'PLAYER', skillLevel: 4 },
    { id: 'u_15', email: 'abdallah.s@example.com', name: 'سي بكر عبدالله', role: 'PLAYER', skillLevel: 2 },
    { id: 'u_16', email: 'hassan@example.com', name: 'حسان', role: 'PLAYER', skillLevel: 4 },
    { id: 'u_17', email: 'djilali.b@example.com', name: 'جيلالي بهاز', role: 'PLAYER', skillLevel: 3 },
    { id: 'u_18', email: 'ahmed@example.com', name: 'أحمد', role: 'PLAYER', skillLevel: 4 },
    { id: 'u_19', email: 'mahmoud.t@example.com', name: 'تواتي محمود', role: 'PLAYER', skillLevel: 5 },
    { id: 'u_20', email: 'zoubair@example.com', name: 'الزبير', role: 'PLAYER', skillLevel: 3 },
    { id: 'u_21', email: 'hamza.n@example.com', name: 'نقايس حمزة', role: 'PLAYER', skillLevel: 4 },
    { id: 'u_22', email: 'chouaib.b@example.com', name: 'بوناب شعيب', role: 'PLAYER', skillLevel: 3 },
];

// --- DATES ---
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow.setHours(17, 0, 0, 0);

const nextWeek = new Date();
nextWeek.setDate(nextWeek.getDate() + 7);
nextWeek.setHours(18, 0, 0, 0);

const dayAfterTomorrow = new Date();
dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
dayAfterTomorrow.setHours(20, 0, 0, 0);

const lastWeek = new Date();
lastWeek.setDate(lastWeek.getDate() - 7);
lastWeek.setHours(19, 0, 0, 0);

const twoWeeksAgo = new Date();
twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
twoWeeksAgo.setHours(19, 0, 0, 0);

// --- SUGGESTIONS ---
export const MOCK_SUGGESTIONS: Suggestion[] = [
    { 
        id: 'sug_1', 
        matchDateISO: dayAfterTomorrow.toISOString(), 
        location: 'ملعب الجامعة الرئيسي', 
        notes: 'مباراة ودية بعد المحاضرات',
        proposerId: 'u_1', // بونوة علي
        votesCount: 8, 
        voters: MOCK_USERS.slice(1, 9).map(u => u.id),
        createdAt: new Date().toISOString()
    },
    { 
        id: 'sug_2', 
        matchDateISO: nextWeek.toISOString(), 
        location: 'النادي الرياضي', 
        notes: 'مباراة مسائية، نحتاج حجز مسبق',
        proposerId: 'u_2', // معمري حمزة
        votesCount: 5, 
        voters: MOCK_USERS.slice(10, 15).map(u => u.id),
        createdAt: new Date().toISOString()
    },
];

// --- MATCHES ---
export const MOCK_UPCOMING_MATCH: Match | null = {
    id: 'match_upcoming',
    dateISO: tomorrow.toISOString(),
    location: 'ملعب الكلية',
    notes: 'تم تأكيد المباراة، يرجى تأكيد الحضور.',
    status: 'UPCOMING'
};

export const MOCK_COMPLETED_MATCHES: Match[] = [
    {
        id: 'match_1',
        dateISO: lastWeek.toISOString(),
        location: 'ملعب الجامعة الرئيسي',
        notes: 'مباراة قوية',
        status: 'COMPLETED',
        score: { teamYellow: 5, teamBlue: 3 }
    },
    {
        id: 'match_2',
        dateISO: twoWeeksAgo.toISOString(),
        location: 'النادي الرياضي',
        notes: 'مباراة ممطرة',
        status: 'COMPLETED',
        score: { teamYellow: 2, teamBlue: 2 }
    }
];

// --- ATTENDANCE ---
const upcomingAttendance: AttendanceRecord[] = [
    // Attending
    ...MOCK_USERS.slice(0, 16).map(u => ({ userId: u.id, userName: u.name, status: 'ATTENDING' as const, confirmedAt: new Date().toISOString() })),
    // Unsure
    ...MOCK_USERS.slice(16, 19).map(u => ({ userId: u.id, userName: u.name, status: 'UNSURE' as const })),
    // Absent
    ...MOCK_USERS.slice(19, 22).map(u => ({ userId: u.id, userName: u.name, status: 'ABSENT' as const })),
];
export const MOCK_ATTENDANCE: { [matchId: string]: AttendanceRecord[] } = {
    [MOCK_UPCOMING_MATCH.id]: upcomingAttendance,
    'match_1': MOCK_USERS.slice(0, 14).map(u => ({ userId: u.id, userName: u.name, status: 'ATTENDING', confirmedAt: lastWeek.toISOString() })),
    'match_2': MOCK_USERS.slice(2, 16).map(u => ({ userId: u.id, userName: u.name, status: 'ATTENDING', confirmedAt: twoWeeksAgo.toISOString() })),
};

// --- PREFERENCES ---
export const MOCK_PREFERENCES: { [matchId: string]: { [userId: string]: PlayerMatchPreferences } } = {
    [MOCK_UPCOMING_MATCH.id]: {
        'u_1': { position: 'MIDFIELDER', side: 'ANY', preferredColor: 'ANY', equivalents: ['u_4', 'u_8'] }, // بونوة علي
        'u_2': { position: 'ATTACKER', side: 'RIGHT', preferredColor: 'BLUE', equivalents: ['u_6', 'u_12'] }, // معمري حمزة
        'u_4': { position: 'DEFENDER', side: 'ANY', preferredColor: 'YELLOW', equivalents: [] }, // شيخي فرج
        'u_6': { position: 'ATTACKER', side: 'LEFT', preferredColor: 'ANY', equivalents: ['u_2', 'u_12'] }, // عبادة رؤوف
        'u_15': { position: 'GOALKEEPER', side: 'ANY', preferredColor: 'ANY', equivalents: [] }, // سي بكر عبدالله
    }
};

// --- AWARDS ---
export const MOCK_AWARDS: { [matchId: string]: MatchAwards } = {
    'match_1': {
        matchId: 'match_1',
        votes: [
            // Vote from u_1 (organizer) is removed to show the voting UI by default
            { voterId: 'u_3', votes: { MVP: 'u_2', THE_ROCK: 'u_4' } },
            { voterId: 'u_4', votes: { MVP: 'u_6', THE_ROCK: 'u_8', PLAYMAKER: 'u_2' } },
        ],
        results: {
            MVP: { winnerId: 'u_2', voteCount: 1 }, // This will be recalculated by the API logic upon new votes
            THE_ROCK: { winnerId: 'u_4', voteCount: 1 },
            PLAYMAKER: { winnerId: 'u_2', voteCount: 1 },
        },
        votingClosed: false,
    },
    'match_2': {
        matchId: 'match_2',
        votes: [],
        results: {},
        votingClosed: false,
    }
};

// --- EVALUATIONS ---
export const MOCK_EVALUATIONS: { [matchId: string]: MatchEvaluations } = {
    'match_1': {
        matchId: 'match_1',
        evaluations: [
            { userId: 'u_1', rating: 5, comment: 'كانت مباراة رائعة ومنظمة بشكل ممتاز!' },
            { userId: 'u_3', rating: 4, comment: 'لعب جيد من الجميع.' },
        ]
    },
    'match_2': {
        matchId: 'match_2',
        evaluations: []
    }
};


// --- CHAT MESSAGES ---
export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
    { id: 1, senderId: 'u_1', senderName: 'بونوة علي', text: 'يا شباب، تم تأكيد مباراة الغد، لا تنسوا تأكيد حضوركم!', timestamp: new Date(Date.now() - 60000 * 60).toISOString() },
    { id: 2, senderId: 'u_2', senderName: 'معمري حمزة', text: 'تمام، أنا جاي أكيد', timestamp: new Date(Date.now() - 60000 * 58).toISOString() },
    { id: 3, senderId: 'u_6', senderName: 'عبادة رؤوف', text: 'وأنا كمان، جاهز', timestamp: new Date(Date.now() - 60000 * 55).toISOString() },
];

// --- TEAM DIVISIONS ---
export const MOCK_TEAM_DIVISIONS: { [matchId: string]: TeamDivision } = {
    [MOCK_UPCOMING_MATCH!.id]: {
        matchId: MOCK_UPCOMING_MATCH!.id,
        generatedAt: new Date(Date.now() - 3600 * 1000).toISOString(),
        votes: [
            { userId: 'u_2', rating: 5, comment: 'تقسيم ممتاز!' },
            { userId: 'u_3', rating: 4 },
        ],
        teams: [
            {
                name: 'الفريق الأصفر',
                color: 'YELLOW',
                players: [
                    { userId: 'u_15', userName: 'سي بكر عبدالله', status: 'ATTENDING', skillLevel: 2, position: 'GOALKEEPER', confirmedAt: new Date().toISOString()},
                    { userId: 'u_2', userName: 'معمري حمزة', status: 'ATTENDING', skillLevel: 5, position: 'ATTACKER', confirmedAt: new Date().toISOString() },
                    { userId: 'u_4', userName: 'شيخي فرج', status: 'ATTENDING', skillLevel: 4, position: 'DEFENDER', confirmedAt: new Date().toISOString() },
                    { userId: 'u_7', userName: 'بن عربة فريد', status: 'ATTENDING', skillLevel: 3, position: 'MIDFIELDER', confirmedAt: new Date().toISOString() },
                    { userId: 'u_9', userName: 'سليم مدور', status: 'ATTENDING', skillLevel: 3, position: 'DEFENDER', confirmedAt: new Date().toISOString() },
                    { userId: 'u_11', userName: 'عوادي عبد الحفيظ', status: 'ATTENDING', skillLevel: 4, position: 'MIDFIELDER', confirmedAt: new Date().toISOString() },
                    { userId: 'u_13', userName: 'بوعامر سعيد', status: 'ATTENDING', skillLevel: 3, position: 'ATTACKER', confirmedAt: new Date().toISOString() },
                    { userId: 'u_16', userName: 'حسان', status: 'ATTENDING', skillLevel: 4, position: 'MIDFIELDER', confirmedAt: new Date().toISOString() },
                ]
            },
            {
                name: 'الفريق الأزرق',
                color: 'BLUE',
                players: [
                    { userId: 'u_5', userName: 'سعدين صلاح', status: 'ATTENDING', skillLevel: 2, position: 'GOALKEEPER', confirmedAt: new Date().toISOString()},
                    { userId: 'u_1', userName: 'بونوة علي', status: 'ATTENDING', skillLevel: 4, position: 'MIDFIELDER', confirmedAt: new Date().toISOString() },
                    { userId: 'u_3', userName: 'بن سلامة رؤوف', status: 'ATTENDING', skillLevel: 3, position: 'DEFENDER', confirmedAt: new Date().toISOString() },
                    { userId: 'u_6', userName: 'عبادة رؤوف', status: 'ATTENDING', skillLevel: 5, position: 'ATTACKER', confirmedAt: new Date().toISOString() },
                    { userId: 'u_8', userName: 'بوتمجت أحمد', status: 'ATTENDING', skillLevel: 4, position: 'MIDFIELDER', confirmedAt: new Date().toISOString() },
                    { userId: 'u_10', userName: 'العقون صالح', status: 'ATTENDING', skillLevel: 2, position: 'DEFENDER', confirmedAt: new Date().toISOString() },
                    { userId: 'u_12', userName: 'خلاف خذير', status: 'ATTENDING', skillLevel: 5, position: 'ATTACKER', confirmedAt: new Date().toISOString() },
                    { userId: 'u_14', userName: 'أولاد أحمد معمر', status: 'ATTENDING', skillLevel: 4, position: 'MIDFIELDER', confirmedAt: new Date().toISOString() },
                ]
            }
        ]
    }
};