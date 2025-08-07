import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  username: string;
  name: string;
  email: string;
  password: string;
  image?: string;
  role: 'user' | 'admin';
  battlesWon: number;
  battlesLost: number;
  totalBattles: number;
  rating: number;
  preferredLanguage: string;
  joinedAt: Date;
  lastActive: Date;
  githubProfile?: {
    id: string;
    username: string;
    profileUrl: string;
  };
  googleProfile?: {
    id: string;
    profileUrl: string;
  };
  totalCodeExecutions: number;
  favoriteLanguages: string[];
  loginCount: number;
  lastLoginIp?: string;
  isVerified: boolean;
}

const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
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
  password: {
    type: String,
    required: true,
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
  githubProfile: {
    id: { type: String, default: null },
    username: { type: String, default: null },
    profileUrl: { type: String, default: null },
  },
  googleProfile: {
    id: { type: String, default: null },
    profileUrl: { type: String, default: null },
  },
  totalCodeExecutions: {
    type: Number,
    default: 0,
  },
  favoriteLanguages: [{
    type: String,
    default: [],
  }],
  loginCount: {
    type: Number,
    default: 0,
  },
  lastLoginIp: {
    type: String,
    default: null,
  },
  isVerified: {
    type: Boolean,
    default: false,
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
