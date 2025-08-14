import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { MongoClient, ObjectId, Db } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI!);

interface Team {
  _id?: ObjectId;
  name: string;
  description: string;
  createdBy: ObjectId;
  members: TeamMember[];
  settings: {
    isPublic: boolean;
    maxMembers: number;
    allowInvites: boolean;
    skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    preferredLanguages: string[];
  };
  stats: {
    battlesPlayed: number;
    battlesWon: number;
    tournamentWins: number;
    totalXP: number;
    averageRating: number;
  };
  createdAt: Date;
  updatedAt: Date;
  avatar?: string;
  banner?: string;
  tags: string[];
  achievements: string[];
}

interface TeamMember {
  userId: ObjectId;
  role: 'leader' | 'co-leader' | 'member';
  joinedAt: Date;
  permissions: {
    canInvite: boolean;
    canKick: boolean;
    canEditTeam: boolean;
    canStartBattles: boolean;
  };
  contributions: {
    battlesParticipated: number;
    battlesWon: number;
    xpContributed: number;
  };
}

interface TeamInvite {
  _id?: ObjectId;
  teamId: ObjectId;
  invitedBy: ObjectId;
  invitedUser: ObjectId;
  message?: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  sentAt: Date;
  respondedAt?: Date;
  expiresAt: Date;
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    await client.connect();
    const db = client.db('coderspae');

    const user = await db.collection('users').findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    switch (action) {
      case 'my-teams':
        return await getMyTeams(db, user._id);
      
      case 'team-details':
        const teamId = searchParams.get('teamId');
        return await getTeamDetails(db, user._id, teamId ? new ObjectId(teamId) : null);
      
      case 'discover':
        return await discoverTeams(db, user._id);
      
      case 'invites':
        return await getTeamInvites(db, user._id);
      
      case 'search':
        const query = searchParams.get('query');
        const skillLevel = searchParams.get('skillLevel');
        const language = searchParams.get('language');
        return await searchTeams(db, user._id, query || '', skillLevel, language);
      
      case 'leaderboard':
        return await getTeamLeaderboard(db);
      
      default:
        return await getMyTeams(db, user._id);
    }
  } catch (error) {
    console.error('Teams GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      console.log('No session or email found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, ...data } = await request.json();
    console.log('Teams POST request:', { action, data, userEmail: session.user.email });

    await client.connect();
    const db = client.db('coderspae');

    const user = await db.collection('users').findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    switch (action) {
      case 'create':
        return await createTeam(db, user._id, data);
      
      case 'join':
        return await joinTeam(db, user._id, new ObjectId(data.teamId));
      
      case 'leave':
        return await leaveTeam(db, user._id, new ObjectId(data.teamId));
      
      case 'invite':
        return await inviteToTeam(db, user._id, new ObjectId(data.teamId), new ObjectId(data.userId), data.message);
      
      case 'respond-invite':
        return await respondToInvite(db, user._id, new ObjectId(data.inviteId), data.response);
      
      case 'kick-member':
        return await kickMember(db, user._id, new ObjectId(data.teamId), new ObjectId(data.memberId));
      
      case 'update-role':
        return await updateMemberRole(db, user._id, new ObjectId(data.teamId), new ObjectId(data.memberId), data.newRole);
      
      case 'update-team':
        return await updateTeam(db, user._id, new ObjectId(data.teamId), data.updates);
      
      case 'delete':
        return await deleteTeam(db, user._id, new ObjectId(data.teamId));
      
      case 'start-battle':
        return await startTeamBattle(db, user._id, new ObjectId(data.teamId), data.battleConfig);
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Teams POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await client.close();
  }
}

