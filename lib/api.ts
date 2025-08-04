const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`,
      };
    }
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(response.status, data.message || data.error || 'Request failed');
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error('API request failed:', error);
    throw new ApiError(0, 'Network error occurred');
  }
}

// Tournament API
export const tournamentApi = {
  // Get all tournaments
  getAll: (params?: {
    status?: string;
    featured?: boolean;
    difficulty?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set('status', params.status);
    if (params?.featured) searchParams.set('featured', 'true');
    if (params?.difficulty) searchParams.set('difficulty', params.difficulty);
    
    const query = searchParams.toString();
    return apiRequest<{ tournaments: any[] }>(`/tournaments${query ? `?${query}` : ''}`);
  },

  // Get single tournament
  getById: (id: string) => 
    apiRequest<{ tournament: any }>(`/tournaments/${id}`),

  // Register for tournament
  register: (id: string) => 
    apiRequest<{ tournament: any; message: string }>(`/tournaments/${id}/register`, {
      method: 'POST',
    }),

  // Create tournament (admin)
  create: (data: any) => 
    apiRequest<{ tournament: any; message: string }>('/tournaments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Update tournament (admin)
  update: (id: string, data: any) => 
    apiRequest<{ tournament: any; message: string }>(`/tournaments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Delete tournament (admin)
  delete: (id: string) => 
    apiRequest<{ message: string }>(`/tournaments/${id}`, {
      method: 'DELETE',
    }),
};

// User API
export const userApi = {
  // Get user profile (public)
  getProfile: (userId: string) => 
    apiRequest<{ user: any }>(`/users/${userId}`),

  // Get current user's profile
  getMyProfile: () => 
    apiRequest<{ user: any }>('/users/me/profile'),

  // Update profile
  updateProfile: (data: any) => 
    apiRequest<{ user: any; message: string }>('/users/me/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Get leaderboard
  getLeaderboard: (params?: { page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    
    const query = searchParams.toString();
    return apiRequest<{ users: any[]; pagination: any }>(`/users/leaderboard/global${query ? `?${query}` : ''}`);
  },

  // Get user activity
  getActivity: () => 
    apiRequest<{ activities: any[] }>('/users/me/activity'),
};

// Challenge API
export const challengeApi = {
  // Get all challenges
  getAll: (params?: {
    difficulty?: string;
    tags?: string[];
    active?: boolean;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.difficulty) searchParams.set('difficulty', params.difficulty);
    if (params?.tags) searchParams.set('tags', params.tags.join(','));
    if (params?.active) searchParams.set('active', 'true');
    
    const query = searchParams.toString();
    return apiRequest<{ challenges: any[] }>(`/challenges${query ? `?${query}` : ''}`);
  },

  // Get single challenge
  getById: (id: string) => 
    apiRequest<{ challenge: any }>(`/challenges/${id}`),

  // Submit solution
  submit: (id: string, data: { code: string; language: string }) => 
    apiRequest<{ result: any }>(`/challenges/${id}/submit`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Auth API
export const authApi = {
  // Login
  login: (credentials: { email: string; password: string }) => 
    apiRequest<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  // Register
  register: (data: { name: string; email: string; password: string }) => 
    apiRequest<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Refresh token
  refresh: () => 
    apiRequest<{ token: string }>('/auth/refresh', {
      method: 'POST',
    }),
};

export { ApiError };
