import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { connectDB } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

interface MatchmakingQueue {
  userId: string;
  username: string;
  level: number;
  rating: number;
  preferredLanguages: string[];
  queueTime: Date;
  battleType: 'quick' | 'ranked' | 'tournament';
}

interface BattleRoom {
  id: string;
  participants: string[];
  challenge: any;
  status: 'waiting' | 'active' | 'completed';
  createdAt: Date;
  settings: {
    timeLimit: number;
    difficulty: string;
    language?: string;
  };
}

// In-memory queues (in production, use Redis)
const matchmakingQueues: Map<string, MatchmakingQueue[]> = new Map([
  ['quick', []],
  ['ranked', []],
  ['tournament', []]
]);

const activeBattles: Map<string, BattleRoom> = new Map();

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, battleType, preferences } = await request.json();
    const { db } = await connectDB();

    // Get user data
    const user = await db.collection('users').findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userStats = await db.collection('user_stats').findOne({ userId: user._id });

    switch (action) {
      case 'join_queue':
        return handleJoinQueue(user, userStats, battleType, preferences);
      
      case 'leave_queue':
        return handleLeaveQueue(user._id.toString(), battleType);
      
      case 'get_queue_status':
        return handleGetQueueStatus(user._id.toString());
      
      case 'create_private_battle':
        return handleCreatePrivateBattle(user, preferences);
      
      case 'join_private_battle':
        return handleJoinPrivateBattle(user, preferences.battleId);
      
      case 'get_active_battles':
        return handleGetActiveBattles();
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Matchmaking API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function handleJoinQueue(user: any, userStats: any, battleType: string, preferences: any) {
  const queue = matchmakingQueues.get(battleType) || [];
  
  // Check if user already in queue
  const existingIndex = queue.findIndex(q => q.userId === user._id.toString());
  if (existingIndex !== -1) {
    return NextResponse.json({ 
      success: false, 
      error: 'Already in queue',
      position: existingIndex + 1
    });
  }

  const queueEntry: MatchmakingQueue = {
    userId: user._id.toString(),
    username: user.username || user.name || 'Anonymous',
    level: userStats?.level || 1,
    rating: userStats?.rating || 1200,
    preferredLanguages: preferences.languages || ['javascript'],
    queueTime: new Date(),
    battleType: battleType as 'quick' | 'ranked' | 'tournament'
  };

  queue.push(queueEntry);
  matchmakingQueues.set(battleType, queue);

  // Try to find a match
  const match = findMatch(queueEntry, queue);
  
  if (match) {
    // Create battle room
    const battleRoom = createBattleRoom([queueEntry, match], battleType, preferences);
    
    // Remove players from queue
    const updatedQueue = queue.filter(q => 
      q.userId !== queueEntry.userId && q.userId !== match.userId
    );
    matchmakingQueues.set(battleType, updatedQueue);

    return NextResponse.json({
      success: true,
      matched: true,
      battleId: battleRoom.id,
      opponent: {
        username: match.username,
        level: match.level,
        rating: match.rating
      }
    });
  }

  return NextResponse.json({
    success: true,
    matched: false,
    position: queue.length,
    estimatedWait: calculateEstimatedWait(queue.length)
  });
}

function findMatch(player: MatchmakingQueue, queue: MatchmakingQueue[]): MatchmakingQueue | null {
  const potentialMatches = queue.filter(q => q.userId !== player.userId);
  
  if (potentialMatches.length === 0) return null;

  // Smart matching algorithm
  const scoredMatches = potentialMatches.map(opponent => ({
    player: opponent,
    score: calculateMatchScore(player, opponent)
  }));

  // Sort by match score (higher is better)
  scoredMatches.sort((a, b) => b.score - a.score);

  // Return best match if score is acceptable
  const bestMatch = scoredMatches[0];
  if (bestMatch.score > 0.3) { // Minimum match threshold
    return bestMatch.player;
  }

  // If no good match and queue is getting long, match with anyone
  if (potentialMatches.length >= 3) {
    return potentialMatches[0];
  }

  return null;
}

function calculateMatchScore(player1: MatchmakingQueue, player2: MatchmakingQueue): number {
  let score = 0;

  // Rating similarity (weight: 0.4)
  const ratingDiff = Math.abs(player1.rating - player2.rating);
  const ratingScore = Math.max(0, 1 - (ratingDiff / 400)); // 400 rating difference = 0 score
  score += ratingScore * 0.4;

  // Level similarity (weight: 0.3)
  const levelDiff = Math.abs(player1.level - player2.level);
  const levelScore = Math.max(0, 1 - (levelDiff / 10)); // 10 level difference = 0 score
  score += levelScore * 0.3;

  // Language compatibility (weight: 0.2)
  const commonLanguages = player1.preferredLanguages.filter(lang => 
    player2.preferredLanguages.includes(lang)
  );
  const languageScore = commonLanguages.length / Math.max(
    player1.preferredLanguages.length, 
    player2.preferredLanguages.length
  );
  score += languageScore * 0.2;

  // Queue time penalty (weight: 0.1) - prioritize players waiting longer
  const waitTime1 = Date.now() - player1.queueTime.getTime();
  const waitTime2 = Date.now() - player2.queueTime.getTime();
  const avgWaitTime = (waitTime1 + waitTime2) / 2;
  const waitScore = Math.min(1, avgWaitTime / (60 * 1000)); // 1 minute = full score
  score += waitScore * 0.1;

  return score;
}

function createBattleRoom(players: MatchmakingQueue[], battleType: string, preferences: any): BattleRoom {
  const battleId = new ObjectId().toString();
  
  const battleRoom: BattleRoom = {
    id: battleId,
    participants: players.map(p => p.userId),
    challenge: null, // Will be set when battle starts
    status: 'waiting',
    createdAt: new Date(),
    settings: {
      timeLimit: preferences.timeLimit || 600, // 10 minutes default
      difficulty: preferences.difficulty || 'medium',
      language: preferences.language
    }
  };

  activeBattles.set(battleId, battleRoom);
  
  // Generate challenge for the battle
  generateBattleChallenge(battleRoom, players);
  
  return battleRoom;
}

async function generateBattleChallenge(battleRoom: BattleRoom, players: MatchmakingQueue[]) {
  // Calculate average skill level
  const avgLevel = players.reduce((sum, p) => sum + p.level, 0) / players.length;
  const avgRating = players.reduce((sum, p) => sum + p.rating, 0) / players.length;
  
  // Generate appropriate challenge
  const challenge = {
    id: new ObjectId().toString(),
    title: generateChallengeTitle(battleRoom.settings.difficulty),
    difficulty: battleRoom.settings.difficulty,
    description: generateChallengeDescription(avgLevel),
    constraints: generateConstraints(),
    examples: generateExamples(),
    starterCode: generateStarterCode(),
    timeLimit: battleRoom.settings.timeLimit,
    testCases: generateTestCases(avgLevel)
  };

  battleRoom.challenge = challenge;
  battleRoom.status = 'active';
  activeBattles.set(battleRoom.id, battleRoom);
}

function handleLeaveQueue(userId: string, battleType: string) {
  const queue = matchmakingQueues.get(battleType) || [];
  const updatedQueue = queue.filter(q => q.userId !== userId);
  matchmakingQueues.set(battleType, updatedQueue);

  return NextResponse.json({ success: true });
}

function handleGetQueueStatus(userId: string) {
  const status = {
    inQueue: false,
    position: 0,
    estimatedWait: 0,
    battleType: null
  };

  for (const [type, queue] of matchmakingQueues.entries()) {
    const position = queue.findIndex(q => q.userId === userId);
    if (position !== -1) {
      status.inQueue = true;
      status.position = position + 1;
      status.estimatedWait = calculateEstimatedWait(position + 1);
      status.battleType = type;
      break;
    }
  }

  return NextResponse.json({ success: true, status });
}

function handleCreatePrivateBattle(user: any, preferences: any) {
  const battleId = new ObjectId().toString();
  
  const battleRoom: BattleRoom = {
    id: battleId,
    participants: [user._id.toString()],
    challenge: null,
    status: 'waiting',
    createdAt: new Date(),
    settings: {
      timeLimit: preferences.timeLimit || 600,
      difficulty: preferences.difficulty || 'medium',
      language: preferences.language
    }
  };

  activeBattles.set(battleId, battleRoom);

  return NextResponse.json({
    success: true,
    battleId,
    inviteCode: generateInviteCode(battleId)
  });
}

function handleJoinPrivateBattle(user: any, battleId: string) {
  const battle = activeBattles.get(battleId);
  
  if (!battle) {
    return NextResponse.json({ error: 'Battle not found' }, { status: 404 });
  }

  if (battle.participants.length >= 2) {
    return NextResponse.json({ error: 'Battle is full' }, { status: 400 });
  }

  if (battle.participants.includes(user._id.toString())) {
    return NextResponse.json({ error: 'Already in battle' }, { status: 400 });
  }

  battle.participants.push(user._id.toString());
  activeBattles.set(battleId, battle);

  // Start battle if we have 2 players
  if (battle.participants.length === 2) {
    // Generate challenge and start battle
    battle.status = 'active';
    // Generate challenge logic here
  }

  return NextResponse.json({ success: true, battleId });
}

function handleGetActiveBattles() {
  const battles = Array.from(activeBattles.values()).map(battle => ({
    id: battle.id,
    participantCount: battle.participants.length,
    status: battle.status,
    settings: battle.settings,
    createdAt: battle.createdAt
  }));

  return NextResponse.json({ success: true, battles });
}

// Helper functions
function calculateEstimatedWait(position: number): number {
  // Rough estimation: 30 seconds per position ahead
  return position * 30;
}

function generateChallengeTitle(difficulty: string): string {
  const titles = {
    easy: ['Array Sum', 'String Reverse', 'Find Maximum', 'Count Elements'],
    medium: ['Binary Search', 'Merge Intervals', 'Valid Parentheses', 'Two Sum'],
    hard: ['Longest Substring', 'Tree Traversal', 'Dynamic Programming', 'Graph Algorithms']
  };
  
  const titleList = titles[difficulty as keyof typeof titles] || titles.medium;
  return titleList[Math.floor(Math.random() * titleList.length)];
}

function generateChallengeDescription(level: number): string {
  return `Battle challenge generated for skill level ${level}. Solve this problem faster than your opponent to win!`;
}

function generateConstraints(): string[] {
  return [
    '1 ≤ n ≤ 10^5',
    'Time limit: 10 minutes',
    'Memory limit: 256 MB'
  ];
}

function generateExamples(): any[] {
  return [
    {
      input: '[1, 2, 3, 4, 5]',
      output: '15',
      explanation: 'Sum of all elements'
    }
  ];
}

function generateStarterCode(): any {
  return {
    javascript: 'function solve(input) {\n    // Your code here\n    return result;\n}',
    python: 'def solve(input):\n    # Your code here\n    return result',
    java: 'public class Solution {\n    public int solve(int[] input) {\n        // Your code here\n        return result;\n    }\n}',
    cpp: 'class Solution {\npublic:\n    int solve(vector<int>& input) {\n        // Your code here\n        return result;\n    }\n};'
  };
}

function generateTestCases(level: number): any[] {
  const numCases = Math.min(5 + level, 20);
  const testCases = [];
  
  for (let i = 0; i < numCases; i++) {
    testCases.push({
      input: `test_input_${i}`,
      expected: `test_output_${i}`,
      hidden: i >= 3 // Hide some test cases
    });
  }
  
  return testCases;
}

function generateInviteCode(battleId: string): string {
  return battleId.substring(0, 8).toUpperCase();
}
