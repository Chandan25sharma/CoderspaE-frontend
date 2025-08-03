import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Battle from '@/models/Battle';
import User from '@/models/User';

// We'll create a separate Socket.IO server that runs independently
// This is a placeholder API route that clients can use to get server info
export async function GET() {
  return Response.json({ 
    message: 'Socket.IO server should be running on port 4000',
    endpoint: 'http://localhost:4000'
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Handle any Socket.IO related HTTP requests here
    // For example, getting battle status, user stats, etc.
    
    switch (body.action) {
      case 'get_battle_status':
        await connectDB();
        const battle = await Battle.findById(body.battleId);
        return Response.json({ battle });
        
      case 'get_user_stats':
        await connectDB();
        const user = await User.findById(body.userId);
        return Response.json({ 
          stats: {
            battlesWon: user?.battlesWon || 0,
            battlesLost: user?.battlesLost || 0,
            totalBattles: user?.totalBattles || 0,
            rating: user?.rating || 1000,
          }
        });
        
      default:
        return Response.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Socket API error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
