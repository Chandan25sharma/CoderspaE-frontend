import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/mongodb';
import CodeExecution from '@/models/CodeExecution';
import User from '@/models/User';

// Mock code execution service - In production, you would use a proper sandboxed environment
async function executeCode(code: string, language: string, input: string = '') {
  const startTime = Date.now();
  
  try {
    let output = '';
    let error = null;
    
    // This is a mock implementation
    // In production, you should use a sandboxed environment like:
    // - Docker containers
    // - AWS Lambda
    // - Judge0 API
    // - CodeRunner services
    
    switch (language) {
      case 'javascript':
        try {
          // Simple JavaScript execution (UNSAFE - for demo only)
          // In production, use a sandboxed environment
          const result = eval(`
            const console = {
              log: (...args) => output += args.join(' ') + '\\n'
            };
            ${code}
          `);
          if (result !== undefined) {
            output += String(result);
          }
        } catch (e) {
          error = (e as Error).message;
        }
        break;
        
      case 'python':
        // Mock Python execution
        output = `Mock Python execution result for:\n${code}\n\nOutput: Hello from Python!`;
        if (code.includes('print(')) {
          const matches = code.match(/print\((.*?)\)/g);
          if (matches) {
            output = matches.map(match => {
              const content = match.replace('print(', '').replace(')', '');
              return content.replace(/['"]/g, '');
            }).join('\n');
          }
        }
        break;
        
      case 'java':
        // Mock Java execution
        output = `Mock Java execution result for:\n${code}\n\nOutput: Hello from Java!`;
        if (code.includes('System.out.println(')) {
          const matches = code.match(/System\.out\.println\((.*?)\)/g);
          if (matches) {
            output = matches.map(match => {
              const content = match.replace('System.out.println(', '').replace(')', '');
              return content.replace(/['"]/g, '');
            }).join('\n');
          }
        }
        break;
        
      case 'cpp':
        // Mock C++ execution
        output = `Mock C++ execution result for:\n${code}\n\nOutput: Hello from C++!`;
        if (code.includes('cout')) {
          const matches = code.match(/cout\s*<<\s*(.*?)\s*;/g);
          if (matches) {
            output = matches.map(match => {
              const content = match.replace(/cout\s*<<\s*/, '').replace(/\s*;/, '');
              return content.replace(/['"]/g, '').replace('endl', '\n');
            }).join('');
          }
        }
        break;
        
      default:
        error = 'Unsupported language';
    }
    
    const executionTime = Date.now() - startTime;
    
    return {
      output: output || 'No output',
      error,
      executionTime,
      status: error ? 'error' : 'success',
      memoryUsed: Math.floor(Math.random() * 1024 * 1024) // Mock memory usage
    };
    
  } catch (e) {
    return {
      output: '',
      error: (e as Error).message,
      executionTime: Date.now() - startTime,
      status: 'error',
      memoryUsed: 0
    };
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { code, language, input, context = 'playground' } = await req.json();
    
    if (!code || !language) {
      return NextResponse.json({ error: 'Code and language are required' }, { status: 400 });
    }
    
    await connectDB();
    
    // Get user info
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Execute the code
    const result = await executeCode(code, language, input);
    
    // Get client IP
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : req.headers.get('x-real-ip') || 'unknown';
    
    // Save execution record
    const execution = await CodeExecution.create({
      userId: user._id.toString(),
      userEmail: user.email,
      code,
      language,
      input: input || '',
      output: result.output,
      error: result.error,
      executionTime: result.executionTime,
      memoryUsed: result.memoryUsed,
      status: result.status,
      executedAt: new Date(),
      ipAddress: ip,
      context,
    });
    
    // Update user's total executions
    user.totalCodeExecutions += 1;
    
    // Update favorite languages
    if (!user.favoriteLanguages.includes(language)) {
      user.favoriteLanguages.push(language);
    }
    
    await user.save();
    
    return NextResponse.json({
      success: true,
      executionId: execution._id,
      output: result.output,
      error: result.error,
      executionTime: result.executionTime,
      memoryUsed: result.memoryUsed,
      status: result.status,
    });
    
  } catch (error) {
    console.error('Code execution error:', error);
    return NextResponse.json(
      { error: 'Failed to execute code' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await connectDB();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Get user's recent executions
    const executions = await CodeExecution.find({ userId: user._id.toString() })
      .sort({ executedAt: -1 })
      .limit(20)
      .select('-code') // Don't send the full code for privacy
      .lean();
    
    return NextResponse.json({
      success: true,
      executions,
      totalExecutions: user.totalCodeExecutions,
    });
    
  } catch (error) {
    console.error('Failed to fetch executions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch executions' },
      { status: 500 }
    );
  }
}
