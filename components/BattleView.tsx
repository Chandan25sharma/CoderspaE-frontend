'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Users, Trophy, Zap, Eye, Crown } from 'lucide-react';
import { CodeEditor } from './CodeEditor';
import confetti from 'canvas-confetti';
import Image from 'next/image';

interface BattlePlayer {
  id: string;
  username: string;
  avatar?: string;
  language: 'python' | 'cpp' | 'javascript' | 'java';
  code: string;
  testsPassed: number;
  totalTests: number;
  accuracy: number;
  isReady: boolean;
  isWinner?: boolean;
}

interface BattleViewProps {
  mode: 'mirror' | 'attack-defend' | 'power-up' | 'cognitive';
  players: BattlePlayer[];
  currentPlayer?: string;
  timeLeft: number;
  totalTime: number;
  phase?: 'waiting' | 'battle' | 'finished';
  spectatorCount?: number;
  problemTitle?: string;
  problemDifficulty?: 'Easy' | 'Medium' | 'Hard';
  revealPercentage?: number;
  isSpectator?: boolean;
  onCodeChange?: (playerId: string, code: string) => void;
  onRunCode?: (playerId: string) => void;
  onPeekToggle?: (playerId: string) => void;
  powerUps?: Array<{
    id: string;
    name: string;
    icon: string;
    cooldown: number;
    active: boolean;
  }>;
  onPowerUpUse?: (powerUpId: string, targetPlayerId?: string) => void;
}

