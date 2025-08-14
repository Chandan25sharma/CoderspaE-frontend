import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Problem } from '@/models/DatabaseSchemas';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    const battleMode = searchParams.get('battleMode');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Build query
    const query: any = { isActive: true, isApproved: true };
    
    if (category && category !== 'all') {
      query.categories = { $in: [category] };
    }
    
    if (difficulty && difficulty !== 'all') {
      query.difficulty = difficulty;
    }
    
    if (battleMode && battleMode !== 'all') {
      query.battleModes = { $in: [battleMode] };
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Get total count
    const total = await Problem.countDocuments(query);
    
    // Get problems with pagination
    const problems = await Problem.find(query)
      .populate('createdBy', 'username displayName')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Get statistics
    const stats = {
      totalProblems: total,
      easyProblems: await Problem.countDocuments({ ...query, difficulty: 'Easy' }),
      mediumProblems: await Problem.countDocuments({ ...query, difficulty: 'Medium' }),
      hardProblems: await Problem.countDocuments({ ...query, difficulty: 'Hard' }),
      categories: await Problem.distinct('categories', query),
      battleModes: await Problem.distinct('battleModes', query)
    };

    return NextResponse.json({
      success: true,
      problems,
      stats,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
        totalProblems: total
      }
    });
  } catch (error) {
    console.error('Problems API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch problems' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const data = await request.json();
    
    // Create new problem
    const problem = new Problem({
      ...data,
      isActive: true,
      isApproved: false, // Requires admin approval
      solvedBy: 0,
      upvotes: 0,
      downvotes: 0,
      rating: 0
    });
    
    await problem.save();
    
    return NextResponse.json({
      success: true,
      problem,
      message: 'Problem created successfully and sent for approval'
    });
  } catch (error) {
    console.error('Create Problem Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create problem' },
      { status: 500 }
    );
  }
}
