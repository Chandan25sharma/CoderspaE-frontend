'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Sword, Timer, Target, Bug, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { CodeEditor } from '../../components/CodeEditor';

interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  actualOutput?: string;
  passed?: boolean;
  points: number;
}

const mockProblem = {
  title: "Find Duplicate Number",
  difficulty: "Hard" as const,
  description: "Given an array of integers containing n + 1 integers where each integer is in the range [1, n] inclusive, prove that at least one duplicate number must exist. Assume that there is only one duplicate number, find the duplicate one.",
  examples: [
    {
      input: "nums = [1,3,4,2,2]",
      output: "2",
      explanation: "The duplicate number is 2"
    }
  ]
};

const AttackDefendPage = () => {
  const [gamePhase, setGamePhase] = useState<'waiting' | 'attack' | 'defend' | 'collision' | 'finished'>('waiting');
  const [currentRound, setCurrentRound] = useState(1);
  const [totalRounds] = useState(3);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes per phase
  const [playerRole, setPlayerRole] = useState<'attacker' | 'defender'>('attacker');
  
  const [attackerCode, setAttackerCode] = useState(`def findDuplicate(nums):
    # Find the duplicate number in O(n) time
    # Try to break this with your test cases!
    
    slow = nums[0]
    fast = nums[0]
    
    # Find intersection point in the cycle
    while True:
        slow = nums[slow]
        fast = nums[nums[fast]]
        if slow == fast:
            break
    
    # Find the start of the cycle
    slow = nums[0]
    while slow != fast:
        slow = nums[slow]
        fast = nums[fast]
    
    return fast`);

  const [defenderTestCases, setDefenderTestCases] = useState<TestCase[]>([
    {
      id: '1',
      input: '[1,3,4,2,2]',
      expectedOutput: '2',
      points: 10,
    },
    {
      id: '2', 
      input: '[3,1,3,4,2]',
      expectedOutput: '3',
      points: 15,
    }
  ]);

  const [newTestCase, setNewTestCase] = useState({
    input: '',
    expectedOutput: '',
    points: 10,
  });

  const [collisionResults, setCollisionResults] = useState<TestCase[]>([]);
  const [attackerPoints, setAttackerPoints] = useState(0);
  const [defenderPoints, setDefenderPoints] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // Timer countdown
  useEffect(() => {
    if ((gamePhase === 'attack' || gamePhase === 'defend') && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            if (gamePhase === 'attack') {
              setGamePhase('defend');
              setTimeLeft(300);
            } else if (gamePhase === 'defend') {
              setGamePhase('collision');
            }
            return prev - 1;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gamePhase, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseColor = () => {
    switch (gamePhase) {
      case 'attack': return '#FF4444';
      case 'defend': return '#00AAFF';
      case 'collision': return '#AA00FF';
      default: return '#FFD700';
    }
  };

  const getPhaseIcon = () => {
    switch (gamePhase) {
      case 'attack': return <Sword className="text-red-400" size={24} />;
      case 'defend': return <Shield className="text-blue-400" size={24} />;
      case 'collision': return <Target className="text-purple-400" size={24} />;
      default: return <Timer className="text-yellow-400" size={24} />;
    }
  };

  const handleStartBattle = (role: 'attacker' | 'defender') => {
    setPlayerRole(role);
    setGamePhase('attack');
    setTimeLeft(300);
  };

  const handleAddTestCase = () => {
    if (newTestCase.input && newTestCase.expectedOutput) {
      const testCase: TestCase = {
        id: Date.now().toString(),
        input: newTestCase.input,
        expectedOutput: newTestCase.expectedOutput,
        points: newTestCase.points,
      };
      
      setDefenderTestCases(prev => [...prev, testCase]);
      setNewTestCase({ input: '', expectedOutput: '', points: 10 });
    }
  };

  const removeTestCase = (id: string) => {
    setDefenderTestCases(prev => prev.filter(tc => tc.id !== id));
  };

  const runCollision = async () => {
    setIsRunning(true);
    setGamePhase('collision');
    
    // Simulate code execution against test cases
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const results: TestCase[] = defenderTestCases.map(testCase => {
      // Mock execution - in real app this would run the code
      const passed = Math.random() > 0.3; // 70% pass rate for demo
      
      return {
        ...testCase,
        actualOutput: passed ? testCase.expectedOutput : 'Error: Index out of bounds',
        passed,
      };
    });
    
    setCollisionResults(results);
    
    // Calculate points
    const passedTests = results.filter(r => r.passed).length;
    const totalTests = results.length;
    const failedTests = totalTests - passedTests;
    
    setAttackerPoints(prev => prev + (passedTests * 10));
    setDefenderPoints(prev => prev + (failedTests * 15));
    
    setIsRunning(false);
    
    // Check if battle is over
    setTimeout(() => {
      if (currentRound >= totalRounds) {
        setGamePhase('finished');
      } else {
        setCurrentRound(prev => prev + 1);
        setGamePhase('attack');
        setTimeLeft(300);
        setCollisionResults([]);
        setPlayerRole(playerRole === 'attacker' ? 'defender' : 'attacker');
      }
    }, 3000);
  };

  if (gamePhase === 'waiting') {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Header */}
        <div className="bg-gray-800 border-b border-gray-700 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4">
              <Target className="text-purple-400" size={32} />
              <div>
                <h1 className="text-3xl font-bold">⚔️ Attack & Defend Mode</h1>
                <p className="text-gray-400">Code solutions vs. Strategic test cases</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Problem Description */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Problem Statement */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Challenge Problem</h2>
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
              </div>

              {/* Rules */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4">Battle Rules</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-red-900/20 border border-red-700/30 rounded p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Sword className="text-red-400" size={18} />
                        <h4 className="font-semibold text-red-400">Attack Phase</h4>
                      </div>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• Write optimal solution code</li>
                        <li>• 5 minutes to implement</li>
                        <li>• Earn points for passing tests</li>
                        <li>• Code will be tested against defender cases</li>
                      </ul>
                    </div>

                    <div className="bg-blue-900/20 border border-blue-700/30 rounded p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="text-blue-400" size={18} />
                        <h4 className="font-semibold text-blue-400">Defend Phase</h4>
                      </div>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• Create challenging test cases</li>
                        <li>• 5 minutes to design tests</li>
                        <li>• Earn points for breaking code</li>
                        <li>• Include edge cases and gotchas</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-purple-900/20 border border-purple-700/30 rounded p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="text-purple-400" size={18} />
                      <h4 className="font-semibold text-purple-400">Collision Phase</h4>
                    </div>
                    <p className="text-sm text-gray-300">
                      Watch as the attacker code is tested against defender test cases. 
                      Slow-motion replay shows exactly where code breaks!
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Role Selection */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-6">Choose Your Role</h2>
                
                <div className="space-y-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleStartBattle('attacker')}
                    className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white py-6 px-6 rounded-lg transition-all"
                  >
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <Sword size={24} />
                      <span className="text-xl font-bold">⚔️ Play as Attacker</span>
                    </div>
                    <p className="text-sm opacity-90">
                      Write the most robust solution possible. Your code will be tested against challenging cases!
                    </p>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleStartBattle('defender')}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-6 px-6 rounded-lg transition-all"
                  >
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <Shield size={24} />
                      <span className="text-xl font-bold">🛡️ Play as Defender</span>
                    </div>
                    <p className="text-sm opacity-90">
                      Create devious test cases to break the attacker&apos;s code. Find edge cases!
                    </p>
                  </motion.button>
                </div>
              </div>

              {/* Strategy Tips */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4">💡 Strategy Tips</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="bg-gray-900 border border-gray-600 rounded p-3">
                    <h4 className="font-semibold text-red-400 mb-1">For Attackers:</h4>
                    <ul className="text-gray-300 space-y-1">
                      <li>• Handle edge cases (empty arrays, single elements)</li>
                      <li>• Consider integer overflow scenarios</li>
                      <li>• Validate input assumptions</li>
                      <li>• Use defensive programming techniques</li>
                    </ul>
                  </div>

                  <div className="bg-gray-900 border border-gray-600 rounded p-3">
                    <h4 className="font-semibold text-blue-400 mb-1">For Defenders:</h4>
                    <ul className="text-gray-300 space-y-1">
                      <li>• Test boundary conditions</li>
                      <li>• Include malformed input</li>
                      <li>• Test performance with large datasets</li>
                      <li>• Create contradictory constraints</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Scoring */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4">🏆 Scoring System</h3>
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex justify-between">
                    <span>Test case passed (Attacker):</span>
                    <span className="text-green-400">+10 points</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Test case failed (Defender):</span>
                    <span className="text-blue-400">+15 points</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bonus for creative test cases:</span>
                    <span className="text-purple-400">+5 points</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time bonus (finish early):</span>
                    <span className="text-yellow-400">+1 point/sec</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div 
        className="bg-gray-800 border-b border-gray-700 p-4"
        style={{ borderBottomColor: getPhaseColor() }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {getPhaseIcon()}
              <div>
                <h1 className="text-xl font-bold">
                  Attack & Defend - Round {currentRound}/{totalRounds}
                </h1>
                <p className="text-gray-400 capitalize">
                  {gamePhase === 'collision' ? 'Code Collision!' : `${gamePhase} Phase`}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">{attackerPoints}</div>
                <div className="text-xs text-gray-400">Attacker</div>
              </div>
              
              <div className="text-4xl font-mono font-bold" style={{ color: getPhaseColor() }}>
                {formatTime(timeLeft)}
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{defenderPoints}</div>
                <div className="text-xs text-gray-400">Defender</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Battle Area */}
      <div className="max-w-7xl mx-auto p-6">
        {gamePhase === 'attack' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sword className="text-red-400" size={20} />
                <h2 className="text-lg font-bold text-red-400">Attack Phase</h2>
              </div>
              <p className="text-gray-300">
                Write your solution! Your code will be tested against the defender&apos;s test cases.
              </p>
            </div>

            <CodeEditor
              value={attackerCode}
              onChange={setAttackerCode}
              language="python"
              height="500px"
              onRun={() => console.log('Running attack code...')}
            />
          </motion.div>
        )}

        {gamePhase === 'defend' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="text-blue-400" size={20} />
                <h2 className="text-lg font-bold text-blue-400">Defend Phase</h2>
              </div>
              <p className="text-gray-300">
                Create test cases to break the attacker&apos;s code! Include edge cases and gotchas.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Test Case Creator */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4">Create Test Case</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Input</label>
                    <input
                      type="text"
                      value={newTestCase.input}
                      onChange={(e) => setNewTestCase(prev => ({ ...prev, input: e.target.value }))}
                      placeholder="[1,2,3,2,4]"
                      className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Expected Output</label>
                    <input
                      type="text"
                      value={newTestCase.expectedOutput}
                      onChange={(e) => setNewTestCase(prev => ({ ...prev, expectedOutput: e.target.value }))}
                      placeholder="2"
                      className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Point Value</label>
                    <select
                      value={newTestCase.points}
                      onChange={(e) => setNewTestCase(prev => ({ ...prev, points: parseInt(e.target.value) }))}
                      className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white"
                    >
                      <option value={10}>10 points (Basic)</option>
                      <option value={15}>15 points (Tricky)</option>
                      <option value={20}>20 points (Evil)</option>
                    </select>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddTestCase}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
                  >
                    Add Test Case
                  </motion.button>
                </div>
              </div>

              {/* Test Cases List */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4">Your Test Cases</h3>
                
                <div className="space-y-3">
                  {defenderTestCases.map((testCase) => (
                    <motion.div
                      key={testCase.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-gray-900 border border-gray-600 rounded p-3"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Test Case</span>
                        <div className="flex items-center gap-2">
                          <span className="text-blue-400 text-sm">{testCase.points} pts</span>
                          <button
                            onClick={() => removeTestCase(testCase.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <XCircle size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="font-mono text-sm">
                        <div className="text-green-400">Input: {testCase.input}</div>
                        <div className="text-blue-400">Expected: {testCase.expectedOutput}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {defenderTestCases.length >= 3 && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={runCollision}
                    className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded font-semibold transition-colors"
                  >
                    Launch Code Collision!
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {gamePhase === 'collision' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="bg-purple-900/20 border border-purple-700/30 rounded-lg p-6 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Target className="text-purple-400" size={32} />
                <h2 className="text-2xl font-bold text-purple-400">Code Collision!</h2>
              </div>
              {isRunning ? (
                <div className="flex items-center justify-center gap-2">
                  <RotateCcw className="animate-spin text-purple-400" size={20} />
                  <span>Testing attacker code against defender test cases...</span>
                </div>
              ) : (
                <p className="text-gray-300">Collision complete! See results below.</p>
              )}
            </div>

            {/* Collision Results */}
            {collisionResults.length > 0 && (
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4">🎯 Battle Results</h3>
                
                <div className="space-y-3">
                  {collisionResults.map((result) => (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`border-l-4 p-4 rounded ${
                        result.passed 
                          ? 'border-green-400 bg-green-900/20' 
                          : 'border-red-400 bg-red-900/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {result.passed ? (
                            <CheckCircle className="text-green-400" size={16} />
                          ) : (
                            <XCircle className="text-red-400" size={16} />
                          )}
                          <span className="font-medium">
                            {result.passed ? 'Test Passed' : 'Test Failed'}
                          </span>
                        </div>
                        <span className="text-sm font-bold">
                          {result.passed ? `+${result.points} Attacker` : `+${result.points} Defender`}
                        </span>
                      </div>
                      
                      <div className="font-mono text-sm space-y-1">
                        <div className="text-gray-400">Input: {result.input}</div>
                        <div className="text-blue-400">Expected: {result.expectedOutput}</div>
                        <div className={result.passed ? 'text-green-400' : 'text-red-400'}>
                          Actual: {result.actualOutput}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {gamePhase === 'finished' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <div className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-lg p-8">
              <h2 className="text-3xl font-bold mb-4">🏆 Battle Complete!</h2>
              
              <div className="flex justify-center gap-8 mb-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-red-400">{attackerPoints}</div>
                  <div className="text-gray-300">Attacker Points</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-400">{defenderPoints}</div>
                  <div className="text-gray-300">Defender Points</div>
                </div>
              </div>
              
              <div className="text-2xl font-bold mb-4">
                {attackerPoints > defenderPoints ? '⚔️ Attacker Wins!' : '🛡️ Defender Wins!'}
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 px-8 rounded-lg font-semibold transition-all"
              >
                Play Again
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AttackDefendPage;
