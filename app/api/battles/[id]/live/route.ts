import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Battle, User } from '@/models/DatabaseSchemas';

// Live Battle Streaming API
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    
    const { id: battleId } = await params;
    const { action, userId, streamData } = await request.json();

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

    switch (action) {
      case 'start_streaming':
        // Enable streaming for the battle
        battle.streamingEnabled = true;
        battle.isLive = true;
        
        if (streamData?.youtubeStreamKey) {
          battle.youtubeStreamKey = streamData.youtubeStreamKey;
        }
        
        await battle.save();
        
        return NextResponse.json({
          success: true,
          message: 'Streaming started successfully',
          streamInfo: {
            isLive: true,
            roomId: battle.roomId,
            streamUrl: `${process.env.NEXT_PUBLIC_API_URL}/stream/${battle.roomId}`,
            youtubeEnabled: !!battle.youtubeStreamKey
          }
        });

      case 'stop_streaming':
        battle.streamingEnabled = false;
        battle.youtubeStreamKey = undefined;
        await battle.save();
        
        return NextResponse.json({
          success: true,
          message: 'Streaming stopped successfully'
        });

      case 'update_camera':
        // Update user's camera preferences
        await User.findByIdAndUpdate(userId, {
          'preferences.cameraEnabled': streamData.cameraEnabled
        });
        
        return NextResponse.json({
          success: true,
          message: 'Camera settings updated'
        });

      case 'update_voice':
        // Update user's voice preferences
        await User.findByIdAndUpdate(userId, {
          'preferences.voiceEnabled': streamData.voiceEnabled
        });
        
        return NextResponse.json({
          success: true,
          message: 'Voice settings updated'
        });

      case 'abort_battle':
        // Check if user is a participant
        const isParticipant = battle.participants.some((p: any) => p.user.toString() === userId);
        if (!isParticipant) {
          return NextResponse.json(
            { success: false, error: 'Only participants can abort the battle' },
            { status: 403 }
          );
        }

        battle.status = 'cancelled';
        battle.isLive = false;
        battle.streamingEnabled = false;
        
        // Clear participants' current battle
        const participantIds = battle.participants.map((p: any) => p.user);
        await User.updateMany(
          { _id: { $in: participantIds } },
          { currentBattle: null }
        );
        
        await battle.save();
        
        return NextResponse.json({
          success: true,
          message: 'Battle aborted successfully'
        });

      case 'get_stream_info':
        return NextResponse.json({
          success: true,
          streamInfo: {
            isLive: battle.isLive,
            streamingEnabled: battle.streamingEnabled,
            roomId: battle.roomId,
            youtubeEnabled: !!battle.youtubeStreamKey,
            participantCount: battle.participants.length,
            spectatorCount: battle.spectators.length,
            settings: battle.settings
          }
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Live Battle API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
