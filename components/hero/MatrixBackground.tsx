'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface MatrixElement {
  id: number;
  left: string;
  fontSize: string;
  duration: number;
  delay: number;
  character: string;
}

const MatrixBackground: React.FC = () => {
  const [matrixElements, setMatrixElements] = useState<MatrixElement[]>([]);
  const [isClient, setIsClient] = useState(false);

  function randomChar() {
    const chars = "アァイィウエカキクサシスセタチツナニハヒフヘホマミムメモラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return chars[Math.floor(Math.random() * chars.length)];
  }

  useEffect(() => {
    setIsClient(true);
    const elements = Array.from({ length: 150 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      fontSize: `${Math.random() * 1.5 + 0.5}rem`,
      duration: Math.random() * 10 + 5,
      delay: Math.random() * 5,
      character: randomChar()
    }));
    setMatrixElements(elements);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden opacity-40 pointer-events-none z-0">
      {isClient && matrixElements.map((element) => (
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
            rotate: [0, 0, 360],
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
};

export default MatrixBackground;
