'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import BattleModeSelector from '@/components/BattleModeSelector';

export default function BattlePage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }
  }, [session, router]);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-purple-400 mb-4">Loading...</div>
        </div>
      </div>
    );
  }

  return <BattleModeSelector />;
}
