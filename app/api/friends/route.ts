import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import clientPromise from '@/lib/mongodb-client';
import { ObjectId, Db } from 'mongodb';
import { User, Friend, FriendRequest, UserStats } from '@/types/database';

interface UserWithSession {
  _id: ObjectId;
  username: string;
  email: string;
  avatar?: string;
  lastSeen?: Date;
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    const client = await clientPromise;
    const db = client.db('coderspae');

    const user = await db.collection<User>('users').findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    switch (action) {
      case 'friends':
        return await getFriends(db, user._id);
      
      case 'requests':
        return await getFriendRequests(db, user._id);
      
      case 'suggestions':
        return await getFriendSuggestions(db, user._id);
      
      case 'search':
        const query = searchParams.get('query');
        return await searchUsers(db, user._id, query || '');
      
      case 'online':
        return await getOnlineFriends(db, user._id);
      
      case 'blocked':
        return await getBlockedUsers(db, user._id);
      
      default:
        return await getFriends(db, user._id);
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

    const { action, targetUserId, message, nickname } = await request.json();

    const client = await clientPromise;
    const db = client.db('coderspae');

    const user = await db.collection<User>('users').findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    switch (action) {
      case 'send_request':
        return await sendFriendRequest(db, user._id, new ObjectId(targetUserId), message);
      
      case 'accept_request':
        return await acceptFriendRequest(db, user._id, new ObjectId(targetUserId));
      
      case 'decline_request':
        return await declineFriendRequest(db, user._id, new ObjectId(targetUserId));
      
      case 'remove_friend':
        return await removeFriend(db, user._id, new ObjectId(targetUserId));
      
      case 'block_user':
        return await blockUser(db, user._id, new ObjectId(targetUserId));
      
      case 'unblock_user':
        return await unblockUser(db, user._id, new ObjectId(targetUserId));
      
      case 'set_nickname':
        return await setFriendNickname(db, user._id, new ObjectId(targetUserId), nickname);
      
      case 'toggle_favorite':
        return await toggleFriendFavorite(db, user._id, new ObjectId(targetUserId));
      
      case 'update_interaction':
        return await updateLastInteraction(db, user._id, new ObjectId(targetUserId));
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Friends POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function getFriends(db: Db, userId: ObjectId) {
  const friends = await db.collection<Friend>('friends')
    .aggregate([
      {
        $match: { 
          userId, 
          isBlocked: false 
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'friendId',
          foreignField: '_id',
          as: 'friendData'
        }
      },
      {
        $lookup: {
          from: 'user_stats',
          localField: 'friendId',
          foreignField: 'userId',
          as: 'stats'
        }
      },
      {
        $lookup: {
          from: 'user_sessions',
          localField: 'friendId',
          foreignField: 'userId',
          as: 'session'
        }
      },
      {
        $project: {
          _id: 1,
          friendId: 1,
          nickname: 1,
          isFavorite: 1,
          friendshipDate: 1,
          lastInteraction: 1,
          friend: {
            $mergeObjects: [
              { $arrayElemAt: ['$friendData', 0] },
              { stats: { $arrayElemAt: ['$stats', 0] } },
              { 
                isOnline: {
                  $cond: {
                    if: { $gt: [{ $size: '$session' }, 0] },
                    then: {
                      $gt: [
                        { $arrayElemAt: ['$session.lastActivity', 0] },
                        { $subtract: [new Date(), 5 * 60 * 1000] } // 5 minutes
                      ]
                    },
                    else: false
                  }
                }
              }
            ]
          }
        }
      },
      { $sort: { isFavorite: -1, 'friend.isOnline': -1, lastInteraction: -1 } }
    ])
    .toArray();

  return NextResponse.json({
    success: true,
    friends: friends.map((f: any) => ({
      id: f.friendId,
      username: f.friend.username,
      email: f.friend.email,
      avatar: f.friend.avatar,
      nickname: f.nickname,
      isFavorite: f.isFavorite,
      friendshipDate: f.friendshipDate,
      lastInteraction: f.lastInteraction,
      isOnline: f.friend.isOnline,
      lastSeen: f.friend.lastSeen,
      stats: f.friend.stats || { level: 1, xp: 0, battlesWon: 0, rating: 1000 }
    }))
  });
}

async function getFriendRequests(db: MongoClient['db'], userId: ObjectId) {
  // Get pending requests sent to user
  const incomingRequests = await db.collection<FriendRequest>('friend_requests')
    .aggregate([
      {
        $match: { 
          receiverId: userId, 
          status: 'pending' 
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'senderId',
          foreignField: '_id',
          as: 'sender'
        }
      },
      {
        $lookup: {
          from: 'user_stats',
          localField: 'senderId',
          foreignField: 'userId',
          as: 'stats'
        }
      },
      {
        $project: {
          _id: 1,
          senderId: 1,
          message: 1,
          sentAt: 1,
          sender: {
            $mergeObjects: [
              { $arrayElemAt: ['$sender', 0] },
              { stats: { $arrayElemAt: ['$stats', 0] } }
            ]
          }
        }
      },
      { $sort: { sentAt: -1 } }
    ])
    .toArray();

  // Get pending requests sent by user
  const outgoingRequests = await db.collection<FriendRequest>('friend_requests')
    .aggregate([
      {
        $match: { 
          senderId: userId, 
          status: 'pending' 
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'receiverId',
          foreignField: '_id',
          as: 'receiver'
        }
      },
      {
        $project: {
          _id: 1,
          receiverId: 1,
          message: 1,
          sentAt: 1,
          receiver: { $arrayElemAt: ['$receiver', 0] }
        }
      },
      { $sort: { sentAt: -1 } }
    ])
    .toArray();

  return NextResponse.json({
    success: true,
    incoming: incomingRequests.map(req => ({
      id: req._id,
      from: {
        id: req.senderId,
        username: req.sender.username,
        email: req.sender.email,
        avatar: req.sender.avatar,
        stats: req.sender.stats || { level: 1, xp: 0, battlesWon: 0, rating: 1000 }
      },
      message: req.message,
      sentAt: req.sentAt
    })),
    outgoing: outgoingRequests.map(req => ({
      id: req._id,
      to: {
        id: req.receiverId,
        username: req.receiver.username,
        email: req.receiver.email,
        avatar: req.receiver.avatar
      },
      message: req.message,
      sentAt: req.sentAt
    }))
  });
}

async function getFriendSuggestions(db: MongoClient['db'], userId: ObjectId) {
  // Get friends' friends who aren't already friends
  const suggestions = await db.collection('friends')
    .aggregate([
      { $match: { userId, isBlocked: false } },
      {
        $lookup: {
          from: 'friends',
          localField: 'friendId',
          foreignField: 'userId',
          as: 'friendsFriends'
        }
      },
      { $unwind: '$friendsFriends' },
      {
        $match: {
          'friendsFriends.friendId': { $ne: userId },
          'friendsFriends.isBlocked': false
        }
      },
      {
        $group: {
          _id: '$friendsFriends.friendId',
          mutualFriends: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $lookup: {
          from: 'user_stats',
          localField: '_id',
          foreignField: 'userId',
          as: 'stats'
        }
      },
      {
        $project: {
          _id: 1,
          mutualFriends: 1,
          user: { $arrayElemAt: ['$user', 0] },
          stats: { $arrayElemAt: ['$stats', 0] }
        }
      },
      { $sort: { mutualFriends: -1 } },
      { $limit: 10 }
    ])
    .toArray();

  // Filter out existing friends and pending requests
  const existingFriends = await db.collection('friends')
    .find({ userId }, { projection: { friendId: 1 } })
    .toArray();
  
  const pendingRequests = await db.collection('friend_requests')
    .find({ 
      $or: [
        { senderId: userId, status: 'pending' },
        { receiverId: userId, status: 'pending' }
      ]
    }, { projection: { senderId: 1, receiverId: 1 } })
    .toArray();

  const excludeIds = new Set([
    ...existingFriends.map(f => f.friendId.toString()),
    ...pendingRequests.map(r => r.senderId.toString()),
    ...pendingRequests.map(r => r.receiverId.toString()),
    userId.toString()
  ]);

  const filteredSuggestions = suggestions.filter(s => !excludeIds.has(s._id.toString()));

  return NextResponse.json({
    success: true,
    suggestions: filteredSuggestions.map(s => ({
      id: s._id,
      username: s.user.username,
      email: s.user.email,
      avatar: s.user.avatar,
      mutualFriends: s.mutualFriends,
      stats: s.stats || { level: 1, xp: 0, battlesWon: 0, rating: 1000 }
    }))
  });
}

async function searchUsers(db: MongoClient['db'], userId: ObjectId, query: string) {
  if (!query || query.length < 2) {
    return NextResponse.json({ success: true, users: [] });
  }

  const users = await db.collection('users')
    .aggregate([
      {
        $match: {
          _id: { $ne: userId },
          $or: [
            { username: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } }
          ]
        }
      },
      {
        $lookup: {
          from: 'user_stats',
          localField: '_id',
          foreignField: 'userId',
          as: 'stats'
        }
      },
      {
        $lookup: {
          from: 'friends',
          let: { searchUserId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$userId', userId] },
                    { $eq: ['$friendId', '$$searchUserId'] }
                  ]
                }
              }
            }
          ],
          as: 'friendship'
        }
      },
      {
        $lookup: {
          from: 'friend_requests',
          let: { searchUserId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$status', 'pending'] },
                    {
                      $or: [
                        {
                          $and: [
                            { $eq: ['$senderId', userId] },
                            { $eq: ['$receiverId', '$$searchUserId'] }
                          ]
                        },
                        {
                          $and: [
                            { $eq: ['$senderId', '$$searchUserId'] },
                            { $eq: ['$receiverId', userId] }
                          ]
                        }
                      ]
                    }
                  ]
                }
              }
            }
          ],
          as: 'pendingRequest'
        }
      },
      {
        $project: {
          _id: 1,
          username: 1,
          email: 1,
          avatar: 1,
          stats: { $arrayElemAt: ['$stats', 0] },
          isFriend: { $gt: [{ $size: '$friendship' }, 0] },
          hasPendingRequest: { $gt: [{ $size: '$pendingRequest' }, 0] }
        }
      },
      { $limit: 20 }
    ])
    .toArray();

  return NextResponse.json({
    success: true,
    users: users.map(u => ({
      id: u._id,
      username: u.username,
      email: u.email,
      avatar: u.avatar,
      stats: u.stats || { level: 1, xp: 0, battlesWon: 0, rating: 1000 },
      isFriend: u.isFriend,
      hasPendingRequest: u.hasPendingRequest
    }))
  });
}

