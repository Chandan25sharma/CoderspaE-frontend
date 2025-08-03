import mongoose from 'mongoose';

const tournamentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Single Elimination', 'Double Elimination', 'Round Robin', 'Swiss System'],
    required: true
  },
  format: {
    type: String,
    enum: ['1v1', 'Team', 'Free for All'],
    required: true
  },
  maxParticipants: {
    type: Number,
    required: true
  },
  prizePool: {
    total: Number,
    currency: {
      type: String,
      default: 'USD'
    },
    distribution: [{
      position: Number,
      amount: Number,
      percentage: Number
    }]
  },
  registrationStart: {
    type: Date,
    required: true
  },
  registrationEnd: {
    type: Date,
    required: true
  },
  tournamentStart: {
    type: Date,
    required: true
  },
  tournamentEnd: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Draft', 'Registration Open', 'Registration Closed', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Draft'
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert', 'Mixed'],
    required: true
  },
  languages: [String],
  rules: {
    timeLimit: Number, // in minutes
    allowedLanguages: [String],
    maxTeamSize: Number,
    codeReview: Boolean,
    liveStreaming: Boolean
  },
  challenges: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Practice'
  }],
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team'
    },
    registeredAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['Registered', 'Confirmed', 'Disqualified', 'Withdrawn'],
      default: 'Registered'
    }
  }],
  brackets: [{
    round: Number,
    matches: [{
      participant1: mongoose.Schema.Types.ObjectId,
      participant2: mongoose.Schema.Types.ObjectId,
      winner: mongoose.Schema.Types.ObjectId,
      score: {
        participant1: Number,
        participant2: Number
      },
      scheduledAt: Date,
      completedAt: Date,
      status: {
        type: String,
        enum: ['Scheduled', 'In Progress', 'Completed', 'Cancelled'],
        default: 'Scheduled'
      }
    }]
  }],
  sponsors: [{
    name: String,
    logo: String,
    website: String,
    tier: {
      type: String,
      enum: ['Title', 'Gold', 'Silver', 'Bronze']
    }
  }],
  isPublic: {
    type: Boolean,
    default: true
  },
  requiresApproval: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  moderators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

tournamentSchema.pre('save', function() {
  this.updatedAt = new Date();
});

export const Tournament = mongoose.models.Tournament || mongoose.model('Tournament', tournamentSchema);
