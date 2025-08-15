import { NextRequest, NextResponse } from 'next/server';

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

const mockLiveBattles: LiveBattle[] = [
  {
    id: '1',
    battleId: 'battle_quick_001',
    battleMode: 'Quick Dual',
    participants: [
      { username: 'CodeMaster42', status: 'active' },
      { username: 'AlgoNinja', status: 'active' }
    ],
    problem: 'Two Sum Challenge',
    difficulty: 'Easy',
    duration: '5 min',
    spectators: 12,
    status: 'in_progress',
    startTime: new Date(Date.now() - 120000).toISOString()
  },
  {
    id: '2',
    battleId: 'battle_mind_002',
    battleMode: 'Minimalist Mind',
    participants: [
      { username: 'DevGuru', status: 'active' },
      { username: 'LogicWizard', status: 'active' }
    ],
    problem: 'Binary Tree Traversal',
    difficulty: 'Medium',
    duration: '10 min',
    spectators: 25,
    status: 'in_progress',
    startTime: new Date(Date.now() - 300000).toISOString()
  },
  {
    id: '3',
    battleId: 'battle_arena_003',
    battleMode: 'Mirror Arena',
    participants: [
      { username: 'StackOverflow', status: 'active' },
      { username: 'GitCommander', status: 'active' }
    ],
    problem: 'Dynamic Programming Maze',
    difficulty: 'Hard',
    duration: '15 min',
    spectators: 8,
    status: 'in_progress',
    startTime: new Date(Date.now() - 600000).toISOString()
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';
    const battleMode = searchParams.get('battleMode');

    let filteredBattles = mockLiveBattles;

    if (status !== 'all') {
      filteredBattles = filteredBattles.filter(battle => battle.status === status);
    }

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
      { success: false, error: 'Failed to fetch battles' },
      { status: 500 }
    );
  }
}
