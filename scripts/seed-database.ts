import { connectDB } from '../lib/mongodb';
import { Practice } from '../models/Practice';
import { Tournament } from '../models/Tournament';
import { BattleMode } from '../models/BattleMode';
import { Team } from '../models/Team';
import { Announcement } from '../models/Announcement';
import { Advertisement } from '../models/Advertisement';
import User from '../models/User';
import { createAdmin } from '../lib/admin-auth';

async function seedDatabase() {
  console.log('🌱 Starting database seeding...');
  
  try {
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Create admin user if not exists
    const adminUser = await createAdmin({
      email: 'chandan@coderspae.com',
      password: 'C@me311001',
      name: 'Chandan Sharma',
      role: 'super-admin',
      status: 'active',
      permissions: ['all']
    });
    console.log('✅ Admin user created/verified');

    // Create regular users for demonstration
    const users = await User.create([
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user',
        username: 'johndoe',
        stats: {
          battles: 45,
          wins: 32,
          rating: 1250
        }
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        role: 'premium',
        username: 'janesmith',
        stats: {
          battles: 78,
          wins: 58,
          rating: 1580
        }
      }
    ]);
    console.log('✅ Sample users created');

    // Create practice challenges
    const practices = await Practice.create([
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
        createdBy: adminUser.id
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
        createdBy: adminUser.id
      }
    ]);
    console.log('✅ Sample practice challenges created');

    // Create battle modes
    const battleModes = await BattleMode.create([
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
        challenges: [practices[0]._id],
        featured: true,
        icon: '⚔️',
        color: '#3B82F6',
        createdBy: adminUser.id
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
        challenges: [practices[1]._id],
        featured: true,
        icon: '🚀',
        color: '#8B5CF6',
        createdBy: adminUser.id
      }
    ]);
    console.log('✅ Sample battle modes created');

    // Create tournaments
    const tournaments = await Tournament.create([
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
        challenges: [practices[0]._id, practices[1]._id],
        sponsors: [
          { name: 'CoderspaE', tier: 'Title', logo: '/logo.png', website: 'https://coderspae.com' },
          { name: 'TechCorp', tier: 'Gold', logo: '/sponsors/techcorp.png', website: 'https://techcorp.com' }
        ],
        createdBy: adminUser.id
      }
    ]);
    console.log('✅ Sample tournaments created');

    // Create teams
    const teams = await Team.create([
      {
        name: 'Code Warriors',
        description: 'Elite coding team focused on competitive programming',
        captain: users[0]._id,
        members: [
          { user: users[0]._id, role: 'Captain', permissions: { canInvite: true, canKick: true, canEditTeam: true } },
          { user: users[1]._id, role: 'Member' }
        ],
        statistics: {
          totalBattles: 25,
          wins: 18,
          losses: 6,
          draws: 1,
          rating: 1450
        }
      }
    ]);
    console.log('✅ Sample teams created');

    // Create announcements
    const announcements = await Announcement.create([
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
        createdBy: adminUser.id
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
        createdBy: adminUser.id
      }
    ]);
    console.log('✅ Sample announcements created');

    // Create advertisements
    const advertisements = await Advertisement.create([
      {
        title: 'Premium Membership Offer',
        description: 'Upgrade to premium and get exclusive access to advanced challenges and tournaments',
        type: 'Banner',
        format: 'Image',
        content: {
          imageUrl: '/ads/premium-offer.jpg',
          clickUrl: '/upgrade',
          altText: 'Upgrade to Premium'
        },
        targeting: {
          userTypes: ['Registered'],
          skillLevels: ['Intermediate', 'Advanced']
        },
        placement: {
          pages: ['Home', 'Practice'],
          position: 'Header',
          priority: 5
        },
        scheduling: {
          startDate: new Date('2024-08-01'),
          endDate: new Date('2024-12-31')
        },
        budget: {
          type: 'CPM',
          amount: 5.0,
          currency: 'USD',
          totalBudget: 10000
        },
        advertiser: {
          name: 'CoderspaE Internal',
          email: 'ads@coderspae.com'
        },
        approval: {
          status: 'Approved',
          reviewedBy: adminUser.id,
          reviewedAt: new Date()
        },
        status: 'Active',
        createdBy: adminUser.id
      }
    ]);
    console.log('✅ Sample advertisements created');

    console.log('🎉 Database seeding completed successfully!');
    console.log(`
📊 Summary:
- Admin User: ${adminUser.email}
- Users: ${users.length}
- Practice Challenges: ${practices.length}
- Battle Modes: ${battleModes.length}
- Tournaments: ${tournaments.length}
- Teams: ${teams.length}
- Announcements: ${announcements.length}
- Advertisements: ${advertisements.length}

🔐 Admin Login:
Email: chandan@coderspae.com
Password: C@me311001
    `);

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}

// Run seeder if called directly
if (require.main === module) {
  seedDatabase().then(() => process.exit(0));
}

export default seedDatabase;