async function getOnlineFriends(db: MongoClient['db'], userId: ObjectId) {
  const onlineFriends = await db.collection('friends')
    .aggregate([
      { $match: { userId, isBlocked: false } },
      {
        $lookup: {
          from: 'user_sessions',
          localField: 'friendId',
          foreignField: 'userId',
          as: 'session'
        }
      },
      {
        $match: {
          'session.lastActivity': {
            $gt: new Date(Date.now() - 5 * 60 * 1000) // 5 minutes
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'friendId',
          foreignField: '_id',
          as: 'friend'
        }
      },
      {
        $project: {
          friendId: 1,
          nickname: 1,
          friend: { $arrayElemAt: ['$friend', 0] },
          lastActivity: { $arrayElemAt: ['$session.lastActivity', 0] },
          currentActivity: { $arrayElemAt: ['$session.currentActivity', 0] }
        }
      },
      { $sort: { lastActivity: -1 } }
    ])
    .toArray();

  return NextResponse.json({
    success: true,
    onlineFriends: onlineFriends.map(f => ({
      id: f.friendId,
      username: f.friend.username,
      avatar: f.friend.avatar,
      nickname: f.nickname,
      lastActivity: f.lastActivity,
      currentActivity: f.currentActivity || 'idle'
    }))
  });
}

async function getBlockedUsers(db: MongoClient['db'], userId: ObjectId) {
  const blockedUsers = await db.collection('friends')
    .aggregate([
      { $match: { userId, isBlocked: true } },
      {
        $lookup: {
          from: 'users',
          localField: 'friendId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $project: {
          friendId: 1,
          user: { $arrayElemAt: ['$user', 0] }
        }
      }
    ])
    .toArray();

  return NextResponse.json({
    success: true,
    blockedUsers: blockedUsers.map(b => ({
      id: b.friendId,
      username: b.user.username,
      email: b.user.email,
      avatar: b.user.avatar
    }))
  });
}

async function sendFriendRequest(db: MongoClient['db'], senderId: ObjectId, receiverId: ObjectId, message?: string) {
  // Check if they're already friends
  const existingFriendship = await db.collection('friends').findOne({
    $or: [
      { userId: senderId, friendId: receiverId },
      { userId: receiverId, friendId: senderId }
    ]
  });

  if (existingFriendship) {
    return NextResponse.json({ error: 'Already friends' }, { status: 400 });
  }

  // Check for existing pending request
  const existingRequest = await db.collection('friend_requests').findOne({
    $or: [
      { senderId, receiverId, status: 'pending' },
      { senderId: receiverId, receiverId: senderId, status: 'pending' }
    ]
  });

  if (existingRequest) {
    return NextResponse.json({ error: 'Friend request already exists' }, { status: 400 });
  }

  // Create friend request
  const result = await db.collection('friend_requests').insertOne({
    senderId,
    receiverId,
    status: 'pending',
    message: message || '',
    sentAt: new Date()
  });

  // Log activity
  await db.collection('user_activities').insertOne({
    userId: senderId,
    type: 'friend_request_sent',
    title: 'Friend request sent',
    description: `Sent friend request to user ${receiverId}`,
    timestamp: new Date()
  });

  return NextResponse.json({
    success: true,
    requestId: result.insertedId,
    message: 'Friend request sent successfully!'
  });
}

async function acceptFriendRequest(db: MongoClient['db'], userId: ObjectId, senderId: ObjectId) {
  // Find and update request
  const request = await db.collection('friend_requests').findOneAndUpdate(
    { senderId, receiverId: userId, status: 'pending' },
    { 
      $set: { 
        status: 'accepted', 
        respondedAt: new Date() 
      } 
    },
    { returnDocument: 'after' }
  );

  if (!request) {
    return NextResponse.json({ error: 'Friend request not found' }, { status: 404 });
  }

  // Create friendship entries for both users
  const friendshipDate = new Date();
  
  await db.collection('friends').insertMany([
    {
      userId,
      friendId: senderId,
      friendshipDate,
      isFavorite: false,
      isBlocked: false
    },
    {
      userId: senderId,
      friendId: userId,
      friendshipDate,
      isFavorite: false,
      isBlocked: false
    }
  ]);

  // Log activities
  await db.collection('user_activities').insertMany([
    {
      userId,
      type: 'friend_request_accepted',
      title: 'Friend request accepted',
      description: `Accepted friend request from user ${senderId}`,
      timestamp: new Date()
    },
    {
      userId: senderId,
      type: 'friend_added',
      title: 'New friend added',
      description: `User ${userId} accepted your friend request`,
      timestamp: new Date()
    }
  ]);

  return NextResponse.json({
    success: true,
    message: 'Friend request accepted!'
  });
}

async function declineFriendRequest(db: MongoClient['db'], userId: ObjectId, senderId: ObjectId) {
  const result = await db.collection('friend_requests').updateOne(
    { senderId, receiverId: userId, status: 'pending' },
    { 
      $set: { 
        status: 'declined', 
        respondedAt: new Date() 
      } 
    }
  );

  if (result.matchedCount === 0) {
    return NextResponse.json({ error: 'Friend request not found' }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    message: 'Friend request declined'
  });
}

async function removeFriend(db: MongoClient['db'], userId: ObjectId, friendId: ObjectId) {
  // Remove friendship from both sides
  await db.collection('friends').deleteMany({
    $or: [
      { userId, friendId },
      { userId: friendId, friendId: userId }
    ]
  });

  // Log activity
  await db.collection('user_activities').insertOne({
    userId,
    type: 'friend_removed',
    title: 'Friend removed',
    description: `Removed user ${friendId} from friends`,
    timestamp: new Date()
  });

  return NextResponse.json({
    success: true,
    message: 'Friend removed successfully'
  });
}

async function blockUser(db: MongoClient['db'], userId: ObjectId, targetUserId: ObjectId) {
  // Update or create friend entry with blocked status
  await db.collection('friends').updateOne(
    { userId, friendId: targetUserId },
    { 
      $set: { 
        isBlocked: true,
        blockedAt: new Date()
      } 
    },
    { upsert: true }
  );

  // Remove any pending friend requests
  await db.collection('friend_requests').deleteMany({
    $or: [
      { senderId: userId, receiverId: targetUserId },
      { senderId: targetUserId, receiverId: userId }
    ]
  });

  return NextResponse.json({
    success: true,
    message: 'User blocked successfully'
  });
}

async function unblockUser(db: MongoClient['db'], userId: ObjectId, targetUserId: ObjectId) {
  await db.collection('friends').updateOne(
    { userId, friendId: targetUserId },
    { 
      $set: { isBlocked: false },
      $unset: { blockedAt: 1 }
    }
  );

  return NextResponse.json({
    success: true,
    message: 'User unblocked successfully'
  });
}

async function setFriendNickname(db: MongoClient['db'], userId: ObjectId, friendId: ObjectId, nickname: string) {
  const result = await db.collection('friends').updateOne(
    { userId, friendId },
    { $set: { nickname: nickname || '' } }
  );

  if (result.matchedCount === 0) {
    return NextResponse.json({ error: 'Friendship not found' }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    message: 'Nickname updated successfully'
  });
}

async function toggleFriendFavorite(db: MongoClient['db'], userId: ObjectId, friendId: ObjectId) {
  const friend = await db.collection('friends').findOne({ userId, friendId });
  
  if (!friend) {
    return NextResponse.json({ error: 'Friendship not found' }, { status: 404 });
  }

  const newFavoriteStatus = !friend.isFavorite;
  
  await db.collection('friends').updateOne(
    { userId, friendId },
    { $set: { isFavorite: newFavoriteStatus } }
  );

  return NextResponse.json({
    success: true,
    isFavorite: newFavoriteStatus,
    message: `Friend ${newFavoriteStatus ? 'added to' : 'removed from'} favorites`
  });
}

async function updateLastInteraction(db: MongoClient['db'], userId: ObjectId, friendId: ObjectId) {
  await db.collection('friends').updateMany(
    {
      $or: [
        { userId, friendId },
        { userId: friendId, friendId: userId }
      ]
    },
    { $set: { lastInteraction: new Date() } }
  );

  return NextResponse.json({
    success: true,
    message: 'Interaction updated'
  });
}
