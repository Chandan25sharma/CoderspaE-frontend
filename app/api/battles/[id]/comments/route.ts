import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Battle, User } from '@/models/DatabaseSchemas';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    
    const { id: battleId } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    const battle = await Battle.findById(battleId)
      .populate('comments.user', 'username displayName avatar') as {
        comments: Array<{
          user: { username: string; displayName: string; avatar: string };
          message: string;
          timestamp: Date;
          isSystemMessage?: boolean;
        }>;
      };

    if (!battle) {
      return NextResponse.json(
        { success: false, error: 'Battle not found' },
        { status: 404 }
      );
    }

    // Ensure battle has comments array
    if (!battle.comments || !Array.isArray(battle.comments)) {
      battle.comments = [];
    }

    // Sort comments by timestamp (newest first) and paginate
    const sortedComments = battle.comments.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    const startIndex = (page - 1) * limit;
    const paginatedComments = sortedComments.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      success: true,
      comments: paginatedComments,
      pagination: {
        current: page,
        total: Math.ceil(battle.comments.length / limit),
        hasNext: startIndex + limit < battle.comments.length,
        hasPrev: page > 1,
        totalComments: battle.comments.length
      }
    });
  } catch (error) {
    console.error('Get Comments Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    
    const { id: battleId } = await params;
    const { userId, message, isSystemMessage = false } = await request.json();

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Message cannot be empty' },
        { status: 400 }
      );
    }

    if (message.length > 500) {
      return NextResponse.json(
        { success: false, error: 'Message too long (max 500 characters)' },
        { status: 400 }
      );
    }

    const battle = await Battle.findById(battleId);
    if (!battle) {
      return NextResponse.json(
        { success: false, error: 'Battle not found' },
        { status: 404 }
      );
    }

    const user = await User.findById(userId);
    if (!user && !isSystemMessage) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Add comment to battle
    const newComment = {
      user: isSystemMessage ? null : userId,
      message: message.trim(),
      timestamp: new Date(),
      isSystemMessage
    };

    battle.comments.push(newComment);
    await battle.save();

    return NextResponse.json({
      success: true,
      comment: newComment,
      message: 'Comment added successfully'
    });
  } catch (error) {
    console.error('Add Comment Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add comment' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    
    const { id: battleId } = await params;
    const { searchParams } = new URL(request.url);
    const commentIndex = parseInt(searchParams.get('commentIndex') || '-1');
    const userId = searchParams.get('userId');

    if (commentIndex < 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid comment index' },
        { status: 400 }
      );
    }

    const battle = await Battle.findById(battleId);
    if (!battle) {
      return NextResponse.json(
        { success: false, error: 'Battle not found' },
        { status: 404 }
      );
    }

    if (commentIndex >= battle.comments.length) {
      return NextResponse.json(
        { success: false, error: 'Comment not found' },
        { status: 404 }
      );
    }

    const comment = battle.comments[commentIndex];
    
    // Check if user can delete this comment (own comment or admin)
    if (comment.user.toString() !== userId && !comment.isSystemMessage) {
      return NextResponse.json(
        { success: false, error: 'Not authorized to delete this comment' },
        { status: 403 }
      );
    }

    // Remove comment
    battle.comments.splice(commentIndex, 1);
    await battle.save();

    return NextResponse.json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    console.error('Delete Comment Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete comment' },
      { status: 500 }
    );
  }
}
