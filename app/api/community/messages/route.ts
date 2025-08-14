import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import mongoose from 'mongoose';

interface UserDoc {
  _id: mongoose.Types.ObjectId;
  username: string;
  image?: string;
  avatar?: string;
}

interface MessageDoc {
  _id: mongoose.Types.ObjectId;
  userId: string;
  message: string;
  timestamp: Date;
  edited?: boolean;
  replies?: Array<{
    id: string;
    userId: string;
    message: string;
    timestamp: Date;
  }>;
}

// Chat Message Schema
const ChatMessageSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  message: { type: String, required: true },
  channel: { type: String, default: 'general' },
  timestamp: { type: Date, default: Date.now },
  edited: { type: Boolean, default: false },
  replies: [{
    id: String,
    userId: String,
    message: String,
    timestamp: Date
  }]
});

// User Schema
const UserSchema = new mongoose.Schema({
  email: String,
  username: String,
  image: String,
  avatar: String
});

const ChatMessage = mongoose.models.ChatMessage || mongoose.model('ChatMessage', ChatMessageSchema, 'chat_messages');
const User = mongoose.models.User || mongoose.model('User', UserSchema, 'users');

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const channel = searchParams.get('channel') || 'general';
    const limit = parseInt(searchParams.get('limit') || '50');

    await connectDB();
    
    // Get messages from the specified channel
    const messages = await ChatMessage.find({ channel })
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();

    // Reverse to show oldest first
    messages.reverse();

    // Get user details for each message
    const userIds = [...new Set(messages.map(m => m.userId))];
    const users = await User.find({ _id: { $in: userIds } }).lean();

    const userMap = (users as UserDoc[]).reduce((acc: Record<string, { username: string; avatar: string }>, user: UserDoc) => {
      acc[user._id.toString()] = {
        username: user.username,
        avatar: user.image || user.avatar || '/default-avatar.png'
      };
      return acc;
    }, {});

    // Enrich messages with user data
    const enrichedMessages = (messages as MessageDoc[]).map(message => ({
      id: message._id.toString(),
      userId: message.userId,
      username: userMap[message.userId]?.username || 'Unknown User',
      avatar: userMap[message.userId]?.avatar || '/default-avatar.png',
      message: message.message,
      timestamp: message.timestamp,
      edited: message.edited || false,
      replies: message.replies || []
    }));

    return NextResponse.json({
      success: true,
      messages: enrichedMessages,
      channel
    });

  } catch (error) {
    console.error('Error fetching chat messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { message, channel = 'general', replyTo } = body;

    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    await connectDB();

    // Get user details
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // If this is a reply, add it to the parent message
    if (replyTo) {
      const parentMessage = await ChatMessage.findById(replyTo);
      
      if (parentMessage) {
        const reply = {
          id: new mongoose.Types.ObjectId().toString(),
          userId: user._id.toString(),
          message: message.trim(),
          timestamp: new Date()
        };

        await ChatMessage.findByIdAndUpdate(replyTo, {
          $push: { replies: reply }
        });

        return NextResponse.json({
          success: true,
          message: 'Reply sent successfully'
        });
      }
    }

    // Insert new message
    const chatMessage = new ChatMessage({
      userId: user._id.toString(),
      message: message.trim(),
      channel,
      timestamp: new Date(),
      edited: false,
      replies: []
    });

    await chatMessage.save();

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
      messageId: chatMessage._id.toString()
    });

  } catch (error) {
    console.error('Error sending chat message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
