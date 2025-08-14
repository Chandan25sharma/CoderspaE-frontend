'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  User, 
  Globe, 
  Clock,
  Target,
  Trophy,
  Eye,
  Video,
  Users2,
  Sparkles
} from 'lucide-react';
import { GameModeType, ChallengeType, GameModeConfig } from '@/types/gameMode';
import { GAME_MODES, getAvailableModesForChallengeType } from '@/lib/gameModes';

interface GameModeSelectorProps {
  onModeSelect: (mode: GameModeType, challengeType: ChallengeType) => void;
  selectedMode?: GameModeType;
  selectedChallengeType?: ChallengeType;
  userTeam?: { _id: string; name: string; members: any[] }; // Team info if user is in a team
  className?: string;
}

const GameModeSelector: React.FC<GameModeSelectorProps> = ({
  onModeSelect,
  selectedMode,
  userTeam,
  className = ''
}) => {
  const [selectedTab, setSelectedTab] = useState<ChallengeType>('1v1-direct');
  const [hoveredMode, setHoveredMode] = useState<GameModeType | null>(null);

  const challengeTypes: { 
    id: ChallengeType; 
    label: string; 
    icon: React.ReactNode; 
    description: string;
    requiresTeam?: boolean;
  }[] = [
    {
      id: '1v1-direct',
      label: 'Direct Challenge',
      icon: <User className="w-5 h-5" />,
      description: 'Challenge a specific player directly',
    },
    {
      id: 'public-join',
      label: 'Public Match',
      icon: <Globe className="w-5 h-5" />,
      description: 'Quick match with any available player',
    },
    {
      id: 'team-vs-team',
      label: 'Team Battle',
      icon: <Users className="w-5 h-5" />,
      description: 'Team vs Team competitive matches',
      requiresTeam: true,
    },
  ];

  const getAvailableModes = () => {
    return getAvailableModesForChallengeType(selectedTab);
  };

  const renderModeCard = (mode: GameModeConfig) => {
    const isSelected = selectedMode === mode.id;
    const isDisabled = selectedTab === 'team-vs-team' && !userTeam;

    return (
      <motion.div
        key={mode.id}
        className={`
          relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300
          ${isSelected 
            ? 'border-blue-500 bg-blue-500/10' 
            : isDisabled
            ? 'border-gray-600 bg-gray-800/50 opacity-50 cursor-not-allowed'
            : 'border-gray-600 bg-gray-800/30 hover:border-gray-500 hover:bg-gray-700/30'
          }
        `}
        onClick={() => !isDisabled && onModeSelect(mode.id, selectedTab)}
        onHoverStart={() => setHoveredMode(mode.id)}
        onHoverEnd={() => setHoveredMode(null)}
        whileHover={!isDisabled ? { scale: 1.02, y: -2 } : {}}
        whileTap={!isDisabled ? { scale: 0.98 } : {}}
      >
        {/* Mode Icon & Title */}
        <div className="flex items-center gap-3 mb-3">
          <div 
            className="text-3xl p-3 rounded-lg"
            style={{ backgroundColor: `${mode.color}20`, color: mode.color }}
          >
            {mode.icon}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{mode.name}</h3>
            <p className="text-gray-400 text-sm">{mode.maxPlayers === 2 ? '1v1' : `Up to ${mode.maxPlayers} players`}</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-300 text-sm mb-4 line-clamp-2">
          {mode.description}
        </p>

        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-4">
          {mode.features.videoStream && (
            <div className="flex items-center gap-1 px-2 py-1 bg-purple-500/20 rounded-full">
              <Video className="w-3 h-3 text-purple-400" />
              <span className="text-xs text-purple-300">Video</span>
            </div>
          )}
          {mode.features.spectatorMode && (
            <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 rounded-full">
              <Eye className="w-3 h-3 text-green-400" />
              <span className="text-xs text-green-300">Spectator</span>
            </div>
          )}
          {mode.features.teamSupport && (
            <div className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 rounded-full">
              <Users2 className="w-3 h-3 text-blue-400" />
              <span className="text-xs text-blue-300">Teams</span>
            </div>
          )}
          {mode.features.story && (
            <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 rounded-full">
              <Sparkles className="w-3 h-3 text-yellow-400" />
              <span className="text-xs text-yellow-300">Story</span>
            </div>
          )}
        </div>

        {/* Game Rules */}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{mode.rules.timeLimit}min</span>
          </div>
          <div className="flex items-center gap-1">
            <Target className="w-3 h-3" />
            <span className="capitalize">{mode.rules.scoring.replace('-', ' ')}</span>
          </div>
        </div>

        {/* Selection Indicator */}
        {isSelected && (
          <motion.div
            className="absolute top-3 right-3 bg-blue-500 rounded-full p-1"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.3 }}
          >
            <Trophy className="w-4 h-4 text-white" />
          </motion.div>
        )}

        {/* Disabled Overlay */}
        {isDisabled && (
          <div className="absolute inset-0 bg-gray-900/50 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <Users className="w-8 h-8 text-gray-500 mx-auto mb-2" />
              <p className="text-gray-400 text-sm font-medium">Requires Team</p>
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Challenge Type Tabs */}
      <div className="flex bg-gray-800/50 rounded-lg p-1">
        {challengeTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setSelectedTab(type.id)}
            disabled={type.requiresTeam && !userTeam}
            className={`
              flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md transition-all duration-200
              ${selectedTab === type.id
                ? 'bg-blue-600 text-white shadow-lg'
                : type.requiresTeam && !userTeam
                ? 'text-gray-500 cursor-not-allowed'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }
            `}
          >
            {type.icon}
            <span className="font-medium">{type.label}</span>
          </button>
        ))}
      </div>

      {/* Challenge Type Description */}
      <div className="text-center">
        <p className="text-gray-400">
          {challengeTypes.find(t => t.id === selectedTab)?.description}
        </p>
        {selectedTab === 'team-vs-team' && !userTeam && (
          <p className="text-red-400 text-sm mt-2">
            You need to join or create a team to participate in team battles
          </p>
        )}
      </div>

      {/* Game Modes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="wait">
          {getAvailableModes().map((mode) => renderModeCard(mode))}
        </AnimatePresence>
      </div>

      {/* Mode Details Panel */}
      <AnimatePresence>
        {hoveredMode && (
          <motion.div
            className="bg-gray-800/50 rounded-lg p-4 border border-gray-700"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {(() => {
              const mode = GAME_MODES[hoveredMode];
              return (
                <div>
                  <h4 className="text-white font-semibold mb-2">{mode.name} - Detailed Rules</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h5 className="text-gray-300 font-medium mb-1">Allowed Tools:</h5>
                      <ul className="text-gray-400 space-y-1">
                        {mode.rules.allowedTools.map((tool) => (
                          <li key={tool} className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-green-400 rounded-full" />
                            {tool.replace('-', ' ')}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-gray-300 font-medium mb-1">Restrictions:</h5>
                      {mode.rules.prohibitedFeatures.length > 0 ? (
                        <ul className="text-gray-400 space-y-1">
                          {mode.rules.prohibitedFeatures.map((feature) => (
                            <li key={feature} className="flex items-center gap-2">
                              <div className="w-1 h-1 bg-red-400 rounded-full" />
                              {feature.replace('-', ' ')}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-green-400">No restrictions</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GameModeSelector;
