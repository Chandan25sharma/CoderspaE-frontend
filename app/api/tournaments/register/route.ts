import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/mongodb';
import TournamentRegistration from '@/models/TournamentRegistration';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { tournamentId, tournamentName, teamId, teamName, isTeamLeader = false, preferences = {} } = await req.json();

    if (!tournamentId || !tournamentName) {
      return NextResponse.json({ error: 'Tournament ID and name are required' }, { status: 400 });
    }

    await connectDB();

    // Get user info
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user is already registered for this tournament
    const existingRegistration = await TournamentRegistration.findOne({
      userId: user._id.toString(),
      tournamentId,
      status: { $in: ['registered', 'confirmed'] }
    });

    if (existingRegistration) {
      return NextResponse.json({ error: 'Already registered for this tournament' }, { status: 400 });
    }

    // Get client IP
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : req.headers.get('x-real-ip') || 'unknown';

    // Create registration
    const registration = await TournamentRegistration.create({
      userId: user._id.toString(),
      userEmail: user.email,
      userName: user.name,
      tournamentId,
      tournamentName,
      teamId,
      teamName,
      isTeamLeader,
      status: 'registered',
      preferences: {
        preferredLanguage: preferences.preferredLanguage || 'javascript',
        notifications: preferences.notifications !== false,
        teamInviteCode: preferences.teamInviteCode || null,
      },
      registrationSource: 'website',
      ipAddress: ip,
    });

    return NextResponse.json({
      success: true,
      registrationId: registration._id,
      message: 'Successfully registered for tournament',
    });

  } catch (error) {
    console.error('Tournament registration error:', error);
    return NextResponse.json(
      { error: 'Failed to register for tournament' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get user's tournament registrations
    const registrations = await TournamentRegistration.find({ userId: user._id.toString() })
      .sort({ registrationDate: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      registrations,
    });

  } catch (error) {
    console.error('Failed to fetch registrations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch registrations' },
      { status: 500 }
    );
  }
}
