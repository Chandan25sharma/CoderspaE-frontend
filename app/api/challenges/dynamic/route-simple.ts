import { NextRequest, NextResponse } from 'next/server';

// Mock challenge data for build compatibility
const mockChallenge = {
  id: 'array_rotation',
  title: 'Array Rotation Challenge',
  description: 'Rotate an array to the right by k steps',
  difficulty: 'easy',
  timeLimit: 300,
  category: 'arrays',
  problemStatement: 'Given an array and a number k, rotate the array to the right by k steps.',
  inputs: [1, 2, 3, 4, 5, 6, 7],
  expectedOutput: [5, 6, 7, 1, 2, 3, 4],
  testCases: [
    {
      input: [[1, 2, 3, 4, 5, 6, 7], 3],
      output: [5, 6, 7, 1, 2, 3, 4]
    },
    {
      input: [[-1, -100, 3, 99], 2],
      output: [3, 99, -1, -100]
    }
  ],
  starterCode: {
    javascript: `function rotate(nums, k) {
    // Write your solution here
    return nums;
}`,
    python: `def rotate(nums, k):
    # Write your solution here
    return nums`
  }
};

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      challenge: mockChallenge
    });
  } catch (error) {
    console.error('Dynamic challenge GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, challengeType, userLevel } = await request.json();

    switch (action) {
      case 'generate_challenge':
        return NextResponse.json({
          success: true,
          challenge: {
            ...mockChallenge,
            createdAt: new Date()
          }
        });

      case 'get_challenge':
        return NextResponse.json({
          success: true,
          challenge: mockChallenge
        });

      case 'submit_solution':
        return NextResponse.json({
          success: true,
          correct: true,
          score: 100,
          executionTime: 45,
          feedback: 'Great job! Your solution is correct.'
        });

      case 'get_user_challenges':
        return NextResponse.json({
          success: true,
          challenges: [mockChallenge]
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Dynamic challenge POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
