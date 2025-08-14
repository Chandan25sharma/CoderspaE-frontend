import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/DatabaseSchemas';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const isOnline = searchParams.get('isOnline');
    const battleMode = searchParams.get('battleMode');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Build query
    const query: any = {};
    
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { displayName: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (isOnline === 'true') {
      query.isOnline = true;
    }

    // Get total count
    const total = await User.countDocuments(query);
    
    // Get users with pagination
    const users = await User.find(query)
      .select('username displayName avatar country bio totalPoints rank tier isOnline lastSeen battleStats')
      .sort({ totalPoints: -1, rank: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Calculate stats for battle mode
    const processedUsers = users.map(user => {
      let modeStats = { played: 0, won: 0, points: 0 };
      
      if (battleMode && user.battleStats) {
        switch (battleMode) {
          case 'quick-battle':
            modeStats = user.battleStats.quickBattleStats || modeStats;
            break;
          case 'minimalist-mind':
            modeStats = user.battleStats.minimalistMindStats || modeStats;
            break;
          case 'narrative-mode':
            modeStats = user.battleStats.narrativeModeStats || modeStats;
            break;
          case 'team-clash':
            modeStats = user.battleStats.teamClashStats || modeStats;
            break;
          case 'attack-defend':
            modeStats = user.battleStats.attackDefendStats || modeStats;
            break;
          case '1v1-quick-dual':
            modeStats = user.battleStats.quickDualStats || modeStats;
            break;
        }
      }

      return {
        ...user,
        modeStats
      };
    });

    return NextResponse.json({
      success: true,
      users: processedUsers,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
        totalUsers: total
      },
      stats: {
        totalUsers: total,
        onlineUsers: await User.countDocuments({ isOnline: true }),
        totalBattles: users.reduce((sum, user) => sum + (user.battleStats?.totalBattles || 0), 0)
      }
    });
  } catch (error) {
    console.error('Users API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const userData = await request.json();
    
    // Create new user with default stats
    const user = new User({
      ...userData,
      totalPoints: 0,
      rank: 0,
      tier: 'Bronze',
      isOnline: false,
      battleStats: {
        totalBattles: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        winRate: 0,
        currentStreak: 0,
        longestStreak: 0,
        quickBattleStats: { played: 0, won: 0, points: 0 },
        minimalistMindStats: { played: 0, won: 0, points: 0 },
        narrativeModeStats: { played: 0, won: 0, points: 0 },
        teamClashStats: { played: 0, won: 0, points: 0 },
        attackDefendStats: { played: 0, won: 0, points: 0 },
        quickDualStats: { played: 0, won: 0, points: 0 }
      }
    });
    
    await user.save();
    
    return NextResponse.json({
      success: true,
      user,
      message: 'User created successfully'
    });
  } catch (error) {
    console.error('Create User Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
