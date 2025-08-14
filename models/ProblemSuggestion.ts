import mongoose from 'mongoose';

const ProblemSuggestionSchema = new mongoose.Schema({
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
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  category: [{
    type: String,
    enum: [
      'Quick Dual (1v1)',
      'Minimalist Mind',
      'Mirror Arena',
      'Narrative Mode',
      'Team Clash',
      'Attack & Defend'
    ],
    required: true
  }],
  timeLimit: {
    type: Number,
    required: true // in minutes
  },
  tags: [{
    type: String,
    required: true
  }],
  suggestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  votes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    vote: {
      type: String,
      enum: ['up', 'down'],
      default: 'up'
    },
    votedAt: {
      type: Date,
      default: Date.now
    }
  }],
  totalVotes: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date,
  approvedAsProblem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem'
  }
}, {
  timestamps: true
});

// Indexes for better performance
ProblemSuggestionSchema.index({ totalVotes: -1 });
ProblemSuggestionSchema.index({ status: 1 });
ProblemSuggestionSchema.index({ createdAt: -1 });
ProblemSuggestionSchema.index({ suggestedBy: 1 });

export default mongoose.models.ProblemSuggestion || mongoose.model('ProblemSuggestion', ProblemSuggestionSchema);
