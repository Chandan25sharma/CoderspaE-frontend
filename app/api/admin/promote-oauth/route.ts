import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    // Check if the current user is authenticated
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { targetEmail, adminSecret } = await request.json();

    // Admin secret check - this should be a secure way to promote OAuth users
    // In production, this should be a strong secret key
    const ADMIN_SECRET = process.env.ADMIN_SECRET || 'your-super-secure-admin-secret-key';
    
    if (adminSecret !== ADMIN_SECRET) {
      return NextResponse.json(
        { error: 'Invalid admin secret' },
        { status: 403 }
      );
    }

    await connectToDatabase();

    // Find the target user to promote
    const targetUser = await User.findOne({ email: targetEmail });
    if (!targetUser) {
      return NextResponse.json(
        { error: 'Target user not found' },
        { status: 404 }
      );
    }

    // Check if user is already an admin
    if (targetUser.role === 'admin') {
      return NextResponse.json(
        { message: 'User is already an admin' },
        { status: 200 }
      );
    }

    // Promote user to admin
    targetUser.role = 'admin';
    await targetUser.save();

    // Log the admin promotion
    console.log(`User ${targetEmail} promoted to admin by ${session.user.email}`);

    return NextResponse.json({
      message: `User ${targetEmail} has been granted admin privileges`,
      user: {
        id: targetUser._id,
        email: targetUser.email,
        name: targetUser.name,
        role: targetUser.role
      }
    });

  } catch (error) {
    console.error('OAuth Admin promotion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
