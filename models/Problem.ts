import mongoose from 'mongoose';

const ProblemSchema = new mongoose.Schema({
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
    required: true, // in minutes
    min: 5,
    max: 120
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
  tags: [{
    type: String,
    required: true
  }],
  testCases: [{
    input: String,
    expectedOutput: String,
    isHidden: {
      type: Boolean,
      default: false
    }
  }],
  constraints: String,
  examples: [{
    input: String,
    output: String,
    explanation: String
  }],
  hints: [String],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  votes: {
    type: Number,
    default: 0
  },
  suggestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isApproved: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for better performance
ProblemSchema.index({ difficulty: 1, category: 1 });
ProblemSchema.index({ rating: -1 });
ProblemSchema.index({ createdAt: -1 });
ProblemSchema.index({ tags: 1 });

export default mongoose.models.Problem || mongoose.model('Problem', ProblemSchema);
