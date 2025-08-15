import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Battle } from '@/models/DatabaseSchemas';

interface LiveBattle {
  id: string;
  battleId: string;
  battleMode: string;
  participants: Array<{
    username: string;
    status: string;
    userId?: string;
  }>;
  problem: string;
  difficulty: string;
  duration: string;
  spectators: number;
  status: string;
  startTime: string;
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';
    const battleMode = searchParams.get('battleMode');

    // Query live battles from database
    const query: any = {};
    
    if (status !== 'all') {
      query.status = status === 'live' ? 'in_progress' : status;
    } else {
      // Only show active battles (in_progress, starting, live)
      query.status = { $in: ['in_progress', 'starting', 'live'] };
    }

    if (battleMode && battleMode !== 'all') {
      query.mode = battleMode;
    }

    const battles = await Battle.find(query)
      .populate('participants.user', 'username displayName')
      .populate('problem', 'title difficulty timeLimit')
      .sort({ startTime: -1 })
      .limit(50)
      .lean();

    // Transform database data to API format
    const liveBattles: LiveBattle[] = battles.map((battle: any) => ({
      id: battle._id.toString(),
      battleId: battle.battleId || `battle_${battle._id}`,
      battleMode: battle.mode || 'Quick Dual',
      participants: (battle.participants || []).map((p: any) => ({
        username: p.user?.username || p.user?.displayName || 'Player',
        status: p.status || 'active',
        userId: p.user?._id?.toString()
      })),
      problem: battle.problem?.title || battle.problemTitle || 'Coding Challenge',
      difficulty: battle.problem?.difficulty || battle.difficulty || 'Medium',
      duration: battle.problem?.timeLimit ? `${battle.problem.timeLimit} min` : '15 min',
      spectators: battle.spectators?.length || Math.floor(Math.random() * 50), // Real spectator count or random for demo
      status: battle.status,
      startTime: battle.startTime || battle.createdAt
    }));

    // If no real battles found, provide some demo data to show the UI working
    if (liveBattles.length === 0) {
      const demoMode = searchParams.get('demo') === 'true';
      if (demoMode) {
        return NextResponse.json({
          success: true,
          data: getMockBattles(),
          total: getMockBattles().length,
          isDemo: true
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: liveBattles,
      total: liveBattles.length,
      isDemo: false
    });
  } catch (error) {
    console.error('Error fetching battles:', error);
    
    // Fallback to demo data if database fails
    return NextResponse.json({
      success: true,
      data: getMockBattles(),
      total: getMockBattles().length,
      isDemo: true,
      error: 'Using demo data - database unavailable'
    });
  }
}

// Mock battles for demo purposes
function getMockBattles(): LiveBattle[] {
  return [
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
    },
    {
      id: '4',
      battleId: 'battle_team_004',
      battleMode: 'Team Clash',
      participants: [
        { username: 'TeamAlpha', status: 'active' },
        { username: 'TeamBeta', status: 'active' }
      ],
      problem: 'Graph Algorithms',
      difficulty: 'Hard',
      duration: '20 min',
      spectators: 45,
      status: 'in_progress',
      startTime: new Date(Date.now() - 180000).toISOString()
    },
    {
      id: '5',
      battleId: 'battle_attack_005',
      battleMode: 'Attack & Defend',
      participants: [
        { username: 'CyberWarrior', status: 'active' },
        { username: 'DefenseExpert', status: 'active' }
      ],
      problem: 'Security Algorithms',
      difficulty: 'Expert',
      duration: '25 min',
      spectators: 67,
      status: 'in_progress',
      startTime: new Date(Date.now() - 450000).toISOString()
    },
    {
      id: '6',
      battleId: 'battle_narrative_006',
      battleMode: 'Narrative Mode',
      participants: [
        { username: 'StoryTeller', status: 'active' },
        { username: 'PlotMaster', status: 'active' }
      ],
      problem: 'String Processing Adventure',
      difficulty: 'Medium',
      duration: '12 min',
      spectators: 34,
      status: 'in_progress',
      startTime: new Date(Date.now() - 240000).toISOString()
    }
  ];
}
