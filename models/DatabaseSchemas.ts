import mongoose from 'mongoose';

// Battle Mode Schema - Defines different types of coding battles
const battleModeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: ['quick-battle', 'minimalist-mind', 'narrative-mode', 'team-clash', 'attack-defend', '1v1-quick-dual']
  },
  displayName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  maxParticipants: {
    type: Number,
    required: true,
    min: 1
  },
  minParticipants: {
    type: Number,
    required: true,
    min: 1
  },
  timeLimit: {
    type: Number, // in minutes
    required: true
  },
  pointsMultiplier: {
    type: Number,
    default: 1.0
  },
  rules: [{
    type: String
  }],
  features: {
    cameraRequired: { type: Boolean, default: false },
    voiceRequired: { type: Boolean, default: false },
    teamBased: { type: Boolean, default: false },
    liveCoding: { type: Boolean, default: true },
    screenShare: { type: Boolean, default: false }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Problem Schema with Battle Mode Categories
const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Easy', 'Medium', 'Hard']
  },
  categories: [{
    type: String,
    required: true
  }],
  battleModes: [{
    type: String,
    enum: ['quick-battle', 'minimalist-mind', 'narrative-mode', 'team-clash', 'attack-defend', '1v1-quick-dual']
  }],
  tags: [{
    type: String
  }],
  timeLimit: {
    type: Number, // in minutes
    required: true
  },
  constraints: {
    type: String
  },
  examples: [{
    input: String,
    output: String,
    explanation: String
  }],
  testCases: [{
    input: String,
    expectedOutput: String,
    isHidden: { type: Boolean, default: false }
  }],
  starterCode: {
    javascript: String,
    python: String,
    java: String,
    cpp: String,
    csharp: String
  },
  solution: {
    javascript: String,
    python: String,
    java: String,
    cpp: String,
    csharp: String
  },
  hints: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  solvedBy: {
    type: Number,
    default: 0
  },
  upvotes: {
    type: Number,
    default: 0
  },
  downvotes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// User Schema with Battle Statistics
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 20
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  displayName: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: ''
  },
  country: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    maxlength: 500
  },
  // Battle Statistics
  battleStats: {
    totalBattles: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    draws: { type: Number, default: 0 },
    winRate: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    // Mode-specific stats
    quickBattleStats: {
      played: { type: Number, default: 0 },
      won: { type: Number, default: 0 },
      points: { type: Number, default: 0 }
    },
    minimalistMindStats: {
      played: { type: Number, default: 0 },
      won: { type: Number, default: 0 },
      points: { type: Number, default: 0 }
    },
    narrativeModeStats: {
      played: { type: Number, default: 0 },
      won: { type: Number, default: 0 },
      points: { type: Number, default: 0 }
    },
    teamClashStats: {
      played: { type: Number, default: 0 },
      won: { type: Number, default: 0 },
      points: { type: Number, default: 0 }
    },
    attackDefendStats: {
      played: { type: Number, default: 0 },
      won: { type: Number, default: 0 },
      points: { type: Number, default: 0 }
    },
    quickDualStats: {
      played: { type: Number, default: 0 },
      won: { type: Number, default: 0 },
      points: { type: Number, default: 0 }
    }
  },
  // Ranking and Points
  totalPoints: {
    type: Number,
    default: 0
  },
  rank: {
    type: Number,
    default: 0
  },
  tier: {
    type: String,
    enum: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master', 'Grandmaster'],
    default: 'Bronze'
  },
  // Skills and Achievements
  skills: [{
    name: String,
    level: { type: Number, min: 1, max: 10 },
    experience: Number
  }],
  achievements: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Achievement'
  }],
  // Social Features
  friends: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['pending', 'accepted', 'blocked'], default: 'pending' },
    addedAt: { type: Date, default: Date.now }
  }],
  // Live Status
  isOnline: {
    type: Boolean,
    default: false
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  currentBattle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Battle'
  },
  // Camera and Voice Settings
  preferences: {
    cameraEnabled: { type: Boolean, default: true },
    voiceEnabled: { type: Boolean, default: true },
    allowStreaming: { type: Boolean, default: false },
    notifications: {
      battleInvites: { type: Boolean, default: true },
      friendRequests: { type: Boolean, default: true },
      achievements: { type: Boolean, default: true }
    }
  }
}, {
  timestamps: true
});

