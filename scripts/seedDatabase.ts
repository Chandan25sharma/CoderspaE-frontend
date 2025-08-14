// Set environment variables directly
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://coderspae-user:yWgCu64U3kBN1rcm@alunguai.jplvz2e.mongodb.net/?retryWrites=true&w=majority&appName=AlunguAi';

import { connectDB } from '../lib/mongodb';
import { User, Problem, BattleMode } from '../models/DatabaseSchemas';

// Sample users data
const sampleUsers = [
  {
    username: 'sarahcodes',
    email: 'sarah@example.com',
    displayName: 'Sarah Chen',
    avatar: '',
    country: 'USA',
    bio: 'Full-stack developer passionate about algorithms',
    totalPoints: 2500,
    rank: 1,
    tier: 'Gold',
    isOnline: true,
    battleStats: {
      totalBattles: 45,
      wins: 32,
      losses: 13,
      draws: 0,
      winRate: 71.1,
      currentStreak: 5,
      longestStreak: 8,
      quickBattleStats: { played: 15, won: 12, points: 800 },
      minimalistMindStats: { played: 10, won: 7, points: 500 },
      narrativeModeStats: { played: 8, won: 6, points: 600 },
      teamClashStats: { played: 6, won: 4, points: 400 },
      attackDefendStats: { played: 4, won: 2, points: 150 },
      quickDualStats: { played: 2, won: 1, points: 50 }
    }
  },
  {
    username: 'alexcode',
    email: 'alex@example.com',
    displayName: 'Alex Rodriguez',
    avatar: '',
    country: 'Spain',
    bio: 'Competitive programmer and algorithm enthusiast',
    totalPoints: 2200,
    rank: 2,
    tier: 'Gold',
    isOnline: false,
    battleStats: {
      totalBattles: 38,
      wins: 25,
      losses: 13,
      draws: 0,
      winRate: 65.8,
      currentStreak: 2,
      longestStreak: 6,
      quickBattleStats: { played: 12, won: 8, points: 650 },
      minimalistMindStats: { played: 8, won: 5, points: 400 },
      narrativeModeStats: { played: 6, won: 4, points: 450 },
      teamClashStats: { played: 7, won: 5, points: 500 },
      attackDefendStats: { played: 3, won: 2, points: 120 },
      quickDualStats: { played: 2, won: 1, points: 80 }
    }
  },
  {
    username: 'devmike',
    email: 'mike@example.com',
    displayName: 'Mike Johnson',
    avatar: '',
    country: 'Canada',
    bio: 'Software engineer with a passion for clean code',
    totalPoints: 1800,
    rank: 3,
    tier: 'Silver',
    isOnline: true,
    battleStats: {
      totalBattles: 32,
      wins: 18,
      losses: 14,
      draws: 0,
      winRate: 56.3,
      currentStreak: 1,
      longestStreak: 4,
      quickBattleStats: { played: 10, won: 6, points: 450 },
      minimalistMindStats: { played: 6, won: 3, points: 200 },
      narrativeModeStats: { played: 8, won: 5, points: 400 },
      teamClashStats: { played: 5, won: 3, points: 300 },
      attackDefendStats: { played: 2, won: 1, points: 80 },
      quickDualStats: { played: 1, won: 0, points: 0 }
    }
  },
  {
    username: 'codequeen',
    email: 'emma@example.com',
    displayName: 'Emma Thompson',
    avatar: '',
    country: 'UK',
    bio: 'Frontend specialist with backend skills',
    totalPoints: 1650,
    rank: 4,
    tier: 'Silver',
    isOnline: false,
    battleStats: {
      totalBattles: 28,
      wins: 16,
      losses: 12,
      draws: 0,
      winRate: 57.1,
      currentStreak: 3,
      longestStreak: 5,
      quickBattleStats: { played: 8, won: 5, points: 400 },
      minimalistMindStats: { played: 7, won: 4, points: 350 },
      narrativeModeStats: { played: 6, won: 3, points: 300 },
      teamClashStats: { played: 4, won: 3, points: 350 },
      attackDefendStats: { played: 2, won: 1, points: 120 },
      quickDualStats: { played: 1, won: 0, points: 30 }
    }
  },
  {
    username: 'pythonpro',
    email: 'raj@example.com',
    displayName: 'Raj Patel',
    avatar: '',
    country: 'India',
    bio: 'Python developer and machine learning enthusiast',
    totalPoints: 1400,
    rank: 5,
    tier: 'Silver',
    isOnline: true,
    battleStats: {
      totalBattles: 25,
      wins: 13,
      losses: 12,
      draws: 0,
      winRate: 52.0,
      currentStreak: 0,
      longestStreak: 3,
      quickBattleStats: { played: 7, won: 4, points: 300 },
      minimalistMindStats: { played: 5, won: 2, points: 150 },
      narrativeModeStats: { played: 6, won: 4, points: 400 },
      teamClashStats: { played: 4, won: 2, points: 200 },
      attackDefendStats: { played: 2, won: 1, points: 100 },
      quickDualStats: { played: 1, won: 0, points: 20 }
    }
  }
];

