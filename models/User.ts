import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: 'user' | 'admin';
  battlesWon: number;
  battlesLost: number;
  totalBattles: number;
  rating: number;
  preferredLanguage: string;
  joinedAt: Date;
  lastActive: Date;
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  image: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  battlesWon: {
    type: Number,
    default: 0,
  },
  battlesLost: {
    type: Number,
    default: 0,
  },
  totalBattles: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 1000,
  },
  preferredLanguage: {
    type: String,
    default: 'en',
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
  lastActive: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Calculate win rate virtual field
UserSchema.virtual('winRate').get(function() {
  if (this.totalBattles === 0) return 0;
  return Math.round((this.battlesWon / this.totalBattles) * 100);
});

// Ensure virtual fields are serialized
UserSchema.set('toJSON', {
  virtuals: true,
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
