'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const LogoAnimation: React.FC = () => {
  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, type: "spring", stiffness: 100 }}
    >
      <motion.div
        className="inline-flex items-center justify-center w-34 h-34 rounded-xl mb-6 relative overflow-hidden"
        whileHover={{ 
          scale: 1.1, 
          rotate: 3600,
          
        }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Image
          src="/icon.png"
          alt="CoderspaE Logo"
          width={100}
          height={48}
          className="object-contain"
        />
      </motion.div>
    </motion.div>
  );
};

export default LogoAnimation;
