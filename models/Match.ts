import mongoose, { Document, Schema } from 'mongoose';

export interface IMatch extends Document {
  _id: string;
  matchId: string;
  challengeId: mongoose.Types.ObjectId;
  gameMode: 'quick-dual' | 'minimalist-mind' | 'mirror-arena' | 'narrative-mode' | 'team-clash' | 'attack-defend';
  challengeType: '1v1-direct' | 'public-join' | 'team-vs-team';
  participants: {
    userId: mongoose.Types.ObjectId;
    teamId?: mongoose.Types.ObjectId;
    role?: 'attack' | 'defend' | 'player';
    status: 'waiting' | 'ready' | 'playing' | 'finished' | 'disconnected';
  }[];
  spectators: {
    userId: mongoose.Types.ObjectId;
    joinedAt: Date;
  }[];
  problems: {
    problemId: string;
    assignedTo?: string;
    type: 'main' | 'mirror' | 'story-chapter' | 'user-created';
  }[];
  gameState: {
    status: 'waiting' | 'countdown' | 'active' | 'paused' | 'finished';
    startTime?: Date;
    endTime?: Date;
    currentPhase?: string;
    timeRemaining?: number;
  };
  results?: {
    winner?: string;
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
  settings: {
    timeLimit: number;
    isRanked: boolean;
    allowSpectators: boolean;
    maxSpectators?: number;
  };
  roomId: string;
  createdAt: Date;
  updatedAt: Date;
}

const MatchSchema = new Schema<IMatch>({
  matchId: {
    type: String,
    required: true,
    unique: true,
  },
  challengeId: {
    type: Schema.Types.ObjectId,
    ref: 'Challenge',
    required: true,
  },
  gameMode: {
    type: String,
    enum: ['quick-dual', 'minimalist-mind', 'mirror-arena', 'narrative-mode', 'team-clash', 'attack-defend'],
    required: true,
  },
  challengeType: {
    type: String,
    enum: ['1v1-direct', 'public-join', 'team-vs-team'],
    required: true,
  },
  participants: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    teamId: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
    },
    role: {
      type: String,
      enum: ['attack', 'defend', 'player'],
      default: 'player',
    },
    status: {
      type: String,
      enum: ['waiting', 'ready', 'playing', 'finished', 'disconnected'],
      default: 'waiting',
    },
  }],
  spectators: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  problems: [{
    problemId: {
      type: String,
      required: true,
    },
    assignedTo: String,
    type: {
      type: String,
      enum: ['main', 'mirror', 'story-chapter', 'user-created'],
      default: 'main',
    },
  }],
  gameState: {
    status: {
      type: String,
      enum: ['waiting', 'countdown', 'active', 'paused', 'finished'],
      default: 'waiting',
    },
    startTime: Date,
    endTime: Date,
    currentPhase: String,
    timeRemaining: Number,
  },
  results: {
    winner: String,
    scores: {
      type: Map,
      of: Number,
    },
    details: [{
      userId: String,
      code: String,
      testsPassed: Number,
      totalTests: Number,
      timeToSolve: Number,
      submissionTime: Date,
    }],
  },
  settings: {
    timeLimit: {
      type: Number,
      required: true,
    },
    isRanked: {
      type: Boolean,
      default: true,
    },
    allowSpectators: {
      type: Boolean,
      default: true,
    },
    maxSpectators: Number,
  },
  roomId: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

// Index for faster queries
MatchSchema.index({ matchId: 1 });
MatchSchema.index({ challengeId: 1 });
MatchSchema.index({ 'participants.userId': 1 });
MatchSchema.index({ gameMode: 1, challengeType: 1 });
MatchSchema.index({ 'gameState.status': 1 });

const Match = mongoose.models.Match || mongoose.model<IMatch>('Match', MatchSchema);

export default Match;
