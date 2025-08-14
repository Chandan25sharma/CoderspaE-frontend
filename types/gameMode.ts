export type GameModeType = 
  | 'quick-dual'
  | 'minimalist-mind'
  | 'mirror-arena'
  | 'narrative-mode'
  | 'team-clash'
  | 'attack-defend';

export type ChallengeType = '1v1-direct' | 'public-join' | 'team-vs-team';

export interface GameModeConfig {
  id: GameModeType;
  name: string;
  description: string;
  icon: string;
  color: string;
  maxPlayers: number;
  minPlayers: number;
  supportedChallengeTypes: ChallengeType[];
  features: {
    videoStream: boolean;
    codeSync: boolean;
    spectatorMode: boolean;
    teamSupport: boolean;
    mirrored: boolean;
    story: boolean;
    minimalistUI: boolean;
    createProblems: boolean;
  };
  rules: {
    timeLimit: number; // in minutes
    scoring: 'time-based' | 'accuracy-based' | 'combined' | 'team-combined';
    allowedTools: string[];
    prohibitedFeatures: string[];
  };
}

export interface UnifiedChallenge {
  _id: string;
  challengeId: string;
  from: {
    _id: string;
    username: string;
    name: string;
    avatar?: string;
    rating: number;
  };
  to: {
    _id: string;
    username: string;
    name: string;
    avatar?: string;
    rating: number;
    teamId?: string;
  };
  gameMode: GameModeType;
  challengeType: ChallengeType;
  problemId?: string;
  problemIds?: string[]; // For team modes
  status: 'pending' | 'accepted' | 'rejected' | 'expired' | 'cancelled';
  metadata?: {
    storyId?: string; // For narrative mode
    mirrorProblemId?: string; // For mirror arena
    teamRoles?: { [userId: string]: 'attack' | 'defend' }; // For attack & defend
  };
  settings: {
    timeLimit: number;
    isRanked: boolean;
    allowSpectators: boolean;
    maxSpectators?: number;
  };
  createdAt: Date;
  expiresAt: Date;
}

export interface UnifiedMatch {
  _id: string;
  matchId: string;
  challengeId: string;
  gameMode: GameModeType;
  challengeType: ChallengeType;
  participants: {
    userId: string;
    teamId?: string;
    role?: 'attack' | 'defend' | 'player';
    status: 'waiting' | 'ready' | 'playing' | 'finished' | 'disconnected';
  }[];
  spectators: {
    userId: string;
    joinedAt: Date;
  }[];
  problems: {
    problemId: string;
    assignedTo?: string; // userId or teamId
    type: 'main' | 'mirror' | 'story-chapter' | 'user-created';
  }[];
  gameState: {
    status: 'waiting' | 'countdown' | 'active' | 'paused' | 'finished';
    startTime?: Date;
    endTime?: Date;
    currentPhase?: string; // For modes like attack & defend
    timeRemaining?: number;
  };
  results?: {
    winner?: string; // userId or teamId
    scores: { [userId: string]: number };
    details: {
      userId: string;
      code: string;
      testsPassed: number;
      totalTests: number;
      timeToSolve?: number;
      submissionTime: Date;
    }[];
  };
  settings: UnifiedChallenge['settings'];
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMember {
  userId: string;
  username: string;
  name: string;
  avatar?: string;
  role: 'leader' | 'member';
  rating: number;
  status: 'online' | 'offline' | 'in-game';
}

export interface Team {
  _id: string;
  teamId: string;
  name: string;
  description?: string;
  avatar?: string;
  members: TeamMember[];
  stats: {
    wins: number;
    losses: number;
    rating: number;
    gamesPlayed: number;
    modesPlayed: GameModeType[];
  };
  settings: {
    isPublic: boolean;
    maxMembers: number;
    allowedGameModes: GameModeType[];
  };
  createdAt: Date;
  updatedAt: Date;
}
