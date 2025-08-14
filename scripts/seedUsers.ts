import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

import dbConnect from '../lib/mongodb';
import User from '../models/User';
import LiveBattle from '../models/LiveBattle';
import Problem from '../models/Problem';
import mongoose from 'mongoose';

interface SeedUser {
  name: string;
  username: string;
  email: string;
  avatar?: string;
  totalPoints: number;
  totalWins: number;
  totalLosses: number;
  isOnline: boolean;
  rank: number;
  bio?: string;
  location?: string;
  website?: string;
}

const sampleUsers: SeedUser[] = [
  {
    name: "Alex Rodriguez",
    username: "alexdev",
    email: "alex@example.com",
    avatar: "/avatars/alex.jpg",
    totalPoints: 2850,
    totalWins: 47,
    totalLosses: 8,
    isOnline: true,
    rank: 1,
    bio: "Full-stack developer passionate about competitive programming",
    location: "San Francisco, CA",
    website: "https://alexdev.io"
  },
  {
    name: "Sarah Chen",
    username: "sarahcodes",
    email: "sarah@example.com",
    avatar: "/avatars/sarah.jpg",
    totalPoints: 2750,
    totalWins: 42,
    totalLosses: 12,
    isOnline: false,
    rank: 2,
    bio: "AI/ML engineer and algorithm enthusiast",
    location: "Seattle, WA"
  },
  {
    name: "Michael Johnson",
    username: "mjtech",
    email: "michael@example.com",
    avatar: "/avatars/michael.jpg",
    totalPoints: 2650,
    totalWins: 38,
    totalLosses: 15,
    isOnline: true,
    rank: 3,
    bio: "Backend systems architect",
    location: "Austin, TX",
    website: "https://mjtech.dev"
  },
  {
    name: "Emma Wilson",
    username: "emmacoder",
    email: "emma@example.com",
    avatar: "/avatars/emma.jpg",
    totalPoints: 2450,
    totalWins: 35,
    totalLosses: 18,
    isOnline: true,
    rank: 4,
    bio: "Frontend developer and UI/UX enthusiast",
    location: "New York, NY"
  },
  {
    name: "David Kim",
    username: "davidk",
    email: "david@example.com",
    avatar: "/avatars/david.jpg",
    totalPoints: 2350,
    totalWins: 32,
    totalLosses: 20,
    isOnline: false,
    rank: 5,
    bio: "Data scientist and competitive programmer",
    location: "Boston, MA"
  },
  {
    name: "Lisa Thompson",
    username: "lisatech",
    email: "lisa@example.com",
    avatar: "/avatars/lisa.jpg",
    totalPoints: 2200,
    totalWins: 28,
    totalLosses: 22,
    isOnline: true,
    rank: 6,
    bio: "DevOps engineer and cloud architecture specialist",
    location: "Denver, CO"
  },
  {
    name: "James Martinez",
    username: "jamesm",
    email: "james@example.com",
    avatar: "/avatars/james.jpg",
    totalPoints: 2100,
    totalWins: 25,
    totalLosses: 25,
    isOnline: false,
    rank: 7,
    bio: "Mobile app developer",
    location: "Miami, FL"
  },
  {
    name: "Anna Petrov",
    username: "annapetrov",
    email: "anna@example.com",
    avatar: "/avatars/anna.jpg",
    totalPoints: 1950,
    totalWins: 22,
    totalLosses: 28,
    isOnline: true,
    rank: 8,
    bio: "Cybersecurity specialist and ethical hacker",
    location: "Chicago, IL"
  },
  {
    name: "Ryan O'Connor",
    username: "ryanoconnor",
    email: "ryan@example.com",
    avatar: "/avatars/ryan.jpg",
    totalPoints: 1850,
    totalWins: 20,
    totalLosses: 30,
    isOnline: false,
    rank: 9,
    bio: "Game developer and graphics programmer",
    location: "Los Angeles, CA",
    website: "https://ryangames.dev"
  },
  {
    name: "Sofia Gonzalez",
    username: "sofiag",
    email: "sofia@example.com",
    avatar: "/avatars/sofia.jpg",
    totalPoints: 1750,
    totalWins: 18,
    totalLosses: 32,
    isOnline: true,
    rank: 10,
    bio: "Machine learning researcher",
    location: "San Diego, CA"
  },
  {
    name: "Tom Bradley",
    username: "tombradley",
    email: "tom@example.com",
    avatar: "/avatars/tom.jpg",
    totalPoints: 1650,
    totalWins: 16,
    totalLosses: 34,
    isOnline: false,
    rank: 11,
    bio: "Blockchain developer",
    location: "Portland, OR"
  },
  {
    name: "Rachel Green",
    username: "rachelgreen",
    email: "rachel@example.com",
    avatar: "/avatars/rachel.jpg",
    totalPoints: 1550,
    totalWins: 14,
    totalLosses: 36,
    isOnline: true,
    rank: 12,
    bio: "Quality assurance engineer",
    location: "Nashville, TN"
  },
  {
    name: "Kevin Park",
    username: "kevinpark",
    email: "kevin@example.com",
    avatar: "/avatars/kevin.jpg",
    totalPoints: 1450,
    totalWins: 12,
    totalLosses: 38,
    isOnline: false,
    rank: 13,
    bio: "Systems administrator",
    location: "Phoenix, AZ"
  },
  {
    name: "Maria Santos",
    username: "mariasantos",
    email: "maria@example.com",
    avatar: "/avatars/maria.jpg",
    totalPoints: 1350,
    totalWins: 10,
    totalLosses: 40,
    isOnline: true,
    rank: 14,
    bio: "Database administrator",
    location: "Houston, TX"
  },
  {
    name: "Chris Wong",
    username: "chriswong",
    email: "chris@example.com",
    avatar: "/avatars/chris.jpg",
    totalPoints: 1250,
    totalWins: 8,
    totalLosses: 42,
    isOnline: false,
    rank: 15,
    bio: "Junior developer",
    location: "Las Vegas, NV"
  }
];

