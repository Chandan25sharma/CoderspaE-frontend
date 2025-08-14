import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Challenge, User, Problem } from '@/models/DatabaseSchemas';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status') || 'pending';
    const type = searchParams.get('type'); // 'sent' or 'received'

    // Build query
    const query: any = { status };
    
    if (userId && type === 'sent') {
      query.challenger = userId;
    } else if (userId && type === 'received') {
      query.challenged = userId;
    } else if (userId) {
      query.$or = [
        { challenger: userId },
        { challenged: userId }
      ];
    }

    // Get challenges with populated data
    const challenges = await Challenge.find(query)
      .populate('challenger', 'username displayName avatar isOnline')
      .populate('challenged', 'username displayName avatar isOnline')
      .populate('problem', 'title difficulty timeLimit categories')
      .populate('battle', 'battleId status')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return NextResponse.json({
      success: true,
      challenges
    });
  } catch (error) {
    console.error('Challenges API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch challenges' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const {
      challengerId,
      challengedId,
      mode,
      problemId,
      message,
      scheduledTime,
      settings = {}
    } = await request.json();

    // Validate users exist
    const [challenger, challenged] = await Promise.all([
      User.findById(challengerId),
      User.findById(challengedId)
    ]);

    if (!challenger || !challenged) {
      return NextResponse.json(
        { success: false, error: 'Invalid user(s)' },
        { status: 400 }
      );
    }

    // Validate problem if specified
    if (problemId) {
      const problem = await Problem.findById(problemId);
      if (!problem) {
        return NextResponse.json(
          { success: false, error: 'Invalid problem' },
          { status: 400 }
        );
      }
    }

    // Create challenge
    const challenge = new Challenge({
      challenger: challengerId,
      challenged: challengedId,
      mode,
      problem: problemId,
      message: message || `Challenge to a ${mode.replace('-', ' ')} battle!`,
      scheduledTime: scheduledTime ? new Date(scheduledTime) : undefined,
      settings: {
        cameraRequired: settings.cameraRequired || false,
        voiceEnabled: settings.voiceEnabled || false,
        allowSpectators: settings.allowSpectators !== false,
        isRanked: settings.isRanked !== false
      }
    });

    await challenge.save();

    // Populate and return the challenge
    const populatedChallenge = await Challenge.findById(challenge._id)
      .populate('challenger', 'username displayName avatar')
      .populate('challenged', 'username displayName avatar')
      .populate('problem', 'title difficulty timeLimit categories');

    return NextResponse.json({
      success: true,
      challenge: populatedChallenge,
      message: 'Challenge sent successfully'
    });
  } catch (error) {
    console.error('Create Challenge Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create challenge' },
      { status: 500 }
    );
  }
}
