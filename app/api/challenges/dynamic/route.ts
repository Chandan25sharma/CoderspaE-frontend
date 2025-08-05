import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

// Dynamic Challenge Templates
const challengeTemplates = [
  {
    id: 'array_rotation',
    title: 'Array Rotation Challenge',
    description: 'Rotate an array to the right by k steps',
    difficulty: 'easy',
    timeLimit: 300,
    category: 'arrays',
    generateChallenge: (level: number) => {
      const size = Math.min(5 + level, 20);
      const array = Array.from({ length: size }, () => Math.floor(Math.random() * 100));
      const k = Math.floor(Math.random() * size) + 1;
      
      return {
        problemStatement: `Given an array of integers [${array.join(', ')}], rotate it to the right by ${k} steps.`,
        inputs: { array, k },
        expectedOutput: rotateArray(array, k),
        testCases: generateTestCases('array_rotation', level),
        starterCode: {
          javascript: `function rotate(nums, k) {
    // Your code here
    return nums;
}`,
          python: `def rotate(nums, k):
    # Your code here
    return nums`,
          java: `public int[] rotate(int[] nums, int k) {
    // Your code here
    return nums;
}`,
          cpp: `vector<int> rotate(vector<int>& nums, int k) {
    // Your code here
    return nums;
}`
        }
      };
    }
  },
  {
    id: 'palindrome_check',
    title: 'Dynamic Palindrome Challenge',
    description: 'Check if a string is a palindrome with various constraints',
    difficulty: 'medium',
    timeLimit: 420,
    category: 'strings',
    generateChallenge: (level: number) => {
      const strings = [
        'racecar', 'A man a plan a canal Panama', 'race a car', 
        'hello world', 'Was it a car or a cat I saw', 'No lemons no melon'
      ];
      const string = strings[Math.floor(Math.random() * strings.length)];
      const ignoreCase = level > 2;
      const ignoreSpaces = level > 3;
      
      return {
        problemStatement: `Check if "${string}" is a palindrome.${ignoreCase ? ' Ignore case.' : ''}${ignoreSpaces ? ' Ignore spaces and punctuation.' : ''}`,
        inputs: { string, ignoreCase, ignoreSpaces },
        expectedOutput: isPalindrome(string, ignoreCase, ignoreSpaces),
        testCases: generateTestCases('palindrome_check', level),
        starterCode: {
          javascript: `function isPalindrome(s, ignoreCase = false, ignoreSpaces = false) {
    // Your code here
    return false;
}`,
          python: `def is_palindrome(s, ignore_case=False, ignore_spaces=False):
    # Your code here
    return False`,
          java: `public boolean isPalindrome(String s, boolean ignoreCase, boolean ignoreSpaces) {
    // Your code here
    return false;
}`,
          cpp: `bool isPalindrome(string s, bool ignoreCase = false, bool ignoreSpaces = false) {
    // Your code here
    return false;
}`
        }
      };
    }
  },
  {
    id: 'binary_search_variant',
    title: 'Advanced Binary Search',
    description: 'Find target in rotated sorted array',
    difficulty: 'hard',
    timeLimit: 600,
    category: 'algorithms',
    generateChallenge: (level: number) => {
      const size = Math.min(8 + level * 2, 30);
      const sortedArray = Array.from({ length: size }, (_, i) => i * 2 + 1);
      const rotatePoint = Math.floor(Math.random() * size);
      const rotatedArray = [...sortedArray.slice(rotatePoint), ...sortedArray.slice(0, rotatePoint)];
      const target = sortedArray[Math.floor(Math.random() * size)];
      
      return {
        problemStatement: `Search for ${target} in rotated sorted array [${rotatedArray.join(', ')}]. Return the index, or -1 if not found.`,
        inputs: { array: rotatedArray, target },
        expectedOutput: rotatedArray.indexOf(target),
        testCases: generateTestCases('binary_search_variant', level),
        starterCode: {
          javascript: `function search(nums, target) {
    // Your code here
    return -1;
}`,
          python: `def search(nums, target):
    # Your code here
    return -1`,
          java: `public int search(int[] nums, int target) {
    // Your code here
    return -1;
}`,
          cpp: `int search(vector<int>& nums, int target) {
    // Your code here
    return -1;
}`
        }
      };
    }
  },
  {
    id: 'tree_traversal',
    title: 'Dynamic Tree Traversal',
    description: 'Implement various tree traversal algorithms',
    difficulty: 'medium',
    timeLimit: 480,
    category: 'trees',
    generateChallenge: (level: number) => {
      const treeSize = Math.min(7 + level, 15);
      const tree = generateRandomTree(treeSize);
      const traversalTypes = ['inorder', 'preorder', 'postorder', 'levelorder'];
      const traversalType = traversalTypes[Math.floor(Math.random() * traversalTypes.length)];
      
      return {
        problemStatement: `Given a binary tree with values [${tree.values.join(', ')}], return the ${traversalType} traversal.`,
        inputs: { tree: tree.structure, traversalType },
        expectedOutput: getTraversal(tree.structure, traversalType),
        testCases: generateTestCases('tree_traversal', level),
        starterCode: {
          javascript: `class TreeNode {
    constructor(val, left, right) {
        this.val = val;
        this.left = left || null;
        this.right = right || null;
    }
}

function traverse(root, type) {
    // Your code here
    return [];
}`,
          python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def traverse(root, traversal_type):
    # Your code here
    return []`,
          java: `class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int val) { this.val = val; }
}

public List<Integer> traverse(TreeNode root, String type) {
    // Your code here
    return new ArrayList<>();
}`,
          cpp: `struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

vector<int> traverse(TreeNode* root, string type) {
    // Your code here
    return {};
}`
        }
      };
    }
  }
];

// Helper functions
function rotateArray(arr: number[], k: number): number[] {
  const n = arr.length;
  k = k % n;
  return [...arr.slice(n - k), ...arr.slice(0, n - k)];
}

function isPalindrome(s: string, ignoreCase: boolean, ignoreSpaces: boolean): boolean {
  let processed = s;
  if (ignoreCase) processed = processed.toLowerCase();
  if (ignoreSpaces) processed = processed.replace(/[^a-zA-Z0-9]/g, '');
  
  return processed === processed.split('').reverse().join('');
}

function generateRandomTree(size: number) {
  const values = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
  // Simplified tree structure for now
  return {
    values,
    structure: values // This would be a proper tree structure in a real implementation
  };
}

function getTraversal(tree: any, type: string): number[] {
  // Simplified traversal implementation
  return tree; // This would implement actual tree traversal
}

function generateTestCases(challengeId: string, level: number): any[] {
  // Generate additional test cases based on challenge type and level
  const baseTestCases = [];
  
  for (let i = 0; i < Math.min(3 + level, 10); i++) {
    // Generate test case based on challenge type
    baseTestCases.push({
      input: `test_input_${i}`,
      expected: `test_output_${i}`,
      hidden: i >= 2 // Hide some test cases
    });
  }
  
  return baseTestCases;
}

export async function POST(request: NextRequest) {
  try {
    const { action, userId, challengeType, userLevel } = await request.json();
    const { db } = await connectToDatabase();

    switch (action) {
      case 'generate_challenge':
        const template = challengeTemplates.find(t => t.id === challengeType) || 
                        challengeTemplates[Math.floor(Math.random() * challengeTemplates.length)];
        
        const challenge = template.generateChallenge(userLevel || 1);
        
        // Store challenge in database
        const challengeDoc = {
          userId,
          templateId: template.id,
          title: template.title,
          difficulty: template.difficulty,
          timeLimit: template.timeLimit,
          category: template.category,
          problemStatement: challenge.problemStatement,
          inputs: challenge.inputs,
          expectedOutput: challenge.expectedOutput,
          testCases: challenge.testCases,
          starterCode: challenge.starterCode,
          createdAt: new Date(),
          status: 'active',
          attempts: 0,
          solved: false
        };
        
        const result = await db.collection('dynamic_challenges').insertOne(challengeDoc);
        
        return NextResponse.json({
          success: true,
          challenge: {
            id: result.insertedId,
            ...challengeDoc
          }
        });

      case 'get_challenge':
        const { challengeId } = await request.json();
        const challengeData = await db.collection('dynamic_challenges').findOne({ _id: challengeId });
        
        if (!challengeData) {
          return NextResponse.json({ success: false, error: 'Challenge not found' });
        }
        
        return NextResponse.json({
          success: true,
          challenge: challengeData
        });

      case 'submit_solution':
        const { challengeId: submitChallengeId, code, language, executionTime } = await request.json();
        
        // Update challenge with solution
        await db.collection('dynamic_challenges').updateOne(
          { _id: submitChallengeId },
          {
            $set: {
              'solution.code': code,
              'solution.language': language,
              'solution.submittedAt': new Date(),
              'solution.executionTime': executionTime,
              solved: true
            },
            $inc: { attempts: 1 }
          }
        );
        
        // Award XP based on difficulty and performance
        const xpReward = calculateXPReward(template?.difficulty || 'medium', executionTime);
        
        return NextResponse.json({
          success: true,
          xpEarned: xpReward,
          message: 'Solution submitted successfully!'
        });

      case 'get_user_challenges':
        const userChallenges = await db.collection('dynamic_challenges')
          .find({ userId })
          .sort({ createdAt: -1 })
          .limit(20)
          .toArray();
        
        return NextResponse.json({
          success: true,
          challenges: userChallenges
        });

      default:
        return NextResponse.json({ success: false, error: 'Invalid action' });
    }
  } catch (error) {
    console.error('Dynamic challenges API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' });
  }
}

function calculateXPReward(difficulty: string, executionTime: number): number {
  const baseXP = {
    easy: 50,
    medium: 100,
    hard: 200
  };
  
  const base = baseXP[difficulty as keyof typeof baseXP] || 100;
  
  // Bonus for faster completion (max 50% bonus)
  const timeBonus = Math.max(0, Math.min(0.5, (300 - executionTime) / 600));
  
  return Math.round(base * (1 + timeBonus));
}
