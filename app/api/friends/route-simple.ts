import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    // Mock responses for all friend-related GET requests
    switch (action) {
      case 'friends':
        return NextResponse.json({
          success: true,
          friends: []
        });

      case 'requests':
        return NextResponse.json({
          success: true,
          requests: {
            incoming: [],
            outgoing: []
          }
        });

      case 'suggestions':
        return NextResponse.json({
          success: true,
          suggestions: []
        });

      case 'search':
        return NextResponse.json({
          success: true,
          users: []
        });

      case 'online':
        return NextResponse.json({
          success: true,
          onlineFriends: []
        });

      case 'blocked':
        return NextResponse.json({
          success: true,
          blockedUsers: []
        });

      default:
        return NextResponse.json({
          success: true,
          friends: []
        });
    }
  } catch (error) {
    console.error('Friends GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action } = await request.json();

    // Mock responses for all friend actions
    switch (action) {
      case 'send_request':
      case 'accept_request':
      case 'decline_request':
      case 'remove_friend':
      case 'block_user':
      case 'unblock_user':
      case 'set_nickname':
      case 'toggle_favorite':
      case 'update_interaction':
        return NextResponse.json({
          success: true,
          message: `${action} completed successfully`
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Friends POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
