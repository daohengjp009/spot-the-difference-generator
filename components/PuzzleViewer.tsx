'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { PuzzleMetadata, Difficulty } from '@/lib/types';
import { Button } from './Button';
import { ImageSkeleton } from './Skeleton';

interface PuzzleViewerProps {
  puzzle: PuzzleMetadata | null;
  isLoading: boolean;
  onDownload?: (format: 'png' | 'pdf' | 'a4') => void;
  onShare?: () => void;
}

export const PuzzleViewer: React.FC<PuzzleViewerProps> = ({
  puzzle,
  isLoading,
  onDownload,
  onShare,
}) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [foundCount, setFoundCount] = useState(0);

  if (isLoading) {
    return (
      <div className="w-full space-y-6">
        <ImageSkeleton className="h-96" />
        <ImageSkeleton className="h-96" />
      </div>
    );
  }

  if (!puzzle) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Generate a puzzle to get started!</p>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-success-100 text-success-700';
      case 'medium':
        return 'bg-warning-100 text-warning-700';
      case 'hard':
        return 'bg-red-100 text-red-700';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 capitalize">
            {puzzle.theme.replace('_', ' ')} Theme
          </h2>
          <div className="flex items-center gap-3 mt-2">
            <span className={`difficulty-badge ${getDifficultyColor(puzzle.difficulty)}`}>
              {puzzle.difficulty}
            </span>
            <span className="text-sm text-gray-600">
              {puzzle.differenceCount} differences
            </span>
          </div>
        </div>
      </div>

      {/* Main puzzle display */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Original Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Picture 1</h3>
          <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
            {puzzle.originalImageUrl && (
              <Image
                src={puzzle.originalImageUrl}
                alt="Original puzzle image"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            )}
          </div>
        </motion.div>

        {/* Modified Image */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Picture 2</h3>
          <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
            {puzzle.modifiedImageUrl && (
              <Image
                src={puzzle.modifiedImageUrl}
                alt="Modified puzzle image"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            )}
          </div>
        </motion.div>
      </div>

      {/* Answer Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="card bg-gradient-to-br from-blue-50 to-purple-50"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Answer Key</h3>
          <Button
            variant={showAnswer ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setShowAnswer(!showAnswer)}
          >
            {showAnswer ? 'Hide Answer' : 'Show Answer'}
          </Button>
        </div>

        {showAnswer && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 gap-3"
          >
            {puzzle.differences.map((diff, index) => (
              <motion.div
                key={diff.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="p-3 bg-white rounded-lg border-l-4 border-primary-500"
              >
                <div className="font-bold text-primary-600">#{index + 1}</div>
                <p className="text-sm text-gray-700 mt-1">{diff.description}</p>
                <p className="text-xs text-gray-500 mt-2">{diff.type.replace('_', ' ')}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="flex flex-wrap gap-3"
      >
        <Button
          onClick={() => onDownload?.('a4')}
          variant="secondary"
          className="flex-1"
        >
          📄 Print (A4)
        </Button>
        <Button
          onClick={() => onDownload?.('pdf')}
          variant="secondary"
          className="flex-1"
        >
          📥 Download PDF
        </Button>
        <Button
          onClick={onShare}
          variant="secondary"
          className="flex-1"
        >
          🔗 Share
        </Button>
      </motion.div>
    </motion.div>
  );
};
