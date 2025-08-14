import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

interface LiveBattle {
  id: string;
  battleId: string;
  battleMode: string;
  participants: Array<{
    username: string;
    status: string;
  }>;
  problem: string;
  difficulty: string;
  duration: string;
  spectators: number;
  status: string;
  startTime: string;
}

// Mock data for live battles
const mockLiveBattles: LiveBattle[] = [
  {
    id: '1',
    battleId: 'battle_quick_001',
    battleMode: 'quick-dual',
    participants: [
      { username: 'CodeMaster42', status: 'active' },
      { username: 'AlgoNinja', status: 'active' }
    ],
    problem: 'Two Sum Challenge',
    difficulty: 'Easy',
    duration: '5 min',
    spectators: 12,
    status: 'in_progress',
    startTime: new Date(Date.now() - 120000).toISOString() // 2 minutes ago
  },
  {
    id: '2',
    battleId: 'battle_mind_002',
    battleMode: 'minimalist-mind',
    participants: [
      { username: 'DevGuru', status: 'active' },
      { username: 'LogicWizard', status: 'active' },
      { username: 'ByteHacker', status: 'active' }
    ],
    problem: 'Binary Tree Traversal',
    difficulty: 'Medium',
    duration: '10 min',
    spectators: 25,
    status: 'in_progress',
    startTime: new Date(Date.now() - 300000).toISOString() // 5 minutes ago
  },
  {
    id: '3',
    battleId: 'battle_arena_003',
    battleMode: 'mirror-arena',
    participants: [
      { username: 'StackOverflow', status: 'active' },
      { username: 'GitCommander', status: 'active' }
    ],
    problem: 'Dynamic Programming Maze',
    difficulty: 'Hard',
    duration: '15 min',
    spectators: 8,
    status: 'in_progress',
    startTime: new Date(Date.now() - 600000).toISOString() // 10 minutes ago
  },
  {
    id: '4',
    battleId: 'battle_narrative_004',
    battleMode: 'narrative-mode',
    participants: [
      { username: 'StoryTeller', status: 'active' },
      { username: 'CodePoet', status: 'active' }
    ],
    problem: 'String Manipulation Story',
    difficulty: 'Medium',
    duration: '12 min',
    spectators: 15,
    status: 'in_progress',
    startTime: new Date(Date.now() - 180000).toISOString() // 3 minutes ago
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';
    const battleMode = searchParams.get('battleMode');

    let filteredBattles = mockLiveBattles;

    // Filter by status
    if (status !== 'all') {
      filteredBattles = filteredBattles.filter(battle => battle.status === status);
    }

    // Filter by battle mode
    if (battleMode && battleMode !== 'all') {
      filteredBattles = filteredBattles.filter(battle => 
        battle.battleMode === battleMode
      );
    }

    return NextResponse.json({
      success: true,
      data: filteredBattles,
      total: filteredBattles.length
    });
  } catch (error) {
    console.error('Error fetching battles:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch battles'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, battleId } = body;

    switch (action) {
      case 'join_spectate':
        // TODO: Implement join spectate logic
        return NextResponse.json({
          success: true,
          message: 'Joined as spectator',
          spectateUrl: `/battle/${battleId}/spectate`
        });

      case 'create_battle':
        // TODO: Implement create battle logic
        const newBattleId = `battle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        return NextResponse.json({
          success: true,
          battleId: newBattleId,
          message: 'Battle created successfully'
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Battle API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}