async function getMyTeams(db: Db, userId: ObjectId) {
  const teams = await db.collection<Team>('teams')
    .aggregate([
      {
        $match: {
          'members.userId': userId
        }
      },
      {
        $addFields: {
          myMembership: {
            $arrayElemAt: [
              {
                $filter: {
                  input: '$members',
                  cond: { $eq: ['$$this.userId', userId] }
                }
              },
              0
            ]
          },
          memberCount: { $size: '$members' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'members.userId',
          foreignField: '_id',
          as: 'memberData'
        }
      },
      {
        $sort: { 'myMembership.joinedAt': -1 }
      }
    ])
    .toArray();

  return NextResponse.json({
    success: true,
    teams: teams.map(team => ({
      id: team._id,
      name: team.name,
      description: team.description,
      avatar: team.avatar,
      memberCount: team.memberCount,
      maxMembers: team.settings.maxMembers,
      myRole: team.myMembership.role,
      joinedAt: team.myMembership.joinedAt,
      stats: team.stats,
      tags: team.tags,
      isPublic: team.settings.isPublic
    }))
  });
}

async function getTeamDetails(db: Db, userId: ObjectId, teamId: ObjectId | null) {
  if (!teamId) {
    return NextResponse.json({ error: 'Team ID required' }, { status: 400 });
  }

  const team = await db.collection<Team>('teams')
    .aggregate([
      { $match: { _id: teamId } },
      {
        $lookup: {
          from: 'users',
          let: { memberIds: '$members.userId' },
          pipeline: [
            { $match: { $expr: { $in: ['$_id', '$$memberIds'] } } },
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
                username: 1,
                email: 1,
                avatar: 1,
                stats: { $arrayElemAt: ['$stats', 0] }
              }
            }
          ],
          as: 'memberData'
        }
      },
      {
        $lookup: {
          from: 'team_battles',
          localField: '_id',
          foreignField: 'teamId',
          as: 'recentBattles',
          pipeline: [
            { $sort: { createdAt: -1 } },
            { $limit: 5 }
          ]
        }
      }
    ])
    .toArray();

  if (!team || team.length === 0) {
    return NextResponse.json({ error: 'Team not found' }, { status: 404 });
  }

  const teamData = team[0];
  
  // Check if user is a member
  const userMembership = teamData.members.find((m: TeamMember) => m.userId.equals(userId));
  
  // Build member list with user data
  const membersWithData = teamData.members.map((member: TeamMember) => {
    const userData = teamData.memberData.find((u: any) => u._id.equals(member.userId));
    return {
      id: member.userId,
      role: member.role,
      joinedAt: member.joinedAt,
      permissions: member.permissions,
      contributions: member.contributions,
      user: userData ? {
        username: userData.username,
        email: userData.email,
        avatar: userData.avatar,
        stats: userData.stats || { level: 1, xp: 0, rating: 1000 }
      } : null
    };
  });

  return NextResponse.json({
    success: true,
    team: {
      id: teamData._id,
      name: teamData.name,
      description: teamData.description,
      avatar: teamData.avatar,
      banner: teamData.banner,
      createdBy: teamData.createdBy,
      settings: teamData.settings,
      stats: teamData.stats,
      tags: teamData.tags,
      achievements: teamData.achievements,
      createdAt: teamData.createdAt,
      members: membersWithData,
      recentBattles: teamData.recentBattles,
      isMember: !!userMembership,
      myRole: userMembership?.role,
      myPermissions: userMembership?.permissions
    }
  });
}

async function discoverTeams(db: Db, userId: ObjectId) {
  // Get user's current teams to exclude them
  const userTeams = await db.collection('teams')
    .find({ 'members.userId': userId }, { projection: { _id: 1 } })
    .toArray();
  
  const excludeTeamIds = userTeams.map(t => t._id);

  // Get user's skill level for better recommendations
  const userStats = await db.collection('user_stats').findOne({ userId });
  const userLevel = userStats?.level || 1;
  
  let recommendedSkillLevel: string;
  if (userLevel < 10) recommendedSkillLevel = 'beginner';
  else if (userLevel < 25) recommendedSkillLevel = 'intermediate';
  else if (userLevel < 50) recommendedSkillLevel = 'advanced';
  else recommendedSkillLevel = 'expert';

  const teams = await db.collection<Team>('teams')
    .aggregate([
      {
        $match: {
          _id: { $nin: excludeTeamIds },
          'settings.isPublic': true,
          $expr: {
            $lt: [{ $size: '$members' }, '$settings.maxMembers']
          }
        }
      },
      {
        $addFields: {
          memberCount: { $size: '$members' },
          isRecommended: { $eq: ['$settings.skillLevel', recommendedSkillLevel] }
        }
      },
      {
        $sort: { 
          isRecommended: -1, 
          'stats.averageRating': -1, 
          memberCount: -1 
        }
      },
      { $limit: 20 }
    ])
    .toArray();

  return NextResponse.json({
    success: true,
    teams: teams.map(team => ({
      id: team._id,
      name: team.name,
      description: team.description,
      avatar: team.avatar,
      memberCount: team.memberCount,
      maxMembers: team.settings.maxMembers,
      skillLevel: team.settings.skillLevel,
      preferredLanguages: team.settings.preferredLanguages,
      stats: team.stats,
      tags: team.tags,
      isRecommended: team.isRecommended
    }))
  });
}