// Battle Schema for Live Battles
const battleSchema = new mongoose.Schema({
  battleId: {
    type: String,
    required: true,
    unique: true
  },
  mode: {
    type: String,
    required: true,
    enum: ['quick-battle', 'minimalist-mind', 'narrative-mode', 'team-clash', 'attack-defend', '1v1-quick-dual']
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  status: {
    type: String,
    enum: ['waiting', 'starting', 'active', 'paused', 'completed', 'cancelled'],
    default: 'waiting'
  },
  participants: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    team: { type: String, default: 'A' }, // For team battles
    joinedAt: { type: Date, default: Date.now },
    isReady: { type: Boolean, default: false },
    score: { type: Number, default: 0 },
    rank: { type: Number, default: 0 },
    submission: {
      code: String,
      language: String,
      submittedAt: Date,
      testResults: [{
        testCase: Number,
        passed: Boolean,
        executionTime: Number,
        memoryUsed: Number
      }]
    }
  }],
  spectators: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    joinedAt: { type: Date, default: Date.now }
  }],
  problem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  },
  timeLimit: {
    type: Number, // in minutes
    required: true
  },
  startTime: {
    type: Date
  },
  endTime: {
    type: Date
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  winningTeam: {
    type: String
  },
  // Live Features
  isLive: {
    type: Boolean,
    default: false
  },
  streamingEnabled: {
    type: Boolean,
    default: false
  },
  youtubeStreamKey: {
    type: String
  },
  roomId: {
    type: String,
    required: true
  },
  // Comments and Chat
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: String,
    timestamp: { type: Date, default: Date.now },
    isSystemMessage: { type: Boolean, default: false }
  }],
  // Battle Settings
  settings: {
    cameraRequired: { type: Boolean, default: false },
    voiceEnabled: { type: Boolean, default: false },
    allowSpectators: { type: Boolean, default: true },
    maxSpectators: { type: Number, default: 100 }
  }
}, {
  timestamps: true
});

// Tournament Schema
const tournamentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['single-elimination', 'double-elimination', 'round-robin', 'swiss'],
    required: true
  },
  mode: {
    type: String,
    enum: ['quick-battle', 'minimalist-mind', 'narrative-mode', 'team-clash', 'attack-defend', '1v1-quick-dual'],
    required: true
  },
  status: {
    type: String,
    enum: ['upcoming', 'registration', 'active', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  // Registration
  registrationStart: {
    type: Date,
    required: true
  },
  registrationEnd: {
    type: Date,
    required: true
  },
  maxParticipants: {
    type: Number,
    required: true
  },
  minParticipants: {
    type: Number,
    default: 2
  },
  // Tournament Schedule
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  // Participants
  participants: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    registeredAt: { type: Date, default: Date.now },
    seed: Number,
    currentRound: { type: Number, default: 0 },
    isEliminated: { type: Boolean, default: false },
    points: { type: Number, default: 0 }
  }],
  // Rounds and Matches
  rounds: [{
    roundNumber: Number,
    matches: [{
      matchId: String,
      participant1: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      participant2: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      battle: { type: mongoose.Schema.Types.ObjectId, ref: 'Battle' },
      winner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      status: { type: String, enum: ['pending', 'active', 'completed'], default: 'pending' },
      scheduledTime: Date
    }]
  }],
  // Prizes and Rewards
  prizePool: {
    total: Number,
    currency: { type: String, default: 'USD' },
    distribution: [{
      position: Number,
      amount: Number,
      points: Number
    }]
  },
  // Tournament Settings
  settings: {
    isPublic: { type: Boolean, default: true },
    requiresApproval: { type: Boolean, default: false },
    allowSpectators: { type: Boolean, default: true },
    streamingEnabled: { type: Boolean, default: false }
  },
  // Results
  leaderboard: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    position: Number,
    points: Number,
    wins: Number,
    losses: Number
  }],
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Challenge Schema for User-to-User Challenges
const challengeSchema = new mongoose.Schema({
  challenger: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  challenged: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mode: {
    type: String,
    enum: ['quick-battle', 'minimalist-mind', 'narrative-mode', 'team-clash', 'attack-defend', '1v1-quick-dual'],
    required: true
  },
  problem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem'
  },
  message: {
    type: String,
    maxlength: 500
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined', 'expired', 'completed'],
    default: 'pending'
  },
  scheduledTime: {
    type: Date
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
  },
  battle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Battle'
  },
  settings: {
    cameraRequired: { type: Boolean, default: false },
    voiceEnabled: { type: Boolean, default: false },
    allowSpectators: { type: Boolean, default: true },
    isRanked: { type: Boolean, default: true }
  }
}, {
  timestamps: true
});

// Leaderboard Schema
const leaderboardSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['global', 'weekly', 'monthly', 'mode-specific'],
    required: true
  },
  mode: {
    type: String,
    enum: ['all', 'quick-battle', 'minimalist-mind', 'narrative-mode', 'team-clash', 'attack-defend', '1v1-quick-dual']
  },
  period: {
    start: Date,
    end: Date
  },
  rankings: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    position: Number,
    points: Number,
    battles: Number,
    wins: Number,
    winRate: Number,
    change: Number // position change from last period
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Export models
export const BattleMode = mongoose.models.BattleMode || mongoose.model('BattleMode', battleModeSchema);
export const Problem = mongoose.models.Problem || mongoose.model('Problem', problemSchema);
export const User = mongoose.models.User || mongoose.model('User', userSchema);
export const Battle = mongoose.models.Battle || mongoose.model('Battle', battleSchema);
export const Tournament = mongoose.models.Tournament || mongoose.model('Tournament', tournamentSchema);
export const Challenge = mongoose.models.Challenge || mongoose.model('Challenge', challengeSchema);
export const Leaderboard = mongoose.models.Leaderboard || mongoose.model('Leaderboard', leaderboardSchema);

const models = {
  BattleMode,
  Problem,
  User,
  Battle,
  Tournament,
  Challenge,
  Leaderboard
};

export default models;
