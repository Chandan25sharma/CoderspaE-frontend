import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

interface CodeMetrics {
  complexity: number;
  readability: number;
  efficiency: number;
  bestPractices: number;
}

interface AIInsight {
  type: 'suggestion' | 'warning' | 'optimization' | 'best_practice';
  message: string;
  code?: string;
  line?: number;
  severity: 'low' | 'medium' | 'high';
}

// AI-powered code analysis system
class CodeAnalyzer {
  static analyzeCode(code: string, language: string): { metrics: CodeMetrics; insights: AIInsight[] } {
    const insights: AIInsight[] = [];
    const metrics: CodeMetrics = {
      complexity: 0,
      readability: 0,
      efficiency: 0,
      bestPractices: 0
    };

    // Complexity Analysis
    const cyclomaticComplexity = this.calculateCyclomaticComplexity(code);
    metrics.complexity = Math.max(0, 100 - cyclomaticComplexity * 10);

    if (cyclomaticComplexity > 10) {
      insights.push({
        type: 'warning',
        message: 'High cyclomatic complexity detected. Consider breaking down into smaller functions.',
        severity: 'high'
      });
    }

    // Readability Analysis
    const readabilityScore = this.analyzeReadability(code, language);
    metrics.readability = readabilityScore;

    // Efficiency Analysis
    const efficiencyScore = this.analyzeEfficiency(code, language);
    metrics.efficiency = efficiencyScore;

    // Best Practices Analysis
    const bestPracticesScore = this.analyzeBestPractices(code, language);
    metrics.bestPractices = bestPracticesScore;

    return { metrics, insights };
  }

  private static calculateCyclomaticComplexity(code: string): number {
    const controlFlow = /\b(if|else|while|for|switch|case|catch|&&|\|\|)\b/g;
    const matches = code.match(controlFlow);
    return (matches?.length || 0) + 1;
  }

  private static analyzeReadability(code: string, language: string): number {
    let score = 100;
    
    // Check for meaningful variable names
    const variableNames = code.match(/\b(let|const|var|int|string|float|double)\s+([a-zA-Z_][a-zA-Z0-9_]*)/g);
    if (variableNames) {
      const shortNames = variableNames.filter(name => name.length < 3);
      score -= shortNames.length * 5;
    }

    // Check for comments
    const commentRatio = this.getCommentRatio(code, language);
    if (commentRatio < 0.1) score -= 15;

    // Check line length
    const lines = code.split('\n');
    const longLines = lines.filter(line => line.length > 120);
    score -= longLines.length * 3;

    return Math.max(0, score);
  }