const sampleLiveBattles = [
  {
    battleId: "battle_live_1",
    battleMode: "quick-dual",
    status: "in_progress",
    duration: 1800,
    room: "room_live_1",
    spectators: [],
    isPublic: true,
    startTime: new Date(Date.now() - 600000) // Started 10 minutes ago
  },
  {
    battleId: "battle_live_2",
    battleMode: "minimalist-mind",
    status: "in_progress",
    duration: 2700,
    room: "room_live_2",
    spectators: [],
    isPublic: true,
    startTime: new Date(Date.now() - 300000) // Started 5 minutes ago
  },
  {
    battleId: "battle_live_3",
    battleMode: "mirror-arena",
    status: "waiting",
    duration: 1800,
    room: "room_live_3",
    spectators: [],
    isPublic: true,
    startTime: new Date(Date.now() + 300000) // Starting in 5 minutes
  }
];

async function seedUsersAndBattles() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await dbConnect();

    console.log('🗑️ Clearing existing users and battles (preserving problems)...');
    await User.deleteMany({});
    await LiveBattle.deleteMany({});

    console.log('👥 Creating users...');
    const createdUsers = await User.insertMany(sampleUsers);
    console.log(`✅ Created ${createdUsers.length} users`);

    // Get existing problems for battles
    const problems = await Problem.find().limit(3);
    console.log(`📚 Found ${problems.length} existing problems for battles`);
    if (problems.length === 0) {
      console.log('⚠️ No problems found. Please run the problems seed script first.');
      return;
    }

    console.log('⚔️ Creating live battles...');
    const battlesWithParticipants = sampleLiveBattles.map((battle, index) => {
      // Assign random users to battles
      const participantCount = Math.floor(Math.random() * 3) + 2; // 2-4 participants
      const selectedUsers = createdUsers
        .sort(() => 0.5 - Math.random())
        .slice(0, participantCount);

      return {
        ...battle,
        problem: problems[index % problems.length]._id,
        participants: selectedUsers.map(user => ({
          user: user._id,
          status: battle.status === 'in_progress' ? 'active' : 'waiting',
          score: battle.status === 'in_progress' ? Math.floor(Math.random() * 100) : 0,
          submissions: battle.status === 'in_progress' ? Math.floor(Math.random() * 5) : 0
        }))
      };
    });

    const createdBattles = await LiveBattle.insertMany(battlesWithParticipants);
    console.log(`✅ Created ${createdBattles.length} live battles`);

    console.log('📊 Seeding summary:');
    console.log(`- Users: ${createdUsers.length}`);
    console.log(`- Live Battles: ${createdBattles.length}`);
    console.log('');
    console.log('Top 5 users by points:');
    const topUsers = createdUsers
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .slice(0, 5);
    
    topUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.username} - ${user.totalPoints} points (${user.totalWins}W/${user.totalLosses}L)`);
    });

    console.log('\n✅ Database seeded successfully!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the seed function
if (require.main === module) {
  seedUsersAndBattles();
}

export default seedUsersAndBattles;
