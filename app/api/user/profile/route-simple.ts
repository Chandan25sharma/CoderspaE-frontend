import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Mock user profile data
    const mockUserProfile = {
      _id: 'mock-user-id',
      email: session.user.email,
      username: session.user.email?.split('@')[0] || 'player',
      avatar: session.user.image || null,
      bio: 'Welcome to CoderspaE!',
      location: 'Unknown',
      github: null,
      linkedin: null,
      website: null,
      skills: ['JavaScript', 'Python', 'React'],
      achievements: [],
      preferences: {
        theme: 'dark',
        language: 'javascript',
        notifications: {
          battles: true,
          tournaments: true,
          friends: true,
          achievements: true
        }
      },
      stats: {
        level: 1,
        xp: 0,
        battles: {
          total: 0,
          wins: 0,
          losses: 0,
          winRate: 0
        },
        tournaments: {
          participated: 0,
          wins: 0,
          topFinishes: 0
        },
        coding: {
          totalTime: 0,
          averageWpm: 0,
          averageAccuracy: 0,
          challengesSolved: 0
        }
      }
    };

    return NextResponse.json({
      success: true,
      user: mockUserProfile
    });
  } catch (error) {
    console.error('Profile GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
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
