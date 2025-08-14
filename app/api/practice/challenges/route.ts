import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Practice } from '@/models/Practice';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const difficulty = searchParams.get('difficulty');
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');

    // Build filter
    interface FilterInterface {
      isActive: boolean;
      difficulty?: string;
      category?: string;
    }
    
    const filter: FilterInterface = { isActive: true };
    if (difficulty) filter.difficulty = difficulty;
    if (category) filter.category = category;

    // Fetch challenges from database
    const challenges = await Practice.find(filter)
      .select('title description difficulty category timeLimit tags xpReward statistics')
      .sort({ featured: -1, createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Practice.countDocuments(filter);

    return NextResponse.json({
      success: true,
      challenges: challenges.map(challenge => ({
        id: challenge._id,
        title: challenge.title,
        description: challenge.description,
        difficulty: challenge.difficulty,
        category: challenge.category,
        timeLimit: challenge.timeLimit,
        tags: challenge.tags || [],
        xpReward: challenge.xpReward || 50,
        statistics: challenge.statistics || {
          totalAttempts: 0,
          successRate: 0,
          averageTime: 0
        }
      })),
      total,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching practice challenges:', error);
    
    // Return fallback data on error
    const fallbackChallenges = [
      {
        id: 'fallback-1',
        title: 'Array Manipulation',
        description: 'Learn to manipulate arrays with various operations.',
        difficulty: 'Beginner',
        category: 'Arrays',
        timeLimit: 30,
        tags: ['arrays'],
        xpReward: 50,
        statistics: { totalAttempts: 500, successRate: 80, averageTime: 12 }
      },
      {
        id: 'fallback-2',
        title: 'String Processing',
        description: 'Master string manipulation techniques.',
        difficulty: 'Intermediate',
        category: 'Strings',
        timeLimit: 35,
        tags: ['strings'],
        xpReward: 75,
        statistics: { totalAttempts: 300, successRate: 70, averageTime: 18 }
      }
    ];

    return NextResponse.json({
      success: true,
      challenges: fallbackChallenges,
      total: fallbackChallenges.length,
      message: 'Using fallback data due to database connection issue'
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const data = await request.json();
    const challenge = new Practice(data);
    await challenge.save();

    return NextResponse.json({
      success: true,
      message: 'Challenge created successfully',
      challenge
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating practice challenge:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create challenge'
    }, { status: 500 });
  }
}
