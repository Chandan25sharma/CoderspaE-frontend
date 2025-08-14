'use client';

import React from 'react';
import { motion } from 'framer-motion';
import MatrixBackground from './hero/MatrixBackground';
import GradientOrbs from './hero/GradientOrbs';
import LogoAnimation from './hero/LogoAnimation';
import DynamicTitle from './hero/DynamicTitle';
import CTAButtons from './hero/CTAButtons';
import StatsGrid from './hero/StatsGrid';
import ScrollIndicator from './hero/ScrollIndicator';

interface AnimatedHeroProps {
  onEnterBattle?: () => void;
}

const AnimatedHero: React.FC<AnimatedHeroProps> = ({ onEnterBattle }) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <GradientOrbs />
      </div>

      {/* Matrix Rain Effect */}
      <MatrixBackground />

      {/* Main Content */}
      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
        {/* Logo Animation */}
        <LogoAnimation />

        {/* Dynamic Title */}
        <DynamicTitle />

        {/* Subtitle */}
        <motion.p 
          className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Join the ultimate competitive programming arena where developers worldwide
          clash in real-time coding battles. Rise through the ranks and become a 
          <span className="text-transparent bg-gradient-to-r from-black to-orange-100 bg-clip-text font-semibold"> Code Legend</span>.
        </motion.p>

        {/* CTA Buttons */}
        <CTAButtons onEnterBattle={onEnterBattle} />

        {/* Stats */}
        <StatsGrid />
      </div>

      {/* Scroll Indicator */}
      <ScrollIndicator />
    </div>
  );
};

export default AnimatedHero;
