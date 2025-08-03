import mongoose from 'mongoose';

const battleModeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Mirror Arena', 'Minimalist Mind', 'Code Arena', 'Attack & Defend', 'Narrative Mode', 'Live Viewer'],
    required: true
  },
  rules: {
    timeLimit: Number, // in minutes
    maxPlayers: Number,
    minPlayers: Number,
    allowedLanguages: [String],
    specialRules: [String],
    scoring: {
      type: String,
      enum: ['Time', 'Accuracy', 'Efficiency', 'Custom']
    }
  },
  configuration: {
    mirrorArena: {
      sameCode: Boolean,
      realTimeSync: Boolean
    },
    minimalistMind: {
      maxLines: Number,
      maxCharacters: Number,
      bannedKeywords: [String]
    },
    codeArena: {
      boosts: [{
        name: String,
        effect: String,
        duration: Number
      }],
      powerUps: [String]
    },
    attackDefend: {
      attackTime: Number,
      defendTime: Number,
      rounds: Number
    },
    narrativeMode: {
      story: String,
      chapters: Number,
      progressiveHints: Boolean
    }
  },
  challenges: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Practice'
  }],
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  icon: String,
  banner: String,
  color: String,
  statistics: {
    totalGames: {
      type: Number,
      default: 0
    },
    totalPlayers: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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

battleModeSchema.pre('save', function() {
  this.updatedAt = new Date();
});

export const BattleMode = mongoose.models.BattleMode || mongoose.model('BattleMode', battleModeSchema);
