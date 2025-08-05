import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db('coderspae');

    // Get user profile with stats
    const user = await db.collection('users').findOne(
      { email: session.user.email },
      { projection: { password: 0 } }
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get user statistics
    const stats = await db.collection('user_stats').findOne({ userId: user._id });
    const recentActivity = await db.collection('user_activities')
      .find({ userId: user._id })
      .sort({ timestamp: -1 })
      .limit(10)
      .toArray();

    const achievements = await db.collection('user_achievements')
      .find({ userId: user._id })
      .toArray();

    return NextResponse.json({
      success: true,
      profile: {
        ...user,
        stats: stats || {
          level: 1,
          xp: 0,
          nextLevelXP: 1000,
          rank: 999999,
          battlesWon: 0,
          battlesPlayed: 0,
          challengesCompleted: 0,
          averageAccuracy: 0,
          averageWPM: 0,
          currentStreak: 0,
          longestStreak: 0
        },
        recentActivity: recentActivity || [],
        achievements: achievements || []
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db('coderspae');

    const updates = await request.json();
    const { password, ...profileUpdates } = updates;

    // Validate required fields
    if (profileUpdates.email && !profileUpdates.email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Build update object
    const updateData: any = {
      ...profileUpdates,
      updatedAt: new Date()
    };

    // Handle password update
    if (password) {
      if (password.length < 6) {
        return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
      }
      updateData.password = await bcrypt.hash(password, 12);
    }

    // Update user profile
    const result = await db.collection('users').updateOne(
      { email: session.user.email },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Log activity
    await db.collection('user_activities').insertOne({
      userId: new ObjectId(session.user.id),
      type: 'profile_update',
      title: 'Updated Profile',
      description: 'Profile information was updated',
      timestamp: new Date()
    });

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db('coderspae');

    // Soft delete - mark account as deleted
    await db.collection('users').updateOne(
      { email: session.user.email },
      { 
        $set: { 
          status: 'deleted',
          deletedAt: new Date(),
          email: `deleted_${Date.now()}_${session.user.email}`
        }
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete profile error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
