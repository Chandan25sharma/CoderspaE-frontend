import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IAdmin extends Document {
  _id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'super-admin';
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string; // Admin who created this admin
  permissions: {
    canCreateAdmins: boolean;
    canDeleteAdmins: boolean;
    canViewAnalytics: boolean;
    canManageUsers: boolean;
    canManageContent: boolean;
  };
  loginAttempts: number;
  lockUntil?: Date;
  otpSecret?: string;
  otpVerified: boolean;
}

const AdminSchema: Schema = new Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long']
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  role: {
    type: String,
    enum: ['admin', 'super-admin'],
    default: 'admin'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  createdBy: {
    type: String, // Admin ID who created this admin
    default: null
  },
  permissions: {
    canCreateAdmins: {
      type: Boolean,
      default: false
    },
    canDeleteAdmins: {
      type: Boolean,
      default: false
    },
    canViewAnalytics: {
      type: Boolean,
      default: true
    },
    canManageUsers: {
      type: Boolean,
      default: true
    },
    canManageContent: {
      type: Boolean,
      default: true
    }
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date
  },
  otpSecret: {
    type: String
  },
  otpVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Virtual for checking if account is locked
AdminSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Pre-save middleware to handle password hashing
AdminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch {
    next(new Error('Password hashing failed'));
  }
});

// Method to check password
AdminSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch {
    return false;
  }
};

// Method to increment login attempts
AdminSchema.methods.incLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates: Record<string, unknown> = { $inc: { loginAttempts: 1 } };
  
  // Lock account after 5 failed attempts for 2 hours
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }
  
  return this.updateOne(updates);
};

// Method to reset login attempts
AdminSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 }
  });
};

export default mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);
