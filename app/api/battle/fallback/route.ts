import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

interface BattleRoom {
  id: string;
  participants: string[];
  challenge: {
    id: string;
    title: string;
    description: string;
    difficulty: string;
    testCases: Array<{
      input: string;
      expectedOutput: string;
    }>;
    starterCode: {
      javascript: string;
      python: string;
    };
  };
  status: 'waiting' | 'active' | 'completed';
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  winner?: string;
}

// In-memory battle storage (in production, use Redis or database)
const activeBattles = new Map<string, BattleRoom>();
const waitingQueue: string[] = [];

const sampleChallenges = [
  {
    id: '1',
    title: 'Array Rotation Challenge',
    description: 'Rotate an array to the right by k steps. Use power-ups strategically to gain advantage!',
    difficulty: 'medium',
    testCases: [
      { input: '[1,2,3,4,5,6,7], k = 3', expectedOutput: '[5,6,7,1,2,3,4]' },
      { input: '[1,2], k = 1', expectedOutput: '[2,1]' },
      { input: '[1], k = 1', expectedOutput: '[1]' }
    ],
    starterCode: {
      javascript: `function rotate(nums, k) {
    // Write your solution here
    // Hint: Consider using array slicing
    return nums;
}`,
      python: `def rotate(nums, k):
    # Write your solution here
    # Hint: Consider using list slicing
    return nums`
    }
  },
  {
    id: '2',
    title: 'Two Sum Problem',
    description: 'Find two numbers in an array that add up to a target sum.',
    difficulty: 'easy',
    testCases: [
      { input: '[2,7,11,15], target = 9', expectedOutput: '[0,1]' },
      { input: '[3,2,4], target = 6', expectedOutput: '[1,2]' }
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {
    // Write your solution here
    return [];
}`,
      python: `def two_sum(nums, target):
    # Write your solution here
    return []`
    }
  }
];

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'join-queue':
        // Add user to waiting queue
        const userId = session.user.email;
        
        // Check if user already in queue
        if (waitingQueue.includes(userId)) {
          return NextResponse.json({
            success: false,
            message: 'Already in queue'
          });
        }

        waitingQueue.push(userId);

        // Try to match with another player
        if (waitingQueue.length >= 2) {
          const player1 = waitingQueue.shift()!;
          const player2 = waitingQueue.shift()!;
          
          const battleId = `battle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          const challenge = sampleChallenges[Math.floor(Math.random() * sampleChallenges.length)];
          
          const battle: BattleRoom = {
            id: battleId,
            participants: [player1, player2],
            challenge,
            status: 'active',
            createdAt: new Date(),
            startedAt: new Date()
          };
          
          activeBattles.set(battleId, battle);
          
          return NextResponse.json({
            success: true,
            matched: true,
            battleId,
            challenge,
            opponent: player1 === userId ? player2 : player1,
            timeLimit: 300000 // 5 minutes
          });
        }

        return NextResponse.json({
          success: true,
          matched: false,
          message: 'Waiting for opponent...',
          queuePosition: waitingQueue.length
        });

      case 'check-battle':
        const battleId = searchParams.get('battleId');
        if (!battleId) {
          return NextResponse.json({ error: 'Battle ID required' }, { status: 400 });
        }

        const battle = activeBattles.get(battleId);
        if (!battle) {
          return NextResponse.json({ error: 'Battle not found' }, { status: 404 });
        }

        return NextResponse.json({
          success: true,
          battle: {
            id: battle.id,
            status: battle.status,
            challenge: battle.challenge,
            participants: battle.participants,
            winner: battle.winner
          }
        });

      case 'active-battles':
        const userActiveBattles = Array.from(activeBattles.values())
          .filter(battle => 
            battle.participants.includes(session.user.email!) && 
            battle.status === 'active'
          );

        return NextResponse.json({
          success: true,
          battles: userActiveBattles
        });

      default:
        return NextResponse.json({
          success: true,
          queueSize: waitingQueue.length,
          activeBattles: activeBattles.size
        });
    }
  } catch (error) {
    console.error('Battle matchmaking error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
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
    const { action, battleId, code } = data;

    switch (action) {
      case 'submit-code':
        if (!battleId || !code) {
          return NextResponse.json({ error: 'Battle ID and code required' }, { status: 400 });
        }

        const battle = activeBattles.get(battleId);
        if (!battle) {
          return NextResponse.json({ error: 'Battle not found' }, { status: 404 });
        }

        // Simulate code execution (in production, use proper code execution service)
        const testResults = battle.challenge.testCases.map(() => ({
          passed: Math.random() > 0.3, // 70% success rate for simulation
          output: 'Simulated output'
        }));

        const allPassed = testResults.every(result => result.passed);
        const completionTime = Date.now() - (battle.startedAt?.getTime() || Date.now());

        if (allPassed) {
          battle.status = 'completed';
          battle.completedAt = new Date();
          battle.winner = session.user.email;
        }

        return NextResponse.json({
          success: true,
          testResults,
          allPassed,
          completionTime,
          winner: battle.winner
        });

      case 'leave-queue':
        const userId = session.user.email;
        const index = waitingQueue.indexOf(userId);
        if (index > -1) {
          waitingQueue.splice(index, 1);
        }

        return NextResponse.json({
          success: true,
          message: 'Left queue successfully'
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Battle action error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
