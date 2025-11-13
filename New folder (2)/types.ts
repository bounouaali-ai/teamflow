export type UserRole = 'PLAYER' | 'ORGANIZER';

export interface User {
  id: string;
  email?: string;
  name:string;
  role: UserRole;
  skillLevel: number; // 1-5 skill rating
}

export interface Suggestion {
  id: string;
  matchDateISO: string;
  location: string;
  notes: string;
  proposerId: string;
  votesCount: number;
  voters: string[]; // Array of user IDs
  createdAt: string;
}

export interface Match {
  id: string;
  dateISO: string;
  location: string;
  notes: string;
  status: 'UPCOMING' | 'COMPLETED' | 'CANCELLED';
  score?: { teamYellow: number; teamBlue: number; };
}

export type AttendanceStatus = 'ATTENDING' | 'UNSURE' | 'ABSENT';

export interface AttendanceRecord {
  userId: string;
  userName: string;
  status: AttendanceStatus;
  confirmedAt?: string; // ISO string, optional for non-attending or legacy data
}

// --- Smart Division v2 Types ---
export type Position = 'GOALKEEPER' | 'DEFENDER' | 'MIDFIELDER' | 'ATTACKER';
export type Side = 'LEFT' | 'RIGHT' | 'ANY';
export type TeamColor = 'YELLOW' | 'BLUE' | 'ANY';

export interface PlayerMatchPreferences {
  position: Position;
  side: Side;
  preferredColor: TeamColor;
  equivalents: string[]; // Array of user IDs
}

export interface TeamPlayer extends AttendanceRecord {
  skillLevel: number;
  position: Position;
}

export interface TeamDivisionVote {
  userId: string;
  rating: number; // 1-5 stars for balance
  comment?: string;
}

export interface TeamDivision {
  matchId: string;
  teams: Team[];
  generatedAt: string; // ISO String of when the division was created
  votes: TeamDivisionVote[];
}


export interface Team {
  name: string;
  players: TeamPlayer[];
  color: 'YELLOW' | 'BLUE';
}

export interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

// --- Post-Match Awards Types ---

export type MatchAwardCategory = 'MVP' | 'PLAYMAKER' | 'THE_ROCK' | 'THE_ENGINE' | 'LEADER' | 'TACKLER';

export interface PostMatchVote {
  voterId: string;
  votes: Partial<Record<MatchAwardCategory, string>>; // { MVP: 'playerId', PLAYMAKER: 'playerId' }
}

export interface MatchAwards {
  matchId: string;
  votes: PostMatchVote[];
  results: Partial<Record<MatchAwardCategory, { winnerId: string; voteCount: number }>>;
  votingClosed: boolean;
}
// ---------------------------------------- 

// --- Match Evaluation Types ---
export interface Evaluation {
  userId: string;
  rating: number; // 1-5 stars
  comment?: string;
}

export interface MatchEvaluations {
  matchId: string;
  evaluations: Evaluation[];
}
// ----------------------------

// --- Live Chat Types ---
export interface ChatMessage {
    id: number;
    senderId: string;
    senderName: string;
    text: string;
    timestamp: string;
}
// ---------------------------------
