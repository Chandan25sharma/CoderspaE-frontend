import { ObjectId } from 'mongodb';

// User Types
export interface User {
  _id: ObjectId;
  email: string;
  username: string;
  password?: string;
  avatar?: string;
  bio?: string;
  preferences: {
    theme: 'light' | 'dark';
    language: string;
    notifications: {
      email: boolean;
      push: boolean;
      battleInvites: boolean;
      friendRequests: boolean;
    };
  };
  profile: {
    github?: string;
    linkedin?: string;
    website?: string;
    location?: string;
    skills: string[];
    experience: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  };
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  isActive: boolean;
  subscription?: {
    tier: string;
    status: string;
  };
}

// Database Types
export interface UserStats {
  userId: ObjectId;
  level: number;
  xp: number;
  rating: number;
  battlesPlayed: number;
  battlesWon: number;
  tournamentWins: number;
  streakCurrent: number;
  streakBest: number;
  averageSpeed: number;
  averageAccuracy: number;
  problemsSolved: number;
  codeSubmissions: number;
  updatedAt: Date;
}

export interface UserActivity {
  userId: ObjectId;
  type: string;
  title: string;
  description: string;
  metadata?: Record<string, any>;
  timestamp: Date;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  difficulty: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  requirements: {
    type: string;
    target: number;
    operator: 'gte' | 'lte' | 'eq';
  };
  rewards: {
    xp: number;
    title?: string;
    badge?: string;
  };
  isSecret: boolean;
}

export interface UserAchievement {
  userId: ObjectId;
  achievementId: string;
  unlockedAt: Date;
  progress: number;
}

// Subscription Types
export interface SubscriptionTier {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
  };
  features: string[];
  limits: {
    battleParticipants?: number;
    tournamentEntries?: number;
    aiInsightsPerDay?: number;
    customChallenges?: number;
    prioritySupport?: boolean;
  };
  stripeProductId: string;
  stripePriceIds: {
    monthly: string;
    yearly: string;
  };
}

export interface Subscription {
  userId: ObjectId;
  tier: string;
  status: 'active' | 'cancelled' | 'expired';
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  billingCycle: 'monthly' | 'yearly';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Friends Types
export interface Friend {
  _id?: ObjectId;
  userId: ObjectId;
  friendId: ObjectId;
  friendshipDate: Date;
  nickname?: string;
  isFavorite: boolean;
  isBlocked: boolean;
  lastInteraction?: Date;
}

export interface FriendRequest {
  _id?: ObjectId;
  senderId: ObjectId;
  receiverId: ObjectId;
  status: 'pending' | 'accepted' | 'declined';
  message?: string;
  sentAt: Date;
  respondedAt?: Date;
}

// Team Types
export interface TeamMember {
  userId: ObjectId;
  role: 'leader' | 'co-leader' | 'member';
  joinedAt: Date;
  permissions: {
    canInvite: boolean;
    canKick: boolean;
    canEditTeam: boolean;
    canStartBattles: boolean;
  };
  contributions: {
    battlesParticipated: number;
    battlesWon: number;
    xpContributed: number;
  };
}

export interface Team {
  _id?: ObjectId;
  name: string;
  description: string;
  createdBy: ObjectId;
  members: TeamMember[];
  settings: {
    isPublic: boolean;
    maxMembers: number;
    allowInvites: boolean;
    skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    preferredLanguages: string[];
  };
  stats: {
    battlesPlayed: number;
    battlesWon: number;
    tournamentWins: number;
    totalXP: number;
    averageRating: number;
  };
  createdAt: Date;
  updatedAt: Date;
  avatar?: string;
  banner?: string;
  tags: string[];
  achievements: string[];
}

export interface TeamInvite {
  _id?: ObjectId;
  teamId: ObjectId;
  invitedBy: ObjectId;
  invitedUser: ObjectId;
  message?: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  sentAt: Date;
  respondedAt?: Date;
  expiresAt: Date;
}

// Battle Types
export interface Battle {
  _id?: ObjectId;
  mode: 'solo' | '1v1' | 'tournament' | 'team';
  participants: ObjectId[];
  challenge: {
    title: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard' | 'expert';
    language: string;
    timeLimit: number;
    testCases: Array<{
      input: string;
      expectedOutput: string;
      isHidden: boolean;
    }>;
  };
  status: 'waiting' | 'active' | 'completed' | 'cancelled';
  results?: Array<{
    userId: ObjectId;
    score: number;
    completionTime: number;
    accuracy: number;
    code: string;
  }>;
  winnerId?: ObjectId;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Database connection type
export interface DatabaseConnection {
  collection: (name: string) => any;
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export interface MongoDocument {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
