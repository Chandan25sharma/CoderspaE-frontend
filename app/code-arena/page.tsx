'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Users, Timer, Trophy, Coins, Snowflake, Bug, Eye, Shield, Clock } from 'lucide-react';
import BattleView from '../../components/BattleView';
import PowerUpBar from '../../components/PowerUpBar';

const mockPowerUps = [
  {
    id: 'freeze',
    name: 'Freeze',
    description: 'Freeze opponent editor for 10 seconds',
    icon: 'freeze',
    cost: 50,
    cooldown: 30,
    duration: 10,
    currentCooldown: 0,
    available: true,
    owned: 2,
  },
  {
    id: 'bug-bomb',
    name: 'Bug Bomb',
    description: 'Inject random bugs into opponent code',
    icon: 'bug',
    cost: 75,
    cooldown: 45,
    duration: 5,
    currentCooldown: 0,
    available: true,
    owned: 1,
  },
  {
    id: 'reveal-test',
    name: 'Reveal Test',
    description: 'Show hidden test cases for 15 seconds',
    icon: 'reveal',
    cost: 60,
    cooldown: 60,
    duration: 15,
    currentCooldown: 0,
    available: true,
    owned: 3,
  },
  {
    id: 'shield',
    name: 'Shield',
    description: 'Protect from next power-up attack',
    icon: 'shield',
    cost: 40,
    cooldown: 20,
    duration: 30,
    currentCooldown: 0,
    available: true,
    owned: 1,
  },
  {
    id: 'time-boost',
    name: 'Time Boost',
    description: 'Get extra 60 seconds of battle time',
    icon: 'time',
    cost: 100,
    cooldown: 120,
    currentCooldown: 0,
    available: true,
    owned: 0,
  },
];

const mockProblem = {
  title: "Array Rotation Challenge",
  difficulty: "Hard" as const,
  description: "Rotate an array to the right by k steps. Use power-ups strategically to gain advantage!",
  examples: [
    {
      input: "nums = [1,2,3,4,5,6,7], k = 3",
      output: "[5,6,7,1,2,3,4]",
      explanation: "Rotate right by 3 steps"
    }
  ]
};

