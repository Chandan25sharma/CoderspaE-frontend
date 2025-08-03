import mongoose from 'mongoose';

const practiceSchema = new mongoose.Schema({
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
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    required: true
  },
  language: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  timeLimit: {
    type: Number, // in minutes
    required: true
  },
  problemStatement: {
    type: String,
    required: true
  },
  starterCode: {
    type: String,
    default: ''
  },
  testCases: [{
    input: String,
    expectedOutput: String,
    isHidden: {
      type: Boolean,
      default: false
    }
  }],
  solutions: [{
    language: String,
    code: String,
    explanation: String
  }],
  hints: [String],
  tags: [String],
  points: {
    type: Number,
    default: 100
  },
  isActive: {
    type: Boolean,
    default: true
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

practiceSchema.pre('save', function() {
  this.updatedAt = new Date();
});

export const Practice = mongoose.models.Practice || mongoose.model('Practice', practiceSchema);
