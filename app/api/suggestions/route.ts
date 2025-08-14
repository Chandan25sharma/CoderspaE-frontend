import { NextRequest, NextResponse } from 'next/server';

interface Suggestion {
  _id: string;
  title: string;
  description: string;
  difficulty?: string;
  category?: string[];
  tags?: string[];
  suggestedBy: {
    name: string;
    _id: string;
  };
  upvotes: number;
  downvotes: number;
  createdAt: string;
}

// Mock data for suggestions
const mockSuggestions: Suggestion[] = [
  {
    _id: 'sug1',
    title: 'Graph Coloring Problem',
    description: 'Given an undirected graph and a number m, determine if the graph can be colored with at most m colors such that no two adjacent vertices share the same color.',
    difficulty: 'Hard',
    category: ['Graph', 'Backtracking'],
    tags: ['graph-theory', 'coloring'],
    suggestedBy: {
      name: 'Alex Chen',
      _id: 'user1'
    },
    upvotes: 15,
    downvotes: 2,
    createdAt: '2024-01-30T10:15:00Z'
  },
  {
    _id: 'sug2',
    title: 'Palindromic Substrings',
    description: 'Given a string, count how many palindromic substrings in this string. Different substrings with the same content count as different substrings.',
    difficulty: 'Medium',
    category: ['String', 'Dynamic Programming'],
    tags: ['palindrome', 'counting'],
    suggestedBy: {
      name: 'Sarah Johnson',
      _id: 'user2'
    },
    upvotes: 12,
    downvotes: 1,
    createdAt: '2024-01-30T14:30:00Z'
  },
  {
    _id: 'sug3',
    title: 'Design Twitter',
    description: 'Design a simplified version of Twitter where users can post tweets, follow/unfollow users, and see tweets from followed users in their timeline.',
    difficulty: 'Medium',
    category: ['Design', 'Hash Table'],
    tags: ['system-design', 'social-media'],
    suggestedBy: {
      name: 'Mike Rodriguez',
      _id: 'user3'
    },
    upvotes: 8,
    downvotes: 3,
    createdAt: '2024-01-31T09:45:00Z'
  },
  {
    _id: 'sug4',
    title: 'LRU Cache Implementation',
    description: 'Design and implement a data structure for Least Recently Used (LRU) cache with O(1) time complexity for both get and put operations.',
    difficulty: 'Medium',
    category: ['Design', 'Hash Table', 'Linked List'],
    tags: ['cache', 'data-structures'],
    suggestedBy: {
      name: 'Emily Davis',
      _id: 'user4'
    },
    upvotes: 20,
    downvotes: 1,
    createdAt: '2024-02-01T11:20:00Z'
  },
  {
    _id: 'sug5',
    title: 'Knight Tour Problem',
    description: 'Given a N×N chessboard with the Knight placed on the first block of an empty board, find if Knight can move to all squares of the chessboard.',
    difficulty: 'Hard',
    category: ['Backtracking', 'Matrix'],
    tags: ['chess', 'backtracking'],
    suggestedBy: {
      name: 'David Kim',
      _id: 'user5'
    },
    upvotes: 6,
    downvotes: 4,
    createdAt: '2024-02-02T16:15:00Z'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'newest'; // 'newest', 'popular', 'upvotes'

    let filteredSuggestions = [...mockSuggestions];

    // Filter by search term
    if (search) {
      filteredSuggestions = filteredSuggestions.filter(suggestion =>
        suggestion.title.toLowerCase().includes(search.toLowerCase()) ||
        suggestion.description.toLowerCase().includes(search.toLowerCase()) ||
        suggestion.suggestedBy.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sort suggestions
    switch (sortBy) {
      case 'popular':
        filteredSuggestions.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
        break;
      case 'upvotes':
        filteredSuggestions.sort((a, b) => b.upvotes - a.upvotes);
        break;
      case 'newest':
      default:
        filteredSuggestions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return NextResponse.json({
      success: true,
      data: filteredSuggestions
    });

  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch suggestions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, difficulty, category, tags } = body;

    // Validate required fields
    if (!title || !description) {
      return NextResponse.json(
        { success: false, error: 'Title and description are required' },
        { status: 400 }
      );
    }

    // Create new suggestion
    const newSuggestion: Suggestion = {
      _id: `sug${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      difficulty: difficulty || 'Medium',
      category: category || ['General'],
      tags: tags || [],
      suggestedBy: {
        name: 'Anonymous User', // In real app, get from session
        _id: 'anonymous'
      },
      upvotes: 0,
      downvotes: 0,
      createdAt: new Date().toISOString()
    };

    // Add to mock suggestions array (in real app, save to database)
    mockSuggestions.unshift(newSuggestion);

    return NextResponse.json({
      success: true,
      data: newSuggestion,
      message: 'Suggestion submitted successfully! Thank you for contributing to the community.'
    });

  } catch (error) {
    console.error('Error submitting suggestion:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit suggestion. Please try again.' },
      { status: 500 }
    );
  }
}

// PATCH endpoint for voting on suggestions
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { suggestionId, action } = body; // action: 'upvote' or 'downvote'

    if (!suggestionId || !action) {
      return NextResponse.json(
        { success: false, error: 'Suggestion ID and action are required' },
        { status: 400 }
      );
    }

    const suggestion = mockSuggestions.find(s => s._id === suggestionId);
    
    if (!suggestion) {
      return NextResponse.json(
        { success: false, error: 'Suggestion not found' },
        { status: 404 }
      );
    }

    // Update vote count
    if (action === 'upvote') {
      suggestion.upvotes += 1;
    } else if (action === 'downvote') {
      suggestion.downvotes += 1;
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid action. Use "upvote" or "downvote"' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: suggestion,
      message: `${action === 'upvote' ? 'Upvoted' : 'Downvoted'} successfully!`
    });

  } catch (error) {
    console.error('Error voting on suggestion:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process vote' },
      { status: 500 }
    );
  }
}
