import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  avatar: String,
  banner: String,
  captain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['Captain', 'Co-Captain', 'Member'],
      default: 'Member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    permissions: {
      canInvite: {
        type: Boolean,
        default: false
      },
      canKick: {
        type: Boolean,
        default: false
      },
      canEditTeam: {
        type: Boolean,
        default: false
      }
    }
  }],
  invitations: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    invitedAt: {
      type: Date,
      default: Date.now
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Declined', 'Expired'],
      default: 'Pending'
    }
  }],
  settings: {
    maxMembers: {
      type: Number,
      default: 5,
      min: 2,
      max: 10
    },
    isPublic: {
      type: Boolean,
      default: true
    },
    requiresApproval: {
      type: Boolean,
      default: false
    },
    allowInvitations: {
      type: Boolean,
      default: true
    }
  },
  statistics: {
    totalBattles: {
      type: Number,
      default: 0
    },
    wins: {
      type: Number,
      default: 0
    },
    losses: {
      type: Number,
      default: 0
    },
    draws: {
      type: Number,
      default: 0
    },
    winRate: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      default: 1200
    },
    rank: Number,
    totalPoints: {
      type: Number,
      default: 0
    }
  },
  achievements: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Achievement'
  }],
  tournaments: [{
    tournament: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tournament'
    },
    placement: Number,
    points: Number,
    joinedAt: Date
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

teamSchema.pre('save', function() {
  this.updatedAt = new Date();
  // Calculate win rate
  if (this.statistics) {
    const totalGames = this.statistics.wins + this.statistics.losses + this.statistics.draws;
    if (totalGames > 0) {
      this.statistics.winRate = (this.statistics.wins / totalGames) * 100;
    }
  }
});

export const Team = mongoose.models.Team || mongoose.model('Team', teamSchema);
