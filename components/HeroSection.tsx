'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const HeroSection: React.FC = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center space-y-6 mb-12"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary-200 rounded-full opacity-30 blur-2xl animate-pulse" />
        <div className="absolute top-40 right-20 w-32 h-32 bg-accent-200 rounded-full opacity-20 blur-3xl animate-float-slow" />
        <div className="absolute bottom-20 left-1/2 w-24 h-24 bg-purple-200 rounded-full opacity-25 blur-2xl animate-pulse" />
      </div>

      {/* Main content */}
      <div className="relative z-10 space-y-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-5xl sm:text-6xl font-display font-bold"
        >
          <span className="gradient-text">Spot the Difference</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-xl sm:text-2xl text-gray-600 font-body"
        >
          🎨 AI-Powered Puzzle Generator
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto"
        >
          Create unlimited children-friendly puzzles instantly. Perfect for education, 
          entertainment, and brain training. Every puzzle is unique and uniquely crafted by AI.
        </motion.p>

        {/* Feature badges */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-2 pt-4"
        >
          {[
            { emoji: '🤖', label: 'AI Generated' },
            { emoji: '🎯', label: '100% Unique' },
            { emoji: '👶', label: 'Kid-Safe' },
            { emoji: '⚡', label: 'Instant' },
          ].map((feature, index) => (
            <motion.div
              key={feature.label}
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 backdrop-blur-sm border border-white/80 shadow-sm"
            >
              <span className="text-lg">{feature.emoji}</span>
              <span className="text-sm font-semibold text-gray-700">{feature.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};
