import mongoose, { Document, Schema } from 'mongoose';

export interface IBattle extends Document {
  _id: string;
  player1: mongoose.Types.ObjectId;
  player2: mongoose.Types.ObjectId;
  challengeId: string;
  challengeTitle: string;
  challengeDescription: string;
  status: 'waiting' | 'active' | 'completed' | 'cancelled';
  winner?: mongoose.Types.ObjectId;
  player1Code: string;
  player2Code: string;
  player1Completed: boolean;
  player2Completed: boolean;
  player1Time?: number;
  player2Time?: number;
  language: string;
  roomId: string;
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
}

const BattleSchema = new Schema<IBattle>({
  player1: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  player2: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  challengeId: {
    type: String,
    required: true,
  },
  challengeTitle: {
    type: String,
    required: true,
  },
  challengeDescription: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['waiting', 'active', 'completed', 'cancelled'],
    default: 'waiting',
  },
  winner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  player1Code: {
    type: String,
    default: '',
  },
  player2Code: {
    type: String,
    default: '',
  },
  player1Completed: {
    type: Boolean,
    default: false,
  },
  player2Completed: {
    type: Boolean,
    default: false,
  },
  player1Time: {
    type: Number,
    default: null,
  },
  player2Time: {
    type: Number,
    default: null,
  },
  language: {
    type: String,
    default: 'javascript',
  },
  roomId: {
    type: String,
    required: true,
    unique: true,
  },
  startedAt: {
    type: Date,
    default: null,
  },
  completedAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Battle || mongoose.model<IBattle>('Battle', BattleSchema);
