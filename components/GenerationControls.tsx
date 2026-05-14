'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Theme, Difficulty } from '@/lib/types';
import { Button } from './Button';

interface GenerationControlsProps {
  onGenerate: (theme: Theme, difficulty: Difficulty) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

const THEMES: Theme[] = [
  'playground',
  'picnic',
  'zoo',
  'underwater',
  'classroom',
  'dinosaurs',
  'fantasy',
  'city_park',
  'outer_space',
  'farm',
];

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];

export const GenerationControls: React.FC<GenerationControlsProps> = ({
  onGenerate,
  isLoading = false,
  disabled = false,
}) => {
  const [selectedTheme, setSelectedTheme] = useState<Theme>('playground');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('easy');

  const handleGenerate = () => {
    onGenerate(selectedTheme, selectedDifficulty);
  };

  const getThemeEmoji = (theme: Theme): string => {
    const emojiMap: Record<Theme, string> = {
      playground: '🎪',
      picnic: '🧺',
      zoo: '🦁',
      underwater: '🐠',
      classroom: '📚',
      dinosaurs: '🦕',
      fantasy: '✨',
      city_park: '🏙️',
      outer_space: '🚀',
      farm: '🌾',
    };
    return emojiMap[theme];
  };

  const getDifficultyEmoji = (difficulty: Difficulty): string => {
    const emojiMap: Record<Difficulty, string> = {
      easy: '🟢',
      medium: '🟡',
      hard: '🔴',
    };
    return emojiMap[difficulty];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Theme Selection */}
      <div>
        <label className="block text-lg font-semibold text-gray-900 mb-4">
          Choose a Theme
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {THEMES.map((theme) => (
            <motion.button
              key={theme}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedTheme(theme)}
              disabled={disabled}
              className={`p-4 rounded-xl font-semibold transition-all duration-300 ${
                selectedTheme === theme
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-play'
                  : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-primary-300'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="text-2xl mb-1">{getThemeEmoji(theme)}</div>
              <div className="text-xs capitalize">{theme.replace('_', ' ')}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Difficulty Selection */}
      <div>
        <label className="block text-lg font-semibold text-gray-900 mb-4">
          Select Difficulty
        </label>
        <div className="grid grid-cols-3 gap-3">
          {DIFFICULTIES.map((difficulty) => (
            <motion.button
              key={difficulty}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedDifficulty(difficulty)}
              disabled={disabled}
              className={`p-4 rounded-xl font-semibold transition-all duration-300 ${
                selectedDifficulty === difficulty
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-play'
                  : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-primary-300'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="text-2xl mb-1">{getDifficultyEmoji(difficulty)}</div>
              <div className="text-sm capitalize">
                {difficulty === 'easy' && '5 diffs'}
                {difficulty === 'medium' && '8 diffs'}
                {difficulty === 'hard' && '10-15 diffs'}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          onClick={handleGenerate}
          isLoading={isLoading}
          disabled={disabled || isLoading}
          className="w-full py-4 text-lg"
        >
          {isLoading ? 'Generating Puzzle...' : '✨ Generate New Puzzle'}
        </Button>
      </motion.div>

      {/* Info text */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-900">
          <span className="font-semibold">💡 Tip:</span> Each puzzle is unique! Generation takes 10-15 seconds.
          Make sure you have an internet connection.
        </p>
      </div>
    </motion.div>
  );
};
