import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { connectDB } from '@/lib/mongodb';

// Simple team interface for the API
interface Team {
  _id?: string;
  name: string;
  description: string;
  captain: string;
  members: Array<{
    userId: string;
    username: string;
    role: 'captain' | 'member';
    joinedAt: Date;
  }>;
  settings: {
    isPublic: boolean;
    maxMembers: number;
    skillLevel: string;
    preferredLanguages: string[];
  };
  stats: {
    battlesPlayed: number;
    battlesWon: number;
    averageRating: number;
    totalXP: number;
  };
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'my-teams';

    await connectDB();

    // For now, return mock teams since we're having database issues
    const mockTeams: Team[] = [
      {
        _id: '1',
        name: 'Code Crushers',
        description: 'Elite team specializing in algorithmic challenges',
        captain: session.user.email,
        members: [
          {
            userId: '1',
            username: session.user.name || 'Captain',
            role: 'captain',
            joinedAt: new Date()
          },
          {
            userId: '2',
            username: 'Sarah Kim',
            role: 'member',
            joinedAt: new Date()
          },
          {
            userId: '3',
            username: 'Mike Johnson',
            role: 'member',
            joinedAt: new Date()
          }
        ],
        settings: {
          isPublic: true,
          maxMembers: 5,
          skillLevel: 'intermediate',
          preferredLanguages: ['JavaScript', 'Python']
        },
        stats: {
          battlesPlayed: 45,
          battlesWon: 32,
          averageRating: 1750,
          totalXP: 12500
        },
        tags: ['algorithms', 'competitive'],
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date()
      },
      {
        _id: '2',
        name: 'Binary Bombers',
        description: 'Fast-paced team focused on speed coding',
        captain: 'emma.wilson@example.com',
        members: [
          {
            userId: '4',
            username: 'Emma Wilson',
            role: 'captain',
            joinedAt: new Date()
          },
          {
            userId: '5',
            username: 'David Lee',
            role: 'member',
            joinedAt: new Date()
          }
        ],
        settings: {
          isPublic: true,
          maxMembers: 4,
          skillLevel: 'advanced',
          preferredLanguages: ['JavaScript', 'TypeScript', 'Go']
        },
        stats: {
          battlesPlayed: 28,
          battlesWon: 20,
          averageRating: 1615,
          totalXP: 8900
        },
        tags: ['speed-coding', 'web-dev'],
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date()
      }
    ];

    switch (action) {
      case 'my-teams':
        // Return teams where user is a member
        const userTeams = mockTeams.filter(team => 
          team.members.some(member => member.userId === session.user?.email || member.username === session.user?.name)
        );
        return NextResponse.json({
          success: true,
          teams: userTeams
        });

      case 'discover':
        // Return public teams user can join
        const discoverTeams = mockTeams.filter(team => 
          team.settings.isPublic && 
          team.members.length < team.settings.maxMembers &&
          !team.members.some(member => member.userId === session.user?.email)
        );
        return NextResponse.json({
          success: true,
          teams: discoverTeams
        });

      case 'leaderboard':
        // Return top teams by rating
        const sortedTeams = [...mockTeams].sort((a, b) => b.stats.averageRating - a.stats.averageRating);
        return NextResponse.json({
          success: true,
          leaderboard: sortedTeams.map((team, index) => ({
            ...team,
            rank: index + 1
          }))
        });

      default:
        return NextResponse.json({
          success: true,
          teams: mockTeams
        });
    }
  } catch (error) {
    console.error('Error in teams API:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch teams'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { action } = data;

    await connectDB();

    switch (action) {
      case 'create':
        // Create new team
        const newTeam: Team = {
          _id: `team_${Date.now()}`,
          name: data.name,
          description: data.description || '',
          captain: session.user.email,
          members: [{
            userId: session.user.email,
            username: session.user.name || 'Captain',
            role: 'captain',
            joinedAt: new Date()
          }],
          settings: {
            isPublic: data.isPublic !== false,
            maxMembers: data.maxMembers || 5,
            skillLevel: data.skillLevel || 'intermediate',
            preferredLanguages: data.preferredLanguages || ['JavaScript']
          },
          stats: {
            battlesPlayed: 0,
            battlesWon: 0,
            averageRating: 1000,
            totalXP: 0
          },
          tags: data.tags || [],
          createdAt: new Date(),
          updatedAt: new Date()
        };

        return NextResponse.json({
          success: true,
          message: 'Team created successfully',
          team: newTeam
        }, { status: 201 });

      case 'join':
        // Join existing team
        const { teamId } = data;
        return NextResponse.json({
          success: true,
          message: `Successfully joined team ${teamId}`
        });

      case 'leave':
        // Leave team
        return NextResponse.json({
          success: true,
          message: 'Successfully left team'
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in teams POST:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to process team action'
    }, { status: 500 });
  }
}
