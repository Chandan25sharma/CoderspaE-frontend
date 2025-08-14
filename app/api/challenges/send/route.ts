import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { targetUser, problemId, message } = await request.json();

    if (!targetUser || !problemId) {
      return NextResponse.json(
        { error: 'Target user and problem ID are required' },
        { status: 400 }
      );
    }

    // TODO: In a real implementation, you would:
    // 1. Validate the target user exists
    // 2. Save the challenge to the database
    // 3. Send a notification to the target user
    // 4. Possibly send an email/push notification

    // For now, we'll just simulate success
    console.log('Challenge sent:', {
      from: session.user.email,
      to: targetUser,
      problemId,
      message
    });

    return NextResponse.json({
      success: true,
      message: 'Challenge sent successfully'
    });
  } catch (error) {
    console.error('Send challenge error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
