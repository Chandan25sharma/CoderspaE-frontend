import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CoderspaE - International Virtual Code Battle Arena',
    short_name: 'CoderspaE',
    description: 'Compete in real-time coding battles with developers worldwide. Master algorithms, climb the leaderboard, and become the ultimate code warrior.',
    start_url: '/',
    display: 'standalone',
    background_color: '#1e293b',
    theme_color: '#1e293b',
    icons: [
      {
        src: '/icon.png',
        sizes: 'any',
        type: 'image/png',
      },
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
