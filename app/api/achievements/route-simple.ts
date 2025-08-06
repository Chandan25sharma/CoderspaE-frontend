import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

interface Achievement {
  _id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  difficulty: string;
  xpReward: number;
  unlockedAt?: Date;
}

// Mock achievements data for build compatibility
const mockAchievements: Achievement[] = [
  {
    _id: '1',
    name: 'First Victory',
    description: 'Win your first battle',
    icon: '🏆',
    category: 'battle',
    difficulty: 'bronze',
    xpReward: 100,
    unlockedAt: new Date()
  },
  {
    _id: '2', 
    name: 'Speed Demon',
    description: 'Complete a challenge in under 30 seconds',
    icon: '⚡',
    category: 'speed',
    difficulty: 'silver',
    xpReward: 250
  },
  {
    _id: '3',
    name: 'Code Master',
    description: 'Solve 10 problems in a row',
    icon: '🎯',
    category: 'skill',
    difficulty: 'gold',
    xpReward: 500
  }
];

export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Return mock data for now
    return NextResponse.json({
      success: true,
      achievements: mockAchievements,
      totalXP: mockAchievements.reduce((sum, achievement) => 
        achievement.unlockedAt ? sum + achievement.xpReward : sum, 0
      )
    });

  } catch (error) {
    console.error('Achievement API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      achievements: [],
      totalXP: 0
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { achievementId, action } = await request.json();

    if (action === 'unlock') {
      // Mock achievement unlock
      return NextResponse.json({
        success: true,
        message: 'Achievement unlocked!',
        xpGained: 100
      });
    }

    if (action === 'claim') {
      // Mock reward claim
      return NextResponse.json({
        success: true,
        message: 'Rewards claimed!',
        rewards: { xp: 100, coins: 50 }
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Achievement POST API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