// Sample problems data
const sampleProblems = [
  {
    title: 'Two Sum',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    difficulty: 'Easy',
    categories: ['Array', 'Hash Table'],
    battleModes: ['quick-battle', '1v1-quick-dual'],
    tags: ['beginner', 'fundamentals'],
    timeLimit: 15,
    constraints: 'Only one valid answer exists.',
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      }
    ],
    testCases: [
      { input: '[2,7,11,15]\n9', expectedOutput: '[0,1]', isHidden: false },
      { input: '[3,2,4]\n6', expectedOutput: '[1,2]', isHidden: false },
      { input: '[3,3]\n6', expectedOutput: '[0,1]', isHidden: true }
    ],
    isActive: true,
    isApproved: true,
    rating: 4.5,
    solvedBy: 1250,
    upvotes: 45,
    downvotes: 3
  },
  {
    title: 'Palindrome Check',
    description: 'Given a string, determine if it is a palindrome, considering only alphanumeric characters and ignoring cases.',
    difficulty: 'Easy',
    categories: ['String', 'Two Pointers'],
    battleModes: ['quick-battle', 'minimalist-mind', '1v1-quick-dual'],
    tags: ['string-manipulation', 'pointers'],
    timeLimit: 20,
    constraints: 'The string consists only of printable ASCII characters.',
    examples: [
      {
        input: '"A man a plan a canal Panama"',
        output: 'true',
        explanation: 'After removing non-alphanumeric characters and converting to lowercase: "amanaplanacanalpanama" is a palindrome.'
      }
    ],
    testCases: [
      { input: '"A man, a plan, a canal: Panama"', expectedOutput: 'true', isHidden: false },
      { input: '"race a car"', expectedOutput: 'false', isHidden: false },
      { input: '""', expectedOutput: 'true', isHidden: true }
    ],
    isActive: true,
    isApproved: true,
    rating: 4.2,
    solvedBy: 980,
    upvotes: 38,
    downvotes: 2
  },
  {
    title: 'Binary Tree Maximum Path Sum',
    description: 'A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. Find the maximum sum of any non-empty path.',
    difficulty: 'Hard',
    categories: ['Binary Tree', 'Dynamic Programming', 'Tree'],
    battleModes: ['narrative-mode', 'attack-defend'],
    tags: ['advanced', 'tree-traversal', 'recursion'],
    timeLimit: 45,
    constraints: 'The number of nodes in the tree is in the range [1, 3 * 10^4].',
    examples: [
      {
        input: 'root = [1,2,3]',
        output: '6',
        explanation: 'The optimal path is 2 -> 1 -> 3 with a path sum of 2 + 1 + 3 = 6.'
      }
    ],
    testCases: [
      { input: '[1,2,3]', expectedOutput: '6', isHidden: false },
      { input: '[-10,9,20,null,null,15,7]', expectedOutput: '42', isHidden: false },
      { input: '[-3]', expectedOutput: '-3', isHidden: true }
    ],
    isActive: true,
    isApproved: true,
    rating: 4.8,
    solvedBy: 234,
    upvotes: 78,
    downvotes: 12
  },
  {
    title: 'Team Project Scheduler',
    description: 'Given a list of project tasks and their dependencies, schedule them optimally for a team of developers. Each task has a duration and required skills.',
    difficulty: 'Medium',
    categories: ['Graph', 'Scheduling', 'Optimization'],
    battleModes: ['team-clash', 'narrative-mode'],
    tags: ['teamwork', 'project-management', 'graph-algorithms'],
    timeLimit: 35,
    constraints: 'Tasks must respect dependency order and team member availability.',
    examples: [
      {
        input: 'tasks = [["frontend", 5, ["js", "css"]], ["backend", 8, ["python"]]], dependencies = [["backend", "frontend"]]',
        output: 'Schedule: backend (days 1-8), frontend (days 9-13)',
        explanation: 'Backend must complete before frontend can start.'
      }
    ],
    testCases: [
      { input: 'tasks=[["A",3,["skill1"]], ["B",2,["skill2"]]], deps=[]', expectedOutput: 'optimal_schedule', isHidden: false }
    ],
    isActive: true,
    isApproved: true,
    rating: 4.3,
    solvedBy: 445,
    upvotes: 55,
    downvotes: 7
  },
  {
    title: 'Code Golf: Fibonacci',
    description: 'Implement the Fibonacci sequence in the shortest possible code. Every character counts!',
    difficulty: 'Medium',
    categories: ['Math', 'Optimization'],
    battleModes: ['minimalist-mind'],
    tags: ['code-golf', 'mathematical', 'optimization'],
    timeLimit: 25,
    constraints: 'Minimize code length while maintaining correctness.',
    examples: [
      {
        input: 'n = 10',
        output: '55',
        explanation: 'The 10th Fibonacci number is 55.'
      }
    ],
    testCases: [
      { input: '10', expectedOutput: '55', isHidden: false },
      { input: '1', expectedOutput: '1', isHidden: false },
      { input: '20', expectedOutput: '6765', isHidden: true }
    ],
    isActive: true,
    isApproved: true,
    rating: 4.6,
    solvedBy: 567,
    upvotes: 67,
    downvotes: 8
  }
];

