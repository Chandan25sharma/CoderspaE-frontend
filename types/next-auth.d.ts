import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
      role: 'user' | 'admin';
      rating: number;
      battlesWon: number;
      battlesLost: number;
      totalBattles: number;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    image?: string;
    role: 'user' | 'admin';
    rating?: number;
    battlesWon?: number;
    battlesLost?: number;
    totalBattles?: number;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: 'user' | 'admin';
    rating?: number;
  }
}
