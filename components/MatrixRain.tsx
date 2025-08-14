'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface MatrixRainProps {
  opacity?: number;
  density?: number;
  className?: string;
}

export default function MatrixRain({ 
  opacity = 0.3, 
  density = 100, 
  className = "absolute inset-0 overflow-hidden pointer-events-none z-0" 
}: MatrixRainProps) {
  const [matrixElements, setMatrixElements] = useState<Array<{
    id: number;
    left: string;
    fontSize: string;
    duration: number;
    delay: number;
    character: string;
  }>>([]);
  const [isClient, setIsClient] = useState(false);

  function randomChar() {
    const chars = "アァイィウエカキクサシスセタチツナニハヒフヘホマミムメモラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?";
    return chars[Math.floor(Math.random() * chars.length)];
  }

  useEffect(() => {
    setIsClient(true);
    const elements = Array.from({ length: density }, (_, i) => ({ 
      id: i,
      left: `${Math.random() * 100}%`,
      fontSize: `${Math.random() * 1.5 + 0.5}rem`,
      duration: Math.random() * 10 + 5,
      delay: Math.random() * 5,
      character: randomChar()
    }));
    setMatrixElements(elements);
  }, [density]);

  if (!isClient) return null;

  return (
    <div className={className} style={{ opacity }}>
      {matrixElements.map((element) => (
        <motion.div
          key={element.id}
          className="absolute font-mono text-green-400 text-sm [text-shadow:0_0_6px_#00FF00,0_0_10px_#00FF00]"
          style={{
            left: element.left,
            fontSize: element.fontSize,
          }}
          animate={{
            y: ['-100vh', '100vh'],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: element.duration,
            repeat: Infinity,
            delay: element.delay,
            ease: "linear"
          }}
        >
          {element.character}
        </motion.div>
      ))}
    </div>
  );
}
