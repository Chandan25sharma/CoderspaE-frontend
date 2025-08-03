import mongoose, { Document, Schema } from 'mongoose';

export interface ILiveBattle extends Document {
  _id: string;
  battleId: string;
  participants: {
    userId: mongoose.Types.ObjectId;
    userName: string;
    webcamEnabled: boolean;
    streamUrl?: string;
    connectionStatus: 'connected' | 'disconnected' | 'reconnecting';
    joinedAt: Date;
  }[];
  challenge: mongoose.Types.ObjectId;
  status: 'waiting' | 'starting' | 'active' | 'paused' | 'ended' | 'cancelled';
  startTime?: Date;
  endTime?: Date;
  duration: number; // in seconds
  isLiveStreaming: boolean;
  streamDetails?: {
    youtubeStreamKey?: string;
    youtubeStreamUrl?: string;
    websiteStreamUrl?: string;
    viewerCount: number;
    isRecording: boolean;
  };
  codeStates: {
    userId: mongoose.Types.ObjectId;
    code: string;
    language: 'javascript' | 'python' | 'java' | 'cpp';
    lastUpdate: Date;
    compilationResults?: {
      success: boolean;
      output?: string;
      error?: string;
      executionTime: number;
      memoryUsed: number;
      testCasesPassed: number;
      totalTestCases: number;
    };
  }[];
  results?: {
    winner?: mongoose.Types.ObjectId;
    scores: {
      userId: mongoose.Types.ObjectId;
      score: number;
      testCasesPassed: number;
      completionTime: number;
      codeQuality: number;
    }[];
    endReason: 'completed' | 'timeout' | 'forfeit' | 'admin_ended';
  };
  spectators: {
    userId?: mongoose.Types.ObjectId;
    sessionId: string;
    joinedAt: Date;
    isAnonymous: boolean;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const LiveBattleSchema = new Schema<ILiveBattle>({
  battleId: {
    type: String,
    required: true,
    unique: true,
  },
  participants: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    webcamEnabled: {
      type: Boolean,
      default: false,
    },
    streamUrl: String,
    connectionStatus: {
      type: String,
      enum: ['connected', 'disconnected', 'reconnecting'],
      default: 'connected',
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  challenge: {
    type: Schema.Types.ObjectId,
    ref: 'Challenge',
    required: true,
  },
  status: {
    type: String,
    enum: ['waiting', 'starting', 'active', 'paused', 'ended', 'cancelled'],
    default: 'waiting',
  },
  startTime: Date,
  endTime: Date,
  duration: {
    type: Number,
    default: 1800, // 30 minutes default
  },
  isLiveStreaming: {
    type: Boolean,
    default: false,
  },
  streamDetails: {
    youtubeStreamKey: String,
    youtubeStreamUrl: String,
    websiteStreamUrl: String,
    viewerCount: {
      type: Number,
      default: 0,
    },
    isRecording: {
      type: Boolean,
      default: false,
    },
  },
  codeStates: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    code: {
      type: String,
      default: '',
    },
    language: {
      type: String,
      enum: ['javascript', 'python', 'java', 'cpp'],
      default: 'javascript',
    },
    lastUpdate: {
      type: Date,
      default: Date.now,
    },
    compilationResults: {
      success: Boolean,
      output: String,
      error: String,
      executionTime: {
        type: Number,
        default: 0,
      },
      memoryUsed: {
        type: Number,
        default: 0,
      },
      testCasesPassed: {
        type: Number,
        default: 0,
      },
      totalTestCases: {
        type: Number,
        default: 0,
      },
    },
  }],
  results: {
    winner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    scores: [{
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      score: {
        type: Number,
        default: 0,
      },
      testCasesPassed: {
        type: Number,
        default: 0,
      },
      completionTime: {
        type: Number,
        default: 0,
      },
      codeQuality: {
        type: Number,
        default: 0,
      },
    }],
    endReason: {
      type: String,
      enum: ['completed', 'timeout', 'forfeit', 'admin_ended'],
    },
  },
  spectators: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    sessionId: {
      type: String,
      required: true,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
  }],
}, {
  timestamps: true,
});

// Indexes for performance
LiveBattleSchema.index({ battleId: 1 });
LiveBattleSchema.index({ status: 1, createdAt: -1 });
LiveBattleSchema.index({ 'participants.userId': 1 });
LiveBattleSchema.index({ isLiveStreaming: 1, status: 1 });

export default mongoose.models.LiveBattle || mongoose.model<ILiveBattle>('LiveBattle', LiveBattleSchema);
