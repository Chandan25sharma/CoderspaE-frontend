import mongoose, { Document, Schema } from 'mongoose';

export interface ICodeExecution extends Document {
  _id: string;
  userId: string;
  userEmail: string;
  code: string;
  language: 'python' | 'javascript' | 'java' | 'cpp';
  input?: string;
  output?: string;
  error?: string;
  executionTime: number; // in milliseconds
  memoryUsed?: number; // in bytes
  status: 'success' | 'error' | 'timeout' | 'pending';
  executedAt: Date;
  ipAddress?: string;
  context: 'practice' | 'battle' | 'tournament' | 'admin-test' | 'playground';
  battleId?: string;
  problemId?: string;
}

const CodeExecutionSchema = new Schema<ICodeExecution>({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  userEmail: {
    type: String,
    required: true,
    index: true,
  },
  code: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    enum: ['python', 'javascript', 'java', 'cpp'],
    required: true,
  },
  input: {
    type: String,
    default: '',
  },
  output: {
    type: String,
    default: '',
  },
  error: {
    type: String,
    default: null,
  },
  executionTime: {
    type: Number,
    default: 0,
  },
  memoryUsed: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['success', 'error', 'timeout', 'pending'],
    default: 'pending',
  },
  executedAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  ipAddress: {
    type: String,
    default: null,
  },
  context: {
    type: String,
    enum: ['practice', 'battle', 'tournament', 'admin-test', 'playground'],
    required: true,
  },
  battleId: {
    type: String,
    default: null,
  },
  problemId: {
    type: String,
    default: null,
  },
}, {
  timestamps: true,
  collection: 'code_executions'
});

// Index for efficient queries
CodeExecutionSchema.index({ userId: 1, executedAt: -1 });
CodeExecutionSchema.index({ language: 1, status: 1 });
CodeExecutionSchema.index({ context: 1, executedAt: -1 });

export default mongoose.models.CodeExecution || mongoose.model<ICodeExecution>('CodeExecution', CodeExecutionSchema);
