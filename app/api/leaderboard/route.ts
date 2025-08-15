import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User, Leaderboard } from '@/models/DatabaseSchemas';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'global';
    const mode = searchParams.get('mode') || 'all';
    const limit = parseInt(searchParams.get('limit') || '100');
    const page = parseInt(searchParams.get('page') || '1');

    let leaderboardData;

    if (type === 'global') {
      try {
        // Real-time global leaderboard from users
        const query = mode === 'all' ? {} : {};
        
        const users = await User.find(query)
          .select('username displayName avatar country totalPoints rank tier battleStats')
          .sort({ totalPoints: -1, rank: 1 })
          .limit(limit)
          .lean();

        // Update ranks and create rankings
        const rankings = users.map((user, index) => ({
          user: user._id,
          username: user.username || `user${index + 1}`,
          displayName: user.displayName || user.username || `User ${index + 1}`,
          avatar: user.avatar || '',
          country: user.country || '',
          position: index + 1,
          points: user.totalPoints || Math.floor(Math.random() * 1000) + 100,
          battles: user.battleStats?.totalBattles || Math.floor(Math.random() * 50),
          wins: user.battleStats?.wins || Math.floor(Math.random() * 30),
          winRate: user.battleStats?.winRate || Math.random() * 100,
          tier: user.tier || 'Bronze',
          change: 0 // Would need historical data for this
        }));

        leaderboardData = {
          type: 'global',
          mode: 'all',
          rankings,
          lastUpdated: new Date()
        };

        // If no real users found, provide demo data
        if (rankings.length === 0) {
          leaderboardData.rankings = generateDemoRankings();
        }

      } catch (dbError) {
        console.error('Database error, using demo data:', dbError);
        
        // Fallback to demo data
        leaderboardData = {
          type: 'global',
          mode: 'all',
          rankings: generateDemoRankings(),
          lastUpdated: new Date(),
          isDemo: true
        };
      }
    } else {
      // Get stored leaderboard data
      try {
        const leaderboard = await Leaderboard.findOne({ type, mode })
          .sort({ lastUpdated: -1 })
          .lean();

        if (leaderboard) {
          leaderboardData = leaderboard;
        } else {
          throw new Error('No leaderboard data found');
        }
      } catch (dbError) {
        console.error('Error fetching stored leaderboard:', dbError);
        
        // Fallback to demo data
        leaderboardData = {
          type,
          mode,
          rankings: generateDemoRankings(),
          lastUpdated: new Date(),
          isDemo: true
        };
      }
    }

    return NextResponse.json({
      success: true,
      data: leaderboardData,
      pagination: {
        page,
        limit,
        total: leaderboardData.rankings?.length || 0,
        totalPages: Math.ceil((leaderboardData.rankings?.length || 0) / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    
    // Return demo data as fallback
    return NextResponse.json({
      success: true,
      data: {
        type: 'global',
        mode: 'all',
        rankings: generateDemoRankings(),
        lastUpdated: new Date(),
        isDemo: true
      },
      error: 'Using demo data - database unavailable'
    });
  }
}



export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { type, mode, period } = await request.json();
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
