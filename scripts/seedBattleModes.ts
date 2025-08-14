import { config } from 'dotenv';
import { connectDB } from '../lib/mongodb';
import { BattleMode } from '../models/DatabaseSchemas';

// Load environment variables
config({ path: '.env.local' });

// Initial battle modes data
const battleModes = [
  {
    name: 'quick-battle',
    displayName: 'Quick Battle',
    description: 'Fast-paced coding challenge with immediate results. Perfect for quick skill testing.',
    maxParticipants: 2,
    minParticipants: 2,
    timeLimit: 15,
    pointsMultiplier: 1.0,
    rules: [
      'Solve the problem within 15 minutes',
      'First correct solution wins',
      'Code efficiency matters',
      'Real-time scoring'
    ],
    features: {
      cameraRequired: false,
      voiceRequired: false,
      teamBased: false,
      liveCoding: true,
      screenShare: false
    },
    isActive: true
  },
  {
    name: 'minimalist-mind',
    displayName: 'Minimalist Mind',
    description: 'Code with minimal lines and maximum efficiency. Every character counts.',
    maxParticipants: 4,
    minParticipants: 2,
    timeLimit: 20,
    pointsMultiplier: 1.2,
    rules: [
      'Solve with minimum lines of code',
      'Code golf principles apply',
      'Readability vs efficiency trade-off',
      'Bonus points for clever solutions'
    ],
    features: {
      cameraRequired: false,
      voiceRequired: false,
      teamBased: false,
      liveCoding: true,
      screenShare: false
    },
    isActive: true
  },
  {
    name: 'narrative-mode',
    displayName: 'Narrative Mode',
    description: 'Story-driven coding challenges with immersive problem scenarios.',
    maxParticipants: 6,
    minParticipants: 2,
    timeLimit: 30,
    pointsMultiplier: 1.3,
    rules: [
      'Follow the story narrative',
      'Multiple chapters/problems',
      'Creative problem solving',
      'Bonus for story completion'
    ],
    features: {
      cameraRequired: false,
      voiceRequired: false,
      teamBased: false,
      liveCoding: true,
      screenShare: true
    },
    isActive: true
  },
  {
    name: 'team-clash',
    displayName: 'Team Clash',
    description: 'Team-based battles where collaboration and strategy determine victory.',
    maxParticipants: 8,
    minParticipants: 4,
    timeLimit: 45,
    pointsMultiplier: 1.5,
    rules: [
      'Teams of 2-4 members',
      'Collaborative coding',
      'Shared problem solving',
      'Team communication is key'
    ],
    features: {
      cameraRequired: true,
      voiceRequired: true,
      teamBased: true,
      liveCoding: true,
      screenShare: true
    },
    isActive: true
  },
  {
    name: 'attack-defend',
    displayName: 'Attack & Defend',
    description: 'Competitive mode where you solve problems while defending against opponent attacks.',
    maxParticipants: 2,
    minParticipants: 2,
    timeLimit: 25,
    pointsMultiplier: 1.4,
    rules: [
      'Solve your assigned problem',
      'Send challenges to opponent',
      'Defend against incoming attacks',
      'Strategic timing crucial'
    ],
    features: {
      cameraRequired: true,
      voiceRequired: false,
      teamBased: false,
      liveCoding: true,
      screenShare: false
    },
    isActive: true
  },
  {
    name: '1v1-quick-dual',
    displayName: '1v1 Quick Dual',
    description: 'Classic head-to-head programming duel. Pure skill vs skill.',
    maxParticipants: 2,
    minParticipants: 2,
    timeLimit: 20,
    pointsMultiplier: 1.1,
    rules: [
      'Direct 1v1 competition',
      'Same problem for both',
      'Speed and accuracy matter',
      'Winner takes all points'
    ],
    features: {
      cameraRequired: false,
      voiceRequired: false,
      teamBased: false,
      liveCoding: true,
      screenShare: false
    },
    isActive: true
  }
];

export async function seedBattleModes() {
  try {
    await connectDB();
    
    // Check if battle modes already exist
    const existingModes = await BattleMode.find({});
    
    if (existingModes.length === 0) {
      await BattleMode.insertMany(battleModes);
      console.log('✅ Battle modes seeded successfully');
    } else {
      console.log('ℹ️ Battle modes already exist, skipping seed');
    }
  } catch (error) {
    console.error('❌ Error seeding battle modes:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seedBattleModes()
    .then(() => {
      console.log('Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}
