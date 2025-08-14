'use client';
import { useState } from 'react';
import { CodeEditor } from './CodeEditor';
import { motion } from 'framer-motion';
import { Play, Terminal, Clock, MemoryStick, CheckCircle, XCircle, Loader } from 'lucide-react';

interface ExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  executionTime: number;
  memoryUsed: number;
  status: 'success' | 'error' | 'timeout' | 'pending';
}

interface CodeExecutorProps {
  initialCode?: string;
  language: string;
  context?: 'playground' | 'practice' | 'battle' | 'tournament';
  height?: string;
  className?: string;
}

export function CodeExecutor({
  initialCode = '',
  language,
  context = 'playground',
  height = '400px',
  className = ''
}: CodeExecutorProps) {
  const [code, setCode] = useState(initialCode);
  const [input, setInput] = useState('');
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const executeCode = async () => {
    if (!code.trim()) {
      setResult({
        success: false,
        output: '',
        error: 'Please write some code before running',
        executionTime: 0,
        memoryUsed: 0,
        status: 'error'
      });
      return;
    }

    setIsExecuting(true);
    setResult(null);

    try {
      const response = await fetch('/api/code/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          language,
          input,
          context,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResult({
          success: true,
          output: data.output,
          error: data.error,
          executionTime: data.executionTime,
          memoryUsed: data.memoryUsed,
          status: data.status,
        });
      } else {
        setResult({
          success: false,
          output: '',
          error: data.error || 'Failed to execute code',
          executionTime: 0,
          memoryUsed: 0,
          status: 'error',
        });
      }
    } catch (error) {
      console.error('Code execution error:', error);
      setResult({
        success: false,
        output: '',
        error: 'Network error: Failed to execute code',
        executionTime: 0,
        memoryUsed: 0,
        status: 'error',
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const getLanguageExample = () => {
    switch (language) {
      case 'python':
        return `# Python Example
print("Hello, CoderspaE!")
name = input("What's your name? ")
print(f"Nice to meet you, {name}!")

# Try some calculations
numbers = [1, 2, 3, 4, 5]
total = sum(numbers)
print(f"Sum of {numbers} = {total}")`;

      case 'javascript':
        return `// JavaScript Example
console.log("Hello, CoderspaE!");

// Function example
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

// Calculate fibonacci sequence
for (let i = 0; i < 10; i++) {
    console.log(\`Fibonacci(\${i}) = \${fibonacci(i)}\`);
}`;

      case 'java':
        return `// Java Example
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, CoderspaE!");
        
        // Array example
        int[] numbers = {1, 2, 3, 4, 5};
        int sum = 0;
        
        for (int num : numbers) {
            sum += num;
        }
        
        System.out.println("Sum: " + sum);
    }
}`;

      case 'cpp':
        return `// C++ Example
#include <iostream>
#include <vector>
using namespace std;

int main() {
    cout << "Hello, CoderspaE!" << endl;
    
    // Vector example
    vector<int> numbers = {1, 2, 3, 4, 5};
    int sum = 0;
    
    for (int num : numbers) {
        sum += num;
    }
    
    cout << "Sum: " << sum << endl;
    
    return 0;
}`;

      default:
        return '// Write your code here';
    }
  };

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const formatMemory = (bytes: number) => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  return (
    <div className={`flex flex-col space-y-4 ${className}`}>
      {/* Code Editor */}
      <div className="relative">
        <CodeEditor
          value={code}
          onChange={setCode}
          language={language}
          height={height}
          onRun={executeCode}
          isRunning={isExecuting}
          placeholder={getLanguageExample()}
        />
        
        {/* Quick Actions */}
        <div className="absolute top-2 right-16 flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCode(getLanguageExample())}
            className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Example
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCode('')}
            className="px-3 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
          >
            Clear
          </motion.button>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Terminal size={16} className="text-gray-400" />
          <span className="text-sm text-gray-400">Input (optional)</span>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter input for your program..."
          className="w-full h-20 bg-gray-800 border border-gray-700 rounded p-2 text-white text-sm resize-none focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Run Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={executeCode}
        disabled={isExecuting}
        className="flex items-center justify-center gap-2 p-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg transition-colors font-medium"
      >
        {isExecuting ? (
          <Loader size={20} className="animate-spin" />
        ) : (
          <Play size={20} />
        )}
        {isExecuting ? 'Executing...' : 'Run Code'}
      </motion.button>

      {/* Results Section */}
      {(result || isExecuting) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden"
        >
          {/* Results Header */}
          <div className="flex items-center justify-between p-3 border-b border-gray-800 bg-gray-800">
            <div className="flex items-center gap-2">
              <Terminal size={16} className="text-green-400" />
              <span className="text-sm font-medium text-white">Execution Results</span>
              {result && (
                <div className="flex items-center gap-1">
                  {result.status === 'success' ? (
                    <CheckCircle size={14} className="text-green-400" />
                  ) : (
                    <XCircle size={14} className="text-red-400" />
                  )}
                  <span className={`text-xs ${result.status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                    {result.status}
                  </span>
                </div>
              )}
            </div>
            
            {result && !isExecuting && (
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  <span>{formatTime(result.executionTime)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MemoryStick size={12} />
                  <span>{formatMemory(result.memoryUsed)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Output/Error Content */}
          <div className="p-4">
            {isExecuting ? (
              <div className="flex items-center gap-2 text-gray-400">
                <Loader size={16} className="animate-spin" />
                <span>Executing your code...</span>
              </div>
            ) : result ? (
              <div className="space-y-3">
                {result.output && (
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Output:</div>
                    <pre className="bg-black rounded p-3 text-green-400 text-sm overflow-x-auto whitespace-pre-wrap">
                      {result.output}
                    </pre>
                  </div>
                )}
                
                {result.error && (
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Error:</div>
                    <pre className="bg-red-900 bg-opacity-20 border border-red-700 rounded p-3 text-red-400 text-sm overflow-x-auto whitespace-pre-wrap">
                      {result.error}
                    </pre>
                  </div>
                )}
                
                {!result.output && !result.error && (
                  <div className="text-gray-500 text-sm italic">
                    No output generated
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </motion.div>
      )}
    </div>
  );
}
