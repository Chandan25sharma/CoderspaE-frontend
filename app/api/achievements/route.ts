import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'battle' | 'challenge' | 'social' | 'streak' | 'milestone';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  requirements: {
    type: string;
    value: number;
    operator: 'gte' | 'eq' | 'lte';
  }[];
  rewards: {
    xp: number;
    title?: string;
    badge?: string;
    powerUps?: string[];
  };
  isSecret: boolean;
  unlockedAt?: Date;
}

const achievementDefinitions: Achievement[] = [
  // Battle Achievements
  {
    id: 'first_victory',
    name: 'First Victory',
    description: 'Win your first battle',
    icon: '🏆',
    category: 'battle',
    tier: 'bronze',
    requirements: [{ type: 'battles_won', value: 1, operator: 'gte' }],
    rewards: { xp: 100, title: 'Battle Rookie' },
    isSecret: false
  },
  {
    id: 'battle_veteran',
    name: 'Battle Veteran',
    description: 'Win 50 battles',
    icon: '⚔️',
    category: 'battle',
    tier: 'gold',
    requirements: [{ type: 'battles_won', value: 50, operator: 'gte' }],
    rewards: { xp: 1000, title: 'Battle Veteran', powerUps: ['time_boost'] },
    isSecret: false
  },
  {
    id: 'battle_legend',
    name: 'Battle Legend',
    description: 'Win 200 battles',
    icon: '👑',
    category: 'battle',
    tier: 'diamond',
    requirements: [{ type: 'battles_won', value: 200, operator: 'gte' }],
    rewards: { xp: 5000, title: 'Battle Legend', powerUps: ['mega_boost', 'ai_hint'] },
    isSecret: false
  },
  
  // Streak Achievements
  {
    id: 'winning_streak_5',
    name: 'Hot Streak',
    description: 'Win 5 battles in a row',
    icon: '🔥',
    category: 'streak',
    tier: 'silver',
    requirements: [{ type: 'current_streak', value: 5, operator: 'gte' }],
    rewards: { xp: 250, badge: 'streak_master' },
    isSecret: false
  },
  {
    id: 'winning_streak_15',
    name: 'Unstoppable',
    description: 'Win 15 battles in a row',
    icon: '🌟',
    category: 'streak',
    tier: 'platinum',
    requirements: [{ type: 'current_streak', value: 15, operator: 'gte' }],
    rewards: { xp: 1500, title: 'Unstoppable Force' },
    isSecret: false
  },

  // Challenge Achievements
  {
    id: 'problem_solver',
    name: 'Problem Solver',
    description: 'Complete 100 challenges',
    icon: '🧩',
    category: 'challenge',
    tier: 'gold',
    requirements: [{ type: 'challenges_completed', value: 100, operator: 'gte' }],
    rewards: { xp: 800, title: 'Problem Solver' },
    isSecret: false
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Complete a challenge in under 2 minutes',
    icon: '⚡',
    category: 'challenge',
    tier: 'silver',
    requirements: [{ type: 'fastest_solve_time', value: 120, operator: 'lte' }],
    rewards: { xp: 300, powerUps: ['speed_boost'] },
    isSecret: false
  },

  // Milestone Achievements
  {
    id: 'level_10',
    name: 'Rising Star',
    description: 'Reach level 10',
    icon: '⭐',
    category: 'milestone',
    tier: 'bronze',
    requirements: [{ type: 'level', value: 10, operator: 'gte' }],
    rewards: { xp: 500, title: 'Rising Star' },
    isSecret: false
  },
  {
    id: 'level_50',
    name: 'Master Coder',
    description: 'Reach level 50',
    icon: '🎯',
    category: 'milestone',
    tier: 'platinum',
    requirements: [{ type: 'level', value: 50, operator: 'gte' }],
    rewards: { xp: 2500, title: 'Master Coder', powerUps: ['all_access'] },
    isSecret: false
  },

  // Secret Achievements
  {
    id: 'konami_code',
    name: 'Classic Gamer',
    description: 'Enter the legendary code sequence',
    icon: '🎮',
    category: 'social',
    tier: 'gold',
    requirements: [{ type: 'konami_code_entered', value: 1, operator: 'gte' }],
    rewards: { xp: 1000, title: 'Classic Gamer', powerUps: ['retro_theme'] },
    isSecret: true
  },
  {
    id: 'midnight_coder',
    name: 'Midnight Coder',
    description: 'Complete a battle between 12 AM and 3 AM',
    icon: '🌙',
    category: 'battle',
    tier: 'silver',
    requirements: [{ type: 'midnight_battle', value: 1, operator: 'gte' }],
    rewards: { xp: 400, title: 'Night Owl' },
    isSecret: true
  }
];

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const user = await db.collection('users').findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get user's unlocked achievements
    const userAchievements = await db.collection('user_achievements')
      .find({ userId: user._id })
      .toArray();

    const unlockedIds = userAchievements.map(ua => ua.achievementId);

    // Combine with achievement definitions
    const achievements = achievementDefinitions.map(achievement => ({
      ...achievement,
      unlocked: unlockedIds.includes(achievement.id),
      unlockedAt: userAchievements.find(ua => ua.achievementId === achievement.id)?.unlockedAt
    }));

    // Filter out secret achievements that aren't unlocked
    const visibleAchievements = achievements.filter(a => !a.isSecret || a.unlocked);

    return NextResponse.json({
      success: true,
      achievements: visibleAchievements,
      stats: {
        total: achievementDefinitions.length,
        unlocked: unlockedIds.length,
        progress: (unlockedIds.length / achievementDefinitions.length) * 100
      }
    });
  } catch (error) {
    console.error('Get achievements error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, data } = await request.json();
    const { db } = await connectToDatabase();

    const user = await db.collection('users').findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    switch (action) {
      case 'check_achievements':
        return await checkAndUnlockAchievements(db, user._id, data);
      
      case 'unlock_secret':
        return await unlockSecretAchievement(db, user._id, data);
      
      case 'claim_rewards':
        return await claimAchievementRewards(db, user._id, data.achievementId);
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Achievement action error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function checkAndUnlockAchievements(db: any, userId: ObjectId, userStats: any) {
  const newlyUnlocked = [];
  
  // Get already unlocked achievements
  const userAchievements = await db.collection('user_achievements')
    .find({ userId })
    .toArray();
  
  const unlockedIds = userAchievements.map(ua => ua.achievementId);

  // Check each achievement
  for (const achievement of achievementDefinitions) {
    if (unlockedIds.includes(achievement.id)) continue;

    const isUnlocked = checkAchievementRequirements(achievement, userStats);
    
    if (isUnlocked) {
      // Unlock the achievement
      await db.collection('user_achievements').insertOne({
        userId,
        achievementId: achievement.id,
        unlockedAt: new Date(),
        rewardsClaimed: false
      });

      // Award XP and other rewards
      await awardAchievementRewards(db, userId, achievement);

      // Log activity
      await db.collection('user_activities').insertOne({
        userId,
        type: 'achievement_unlocked',
        title: `Achievement Unlocked: ${achievement.name}`,
        description: achievement.description,
        timestamp: new Date(),
        metadata: { achievementId: achievement.id, tier: achievement.tier }
      });

      newlyUnlocked.push(achievement);
    }
  }

  return NextResponse.json({
    success: true,
    newlyUnlocked,
    totalChecked: achievementDefinitions.length
  });
}

function checkAchievementRequirements(achievement: Achievement, userStats: any): boolean {
  return achievement.requirements.every(req => {
    const userValue = userStats[req.type] || 0;
    
    switch (req.operator) {
      case 'gte':
        return userValue >= req.value;
      case 'lte':
        return userValue <= req.value;
      case 'eq':
        return userValue === req.value;
      default:
        return false;
    }
  });
}

async function awardAchievementRewards(db: any, userId: ObjectId, achievement: Achievement) {
  const updates: any = {};
  
  // Award XP
  if (achievement.rewards.xp) {
    await db.collection('user_stats').updateOne(
      { userId },
      { 
        $inc: { xp: achievement.rewards.xp },
        $set: { updatedAt: new Date() }
      },
      { upsert: true }
    );
  }

  // Award title
  if (achievement.rewards.title) {
    await db.collection('users').updateOne(
      { _id: userId },
      { 
        $addToSet: { availableTitles: achievement.rewards.title },
        $set: { updatedAt: new Date() }
      }
    );
  }

  // Award power-ups
  if (achievement.rewards.powerUps) {
    await db.collection('user_inventory').updateOne(
      { userId },
      {
        $inc: achievement.rewards.powerUps.reduce((acc, powerUp) => {
          acc[`powerUps.${powerUp}`] = 1;
          return acc;
        }, {} as any),
        $set: { updatedAt: new Date() }
      },
      { upsert: true }
    );
  }
}

async function unlockSecretAchievement(db: any, userId: ObjectId, data: any) {
  const { secretCode, context } = data;
  
  // Handle Konami Code
  if (secretCode === 'ArrowUp,ArrowUp,ArrowDown,ArrowDown,ArrowLeft,ArrowRight,ArrowLeft,ArrowRight,KeyB,KeyA') {
    const achievement = achievementDefinitions.find(a => a.id === 'konami_code');
    if (achievement) {
      // Check if already unlocked
      const existing = await db.collection('user_achievements')
        .findOne({ userId, achievementId: 'konami_code' });
      
      if (!existing) {
        await db.collection('user_achievements').insertOne({
          userId,
          achievementId: 'konami_code',
          unlockedAt: new Date(),
          rewardsClaimed: false
        });

        await awardAchievementRewards(db, userId, achievement);
        
        return NextResponse.json({
          success: true,
          achievement,
          message: 'Secret achievement unlocked!'
        });
      }
    }
  }

  // Handle midnight coding
  if (context === 'battle_complete') {
    const now = new Date();
    const hour = now.getHours();
    
    if (hour >= 0 && hour < 3) { // Between 12 AM and 3 AM
      const achievement = achievementDefinitions.find(a => a.id === 'midnight_coder');
      if (achievement) {
        const existing = await db.collection('user_achievements')
          .findOne({ userId, achievementId: 'midnight_coder' });
        
        if (!existing) {
          await db.collection('user_achievements').insertOne({
            userId,
            achievementId: 'midnight_coder',
            unlockedAt: new Date(),
            rewardsClaimed: false
          });

          await awardAchievementRewards(db, userId, achievement);
          
          return NextResponse.json({
            success: true,
            achievement,
            message: 'Midnight warrior achievement unlocked!'
          });
        }
      }
    }
  }

  return NextResponse.json({ success: false, message: 'No secret achievement found' });
}

async function claimAchievementRewards(db: any, userId: ObjectId, achievementId: string) {
  const userAchievement = await db.collection('user_achievements')
    .findOne({ userId, achievementId });
  
  if (!userAchievement) {
    return NextResponse.json({ error: 'Achievement not found' }, { status: 404 });
  }

  if (userAchievement.rewardsClaimed) {
    return NextResponse.json({ error: 'Rewards already claimed' }, { status: 400 });
  }

  const achievement = achievementDefinitions.find(a => a.id === achievementId);
  if (!achievement) {
    return NextResponse.json({ error: 'Achievement definition not found' }, { status: 404 });
  }

  // Mark rewards as claimed
  await db.collection('user_achievements').updateOne(
    { userId, achievementId },
    { $set: { rewardsClaimed: true, claimedAt: new Date() } }
  );

  return NextResponse.json({
    success: true,
    rewards: achievement.rewards,
    message: 'Rewards claimed successfully!'
  });
}
