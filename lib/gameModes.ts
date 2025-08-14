import { GameModeConfig, GameModeType, ChallengeType } from '@/types/gameMode';

export const GAME_MODES: Record<GameModeType, GameModeConfig> = {
  'quick-dual': {
    id: 'quick-dual',
    name: 'Quick Dual',
    description: 'Fast-paced 1v1 coding battle with full-screen split coding and video streaming',
    icon: '⚡',
    color: '#3b82f6',
    maxPlayers: 2,
    minPlayers: 2,
    supportedChallengeTypes: ['1v1-direct', 'public-join', 'team-vs-team'],
    features: {
      videoStream: true,
      codeSync: true,
      spectatorMode: true,
      teamSupport: true,
      mirrored: false,
      story: false,
      minimalistUI: false,
      createProblems: false,
    },
    rules: {
      timeLimit: 30,
      scoring: 'combined',
      allowedTools: ['autocomplete', 'syntax-highlighting', 'debugging', 'hints'],
      prohibitedFeatures: [],
    },
  },
  'minimalist-mind': {
    id: 'minimalist-mind',
    name: 'Minimalist Mind',
    description: 'Distraction-free coding environment with limited tools and clean UI',
    icon: '🧘',
    color: '#10b981',
    maxPlayers: 2,
    minPlayers: 2,
    supportedChallengeTypes: ['1v1-direct', 'public-join'],
    features: {
      videoStream: false,
      codeSync: true,
      spectatorMode: true,
      teamSupport: false,
      mirrored: false,
      story: false,
      minimalistUI: true,
      createProblems: false,
    },
    rules: {
      timeLimit: 45,
      scoring: 'accuracy-based',
      allowedTools: ['syntax-highlighting'],
      prohibitedFeatures: ['autocomplete', 'debugging', 'hints', 'chat'],
    },
  },
  'mirror-arena': {
    id: 'mirror-arena',
    name: 'Mirror Arena',
    description: 'Both players solve mirrored versions of the same problem with different constraints',
    icon: '🪞',
    color: '#8b5cf6',
    maxPlayers: 2,
    minPlayers: 2,
    supportedChallengeTypes: ['1v1-direct', 'public-join'],
    features: {
      videoStream: true,
      codeSync: true,
      spectatorMode: true,
      teamSupport: false,
      mirrored: true,
      story: false,
      minimalistUI: false,
      createProblems: false,
    },
    rules: {
      timeLimit: 40,
      scoring: 'combined',
      allowedTools: ['autocomplete', 'syntax-highlighting', 'debugging'],
      prohibitedFeatures: ['hints'],
    },
  },
  'narrative-mode': {
    id: 'narrative-mode',
    name: 'Narrative Mode',
    description: 'Story-driven coding challenges with missions and progressive unlocks',
    icon: '📖',
    color: '#f59e0b',
    maxPlayers: 2,
    minPlayers: 2,
    supportedChallengeTypes: ['1v1-direct', 'public-join'],
    features: {
      videoStream: true,
      codeSync: true,
      spectatorMode: true,
      teamSupport: false,
      mirrored: false,
      story: true,
      minimalistUI: false,
      createProblems: false,
    },
    rules: {
      timeLimit: 60,
      scoring: 'combined',
      allowedTools: ['autocomplete', 'syntax-highlighting', 'debugging', 'hints'],
      prohibitedFeatures: [],
    },
  },
  'team-clash': {
    id: 'team-clash',
    name: 'Team Clash',
    description: 'Team vs Team battles where each member solves problems for combined team score',
    icon: '👥',
    color: '#ef4444',
    maxPlayers: 8,
    minPlayers: 4,
    supportedChallengeTypes: ['team-vs-team'],
    features: {
      videoStream: true,
      codeSync: true,
      spectatorMode: true,
      teamSupport: true,
      mirrored: false,
      story: false,
      minimalistUI: false,
      createProblems: false,
    },
    rules: {
      timeLimit: 45,
      scoring: 'team-combined',
      allowedTools: ['autocomplete', 'syntax-highlighting', 'debugging', 'hints', 'team-chat'],
      prohibitedFeatures: [],
    },
  },
  'attack-defend': {
    id: 'attack-defend',
    name: 'Attack & Defend',
    description: 'One team creates problems while the other solves them, then switch roles',
    icon: '⚔️',
    color: '#dc2626',
    maxPlayers: 8,
    minPlayers: 4,
    supportedChallengeTypes: ['team-vs-team'],
    features: {
      videoStream: true,
      codeSync: true,
      spectatorMode: true,
      teamSupport: true,
      mirrored: false,
      story: false,
      minimalistUI: false,
      createProblems: true,
    },
    rules: {
      timeLimit: 90,
      scoring: 'team-combined',
      allowedTools: ['autocomplete', 'syntax-highlighting', 'debugging', 'hints', 'team-chat', 'problem-creator'],
      prohibitedFeatures: [],
    },
  },
};

export const getGameModeByType = (type: GameModeType): GameModeConfig => {
  return GAME_MODES[type];
};

export const getAvailableModesForChallengeType = (challengeType: string) => {
  return Object.values(GAME_MODES).filter(mode => 
    mode.supportedChallengeTypes.includes(challengeType as 'team-vs-team' | '1v1-direct' | 'public-join')
  );
};

export const getTeamOnlyModes = (): GameModeConfig[] => {
  return Object.values(GAME_MODES).filter(mode => 
    mode.features.teamSupport && mode.supportedChallengeTypes.includes('team-vs-team')
  );
};

export const getSoloModes = (): GameModeConfig[] => {
  return Object.values(GAME_MODES).filter(mode => 
    mode.supportedChallengeTypes.includes('1v1-direct') || 
    mode.supportedChallengeTypes.includes('public-join')
  );
};
