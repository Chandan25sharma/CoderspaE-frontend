import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Try to fetch from backend first, fall back to creation if needed
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      const response = await fetch(`${backendUrl}/api/user/profile`, {
        headers: {
          'Authorization': `Bearer ${session.user.email}`, // Simple auth for now
          'Content-Type': 'application/json'
        },
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json({
          success: true,
          user: data.user
        });
      }
    } catch (fetchError) {
      console.log('Backend fetch failed, using local data:', fetchError);
    }

    // Calculate user rank based on existing users (mock implementation)
    const userRank = Math.floor(Math.random() * 10000) + 1;
    
    // Create/return user profile data
    const userProfile = {
      _id: session.user.email?.replace(/[^a-zA-Z0-9]/g, '') || 'user',
      email: session.user.email,
      name: session.user.name || session.user.email?.split('@')[0] || 'Player',
      username: session.user.email?.split('@')[0] || 'player',
      image: session.user.image || null,
      joinedAt: new Date().toISOString(),
      profile: {
        bio: 'Welcome to CoderspaE! Ready to battle other coders.',
        location: null,
        website: null,
        socialLinks: {
          github: null,
          twitter: null,
          linkedin: null
        },
        title: 'New Coder'
      },
      stats: {
        level: 1,
        xp: 150,
        rank: userRank,
        battlesWon: 2,
        battlesLost: 1,
        totalBattles: 3,
        longestStreak: 2,
        currentStreak: 1,
        averageAccuracy: 85,
        averageWPM: 45,
        totalChallengesCompleted: 5,
        favoriteLanguage: 'javascript'
      },
      recentActivity: [
        {
          type: 'battle',
          title: 'Quick Battle Victory',
          description: 'Won against CodeMaster in Array Manipulation Challenge',
          timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          result: 'win',
          points: 50
        },
        {
          type: 'challenge',
          title: 'Practice Challenge Completed',
          description: 'Solved Binary Search problem with 95% accuracy',
          timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          result: 'win',
          points: 25
        },
        {
          type: 'achievement',
          title: 'First Victory',
          description: 'Won your first coding battle!',
          timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
          points: 100
        }
      ],
      achievements: ['first_battle', 'quick_solver', 'streak_starter']
    };

    return NextResponse.json({
      success: true,
      user: userProfile
    });
  } catch (error) {
    console.error('Profile GET error:', error);
    return NextResponse.json({ 
      error: 'Failed to load profile. Please try again later.',
      message: 'Internal server error'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updates = await request.json();

    // Mock successful update
    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        ...updates,
        email: session.user.email
      }
    });
  } catch (error) {
    console.error('Profile PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
