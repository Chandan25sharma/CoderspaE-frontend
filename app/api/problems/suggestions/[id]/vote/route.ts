import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ProblemSuggestion from '@/models/ProblemSuggestion';
import Problem from '@/models/Problem';
import { getServerSession } from 'next-auth/next';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id: suggestionId } = await params;

    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action } = body; // 'vote' or 'unvote'

    const suggestion = await ProblemSuggestion.findById(suggestionId);
    if (!suggestion) {
      return NextResponse.json(
        { success: false, error: 'Suggestion not found' },
        { status: 404 }
      );
    }

    const userId = session.user.id;
    const existingVoteIndex = suggestion.votes.findIndex(
      (vote: { user: { toString(): string } }) => vote.user.toString() === userId
    );

    if (action === 'vote') {
      if (existingVoteIndex === -1) {
        // Add new vote
        suggestion.votes.push({
          user: userId,
          vote: 'up',
          votedAt: new Date()
        });
        suggestion.totalVotes += 1;
      }
    } else if (action === 'unvote') {
      if (existingVoteIndex !== -1) {
        // Remove vote
        suggestion.votes.splice(existingVoteIndex, 1);
        suggestion.totalVotes -= 1;
      }
    }

    await suggestion.save();

    // Check if suggestion reaches 50+ votes for auto-approval
    if (suggestion.totalVotes >= 50 && suggestion.status === 'pending') {
      // Auto-approve and create as problem
      const problem = new Problem({
        title: suggestion.title,
        description: suggestion.description,
        difficulty: suggestion.difficulty,
        category: suggestion.category,
        timeLimit: suggestion.timeLimit,
        tags: suggestion.tags,
        rating: 0,
        solvedBy: 0,
        isActive: true,
        isApproved: true,
        suggestedBy: suggestion.suggestedBy
      });

      await problem.save();

      // Update suggestion status
      suggestion.status = 'approved';
      suggestion.approvedAsProblem = problem._id;
      await suggestion.save();
    }

    return NextResponse.json({
      success: true,
      data: {
        totalVotes: suggestion.totalVotes,
        hasVoted: action === 'vote',
        autoApproved: suggestion.status === 'approved'
      }
    });

  } catch (error) {
    console.error('Error voting on suggestion:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process vote' },
      { status: 500 }
    );
  }
}
