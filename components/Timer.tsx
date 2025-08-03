'use client';
import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  timeLimit: number; // in milliseconds
  onTimeUp?: () => void;
}

export function Timer({ timeLimit, onTimeUp }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (onTimeUp) onTimeUp();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1000);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, onTimeUp]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const isWarning = timeLeft <= 60000; // Last minute
  const isCritical = timeLeft <= 30000; // Last 30 seconds

  return (
    <div className="flex items-center space-x-2">
      <Clock className={`h-5 w-5 ${
        isCritical ? 'text-red-400' : 
        isWarning ? 'text-yellow-400' : 
        'text-green-400'
      }`} />
      <span className={`font-mono text-lg font-semibold ${
        isCritical ? 'text-red-400' : 
        isWarning ? 'text-yellow-400' : 
        'text-green-400'
      }`}>
        {formatTime(timeLeft)}
      </span>
    </div>
  );
}
