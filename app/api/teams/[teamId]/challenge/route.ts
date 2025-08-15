import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Team } from '@/models/Team';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

// POST /api/teams/[teamId]/challenge - Send a challenge to another team
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ teamId: string }> }
) {
  try {
    const { teamId } = await context.params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const { 
      challengedTeamId, 
      battleMode, 
      problems, 
      scheduledAt, 
      message 
    } = await request.json();

    // Verify the challenging team exists and user is a member
    const challengingTeam = await Team.findById(teamId);
    if (!challengingTeam) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      );
    }

    // Check if user is a member of the challenging team
    const isMember = challengingTeam.members.some(
      (member: any) => member.user.toString() === session.user.id
    );
    if (!isMember) {
      return NextResponse.json(
        { error: 'You are not a member of this team' },
        { status: 403 }
      );
    }

    // Verify the challenged team exists
    const challengedTeam = await Team.findById(challengedTeamId);
    if (!challengedTeam) {
      return NextResponse.json(
        { error: 'Challenged team not found' },
        { status: 404 }
      );
    }

    // Create challenge object
    const challenge = {
      challengeId: uuidv4(),
      fromTeam: challengingTeam._id,
      toTeam: challengedTeam._id,
      battleMode,
      problems,
      scheduledAt: new Date(scheduledAt),
      status: 'pending' as const,
      createdAt: new Date(),
      message
    };

    // Add challenge to both teams
    challengingTeam.challenges.sent.push(challenge);
    challengedTeam.challenges.received.push(challenge);

    await challengingTeam.save();
    await challengedTeam.save();

    // Populate team data for response
    const populatedChallenge = {
      ...challenge,
      fromTeam: {
        _id: challengingTeam._id,
        name: challengingTeam.name
      },
      toTeam: {
        _id: challengedTeam._id,
        name: challengedTeam.name
      }
    };

    return NextResponse.json(populatedChallenge, { status: 201 });

  } catch (error) {
    console.error('Error creating team challenge:', error);
    return NextResponse.json(
      { error: 'Failed to create challenge' },
      { status: 500 }
    );
  }
}

// GET /api/teams/[teamId]/challenge - Get team challenges
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ teamId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const { teamId } = await context.params;

    const team = await Team.findById(teamId)
      .populate('challenges.sent.fromTeam', 'name')
      .populate('challenges.sent.toTeam', 'name')
      .populate('challenges.received.fromTeam', 'name')
      .populate('challenges.received.toTeam', 'name');

    if (!team) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      );
    }

    // Check if user is a member of the team
    const isMember = team.members.some(
      (member: any) => member.user.toString() === session.user.id
    );
    if (!isMember) {
      return NextResponse.json(
        { error: 'You are not a member of this team' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      sent: team.challenges.sent,
      received: team.challenges.received
    });

  } catch (error) {
    console.error('Error fetching team challenges:', error);
    return NextResponse.json(
      { error: 'Failed to fetch challenges' },
      { status: 500 }
    );
  }
}
