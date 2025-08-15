import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Mock online users data for now
// In production, this would come from Socket.IO or Redis
const mockOnlineUsers = [
  { id: '1', username: 'AlexCodeMaster', avatar: '/avatars/alex.png', status: 'online', lastSeen: new Date() },
  { id: '2', username: 'SarahDevPro', avatar: '/avatars/sarah.png', status: 'online', lastSeen: new Date() },
  { id: '3', username: 'MikeJavaKing', avatar: '/avatars/mike.png', status: 'away', lastSeen: new Date(Date.now() - 5 * 60 * 1000) },
  { id: '4', username: 'EmilyReactQueen', avatar: '/avatars/emily.png', status: 'online', lastSeen: new Date() },
  { id: '5', username: 'DavidPythonGuru', avatar: '/avatars/david.png', status: 'busy', lastSeen: new Date() }
];

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Filter out the current user from online users
    const onlineUsers = mockOnlineUsers.filter(user => user.username !== session.user?.name);

    return NextResponse.json({
      success: true,
      users: onlineUsers,
      total: onlineUsers.length
    });

  } catch (error) {
    console.error('Error fetching online users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch online users' }, 
      { status: 500 }
    );
  }
}
