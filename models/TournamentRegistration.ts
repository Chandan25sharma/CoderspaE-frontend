import mongoose, { Document, Schema } from 'mongoose';

export interface ITournamentRegistration extends Document {
  _id: string;
  userId: string;
  userEmail: string;
  userName: string;
  tournamentId: string;
  tournamentName: string;
  registrationDate: Date;
  teamId?: string;
  teamName?: string;
  isTeamLeader: boolean;
  status: 'registered' | 'confirmed' | 'cancelled' | 'disqualified';
  paymentStatus?: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentId?: string;
  preferences: {
    preferredLanguage: string;
    notifications: boolean;
    teamInviteCode?: string;
  };
  registrationSource: 'website' | 'mobile' | 'admin';
  ipAddress?: string;
}

const TournamentRegistrationSchema = new Schema<ITournamentRegistration>({
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
  tournamentId: {
    type: String,
    required: true,
    index: true,
  },
  tournamentName: {
    type: String,
    required: true,
  },
  registrationDate: {
    type: Date,
    default: Date.now,
    index: true,
  },
  teamId: {
    type: String,
    default: null,
  },
  teamName: {
    type: String,
    default: null,
  },
  isTeamLeader: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['registered', 'confirmed', 'cancelled', 'disqualified'],
    default: 'registered',
    index: true,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending',
  },
  paymentId: {
    type: String,
    default: null,
  },
  preferences: {
    preferredLanguage: { type: String, default: 'javascript' },
    notifications: { type: Boolean, default: true },
    teamInviteCode: { type: String, default: null },
  },
  registrationSource: {
    type: String,
    enum: ['website', 'mobile', 'admin'],
    default: 'website',
  },
  ipAddress: {
    type: String,
    default: null,
  },
}, {
  timestamps: true,
  collection: 'tournament_registrations'
});

// Compound indexes for efficient queries
TournamentRegistrationSchema.index({ tournamentId: 1, status: 1 });
TournamentRegistrationSchema.index({ userId: 1, registrationDate: -1 });

export default mongoose.models.TournamentRegistration || mongoose.model<ITournamentRegistration>('TournamentRegistration', TournamentRegistrationSchema);
