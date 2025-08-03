import mongoose, { Document, Schema } from 'mongoose';

export interface IAdminActivity extends Document {
  _id: string;
  adminId: mongoose.Types.ObjectId;
  adminName: string;
  adminEmail: string;
  action: string;
  details: {
    targetType?: 'user' | 'challenge' | 'tournament' | 'system' | 'battle';
    targetId?: string;
    targetName?: string;
    beforeState?: Record<string, unknown>;
    afterState?: Record<string, unknown>;
    additionalInfo?: Record<string, unknown>;
  };
  timestamp: Date;
  ip: string;
  userAgent: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'success' | 'failed' | 'pending';
}

const AdminActivitySchema = new Schema<IAdminActivity>({
  adminId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  adminName: {
    type: String,
    required: true,
  },
  adminEmail: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    required: true,
    enum: [
      // User Management
      'USER_LOGIN', 'USER_LOGOUT', 'USER_CREATED', 'USER_UPDATED', 'USER_DELETED',
      'USER_SUSPENDED', 'USER_BANNED', 'USER_ACTIVATED', 'USER_ROLE_CHANGED',
      
      // Challenge Management
      'CHALLENGE_CREATED', 'CHALLENGE_UPDATED', 'CHALLENGE_DELETED', 'CHALLENGE_ACTIVATED',
      'CHALLENGE_DEACTIVATED',
      
      // Tournament Management
      'TOURNAMENT_CREATED', 'TOURNAMENT_UPDATED', 'TOURNAMENT_DELETED', 'TOURNAMENT_STARTED',
      'TOURNAMENT_ENDED', 'TOURNAMENT_CANCELLED',
      
      // Battle Management
      'BATTLE_FORCE_ENDED', 'BATTLE_REVIEWED', 'BATTLE_DISPUTED',
      
      // System Management
      'SYSTEM_MAINTENANCE_ON', 'SYSTEM_MAINTENANCE_OFF', 'SYSTEM_BACKUP',
      'SYSTEM_RESTORE', 'SYSTEM_CONFIG_CHANGED',
      
      // Security
      'ADMIN_LOGIN', 'ADMIN_LOGOUT', 'ADMIN_PASSWORD_CHANGED', 'ADMIN_PERMISSIONS_CHANGED',
      'SECURITY_ALERT', 'SUSPICIOUS_ACTIVITY_DETECTED'
    ]
  },
  details: {
    targetType: {
      type: String,
      enum: ['user', 'challenge', 'tournament', 'system', 'battle'],
    },
    targetId: String,
    targetName: String,
    beforeState: Schema.Types.Mixed,
    afterState: Schema.Types.Mixed,
    additionalInfo: Schema.Types.Mixed,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  ip: {
    type: String,
    required: true,
  },
  userAgent: {
    type: String,
    required: true,
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'low',
  },
  status: {
    type: String,
    enum: ['success', 'failed', 'pending'],
    default: 'success',
  },
}, {
  timestamps: true,
});

// Indexes for better query performance
AdminActivitySchema.index({ adminId: 1, timestamp: -1 });
AdminActivitySchema.index({ action: 1, timestamp: -1 });
AdminActivitySchema.index({ severity: 1, timestamp: -1 });
AdminActivitySchema.index({ 'details.targetType': 1, 'details.targetId': 1 });

export default mongoose.models.AdminActivity || mongoose.model<IAdminActivity>('AdminActivity', AdminActivitySchema);
