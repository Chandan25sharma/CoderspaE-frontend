'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DynamicTitleProps {
  words?: string[];
}

const DynamicTitle: React.FC<DynamicTitleProps> = ({ 
  words = ['Battle', 'Compete', 'Dominate', 'Conquer', 'Master'] 
}) => {
  const [currentWord, setCurrentWord] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTyping(false);
      setTimeout(() => {
        setCurrentWord((prev) => (prev + 1) % words.length);
        setIsTyping(true);
      }, 500);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <motion.h1 
      className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <span className="bg-gradient-to-r from-gray-800 to-gray-300 bg-clip-text text-transparent">
        Code.
      </span>
      <br />
      <AnimatePresence mode="wait">
        <motion.span
          key={currentWord}
          className="bg-gradient-to-r from-black via-gray-600 to-gray-400 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 50, rotateX: -90 }}
          animate={{ 
            opacity: isTyping ? 1 : 0, 
            y: 29, 
            rotateX: 0 
          }}
          exit={{ opacity: 0, y: -50, rotateX: 90 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          {words[currentWord]}.
        </motion.span>
      </AnimatePresence>
      <br />
      <span className="bg-gradient-to-r from-emerald-950 to-cyan-400 bg-clip-text text-transparent">
        Conquer.
      </span>
    </motion.h1>
  );
};

export default DynamicTitle;
