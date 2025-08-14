import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ProblemSuggestion from '@/models/ProblemSuggestion';
import { getServerSession } from 'next-auth/next';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') || 'pending';

    const skip = (page - 1) * limit;
    
    const suggestions = await ProblemSuggestion.find({ status })
      .populate('suggestedBy', 'name username')
      .sort({ totalVotes: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await ProblemSuggestion.countDocuments({ status });

    return NextResponse.json({
      success: true,
      data: {
        suggestions,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch suggestions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description, difficulty, category, timeLimit, tags } = body;

    // Validate required fields
    if (!title || !description || !difficulty || !category || !timeLimit || !tags) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const suggestion = new ProblemSuggestion({
      title,
      description,
      difficulty,
      category,
      timeLimit,
      tags,
      suggestedBy: session.user.id,
      totalVotes: 0,
      status: 'pending'
    });

    await suggestion.save();

    return NextResponse.json({
      success: true,
      data: suggestion
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating suggestion:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create suggestion' },
      { status: 500 }
    );
  }
}
