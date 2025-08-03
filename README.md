# CoderspaE Frontend

Next.js frontend for the CoderspaE real-time coding battle platform.

## Features

- 🎮 Real-time coding battles
- 💰 Premium subscription with Stripe
- 🤖 AI-generated challenges
- 👥 Team mode battles
- 📊 Live spectator mode
- 🏆 Tournaments and leaderboards
- 🎨 Premium themes
- 🔒 NextAuth authentication

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **Payments**: Stripe
- **Real-time**: Socket.IO Client
- **Animations**: Framer Motion
- **UI Components**: Lucide React icons
- **Code Editor**: Monaco Editor

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   - MongoDB URI
   - NextAuth secrets
   - Google/GitHub OAuth credentials
   - Stripe keys
   - Backend URLs

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   npm start
   ```

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables

Required environment variables for deployment:

```env
# NextAuth
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-secret-key

# Database
MONGODB_URI=your-mongodb-atlas-uri

# OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Backend
NEXT_PUBLIC_BACKEND_URL=https://your-backend.railway.app
NEXT_PUBLIC_SOCKET_URL=https://your-socket-server.railway.app

# Stripe
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
```

## Project Structure

```
frontend/
├── app/                    # App Router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── battle/            # Battle pages
│   ├── dashboard/         # User dashboard
│   ├── leaderboard/       # Leaderboard
│   └── payment/           # Payment pages
├── components/            # Reusable components
│   ├── EnhancedBattle.tsx # Main battle component
│   ├── PricingModal.tsx   # Subscription modal
│   └── ...
├── hooks/                 # Custom React hooks
├── public/                # Static assets
└── types/                 # TypeScript types
```

## Features Overview

### Battle System
- Real-time coding battles with live opponent code viewing
- Multiple battle types: casual, premium, AI challenges
- Spectator mode with live code streaming
- Prize pools for premium battles

### Subscription Plans
- **Free**: Basic battles, profile, leaderboard
- **Premium** ($5/month): AI challenges, team mode, premium themes
- **Company** ($500/post): Job board access, developer profiles
- **Tournament** ($5,000): Branded tournaments, live sponsor feeds

### Payment Integration
- Stripe checkout for subscriptions
- Battle registration payments ($10 entry, $18 winner prize)
- Early bird promotion (first 100 users get 1-year premium free)

### Real-time Features
- Live code synchronization
- Real-time battle updates
- Spectator mode
- Live typing indicators

## Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License
