import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User, Leaderboard } from '@/models/DatabaseSchemas';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'global'; // global, weekly, monthly, mode-specific
    const mode = searchParams.get('mode') || 'all';
    const limit = parseInt(searchParams.get('limit') || '100');

    let leaderboardData;

    if (type === 'global') {
      // Real-time global leaderboard from users
      const query = mode === 'all' ? {} : {};
      
      const users = await User.find(query)
        .select('username displayName avatar country totalPoints rank tier battleStats')
        .sort({ totalPoints: -1, rank: 1 })
        .limit(limit)
        .lean();

      // Update ranks
      const rankings = users.map((user, index) => ({
        user: user._id,
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar,
        country: user.country,
        position: index + 1,
        points: user.totalPoints,
        battles: user.battleStats?.totalBattles || 0,
        wins: user.battleStats?.wins || 0,
        winRate: user.battleStats?.winRate || 0,
        tier: user.tier,
        change: 0 // Would need historical data for this
      }));

      leaderboardData = {
        type: 'global',
        mode: 'all',
        rankings,
        lastUpdated: new Date()
      };
    } else {
      // Get stored leaderboard data
      const leaderboard = await Leaderboard.findOne({ type, mode })
        .populate('rankings.user', 'username displayName avatar country tier')
        .sort({ lastUpdated: -1 });

      if (!leaderboard) {
        return NextResponse.json({
          success: true,
          leaderboard: {
            type,
            mode,
            rankings: [],
            lastUpdated: new Date()
          }
        });
      }

      leaderboardData = leaderboard;
    }

    return NextResponse.json({
      success: true,
      leaderboard: leaderboardData
    });
  } catch (error) {
    console.error('Leaderboard API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { type, mode, period } = await request.json();

    // Generate leaderboard based on type
    let rankings: Array<{
      user: string;
      position: number;
      points: number;
      battles: number;
      wins: number;
      winRate: number;
      change: number;
    }> = [];
    
    if (type === 'weekly' || type === 'monthly') {
      const now = new Date();
      const startDate = type === 'weekly' 
        ? new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        : new Date(now.getFullYear(), now.getMonth(), 1);
      
      // For now, use global rankings as base
      // In production, you'd filter by date range from battle history
      const users = await User.find({})
        .select('username displayName avatar totalPoints battleStats')
        .sort({ totalPoints: -1 })
        .limit(100)
        .lean();

      rankings = users.map((user, index) => ({
        user: String(user._id),
        position: index + 1,
        points: Number(user.totalPoints) || 0,
        battles: Number(user.battleStats?.totalBattles) || 0,
        wins: Number(user.battleStats?.wins) || 0,
        winRate: Number(user.battleStats?.winRate) || 0,
        change: 0
      }));
    }

    // Create or update leaderboard
    const leaderboard = await Leaderboard.findOneAndUpdate(
      { type, mode },
      {
        type,
        mode,
        period: period ? {
          start: new Date(period.start),
          end: new Date(period.end)
        } : undefined,
        rankings,
        lastUpdated: new Date()
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      leaderboard,
      message: 'Leaderboard updated successfully'
    });
  } catch (error) {
    console.error('Update Leaderboard Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update leaderboard' },
      { status: 500 }
    );
  }
}