async function getTeamInvites(db: Db, userId: ObjectId) {
  const invites = await db.collection<TeamInvite>('team_invites')
    .aggregate([
      {
        $match: {
          invitedUser: userId,
          status: 'pending',
          expiresAt: { $gt: new Date() }
        }
      },
      {
        $lookup: {
          from: 'teams',
          localField: 'teamId',
          foreignField: '_id',
          as: 'team'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'invitedBy',
          foreignField: '_id',
          as: 'inviter'
        }
      },
      {
        $project: {
          _id: 1,
          message: 1,
          sentAt: 1,
          expiresAt: 1,
          team: { $arrayElemAt: ['$team', 0] },
          inviter: { $arrayElemAt: ['$inviter', 0] }
        }
      },
      { $sort: { sentAt: -1 } }
    ])
    .toArray();

  return NextResponse.json({
    success: true,
    invites: invites.map(invite => ({
      id: invite._id,
      message: invite.message,
      sentAt: invite.sentAt,
      expiresAt: invite.expiresAt,
      team: {
        id: invite.team._id,
        name: invite.team.name,
        description: invite.team.description,
        avatar: invite.team.avatar,
        memberCount: invite.team.members?.length || 0,
        maxMembers: invite.team.settings?.maxMembers || 0
      },
      inviter: {
        username: invite.inviter.username,
        avatar: invite.inviter.avatar
      }
    }))
  });
}

async function searchTeams(db: Db, userId: ObjectId, query: string, skillLevel?: string | null, language?: string | null) {
  const matchConditions: any = {
    'settings.isPublic': true,
    $expr: {
      $lt: [{ $size: '$members' }, '$settings.maxMembers']
    }
  };

  if (query) {
    matchConditions.$or = [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { tags: { $in: [new RegExp(query, 'i')] } }
    ];
  }

  if (skillLevel) {
    matchConditions['settings.skillLevel'] = skillLevel;
  }

  if (language) {
    matchConditions['settings.preferredLanguages'] = language;
  }

  const teams = await db.collection<Team>('teams')
    .aggregate([
      { $match: matchConditions },
      {
        $addFields: {
          memberCount: { $size: '$members' }
        }
      },
      { $sort: { 'stats.averageRating': -1, memberCount: -1 } },
      { $limit: 50 }
    ])
    .toArray();

  return NextResponse.json({
    success: true,
    teams: teams.map(team => ({
      id: team._id,
      name: team.name,
      description: team.description,
      avatar: team.avatar,
      memberCount: team.memberCount,
      maxMembers: team.settings.maxMembers,
      skillLevel: team.settings.skillLevel,
      preferredLanguages: team.settings.preferredLanguages,
      stats: team.stats,
      tags: team.tags
    }))
  });
}

async function getTeamLeaderboard(db: Db) {
  const teams = await db.collection<Team>('teams')
    .aggregate([
      {
        $match: {
          'settings.isPublic': true,
          'stats.battlesPlayed': { $gt: 0 }
        }
      },
      {
        $addFields: {
          memberCount: { $size: '$members' },
          winRate: {
            $cond: {
              if: { $gt: ['$stats.battlesPlayed', 0] },
              then: {
                $multiply: [
                  { $divide: ['$stats.battlesWon', '$stats.battlesPlayed'] },
                  100
                ]
              },
              else: 0
            }
          }
        }
      },
      { $sort: { 'stats.averageRating': -1, winRate: -1, 'stats.totalXP': -1 } },
      { $limit: 100 }
    ])
    .toArray();

  return NextResponse.json({
    success: true,
    leaderboard: teams.map((team, index) => ({
      rank: index + 1,
      id: team._id,
      name: team.name,
      avatar: team.avatar,
      memberCount: team.memberCount,
      stats: {
        ...team.stats,
        winRate: Math.round(team.winRate * 100) / 100
      },
      tags: team.tags?.slice(0, 3) || []
    }))
  });
}

