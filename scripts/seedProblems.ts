import mongoose from 'mongoose';
import Problem from '../models/Problem';
import User from '../models/User';
import ProblemSuggestion from '../models/ProblemSuggestion';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/coderspae';

// Sample problems data
const problemsData = [
  {
    title: 'Two Sum',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
    difficulty: 'Easy',
    category: ['Quick Dual (1v1)', 'Minimalist Mind'],
    timeLimit: 15,
    rating: 4.2,
    solvedBy: 1234,
    tags: ['Array', 'Hash Table'],
    testCases: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        expectedOutput: '[0,1]',
        isHidden: false
      },
      {
        input: 'nums = [3,2,4], target = 6',
        expectedOutput: '[1,2]',
        isHidden: false
      },
      {
        input: 'nums = [3,3], target = 6',
        expectedOutput: '[0,1]',
        isHidden: true
      }
    ],
    constraints: '2 <= nums.length <= 10^4, -10^9 <= nums[i] <= 10^9, -10^9 <= target <= 10^9',
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      }
    ],
    hints: ['Use a hash map to store the complement of each number', 'Check if the complement exists in the hash map'],
    isActive: true,
    isApproved: true
  },
  {
    title: 'Binary Tree Inorder Traversal',
    description: 'Given the root of a binary tree, return the inorder traversal of its nodes\' values.',
    difficulty: 'Medium',
    category: ['Mirror Arena', 'Team Clash'],
    timeLimit: 25,
    rating: 4.1,
    solvedBy: 892,
    tags: ['Tree', 'Stack', 'Recursion', 'Depth-First Search'],
    testCases: [
      {
        input: 'root = [1,null,2,3]',
        expectedOutput: '[1,3,2]',
        isHidden: false
      },
      {
        input: 'root = []',
        expectedOutput: '[]',
        isHidden: false
      },
      {
        input: 'root = [1]',
        expectedOutput: '[1]',
        isHidden: true
      }
    ],
    constraints: 'The number of nodes in the tree is in the range [0, 100]. -100 <= Node.val <= 100',
    examples: [
      {
        input: 'root = [1,null,2,3]',
        output: '[1,3,2]',
        explanation: 'Inorder traversal visits left subtree, root, then right subtree'
      }
    ],
    hints: ['Use recursion or stack-based iterative approach', 'Visit left subtree, process node, then visit right subtree'],
    isActive: true,
    isApproved: true
  },
  {
    title: 'Median of Two Sorted Arrays',
    description: 'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).',
    difficulty: 'Hard',
    category: ['Attack & Defend'],
    timeLimit: 35,
    rating: 4.5,
    solvedBy: 456,
    tags: ['Array', 'Binary Search', 'Divide and Conquer'],
    testCases: [
      {
        input: 'nums1 = [1,3], nums2 = [2]',
        expectedOutput: '2.00000',
        isHidden: false
      },
      {
        input: 'nums1 = [1,2], nums2 = [3,4]',
        expectedOutput: '2.50000',
        isHidden: false
      },
      {
        input: 'nums1 = [0,0], nums2 = [0,0]',
        expectedOutput: '0.00000',
        isHidden: true
      }
    ],
    constraints: 'nums1.length == m, nums2.length == n, 0 <= m <= 1000, 0 <= n <= 1000, 1 <= m + n <= 2000',
    examples: [
      {
        input: 'nums1 = [1,3], nums2 = [2]',
        output: '2.00000',
        explanation: 'merged array = [1,2,3] and median is 2.'
      }
    ],
    hints: ['Use binary search to partition arrays', 'Ensure left partition has correct number of elements'],
    isActive: true,
    isApproved: true
  },
  {
    title: 'Valid Parentheses',
    description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
    difficulty: 'Easy',
    category: ['Minimalist Mind', 'Quick Dual (1v1)'],
    timeLimit: 12,
    rating: 4.3,
    solvedBy: 2103,
    tags: ['String', 'Stack'],
    testCases: [
      {
        input: 's = "()"',
        expectedOutput: 'true',
        isHidden: false
      },
      {
        input: 's = "()[]{}"',
        expectedOutput: 'true',
        isHidden: false
      },
      {
        input: 's = "(]"',
        expectedOutput: 'false',
        isHidden: true
      }
    ],
    constraints: '1 <= s.length <= 10^4, s consists of parentheses only \'()[]{}\'.', 
    examples: [
      {
        input: 's = "()"',
        output: 'true',
        explanation: 'The string has valid parentheses pairs'
      }
    ],
    hints: ['Use a stack to keep track of opening brackets', 'Match each closing bracket with the most recent opening bracket'],
    isActive: true,
    isApproved: true
  },
  {
    title: 'Longest Substring Without Repeating Characters',
    description: 'Given a string s, find the length of the longest substring without repeating characters.',
    difficulty: 'Medium',
    category: ['Narrative Mode', 'Mirror Arena'],
    timeLimit: 20,
    rating: 4.0,
    solvedBy: 987,
    tags: ['Hash Table', 'String', 'Sliding Window'],
    testCases: [
      {
        input: 's = "abcabcbb"',
        expectedOutput: '3',
        isHidden: false
      },
      {
        input: 's = "bbbbb"',
        expectedOutput: '1',
        isHidden: false
      },
      {
        input: 's = "pwwkew"',
        expectedOutput: '3',
        isHidden: true
      }
    ],
    constraints: '0 <= s.length <= 5 * 10^4, s consists of English letters, digits, symbols and spaces.',
    examples: [
      {
        input: 's = "abcabcbb"',
        output: '3',
        explanation: 'The answer is "abc", with the length of 3.'
      }
    ],
    hints: ['Use sliding window technique', 'Keep track of characters and their positions'],
    isActive: true,
    isApproved: true
  },
  {
    title: 'Reverse Linked List',
    description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
    difficulty: 'Easy',
    category: ['Team Clash', 'Quick Dual (1v1)'],
    timeLimit: 18,
    rating: 4.4,
    solvedBy: 1876,
    tags: ['Linked List', 'Recursion'],
    testCases: [
      {
        input: 'head = [1,2,3,4,5]',
        expectedOutput: '[5,4,3,2,1]',
        isHidden: false
      },
      {
        input: 'head = [1,2]',
        expectedOutput: '[2,1]',
        isHidden: false
      },
      {
        input: 'head = []',
        expectedOutput: '[]',
        isHidden: true
      }
    ],
    constraints: 'The number of nodes in the list is the range [0, 5000]. -5000 <= Node.val <= 5000',
    examples: [
      {
        input: 'head = [1,2,3,4,5]',
        output: '[5,4,3,2,1]',
        explanation: 'Reverse the direction of pointers in the linked list'
      }
    ],
    hints: ['Use iterative approach with three pointers', 'Or use recursion to reverse the rest and fix connections'],
    isActive: true,
    isApproved: true
  }
];

