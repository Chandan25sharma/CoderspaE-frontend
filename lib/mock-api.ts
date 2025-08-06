// Mock implementations for API routes during build
// This file provides fallback implementations when database is not available

export const mockApiResponse = (data: any = null, success: boolean = true) => {
  return {
    success,
    data,
    message: success ? 'Success' : 'Feature not available in demo mode',
    error: success ? null : 'Demo mode - feature disabled'
  };
};

export const mockUserData = {
  _id: 'demo-user',
  name: 'Demo User',
  email: 'demo@coderspae.com',
  username: 'demouser',
  level: 15,
  xp: 2450,
  rank: 'Gold',
  totalBattles: 25,
  wins: 18,
  winRate: 72,
  streakCount: 5,
  achievements: [],
  stats: {
    totalProblems: 45,
    problemsSolved: 32,
    averageTime: 180,
    languages: ['JavaScript', 'Python', 'Java'],
    difficulty: {
      easy: 15,
      medium: 12,
      hard: 5
    }
  }
};

export const isDemoMode = () => {
  return !process.env.MONGODB_URI || process.env.NODE_ENV === 'development';
};