async function createTeam(db: Db, userId: ObjectId, teamData: any) {
  console.log('Creating team with data:', { teamData, userId });
  
  // Validate team data
  if (!teamData.name || teamData.name.length < 3) {
    console.log('Team name validation failed:', teamData.name);
    return NextResponse.json({ error: 'Team name must be at least 3 characters' }, { status: 400 });
  }

  // Check if user already leads max number of teams
  const userTeams = await db.collection('teams')
    .countDocuments({ 'members': { $elemMatch: { userId, role: 'leader' } } });
  
  if (userTeams >= 3) {
    return NextResponse.json({ error: 'You can only lead up to 3 teams' }, { status: 400 });
  }

  // Check team name uniqueness
  const existingTeam = await db.collection('teams').findOne({ name: teamData.name });
  if (existingTeam) {
    return NextResponse.json({ error: 'Team name already exists' }, { status: 400 });
  }

  const newTeam: Team = {
    name: teamData.name,
    description: teamData.description || '',
    createdBy: userId,
    members: [{
      userId,
      role: 'leader',
      joinedAt: new Date(),
      permissions: {
        canInvite: true,
        canKick: true,
        canEditTeam: true,
        canStartBattles: true
      },
      contributions: {
        battlesParticipated: 0,
        battlesWon: 0,
        xpContributed: 0
      }
    }],
    settings: {
      isPublic: teamData.isPublic !== false,
      maxMembers: Math.min(teamData.maxMembers || 10, 50),
      allowInvites: teamData.allowInvites !== false,
      skillLevel: teamData.skillLevel || 'intermediate',
      preferredLanguages: teamData.preferredLanguages || []
    },
    stats: {
      battlesPlayed: 0,
      battlesWon: 0,
      tournamentWins: 0,
      totalXP: 0,
      averageRating: 1000
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    avatar: teamData.avatar || '',
    banner: teamData.banner || '',
    tags: teamData.tags || [],
    achievements: []
  };

  const result = await db.collection('teams').insertOne(newTeam);

  // Log activity
  await db.collection('user_activities').insertOne({
    userId,
    type: 'team_created',
    title: 'Team created',
    description: `Created team "${teamData.name}"`,
    timestamp: new Date()
  });

  return NextResponse.json({
    success: true,
    teamId: result.insertedId,
    message: 'Team created successfully!'
  });
}

async function joinTeam(db: Db, userId: ObjectId, teamId: ObjectId) {
  const team = await db.collection<Team>('teams').findOne({ _id: teamId });
  
  if (!team) {
    return NextResponse.json({ error: 'Team not found' }, { status: 404 });
  }

  if (!team.settings.isPublic) {
    return NextResponse.json({ error: 'This team requires an invitation' }, { status: 403 });
  }

  if (team.members.length >= team.settings.maxMembers) {
    return NextResponse.json({ error: 'Team is full' }, { status: 400 });
  }

  // Check if user is already a member
  const isMember = team.members.some(m => m.userId.equals(userId));
  if (isMember) {
    return NextResponse.json({ error: 'Already a member of this team' }, { status: 400 });
  }

  // Add user to team
  const newMember: TeamMember = {
    userId,
    role: 'member',
    joinedAt: new Date(),
    permissions: {
      canInvite: false,
      canKick: false,
      canEditTeam: false,
      canStartBattles: true
    },
    contributions: {
      battlesParticipated: 0,
      battlesWon: 0,
      xpContributed: 0
    }
  };

  await db.collection('teams').updateOne(
    { _id: teamId },
    { 
      $push: { members: newMember },
      $set: { updatedAt: new Date() }
    }
  );

  // Log activity
  await db.collection('user_activities').insertOne({
    userId,
    type: 'team_joined',
    title: 'Joined team',
    description: `Joined team "${team.name}"`,
    timestamp: new Date()
  });

  return NextResponse.json({
    success: true,
    message: `Successfully joined ${team.name}!`
  });
}

async function leaveTeam(db: Db, userId: ObjectId, teamId: ObjectId) {
  const team = await db.collection<Team>('teams').findOne({ _id: teamId });
  
  if (!team) {
    return NextResponse.json({ error: 'Team not found' }, { status: 404 });
  }

  const userMembership = team.members.find(m => m.userId.equals(userId));
  if (!userMembership) {
    return NextResponse.json({ error: 'Not a member of this team' }, { status: 400 });
  }

  // If user is the leader, they need to transfer leadership or team will be deleted
  if (userMembership.role === 'leader') {
    if (team.members.length === 1) {
      // Delete team if leader is the only member
      await db.collection('teams').deleteOne({ _id: teamId });
      
      await db.collection('user_activities').insertOne({
        userId,
        type: 'team_deleted',
        title: 'Team deleted',
        description: `Team "${team.name}" was deleted`,
        timestamp: new Date()
      });

      return NextResponse.json({
        success: true,
        message: 'Team deleted as you were the only member'
      });
    } else {
      return NextResponse.json({ 
        error: 'You must transfer leadership before leaving the team' 
      }, { status: 400 });
    }
  }

  // Remove user from team
  await db.collection('teams').updateOne(
    { _id: teamId },
    { 
      $pull: { members: { userId } },
      $set: { updatedAt: new Date() }
    }
  );

  await db.collection('user_activities').insertOne({
    userId,
    type: 'team_left',
    title: 'Left team',
    description: `Left team "${team.name}"`,
    timestamp: new Date()
  });

  return NextResponse.json({
    success: true,
    message: `Left ${team.name} successfully`
  });
}

async function inviteToTeam(db: Db, userId: ObjectId, teamId: ObjectId, invitedUserId: ObjectId, message?: string) {
  const team = await db.collection<Team>('teams').findOne({ _id: teamId });
  
  if (!team) {
    return NextResponse.json({ error: 'Team not found' }, { status: 404 });
  }

  // Check permissions
  const userMembership = team.members.find(m => m.userId.equals(userId));
  if (!userMembership || !userMembership.permissions.canInvite) {
    return NextResponse.json({ error: 'No permission to invite members' }, { status: 403 });
  }

  // Check if team has space
  if (team.members.length >= team.settings.maxMembers) {
    return NextResponse.json({ error: 'Team is full' }, { status: 400 });
  }

  // Check if user is already a member
  const isAlreadyMember = team.members.some(m => m.userId.equals(invitedUserId));
  if (isAlreadyMember) {
    return NextResponse.json({ error: 'User is already a team member' }, { status: 400 });
  }

  // Check for existing pending invite
  const existingInvite = await db.collection('team_invites').findOne({
    teamId,
    invitedUser: invitedUserId,
    status: 'pending'
  });

  if (existingInvite) {
    return NextResponse.json({ error: 'Invitation already sent' }, { status: 400 });
  }

  // Create invite
  const invite: TeamInvite = {
    teamId,
    invitedBy: userId,
    invitedUser: invitedUserId,
    message: message || '',
    status: 'pending',
    sentAt: new Date(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  };

  await db.collection('team_invites').insertOne(invite);

  return NextResponse.json({
    success: true,
    message: 'Invitation sent successfully!'
  });
}

async function respondToInvite(db: Db, userId: ObjectId, inviteId: ObjectId, response: 'accept' | 'decline') {
  const invite = await db.collection<TeamInvite>('team_invites').findOne({
    _id: inviteId,
    invitedUser: userId,
    status: 'pending'
  });

  if (!invite) {
    return NextResponse.json({ error: 'Invitation not found' }, { status: 404 });
  }

  if (invite.expiresAt < new Date()) {
    await db.collection('team_invites').updateOne(
      { _id: inviteId },
      { $set: { status: 'expired' } }
    );
    return NextResponse.json({ error: 'Invitation has expired' }, { status: 400 });
  }

  // Update invite status
  await db.collection('team_invites').updateOne(
    { _id: inviteId },
    { 
      $set: { 
        status: response === 'accept' ? 'accepted' : 'declined',
        respondedAt: new Date()
      } 
    }
  );

  if (response === 'accept') {
    // Add user to team
    const team = await db.collection<Team>('teams').findOne({ _id: invite.teamId });
    
    if (!team) {
      return NextResponse.json({ error: 'Team no longer exists' }, { status: 404 });
    }

    if (team.members.length >= team.settings.maxMembers) {
      return NextResponse.json({ error: 'Team is now full' }, { status: 400 });
    }

    const newMember: TeamMember = {
      userId,
      role: 'member',
      joinedAt: new Date(),
      permissions: {
        canInvite: false,
        canKick: false,
        canEditTeam: false,
        canStartBattles: true
      },
      contributions: {
        battlesParticipated: 0,
        battlesWon: 0,
        xpContributed: 0
      }
    };

    await db.collection('teams').updateOne(
      { _id: invite.teamId },
      { 
        $push: { members: newMember },
        $set: { updatedAt: new Date() }
      }
    );

    await db.collection('user_activities').insertOne({
      userId,
      type: 'team_joined',
      title: 'Joined team',
      description: `Joined team "${team.name}" via invitation`,
      timestamp: new Date()
    });

    return NextResponse.json({
      success: true,
      message: `Successfully joined ${team.name}!`
    });
  }

  return NextResponse.json({
    success: true,
    message: 'Invitation declined'
  });
}

async function kickMember(db: Db, userId: ObjectId, teamId: ObjectId, memberId: ObjectId) {
  const team = await db.collection<Team>('teams').findOne({ _id: teamId });
  
  if (!team) {
    return NextResponse.json({ error: 'Team not found' }, { status: 404 });
  }

  const userMembership = team.members.find(m => m.userId.equals(userId));
  if (!userMembership || !userMembership.permissions.canKick) {
    return NextResponse.json({ error: 'No permission to kick members' }, { status: 403 });
  }

  const targetMember = team.members.find(m => m.userId.equals(memberId));
  if (!targetMember) {
    return NextResponse.json({ error: 'Member not found' }, { status: 404 });
  }

  if (targetMember.role === 'leader') {
    return NextResponse.json({ error: 'Cannot kick team leader' }, { status: 400 });
  }

  // Remove member
  await db.collection('teams').updateOne(
    { _id: teamId },
    { 
      $pull: { members: { userId: memberId } },
      $set: { updatedAt: new Date() }
    }
  );

  // Log activities
  await db.collection('user_activities').insertMany([
    {
      userId,
      type: 'member_kicked',
      title: 'Member kicked',
      description: `Kicked member from team "${team.name}"`,
      timestamp: new Date()
    },
    {
      userId: memberId,
      type: 'kicked_from_team',
      title: 'Removed from team',
      description: `You were removed from team "${team.name}"`,
      timestamp: new Date()
    }
  ]);

  return NextResponse.json({
    success: true,
    message: 'Member removed successfully'
  });
}

async function updateMemberRole(db: Db, userId: ObjectId, teamId: ObjectId, memberId: ObjectId, newRole: string) {
  const team = await db.collection<Team>('teams').findOne({ _id: teamId });
  
  if (!team) {
    return NextResponse.json({ error: 'Team not found' }, { status: 404 });
  }

  const userMembership = team.members.find(m => m.userId.equals(userId));
  if (!userMembership || userMembership.role !== 'leader') {
    return NextResponse.json({ error: 'Only team leaders can change roles' }, { status: 403 });
  }

  const targetMember = team.members.find(m => m.userId.equals(memberId));
  if (!targetMember) {
    return NextResponse.json({ error: 'Member not found' }, { status: 404 });
  }

  // Define role permissions
  const rolePermissions = {
    leader: { canInvite: true, canKick: true, canEditTeam: true, canStartBattles: true },
    'co-leader': { canInvite: true, canKick: true, canEditTeam: false, canStartBattles: true },
    member: { canInvite: false, canKick: false, canEditTeam: false, canStartBattles: true }
  };

  if (newRole === 'leader') {
    // Transfer leadership
    await db.collection('teams').updateOne(
      { _id: teamId, 'members.userId': userId },
      { 
        $set: { 
          'members.$.role': 'co-leader',
          'members.$.permissions': rolePermissions['co-leader']
        } 
      }
    );
  }

  // Update target member role
  await db.collection('teams').updateOne(
    { _id: teamId, 'members.userId': memberId },
    { 
      $set: { 
        'members.$.role': newRole,
        'members.$.permissions': rolePermissions[newRole as keyof typeof rolePermissions],
        updatedAt: new Date()
      } 
    }
  );

  return NextResponse.json({
    success: true,
    message: `Role updated to ${newRole}`
  });
}

async function updateTeam(db: Db, userId: ObjectId, teamId: ObjectId, updates: any) {
  const team = await db.collection<Team>('teams').findOne({ _id: teamId });
  
  if (!team) {
    return NextResponse.json({ error: 'Team not found' }, { status: 404 });
  }

  const userMembership = team.members.find(m => m.userId.equals(userId));
  if (!userMembership || !userMembership.permissions.canEditTeam) {
    return NextResponse.json({ error: 'No permission to edit team' }, { status: 403 });
  }

  // Validate updates
  const allowedUpdates = ['description', 'avatar', 'banner', 'tags', 'settings'];
  const updateData: any = { updatedAt: new Date() };

  for (const [key, value] of Object.entries(updates)) {
    if (allowedUpdates.includes(key)) {
      updateData[key] = value;
    }
  }

  await db.collection('teams').updateOne(
    { _id: teamId },
    { $set: updateData }
  );

  return NextResponse.json({
    success: true,
    message: 'Team updated successfully'
  });
}

async function deleteTeam(db: Db, userId: ObjectId, teamId: ObjectId) {
  const team = await db.collection<Team>('teams').findOne({ _id: teamId });
  
  if (!team) {
    return NextResponse.json({ error: 'Team not found' }, { status: 404 });
  }

  const userMembership = team.members.find(m => m.userId.equals(userId));
  if (!userMembership || userMembership.role !== 'leader') {
    return NextResponse.json({ error: 'Only team leaders can delete teams' }, { status: 403 });
  }

  // Delete team and related data
  await Promise.all([
    db.collection('teams').deleteOne({ _id: teamId }),
    db.collection('team_invites').deleteMany({ teamId }),
    db.collection('team_battles').deleteMany({ teamId })
  ]);

  // Log activity for all members
  const memberActivities = team.members.map(member => ({
    userId: member.userId,
    type: 'team_deleted',
    title: 'Team deleted',
    description: `Team "${team.name}" was deleted`,
    timestamp: new Date()
  }));

  await db.collection('user_activities').insertMany(memberActivities);

  return NextResponse.json({
    success: true,
    message: 'Team deleted successfully'
  });
}

async function startTeamBattle(db: Db, userId: ObjectId, teamId: ObjectId, battleConfig: any) {
  const team = await db.collection<Team>('teams').findOne({ _id: teamId });
  
  if (!team) {
    return NextResponse.json({ error: 'Team not found' }, { status: 404 });
  }

  const userMembership = team.members.find(m => m.userId.equals(userId));
  if (!userMembership || !userMembership.permissions.canStartBattles) {
    return NextResponse.json({ error: 'No permission to start battles' }, { status: 403 });
  }

  // Create team battle
  const battleData = {
    teamId,
    createdBy: userId,
    mode: battleConfig.mode || 'team-vs-team',
    maxParticipants: Math.min(battleConfig.maxParticipants || team.members.length, team.members.length),
    difficulty: battleConfig.difficulty || 'medium',
    language: battleConfig.language || 'javascript',
    timeLimit: battleConfig.timeLimit || 1800, // 30 minutes
    status: 'waiting',
    participants: [],
    createdAt: new Date(),
    startsAt: battleConfig.startsAt || new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
  };

  const result = await db.collection('team_battles').insertOne(battleData);

  // Update team stats
  await db.collection('teams').updateOne(
    { _id: teamId },
    { $inc: { 'stats.battlesPlayed': 1 } }
  );

  return NextResponse.json({
    success: true,
    battleId: result.insertedId,
    message: 'Team battle created successfully!'
  });
}
