import mongoose, { Document, Schema } from 'mongoose';

export interface IAdministrator extends Document {
  _id: string;
  name: string;
  email: string;
  password?: string; // For email/password login
  role: 'super-admin' | 'admin' | 'moderator';
  permissions: string[];
  loginProvider: 'email' | 'google' | 'github';
  googleProfile?: {
    id: string;
    profileUrl: string;
  };
  githubProfile?: {
    id: string;
    username: string;
    profileUrl: string;
  };
  createdAt: Date;
  lastLogin: Date;
  isActive: boolean;
  createdBy?: string; // ID of admin who created this admin
}

const AdministratorSchema = new Schema<IAdministrator>({
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
    default: null, // For OAuth logins
  },
  role: {
    type: String,
    enum: ['super-admin', 'admin', 'moderator'],
    default: 'admin',
  },
  permissions: [{
    type: String,
    default: [],
  }],
  loginProvider: {
    type: String,
    enum: ['email', 'google', 'github'],
    required: true,
  },
  googleProfile: {
    id: { type: String, default: null },
    profileUrl: { type: String, default: null },
  },
  githubProfile: {
    id: { type: String, default: null },
    username: { type: String, default: null },
    profileUrl: { type: String, default: null },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdBy: {
    type: String,
    default: null,
  },
}, {
  timestamps: true,
  collection: 'administrators'
});

// Index for efficient queries
AdministratorSchema.index({ email: 1 });
AdministratorSchema.index({ role: 1, isActive: 1 });

export default mongoose.models.Administrator || mongoose.model<IAdministrator>('Administrator', AdministratorSchema);
