import mongoose, { Document, Schema } from 'mongoose';

export interface ISession extends Document {
  _id: string;
  userId: string;
  userEmail: string;
  userName: string;
  provider: 'google' | 'github' | 'credentials';
  loginTime: Date;
  lastActivity: Date;
  ipAddress?: string;
  userAgent?: string;
  sessionToken?: string;
  isActive: boolean;
  logoutTime?: Date;
  location?: {
    country?: string;
    city?: string;
    region?: string;
  };
  deviceInfo?: {
    browser?: string;
    os?: string;
    device?: string;
  };
}

const SessionSchema = new Schema<ISession>({
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
  userName: {
    type: String,
    required: true,
  },
  provider: {
    type: String,
    enum: ['google', 'github', 'credentials'],
    required: true,
  },
  loginTime: {
    type: Date,
    default: Date.now,
    index: true,
  },
  lastActivity: {
    type: Date,
    default: Date.now,
  },
  ipAddress: {
    type: String,
    default: null,
  },
  userAgent: {
    type: String,
    default: null,
  },
  sessionToken: {
    type: String,
    default: null,
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true,
  },
  logoutTime: {
    type: Date,
    default: null,
  },
  location: {
    country: { type: String, default: null },
    city: { type: String, default: null },
    region: { type: String, default: null },
  },
  deviceInfo: {
    browser: { type: String, default: null },
    os: { type: String, default: null },
    device: { type: String, default: null },
  },
}, {
  timestamps: true,
  collection: 'sessions'
});

// Index for efficient queries
SessionSchema.index({ userId: 1, isActive: 1 });
SessionSchema.index({ loginTime: -1 });

export default mongoose.models.Session || mongoose.model<ISession>('Session', SessionSchema);
