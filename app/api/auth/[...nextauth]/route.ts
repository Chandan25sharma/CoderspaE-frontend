import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import Session from '@/models/Session';
import Administrator from '@/models/Administrator';

// Helper function to get client IP and device info
function getClientInfo(req: any) {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded ? forwarded.split(',')[0] : req.headers['x-real-ip'] || req.connection?.remoteAddress || 'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';
  
  return { ip, userAgent };
}

// Helper function to parse user agent
function parseUserAgent(userAgent: string) {
  const browserMatch = userAgent.match(/(Chrome|Firefox|Safari|Edge|Opera)\/?([\d\.]+)/);
  const osMatch = userAgent.match(/(Windows|Mac|Linux|Android|iOS)/);
  
  return {
    browser: browserMatch ? `${browserMatch[1]} ${browserMatch[2]}` : 'Unknown',
    os: osMatch ? osMatch[1] : 'Unknown',
    device: userAgent.includes('Mobile') ? 'Mobile' : 'Desktop'
  };
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        name: { label: 'Name', type: 'text' },
        isSignUp: { label: 'Is Sign Up', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        await connectDB();
        
        // Handle sign up
        if (credentials.isSignUp === 'true') {
          const existingUser = await User.findOne({ email: credentials.email });
          if (existingUser) {
            throw new Error('User already exists');
          }
          
          // Hash password
          const hashedPassword = await bcrypt.hash(credentials.password, 12);
          
          const newUser = await User.create({
            email: credentials.email,
            name: credentials.name || credentials.email.split('@')[0],
            password: hashedPassword,
            isVerified: true,
            role: 'user'
          });
          
          return {
            id: newUser._id.toString(),
            email: newUser.email,
            name: newUser.name,
            image: newUser.image,
            role: newUser.role || 'user',
          };
        }
        
        // Handle sign in
        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          throw new Error('No user found with this email');
        }

        // Check password
        if (user.password) {
          const isValidPassword = await bcrypt.compare(credentials.password, user.password);
          if (!isValidPassword) {
            throw new Error('Invalid password');
          }
        } else {
          // User might be OAuth user without password
          throw new Error('Please sign in with the method you used to create this account');
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role || 'user',
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      await connectDB();
      
      let existingUser;
      
      if (account?.provider === 'google') {
        existingUser = await User.findOne({ email: user.email });
        
        if (!existingUser) {
          existingUser = await User.create({
            email: user.email,
            name: user.name,
            image: user.image,
            googleProfile: {
              id: account.providerAccountId,
              profileUrl: `https://plus.google.com/${account.providerAccountId}`
            },
            isVerified: true,
            loginCount: 1,
          });
        } else {
          // Update user info and increment login count
          existingUser.lastActive = new Date();
          existingUser.loginCount += 1;
          existingUser.image = user.image || existingUser.image;
          existingUser.name = user.name || existingUser.name;
          if (!existingUser.googleProfile?.id) {
            existingUser.googleProfile = {
              id: account.providerAccountId,
              profileUrl: `https://plus.google.com/${account.providerAccountId}`
            };
          }
          await existingUser.save();
        }
        
        // Create session record
        await Session.create({
          userId: existingUser._id.toString(),
          userEmail: existingUser.email,
          userName: existingUser.name,
          provider: 'google',
          loginTime: new Date(),
          lastActivity: new Date(),
          isActive: true,
        });
      }
      
      if (account?.provider === 'github') {
        existingUser = await User.findOne({ email: user.email });
        
        if (!existingUser) {
          existingUser = await User.create({
            email: user.email,
            name: user.name,
            image: user.image,
            githubProfile: {
              id: account.providerAccountId,
              username: (profile as { login?: string })?.login || user.name,
              profileUrl: `https://github.com/${(profile as { login?: string })?.login || user.name}`
            },
            isVerified: true,
            loginCount: 1,
          });
        } else {
          // Update user info and increment login count
          existingUser.lastActive = new Date();
          existingUser.loginCount += 1;
          existingUser.image = user.image || existingUser.image;
          existingUser.name = user.name || existingUser.name;
          if (!existingUser.githubProfile?.id) {
            existingUser.githubProfile = {
              id: account.providerAccountId,
              username: (profile as { login?: string })?.login || user.name,
              profileUrl: `https://github.com/${(profile as { login?: string })?.login || user.name}`
            };
          }
          await existingUser.save();
        }
        
        // Create session record
        await Session.create({
          userId: existingUser._id.toString(),
          userEmail: existingUser.email,
          userName: existingUser.name,
          provider: 'github',
          loginTime: new Date(),
          lastActivity: new Date(),
          isActive: true,
        });
      }
      
      return true;
    },
    async session({ session }) {
      if (session.user?.email) {
        await connectDB();
        
        // Check if user is an administrator
        const admin = await Administrator.findOne({ email: session.user.email, isActive: true });
        if (admin) {
          session.user.id = admin._id.toString();
          session.user.role = 'admin';
          session.user.name = admin.name;
          session.user.image = session.user.image;
          // Update last login
          admin.lastLogin = new Date();
          await admin.save();
          return session;
        }
        
        // Regular user
        const user = await User.findOne({ email: session.user.email });
        if (user) {
          session.user.id = user._id.toString();
          session.user.role = user.role || 'user';
          session.user.rating = user.rating;
          session.user.battlesWon = user.battlesWon;
          session.user.battlesLost = user.battlesLost;
          session.user.totalBattles = user.totalBattles;
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