// Sample problem suggestions data
const suggestionsData = [
  {
    title: 'Maximum Subarray',
    description: 'Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.',
    difficulty: 'Medium',
    category: ['Quick Dual (1v1)', 'Mirror Arena'],
    timeLimit: 22,
    tags: ['Array', 'Dynamic Programming', 'Divide and Conquer'],
    totalVotes: 67,
    status: 'pending'
  },
  {
    title: 'Climbing Stairs',
    description: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
    difficulty: 'Easy',
    category: ['Minimalist Mind', 'Narrative Mode'],
    timeLimit: 15,
    tags: ['Math', 'Dynamic Programming', 'Memoization'],
    totalVotes: 45,
    status: 'pending'
  },
  {
    title: 'Merge Two Sorted Lists',
    description: 'You are given the heads of two sorted linked lists list1 and list2. Merge the two lists in a one sorted list.',
    difficulty: 'Easy',
    category: ['Team Clash', 'Quick Dual (1v1)'],
    timeLimit: 16,
    tags: ['Linked List', 'Recursion'],
    totalVotes: 38,
    status: 'pending'
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Problem.deleteMany({});
    await ProblemSuggestion.deleteMany({});
    console.log('Cleared existing data');

    // Create problems
    const createdProblems = await Problem.insertMany(problemsData);
    console.log(`Created ${createdProblems.length} problems`);

    // Get a sample user ID (assuming users exist)
    const sampleUser = await User.findOne({});
    if (sampleUser) {
      // Add suggestedBy to suggestions
      const suggestionsWithUser = suggestionsData.map(suggestion => ({
        ...suggestion,
        suggestedBy: sampleUser._id,
        votes: Array.from({ length: suggestion.totalVotes }, () => ({
          user: sampleUser._id,
          vote: 'up',
          votedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date within last 30 days
        }))
      }));

      const createdSuggestions = await ProblemSuggestion.insertMany(suggestionsWithUser);
      console.log(`Created ${createdSuggestions.length} problem suggestions`);
    } else {
      console.log('No users found, skipping problem suggestions');
    }

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

export { seedDatabase };