const BattleView: React.FC<BattleViewProps> = ({
  mode,
  players,
  currentPlayer,
  timeLeft,
  phase = 'waiting',
  spectatorCount = 0,
  problemTitle = 'Code Challenge',
  problemDifficulty = 'Medium',
  revealPercentage = 100,
  isSpectator = false,
  onCodeChange,
  onRunCode,
  onPeekToggle,
  powerUps = [],
  onPowerUpUse,
}) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [winner, setWinner] = useState<BattlePlayer | null>(null);

  useEffect(() => {
    const winnerPlayer = players.find(p => p.isWinner);
    if (winnerPlayer && !winner) {
      setWinner(winnerPlayer);
      setShowConfetti(true);
      
      // Trigger confetti animation
      confetti({
        particleCount: 500,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [players, winner]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '#44FF88';
      case 'Medium': return '#FFD700';
      case 'Hard': return '#FF4444';
      default: return '#AA00FF';
    }
  };

  const getProgressBarColor = (percentage: number) => {
    if (percentage >= 80) return '#44FF88';
    if (percentage >= 50) return '#FFD700';
    return '#FF4444';
  };

  const renderPlayer = (player: BattlePlayer, index: number) => {
    const isCurrentPlayer = currentPlayer === player.id;
    const canEdit = !isSpectator && isCurrentPlayer;
    const showPeekButton = isSpectator && mode === 'mirror';
    
    return (
      <motion.div
        key={player.id}
        initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
        animate={{ opacity: 1, x: 0 }}
        className={`flex-1 min-w-0 ${index > 0 ? 'border-l border-gray-700' : ''}`}
      >
        {/* Player Header */}
        <div className="p-4 bg-gray-800 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                {player.avatar ? (
                  <Image 
                    src={player.avatar} 
                    alt={player.username}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {player.username[0].toUpperCase()}
                  </div>
                )}
                {player.isWinner && (
                  <Crown className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-white">{player.username}</h3>
                <span className="text-xs text-gray-400 uppercase font-mono">
                  {player.language}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Test Progress */}
              <div className="text-right">
                <div className="text-sm font-mono text-white">
                  {player.testsPassed}/{player.totalTests}
                </div>
                <div className="text-xs text-gray-400">tests passed</div>
              </div>
              
              {/* Accuracy Circle */}
              <div className="relative w-12 h-12">
                <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                    fill="none"
                    stroke="#374151"
                    strokeWidth="2"
                  />
                  <path
                    d="M18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                    fill="none"
                    stroke={getProgressBarColor(player.accuracy)}
                    strokeWidth="2"
                    strokeDasharray={`${player.accuracy}, 100`}
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">
                    {Math.round(player.accuracy)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Peek Button for Spectators */}
          {showPeekButton && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onPeekToggle?.(player.id)}
              className="mt-2 flex items-center gap-2 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm transition-colors"
            >
              <Eye size={14} />
              🔍 Peek {player.language.toUpperCase()}
            </motion.button>
          )}
        </div>

        {/* Code Editor */}
        <CodeEditor
          value={player.code}
          onChange={(code) => onCodeChange?.(player.id, code)}
          language={player.language}
          readOnly={!canEdit}
          spectatorMode={isSpectator}
          revealPercentage={revealPercentage}
          onRun={() => onRunCode?.(player.id)}
          showControls={canEdit}
          height="400px"
          className="border-0 rounded-none"
        />
      </motion.div>
    );
  };

  return (
    <div className="h-full bg-gray-900 text-white overflow-hidden"
      style={{ 
        background: showConfetti ? 
        'radial-gradient(circle, rgba(128,0,128,0.1) 0%, rgba(0,0,0,1) 100%)' : 
        undefined 
      }}
    >

      {/* Top Bar */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-xl font-bold">{problemTitle}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span 
                  className="px-2 py-1 rounded text-xs font-semibold"
                  style={{ 
                    backgroundColor: `${getDifficultyColor(problemDifficulty)}20`,
                    color: getDifficultyColor(problemDifficulty)
                  }}
                >
                  {problemDifficulty}
                </span>
                {mode === 'attack-defend' && (
                  <span className="px-2 py-1 bg-red-600 rounded text-xs font-semibold">
                    Attack & Defend
                  </span>
                )}
                {mode === 'power-up' && (
                  <span className="px-2 py-1 bg-purple-600 rounded text-xs font-semibold">
                    Power-Up Battle
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Spectator Count */}
            {spectatorCount > 0 && (
              <div className="flex items-center gap-2 text-gray-400">
                <Users size={16} />
                <span className="text-sm">{spectatorCount} watching</span>
              </div>
            )}

            {/* Timer */}
            <div className="flex items-center gap-2">
              <Timer size={20} className="text-yellow-400" />
              <span className="text-2xl font-mono font-bold">
                {formatTime(timeLeft)}
              </span>
            </div>

            {/* Phase Indicator */}
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full animate-pulse ${
                phase === 'waiting' ? 'bg-yellow-400' :
                phase === 'battle' ? 'bg-green-400' :
                'bg-red-400'
              }`} />
              <span className="text-sm font-semibold capitalize">{phase}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Power-ups Bar (for power-up mode) */}
      {mode === 'power-up' && powerUps.length > 0 && (
        <div className="bg-gray-800 border-b border-gray-700 p-4">
          <div className="flex items-center gap-4">
            <Zap className="text-purple-400" size={20} />
            <span className="font-semibold">Power-ups:</span>
            <div className="flex gap-2">
              {powerUps.map((powerUp) => (
                <motion.button
                  key={powerUp.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onPowerUpUse?.(powerUp.id)}
                  disabled={powerUp.cooldown > 0 || !powerUp.active}
                  className={`relative px-3 py-2 rounded-md text-sm font-semibold transition-all ${
                    powerUp.active && powerUp.cooldown === 0
                      ? 'bg-purple-600 hover:bg-purple-700 text-white'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <span className="mr-1">{powerUp.icon}</span>
                  {powerUp.name}
                  {powerUp.cooldown > 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md">
                      <span className="text-xs font-bold">{powerUp.cooldown}s</span>
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Battle Area */}
      <div className="flex-1 flex overflow-hidden">
        {players.map((player, index) => renderPlayer(player, index))}
      </div>

      {/* Winner Announcement */}
      <AnimatePresence>
        {winner && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              className="bg-gradient-to-br from-purple-900 to-blue-900 p-8 rounded-2xl text-center max-w-md mx-4"
            >
              <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-2">🎉 Victory!</h2>
              <p className="text-xl mb-4">
                <span className="font-bold text-yellow-400">{winner.username}</span> wins!
              </p>
              <div className="text-sm text-gray-300">
                <p>Tests Passed: {winner.testsPassed}/{winner.totalTests}</p>
                <p>Accuracy: {Math.round(winner.accuracy)}%</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BattleView;
