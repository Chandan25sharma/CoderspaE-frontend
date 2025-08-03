const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/coderspae';

async function seedDatabase() {
  console.log('🌱 Starting database seeding...');
  
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db();
    
    // Create admin user
    const adminPassword = await bcrypt.hash('C@me311001', 12);
    const adminResult = await db.collection('users').findOneAndUpdate(
      { email: 'chandan@coderspae.com' },
      {
        $setOnInsert: {
          name: 'Chandan Sharma',
          email: 'chandan@coderspae.com',
          password: adminPassword,
          role: 'super-admin',
          username: 'chandan',
          isActive: true,
          createdAt: new Date()
        }
      },
      { upsert: true, returnDocument: 'after' }
    );
    
    const adminUser = adminResult.value || adminResult;
    console.log('✅ Admin user created/verified');

    // Create sample users (check if they exist first)
    const existingUsers = await db.collection('users').find({
      email: { $in: ['john@example.com', 'jane@example.com'] }
    }).toArray();
    
    if (existingUsers.length === 0) {
      await db.collection('users').insertMany([
        {
          name: 'John Doe',
          email: 'john@example.com',
          password: await bcrypt.hash('password123', 12),
          role: 'user',
          username: 'johndoe',
          isActive: true,
          stats: {
            battles: 45,
            wins: 32,
            rating: 1250
          },
          createdAt: new Date()
        },
        {
          name: 'Jane Smith',
          email: 'jane@example.com',
          password: await bcrypt.hash('password123', 12),
          role: 'premium',
          username: 'janesmith',
          isActive: true,
          stats: {
            battles: 78,
            wins: 58,
            rating: 1580
          },
          createdAt: new Date()
        }
      ]);
      console.log('✅ Sample users created');
    } else {
      console.log('✅ Sample users already exist');
    }

    // Create practice challenges (check if they exist first)
    const existingPractices = await db.collection('practices').find({
      title: { $in: ['Two Sum Problem', 'Binary Tree Traversal'] }
    }).toArray();
    
    if (existingPractices.length === 0) {
      await db.collection('practices').insertMany([
      {
        title: 'Two Sum Problem',
        description: 'Find two numbers in an array that add up to a target sum',
        difficulty: 'Beginner',
        language: 'JavaScript',
        category: 'Array',
        timeLimit: 30,
        problemStatement: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

Example:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].`,
        starterCode: `function twoSum(nums, target) {
    // Your solution here
}`,
        testCases: [
          { input: '[2,7,11,15], 9', expectedOutput: '[0,1]' },
          { input: '[3,2,4], 6', expectedOutput: '[1,2]' },
          { input: '[3,3], 6', expectedOutput: '[0,1]' }
        ],
        hints: ['Use a hash map to store values and their indices', 'For each number, check if target - number exists in the map'],
        tags: ['array', 'hash-table', 'easy'],
        points: 100,
        isActive: true,
        createdBy: adminUser._id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Binary Tree Traversal',
        description: 'Implement in-order traversal of a binary tree',
        difficulty: 'Intermediate',
        language: 'Python',
        category: 'Tree',
        timeLimit: 45,
        problemStatement: `Given the root of a binary tree, return the inorder traversal of its nodes' values.

Inorder traversal visits nodes in this order: left subtree, root, right subtree.

Example:
Input: root = [1,null,2,3]
Output: [1,3,2]`,
        starterCode: `def inorderTraversal(root):
    # Your solution here
    pass`,
        testCases: [
          { input: '[1,null,2,3]', expectedOutput: '[1,3,2]' },
          { input: '[]', expectedOutput: '[]' },
          { input: '[1]', expectedOutput: '[1]' }
        ],
        hints: ['Use recursion or stack for iterative approach', 'Process left subtree, then root, then right subtree'],
        tags: ['tree', 'traversal', 'recursion'],
        points: 150,
        isActive: true,
        createdBy: adminUser._id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
    console.log('✅ Sample practice challenges created');
    } else {
      console.log('✅ Sample practice challenges already exist');
    }

    // Create tournaments
    await db.collection('tournaments').insertMany([
      {
        title: 'CodeClash World Championship 2024',
        description: 'The ultimate coding competition with $100,000 prize pool',
        type: 'Single Elimination',
        format: '1v1',
        maxParticipants: 256,
        prizePool: {
          total: 100000,
          currency: 'USD',
          distribution: [
            { position: 1, amount: 50000, percentage: 50 },
            { position: 2, amount: 25000, percentage: 25 },
            { position: 3, amount: 15000, percentage: 15 },
            { position: 4, amount: 10000, percentage: 10 }
          ]
        },
        registrationStart: new Date('2024-08-01'),
        registrationEnd: new Date('2024-08-15'),
        tournamentStart: new Date('2024-08-20'),
        tournamentEnd: new Date('2024-08-25'),
        status: 'Registration Open',
        difficulty: 'Expert',
        languages: ['JavaScript', 'Python', 'Java', 'C++'],
        rules: {
          timeLimit: 60,
          allowedLanguages: ['JavaScript', 'Python', 'Java', 'C++'],
          maxTeamSize: 1,
          codeReview: false,
          liveStreaming: true
        },
        participants: [],
        isPublic: true,
        requiresApproval: false,
        createdBy: adminUser._id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
    console.log('✅ Sample tournaments created');

    // Create battle modes
    await db.collection('battlemodes').insertMany([
      {
        name: 'Mirror Arena',
        slug: 'mirror-arena',
        description: 'Both players solve the same problem simultaneously',
        type: 'Mirror Arena',
        difficulty: 'Intermediate',
        rules: {
          timeLimit: 30,
          maxPlayers: 2,
          minPlayers: 2,
          allowedLanguages: ['JavaScript', 'Python', 'Java'],
          scoring: 'Time'
        },
        configuration: {
          mirrorArena: {
            sameCode: true,
            realTimeSync: true
          }
        },
        featured: true,
        icon: '⚔️',
        color: '#3B82F6',
        isActive: true,
        statistics: {
          totalGames: 0,
          totalPlayers: 0,
          averageRating: 0
        },
        createdBy: adminUser._id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Code Arena: Battle with Boosts',
        slug: 'code-arena',
        description: 'Fast-paced coding with power-ups and boosts',
        type: 'Code Arena',
        difficulty: 'Advanced',
        rules: {
          timeLimit: 20,
          maxPlayers: 4,
          minPlayers: 2,
          allowedLanguages: ['JavaScript', 'Python', 'Java', 'C++'],
          scoring: 'Custom'
        },
        configuration: {
          codeArena: {
            boosts: [
              { name: 'Speed Boost', effect: 'Increase typing speed by 25%', duration: 60 },
              { name: 'Hint Reveal', effect: 'Reveal one hint', duration: 0 },
              { name: 'Time Freeze', effect: 'Freeze opponents timer for 10s', duration: 10 }
            ],
            powerUps: ['Double Points', 'Shield', 'Sabotage']
          }
        },
        featured: true,
        icon: '🚀',
        color: '#8B5CF6',
        isActive: true,
        statistics: {
          totalGames: 0,
          totalPlayers: 0,
          averageRating: 0
        },
        createdBy: adminUser._id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
    console.log('✅ Sample battle modes created');

    // Create announcements
    await db.collection('announcements').insertMany([
      {
        title: 'Welcome to CoderspaE!',
        content: 'We are excited to launch the ultimate coding battle platform. Join tournaments, practice challenges, and compete with developers worldwide!',
        type: 'General',
        priority: 'High',
        target: 'All Users',
        display: {
          showOnHomepage: true,
          showInNavbar: false,
          showAsPopup: false
        },
        status: 'Published',
        isSticky: false,
        statistics: {
          views: 0,
          clicks: 0,
          reactions: [],
          comments: 0,
          acknowledgments: 0
        },
        createdBy: adminUser._id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'CodeClash Championship Registration Open',
        content: 'Registration is now open for our biggest tournament yet! $100,000 prize pool awaits. Register before August 15th.',
        type: 'Tournament',
        priority: 'Critical',
        target: 'All Users',
        display: {
          showOnHomepage: true,
          showInNavbar: true,
          showAsPopup: true
        },
        status: 'Published',
        isSticky: true,
        statistics: {
          views: 0,
          clicks: 0,
          reactions: [],
          comments: 0,
          acknowledgments: 0
        },
        createdBy: adminUser._id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
    console.log('✅ Sample announcements created');

    console.log('🎉 Database seeding completed successfully!');
    console.log(`
📊 Summary:
- Admin User: chandan@coderspae.com
- Users: 2
- Practice Challenges: 2
- Battle Modes: 2
- Tournaments: 1
- Announcements: 2

🔐 Admin Login:
Email: chandan@coderspae.com
Password: C@me311001

📱 Access the admin panel at: http://localhost:3000/admin/login
    `);

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await client.close();
  }
}

seedDatabase();
