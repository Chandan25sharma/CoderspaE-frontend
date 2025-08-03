import mongoose, { Document, Schema } from 'mongoose';

export interface ITestCase {
  input: string;
  expectedOutput: string;
  description?: string;
}

export interface IChallenge extends Document {
  _id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  testCases: ITestCase[];
  starterCode: {
    javascript: string;
    python: string;
    java: string;
    cpp: string;
  };
  functionName: string;
  timeLimit: number; // in milliseconds
  memoryLimit: number; // in MB
  isActive: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TestCaseSchema = new Schema<ITestCase>({
  input: {
    type: String,
    required: true,
  },
  expectedOutput: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
});

const ChallengeSchema = new Schema<IChallenge>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  testCases: [TestCaseSchema],
  starterCode: {
    javascript: {
      type: String,
      default: '// Write your solution here\nfunction solution() {\n    \n}',
    },
    python: {
      type: String,
      default: '# Write your solution here\ndef solution():\n    pass',
    },
    java: {
      type: String,
      default: '// Write your solution here\npublic class Solution {\n    public void solution() {\n        \n    }\n}',
    },
    cpp: {
      type: String,
      default: '// Write your solution here\n#include <iostream>\nusing namespace std;\n\nvoid solution() {\n    \n}',
    },
  },
  functionName: {
    type: String,
    default: 'solution',
  },
  timeLimit: {
    type: Number,
    default: 5000, // 5 seconds
  },
  memoryLimit: {
    type: Number,
    default: 128, // 128 MB
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Challenge || mongoose.model<IChallenge>('Challenge', ChallengeSchema);
