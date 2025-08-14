import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import mongoose from 'mongoose';

// User Schema
const UserSchema = new mongoose.Schema({
  email: String,
  username: String,
  totalPoints: { type: Number, default: 0 },
  totalWins: { type: Number, default: 0 },
  totalLosses: { type: Number, default: 0 },
  rank: { type: Number, default: 999 },
  battleStats: [{
    battleMode: String,
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    points: { type: Number, default: 0 }
  }]
});

const User = mongoose.models.User || mongoose.model('User', UserSchema, 'users');

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const battleMode = searchParams.get('battleMode');

    await connectDB();

    // Get user details
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate overall stats
    const totalWins = user.totalWins || 0;
    const totalLosses = user.totalLosses || 0;
    const totalPoints = user.totalPoints || 0;
    const totalGames = totalWins + totalLosses;
    const winRate = totalGames > 0 ? (totalWins / totalGames) * 100 : 0;

    // Calculate rank (simplified - you might want to cache this)
    const usersAbove = await User.countDocuments({ 
      totalPoints: { $gt: totalPoints } 
    });
    const rank = usersAbove + 1;

    // Battle mode specific stats
    let battleModeStats = null;
    if (battleMode && user.battleStats) {
      battleModeStats = user.battleStats.find(
        (stat: any) => stat.battleMode === battleMode
      );
    }

    // Calculate trending (simplified logic)
    const recentPointsGain = Math.floor(Math.random() * 50) - 25; // Mock recent gains
    const trending = recentPointsGain > 10 ? 'up' : recentPointsGain < -10 ? 'down' : 'stable';

    const stats = {
      rank: Math.min(rank, 999),
      totalWins: battleModeStats ? battleModeStats.wins : totalWins,
      totalLosses: battleModeStats ? battleModeStats.losses : totalLosses,
      totalPoints: battleModeStats ? battleModeStats.points : totalPoints,
      winRate: battleModeStats ? 
        ((battleModeStats.wins / (battleModeStats.wins + battleModeStats.losses)) * 100) || 0 : 
        winRate,
      recentGames: Math.floor(Math.random() * 10), // Mock recent games
      trending,
      pointsGain: recentPointsGain
    };

    return NextResponse.json({
      success: true,
      stats,
      battleMode
    });

  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