const CodeArenaPage = () => {
  const [gamePhase, setGamePhase] = useState<'waiting' | 'battle' | 'finished'>('waiting');
  const [timeLeft, setTimeLeft] = useState(480); // 8 minutes
  const [spectatorCount, setSpectatorCount] = useState(157);
  const [coins, setCoins] = useState(250);
  const [powerUps, setPowerUps] = useState(mockPowerUps);
  const [activePowerUps, setActivePowerUps] = useState<Array<{
    id: string;
    name: string;
    duration: number;
    target?: string;
  }>>([]);
  
  const [players, setPlayers] = useState([
    {
      id: 'player1',
      username: 'PowerCoder',
      avatar: '/api/placeholder/32/32',
      language: 'python' as const,
      code: `def rotate(nums, k):
    # Your power-enhanced solution here
    n = len(nums)
    k = k % n
    
    # Reverse entire array
    nums.reverse()
    
    # Reverse first k elements
    nums[:k] = reversed(nums[:k])
    
    # Reverse remaining elements
    nums[k:] = reversed(nums[k:])
    
    return nums`,
      testsPassed: 3,
      totalTests: 5,
      accuracy: 60,
      isReady: true,
      isWinner: false,
    },
    {
      id: 'player2',
      username: 'BattleMaster',
      avatar: '/api/placeholder/32/32',
      language: 'javascript' as const,
      code: `function rotate(nums, k) {
    // Strategic power-up usage required!
    const n = nums.length;
    k = k % n;
    
    // Three-step reversal approach
    reverse(nums, 0, n - 1);
    reverse(nums, 0, k - 1);
    reverse(nums, k, n - 1);
    
    return nums;
}

function reverse(arr, start, end) {
    while (start < end) {
        [arr[start], arr[end]] = [arr[end], arr[start]];
        start++;
        end--;
    }
}`,
      testsPassed: 4,
      totalTests: 5,
      accuracy: 80,
      isReady: true,
      isWinner: false,
    }
  ]);

  const [battleEvents, setBattleEvents] = useState<Array<{
    id: string;
    type: 'power-up' | 'test-pass' | 'code-change';
    player: string;
    message: string;
    timestamp: Date;
  }>>([]);

  // Timer countdown
  useEffect(() => {
    if (gamePhase === 'battle' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGamePhase('finished');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gamePhase, timeLeft]);

  // Power-up cooldown management
  useEffect(() => {
    const interval = setInterval(() => {
      setPowerUps(prev => prev.map(powerUp => ({
        ...powerUp,
        currentCooldown: Math.max(0, powerUp.currentCooldown - 1)
      })));
      
      setActivePowerUps(prev => prev.map(active => ({
        ...active,
        duration: active.duration - 1
      })).filter(active => active.duration > 0));
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const handleStartBattle = () => {
    setGamePhase('battle');
  };

  const handlePowerUpUse = (powerUpId: string) => {
    const powerUp = powerUps.find(p => p.id === powerUpId);
    if (!powerUp || powerUp.owned <= 0 || powerUp.currentCooldown > 0) return;

    // Use power-up
    setPowerUps(prev => prev.map(p => 
      p.id === powerUpId 
        ? { ...p, owned: p.owned - 1, currentCooldown: p.cooldown }
        : p
    ));

    // Add to active power-ups
    if (powerUp.duration) {
      setActivePowerUps(prev => [...prev, {
        id: powerUpId,
        name: powerUp.name,
        duration: powerUp.duration,
        target: powerUpId === 'freeze' || powerUpId === 'bug-bomb' ? 'opponent' : 'self'
      }]);
    }

    // Add battle event
    setBattleEvents(prev => [...prev, {
      id: Date.now().toString(),
      type: 'power-up',
      player: 'You',
      message: `Used ${powerUp.name}!`,
      timestamp: new Date()
    }]);

    // Apply power-up effects
    if (powerUpId === 'time-boost') {
      setTimeLeft(prev => prev + 60);
    }
  };

  const handlePowerUpPurchase = (powerUpId: string) => {
    const powerUp = powerUps.find(p => p.id === powerUpId);
    if (!powerUp || coins < powerUp.cost) return;

    setCoins(prev => prev - powerUp.cost);
    setPowerUps(prev => prev.map(p => 
      p.id === powerUpId 
        ? { ...p, owned: p.owned + 1 }
        : p
    ));
  };

  const handleCodeChange = (playerId: string, code: string) => {
    setPlayers(prev => prev.map(p => 
      p.id === playerId ? { ...p, code } : p
    ));
  };

  const handleRunCode = (playerId: string) => {
    // Mock code execution with power-up effects
    const player = players.find(p => p.id === playerId);
    if (player) {
      const hasShield = activePowerUps.some(p => p.id === 'shield' && p.target === 'self');
      const isSlowed = activePowerUps.some(p => p.id === 'freeze' && p.target === 'opponent');
      
      // Simulate test results
      let passed = Math.floor(Math.random() * 3) + 2;
      
      // Power-up effects
      if (hasShield) passed = Math.min(5, passed + 1);
      if (isSlowed) passed = Math.max(1, passed - 1);
      
      setPlayers(prev => prev.map(p => 
        p.id === playerId ? { 
          ...p, 
          testsPassed: passed,
          accuracy: Math.round((passed / 5) * 100)
        } : p
      ));

      // Add coins for progress
      if (passed >= 4) {
        setCoins(prev => prev + 25);
      }
    }
  };

  if (gamePhase === 'waiting') {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Header */}
        <div className="bg-gray-800 border-b border-gray-700 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Zap className="text-purple-400" size={32} />
                <div>
                  <h1 className="text-3xl font-bold">⚔️ Code Arena: Battle with Boosts</h1>
                  <p className="text-gray-400">Use strategic power-ups to dominate the coding battlefield</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-yellow-400">
                  <Coins size={16} />
                  <span className="font-bold">{coins}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Users size={16} />
                  <span>{spectatorCount} watching</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Problem & Battle Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Problem Statement */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800 border border-gray-700 rounded-lg p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Trophy className="text-yellow-400" size={24} />
                  <h2 className="text-xl font-bold">Power-Up Challenge</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{mockProblem.title}</h3>
                      <span className="px-2 py-1 bg-red-600 text-white rounded text-xs font-semibold">
                        {mockProblem.difficulty}
                      </span>
                    </div>
                    <p className="text-gray-300">{mockProblem.description}</p>
                  </div>

                  <div className="bg-gray-900 border border-gray-600 rounded p-3 font-mono text-sm">
                    <div className="text-green-400">Input: {mockProblem.examples[0].input}</div>
                    <div className="text-blue-400">Output: {mockProblem.examples[0].output}</div>
                    <div className="text-gray-400 mt-1">{mockProblem.examples[0].explanation}</div>
                  </div>
                </div>
              </motion.div>

              {/* Power-Up Rules */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gray-800 border border-gray-700 rounded-lg p-6"
              >
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Zap className="text-purple-400" size={20} />
                  Power-Up Battle Rules
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-purple-400">Offensive Power-ups:</h4>
                    <ul className="space-y-1 text-gray-300">
                      <li className="flex items-center gap-2">
                        <Snowflake size={14} className="text-blue-400" />
                        <span><strong>Freeze:</strong> Lock opponent editor (10s)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Bug size={14} className="text-red-400" />
                        <span><strong>Bug Bomb:</strong> Inject code errors (5s)</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-green-400">Defensive Power-ups:</h4>
                    <ul className="space-y-1 text-gray-300">
                      <li className="flex items-center gap-2">
                        <Shield size={14} className="text-green-400" />
                        <span><strong>Shield:</strong> Block next attack (30s)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Eye size={14} className="text-yellow-400" />
                        <span><strong>Reveal:</strong> Show hidden tests (15s)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Clock size={14} className="text-purple-400" />
                        <span><strong>Time Boost:</strong> +60 seconds</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-purple-900/20 border border-purple-700/30 rounded">
                  <p className="text-sm text-purple-200">
                    💡 <strong>Strategy Tip:</strong> Earn coins by passing test cases. 
                    Time your power-ups carefully for maximum impact!
                  </p>
                </div>
              </motion.div>

              {/* Battle Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleStartBattle}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-all"
                >
                  ⚔️ Enter Battle Arena
                </motion.button>
              </motion.div>
            </div>

            {/* Power-ups & Players */}
            <div className="space-y-6">
              {/* Power-ups Preview */}
              <PowerUpBar
                powerUps={powerUps}
                coins={coins}
                onPowerUpUse={handlePowerUpUse}
                onPowerUpPurchase={handlePowerUpPurchase}
                disabled={true}
              />

              {/* Current Players */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gray-800 border border-gray-700 rounded-lg p-6"
              >
                <h3 className="text-lg font-bold mb-4">Arena Fighters</h3>
                <div className="space-y-3">
                  {players.map((player) => (
                    <div key={player.id} className="flex items-center justify-between bg-gray-900 rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {player.username[0]}
                        </div>
                        <div>
                          <div className="font-semibold">{player.username}</div>
                          <div className="text-xs text-gray-400 uppercase">{player.language}</div>
                        </div>
                      </div>
                      <div className="text-green-400 text-sm">Ready</div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Live Events Preview */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gray-800 border border-gray-700 rounded-lg p-6"
              >
                <h3 className="text-lg font-bold mb-4">Battle Events</h3>
                <div className="text-sm text-gray-400 text-center py-4">
                  Battle events will appear here...
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Power-ups Bar */}
      <div className="border-b border-gray-700">
        <div className="max-w-7xl mx-auto p-4">
          <PowerUpBar
            powerUps={powerUps}
            coins={coins}
            onPowerUpUse={handlePowerUpUse}
            onPowerUpPurchase={handlePowerUpPurchase}
          />
        </div>
      </div>

      {/* Battle View */}
      <BattleView
        mode="power-up"
        players={players}
        currentPlayer="player1"
        timeLeft={timeLeft}
        totalTime={480}
        phase={gamePhase}
        spectatorCount={spectatorCount}
        problemTitle={mockProblem.title}
        problemDifficulty={mockProblem.difficulty}
        onCodeChange={handleCodeChange}
        onRunCode={handleRunCode}
        powerUps={powerUps.map(p => ({
          id: p.id,
          name: p.name,
          icon: p.icon,
          cooldown: p.currentCooldown,
          active: false
        }))}
        onPowerUpUse={handlePowerUpUse}
      />

      {/* Active Power-ups Overlay */}
      <AnimatePresence>
        {activePowerUps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 right-4 space-y-2 z-40"
          >
            {activePowerUps.map((powerUp) => (
              <motion.div
                key={powerUp.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <Zap size={16} />
                  <span className="font-semibold">{powerUp.name}</span>
                  <span className="text-sm">({powerUp.duration}s)</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Battle Events Feed */}
      {battleEvents.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="fixed top-20 left-4 w-80 bg-gray-800 border border-gray-700 rounded-lg p-4 z-30"
        >
          <h4 className="font-semibold mb-2">Battle Feed</h4>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {battleEvents.slice(-5).map((event) => (
              <div key={event.id} className="text-sm text-gray-300">
                <span className="font-semibold text-purple-400">{event.player}:</span> {event.message}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CodeArenaPage;
