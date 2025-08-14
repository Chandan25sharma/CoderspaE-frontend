import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Battle, User, BattleMode } from '@/models/DatabaseSchemas';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    
    const { id: battleId } = await params;
    const { userId, action } = await request.json(); // action: 'join', 'spectate', 'leave'

    const battle = await Battle.findById(battleId);
    if (!battle) {
      return NextResponse.json(
        { success: false, error: 'Battle not found' },
        { status: 404 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Get battle mode details for validation
    const battleMode = await BattleMode.findOne({ name: battle.mode });
    if (!battleMode) {
      return NextResponse.json(
        { success: false, error: 'Invalid battle mode' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'join':
        // Check if battle is joinable
        if (battle.status !== 'waiting') {
          return NextResponse.json(
            { success: false, error: 'Battle is not accepting new participants' },
            { status: 400 }
          );
        }

        // Check if user is already a participant
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const isParticipant = battle.participants.some((p: any) => p.user.toString() === userId);
        if (isParticipant) {
          return NextResponse.json(
            { success: false, error: 'User is already a participant' },
            { status: 400 }
          );
        }

        // Check max participants
        if (battle.participants.length >= battleMode.maxParticipants) {
          return NextResponse.json(
            { success: false, error: 'Battle is full' },
            { status: 400 }
          );
        }

        // Add user as participant
        battle.participants.push({
          user: userId,
          joinedAt: new Date(),
          isReady: false,
          score: 0,
          rank: 0
        });

        // Update user's current battle
        await User.findByIdAndUpdate(userId, {
          currentBattle: battle._id
        });

        // Check if we have enough participants to start
        if (battle.participants.length >= battleMode.minParticipants) {
          battle.status = 'starting';
        }

        break;

      case 'spectate':
        // Check if spectators are allowed
        if (!battle.settings.allowSpectators) {
          return NextResponse.json(
            { success: false, error: 'Spectators not allowed in this battle' },
            { status: 400 }
          );
        }

        // Check if user is already a spectator
        const isSpectator = battle.spectators.some((s: any) => s.user.toString() === userId);
        if (isSpectator) {
          return NextResponse.json(
            { success: false, error: 'User is already spectating' },
            { status: 400 }
          );
        }

        // Check max spectators
        if (battle.spectators.length >= battle.settings.maxSpectators) {
          return NextResponse.json(
            { success: false, error: 'Maximum spectators reached' },
            { status: 400 }
          );
        }

        // Add user as spectator
        battle.spectators.push({
          user: userId,
          joinedAt: new Date()
        });

        break;

      case 'leave':
        // Remove from participants
        battle.participants = battle.participants.filter((p: any) => p.user.toString() !== userId);
        
        // Remove from spectators
        battle.spectators = battle.spectators.filter((s: any) => s.user.toString() !== userId);

        // Clear user's current battle
        await User.findByIdAndUpdate(userId, {
          currentBattle: null
        });

        // If no participants left, cancel battle
        if (battle.participants.length === 0) {
          battle.status = 'cancelled';
        }

        break;

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }

    await battle.save();

    // Return updated battle
    const updatedBattle = await Battle.findById(battleId)
      .populate('participants.user', 'username displayName avatar isOnline')
      .populate('spectators.user', 'username displayName avatar')
      .populate('problem', 'title difficulty timeLimit categories');

    return NextResponse.json({
      success: true,
      battle: updatedBattle,
      message: `Successfully ${action === 'join' ? 'joined' : action === 'spectate' ? 'started spectating' : 'left'} the battle`
    });
  } catch (error) {
    console.error('Battle Join/Leave Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