export async function seedDatabase() {
  try {
    await connectDB();
    console.log('🌱 Starting database seeding...');

    // Seed Battle Modes first
    console.log('📝 Seeding battle modes...');
    const existingModes = await BattleMode.find({});
    if (existingModes.length === 0) {
      // Import and run battle mode seeding
      const { seedBattleModes } = await import('./seedBattleModes');
      await seedBattleModes();
    } else {
      console.log('ℹ️ Battle modes already exist, skipping...');
    }

    // Seed Users
    console.log('👥 Seeding users...');
    const existingUsers = await User.find({});
    if (existingUsers.length === 0) {
      const createdUsers = await User.insertMany(sampleUsers);
      console.log(`✅ Created ${createdUsers.length} users`);
    } else {
      console.log('ℹ️ Users already exist, skipping...');
    }

    // Seed Problems
    console.log('🧩 Seeding problems...');
    const existingProblems = await Problem.find({});
    if (existingProblems.length === 0) {
      // Get a sample user to be the creator
      const sampleUser = await User.findOne({ username: 'sarahcodes' });
      
      const problemsWithCreator = sampleProblems.map(problem => ({
        ...problem,
        createdBy: sampleUser?._id
      }));
      
      const createdProblems = await Problem.insertMany(problemsWithCreator);
      console.log(`✅ Created ${createdProblems.length} problems`);
    } else {
      console.log('ℹ️ Problems already exist, skipping...');
    }

    console.log('🎉 Database seeding completed successfully!');
    
    // Display summary
    const userCount = await User.countDocuments({});
    const problemCount = await Problem.countDocuments({});
    const modeCount = await BattleMode.countDocuments({});
    
    console.log('\n📊 Database Summary:');
    console.log(`👥 Users: ${userCount}`);
    console.log(`🧩 Problems: ${problemCount}`);
    console.log(`⚔️ Battle Modes: ${modeCount}`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}