  private static analyzeEfficiency(code: string, language: string): number {
    let score = 100;
    
    // Check for nested loops
    const nestedLoops = (code.match(/for.*{[^}]*for/g) || []).length;
    score -= nestedLoops * 20;

    // Check for redundant operations
    if (code.includes('.length') && code.includes('for')) {
      const lengthInLoop = code.match(/for.*\.length.*{/g);
      if (lengthInLoop) score -= 10;
    }

    // Language-specific optimizations
    switch (language) {
      case 'javascript':
        if (code.includes('var ')) score -= 5; // Prefer let/const
        if (code.includes('==') && !code.includes('===')) score -= 10;
        break;
      case 'python':
        if (code.includes('range(len(')) score -= 5; // Prefer enumerate
        break;
    }

    return Math.max(0, score);
  }

  private static analyzeBestPractices(code: string, language: string): number {
    let score = 100;
    
    // Check for error handling
    const hasErrorHandling = /try|catch|except|finally/i.test(code);
    if (!hasErrorHandling && code.length > 100) score -= 15;

    // Check for magic numbers
    const magicNumbers = code.match(/\b\d{2,}\b/g);
    if (magicNumbers && magicNumbers.length > 2) score -= 10;

    // Language-specific best practices
    switch (language) {
      case 'javascript':
        if (!code.includes('use strict') && code.length > 50) score -= 5;
        break;
      case 'python':
        if (!code.match(/^def\s+\w+\(/m) && code.length > 50) score -= 5; // Function definition
        break;
    }

    return Math.max(0, score);
  }

  private static getCommentRatio(code: string, language: string): number {
    const totalLines = code.split('\n').length;
    let commentLines = 0;

    switch (language) {
      case 'javascript':
      case 'java':
      case 'cpp':
        commentLines = (code.match(/\/\/.*|\/\*[\s\S]*?\*\//g) || []).length;
        break;
      case 'python':
        commentLines = (code.match(/#.*|'''[\s\S]*?'''|"""[\s\S]*?"""/g) || []).length;
        break;
    }

    return commentLines / totalLines;
  }

  static generatePersonalizedInsights(userCode: string[], language: string): AIInsight[] {
    const insights: AIInsight[] = [];
    
    // Analyze patterns across multiple submissions
    const commonMistakes = this.findCommonMistakes(userCode, language);
    
    commonMistakes.forEach(mistake => {
      insights.push({
        type: 'suggestion',
        message: `Pattern detected: ${mistake.description}. ${mistake.suggestion}`,
        severity: 'medium'
      });
    });

    return insights;
  }

  private static findCommonMistakes(codeHistory: string[], language: string): Array<{description: string, suggestion: string}> {
    const mistakes = [];
    
    // Check for repeated inefficient patterns
    const inefficientLoops = codeHistory.filter(code => 
      code.includes('for') && code.includes('.length') && 
      code.split('for').length > 2
    ).length;
    
    if (inefficientLoops > 2) {
      mistakes.push({
        description: 'Frequent use of nested loops',
        suggestion: 'Consider using hash maps or optimized algorithms to reduce time complexity'
      });
    }

    return mistakes;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, code, language, userId, sessionId } = await request.json();
    const client = await clientPromise;
    const db = client.db('coderspae');

    switch (action) {
      case 'analyze_code':
        const analysis = CodeAnalyzer.analyzeCode(code, language);
        
        // Store analysis for learning
        await db.collection('code_analyses').insertOne({
          userId,
          sessionId,
          code,
          language,
          metrics: analysis.metrics,
          insights: analysis.insights,
          timestamp: new Date()
        });

        return NextResponse.json({
          success: true,
          analysis
        });

      case 'get_personalized_insights':
        // Get user's recent code submissions
        const recentCode = await db.collection('code_analyses')
          .find({ userId })
          .sort({ timestamp: -1 })
          .limit(10)
          .toArray();

        const codeHistory = recentCode.map(item => item.code);
        const personalizedInsights = CodeAnalyzer.generatePersonalizedInsights(codeHistory, language);

        return NextResponse.json({
          success: true,
          insights: personalizedInsights
        });

      case 'get_improvement_suggestions':
        // Analyze user's coding patterns and suggest improvements
        const userAnalyses = await db.collection('code_analyses')
          .find({ userId })
          .sort({ timestamp: -1 })
          .limit(20)
          .toArray();

        const averageMetrics = this.calculateAverageMetrics(userAnalyses);
        const suggestions = this.generateImprovementSuggestions(averageMetrics);

        return NextResponse.json({
          success: true,
          averageMetrics,
          suggestions
        });

      case 'real_time_feedback':
        // Provide real-time feedback as user types
        const quickAnalysis = CodeAnalyzer.analyzeCode(code, language);
        const realtimeInsights = quickAnalysis.insights.filter(insight => 
          insight.severity === 'high' || insight.type === 'warning'
        );

        return NextResponse.json({
          success: true,
          insights: realtimeInsights,
          quickMetrics: quickAnalysis.metrics
        });

      default:
        return NextResponse.json({ success: false, error: 'Invalid action' });
    }
  } catch (error) {
    console.error('AI Insights API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' });
  }
}

function calculateAverageMetrics(analyses: any[]): CodeMetrics {
  if (analyses.length === 0) {
    return { complexity: 50, readability: 50, efficiency: 50, bestPractices: 50 };
  }

  const totals = analyses.reduce((acc, analysis) => ({
    complexity: acc.complexity + (analysis.metrics?.complexity || 0),
    readability: acc.readability + (analysis.metrics?.readability || 0),
    efficiency: acc.efficiency + (analysis.metrics?.efficiency || 0),
    bestPractices: acc.bestPractices + (analysis.metrics?.bestPractices || 0)
  }), { complexity: 0, readability: 0, efficiency: 0, bestPractices: 0 });

  return {
    complexity: Math.round(totals.complexity / analyses.length),
    readability: Math.round(totals.readability / analyses.length),
    efficiency: Math.round(totals.efficiency / analyses.length),
    bestPractices: Math.round(totals.bestPractices / analyses.length)
  };
}

function generateImprovementSuggestions(metrics: CodeMetrics): AIInsight[] {
  const suggestions: AIInsight[] = [];

  if (metrics.complexity < 70) {
    suggestions.push({
      type: 'suggestion',
      message: 'Focus on writing simpler, more modular code. Break complex functions into smaller, single-purpose functions.',
      severity: 'medium'
    });
  }

  if (metrics.readability < 70) {
    suggestions.push({
      type: 'suggestion',
      message: 'Improve code readability by using descriptive variable names and adding meaningful comments.',
      severity: 'medium'
    });
  }

  if (metrics.efficiency < 70) {
    suggestions.push({
      type: 'optimization',
      message: 'Consider learning more about algorithm complexity and optimization techniques.',
      severity: 'medium'
    });
  }

  if (metrics.bestPractices < 70) {
    suggestions.push({
      type: 'best_practice',
      message: 'Review language-specific best practices and coding standards for better code quality.',
      severity: 'medium'
    });
  }

  return suggestions;
}
