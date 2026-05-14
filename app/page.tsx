'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { HeroSection } from '@/components/HeroSection';
import { GenerationControls } from '@/components/GenerationControls';
import { PuzzleViewer } from '@/components/PuzzleViewer';
import { PuzzleMetadata, Theme, Difficulty } from '@/lib/types';

export default function Home() {
  const [puzzle, setPuzzle] = useState<PuzzleMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [jobId, setJobId] = useState<string | null>(null);

  const handleGeneratePuzzle = useCallback(
    async (theme: Theme, difficulty: Difficulty) => {
      try {
        setIsLoading(true);
        setError(null);
        setGenerationProgress(0);

        // Start generation
        const response = await fetch('/api/puzzle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ theme, difficulty }),
        });

        if (!response.ok) {
          throw new Error('Failed to start puzzle generation');
        }

        const data = await response.json();
        const newJobId = data.jobId;
        setJobId(newJobId);

        // Poll for completion
        let completed = false;
        let attempts = 0;
        const maxAttempts = 180; // 3 minutes timeout

        while (!completed && attempts < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, 1000));

          const statusResponse = await fetch(`/api/puzzle?jobId=${newJobId}`);
          const statusData = await statusResponse.json();

          if (statusData.status === 'complete' && statusData.puzzle) {
            setPuzzle(statusData.puzzle);
            completed = true;
            setGenerationProgress(100);
          } else if (statusData.status === 'failed') {
            throw new Error(statusData.error || 'Puzzle generation failed');
          } else {
            setGenerationProgress(statusData.progress || 0);
          }

          attempts++;
        }

        if (!completed) {
          throw new Error('Puzzle generation timed out');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
        console.error('Generation error:', err);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const handleDownload = useCallback(
    async (format: 'png' | 'pdf' | 'a4') => {
      if (!puzzle) return;

      try {
        const response = await fetch('/api/export', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            format,
            puzzleData: puzzle,
            includeAnswer: false,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to export as ${format}`);
        }

        const data = await response.json();

        if (data.success && data.url) {
          // Download or open the file
          window.open(data.url, '_blank');
        } else {
          setError(`Export failed: ${data.error}`);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Download failed';
        setError(errorMessage);
        console.error('Download error:', err);
      }
    },
    [puzzle]
  );

  const handleShare = useCallback(async () => {
    if (!puzzle) return;

    try {
      const response = await fetch(`/api/export/share?puzzleId=${puzzle.id}`);
      const data = await response.json();

      if (data.success) {
        // Copy share URL to clipboard
        await navigator.clipboard.writeText(data.shareUrl);
        alert('Share link copied to clipboard!');
      }
    } catch (err) {
      console.error('Share error:', err);
      alert('Failed to generate share link');
    }
  }, [puzzle]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 backdrop-blur-sm bg-white/70 border-b border-white/20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✨</span>
            <h1 className="font-display font-bold text-lg text-gray-900">
              Spot the Difference
            </h1>
          </div>
          <div className="text-sm text-gray-600">AI-Powered Educational Puzzles</div>
        </div>
      </motion.nav>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Hero Section */}
        <HeroSection />

        {/* Error message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700"
          >
            ❌ {error}
          </motion.div>
        )}

        {/* Generation progress */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 space-y-4"
          >
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900">
                  Generating your puzzle...
                </span>
                <span className="text-sm text-gray-600">{generationProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${generationProgress}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
                />
              </div>
              <p className="text-sm text-gray-500 mt-3">
                🎨 Creating your unique puzzle... This may take 10-15 seconds.
              </p>
            </div>
          </motion.div>
        )}

        {/* Main grid layout */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Generation Controls */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="lg:sticky lg:top-24 lg:h-fit"
          >
            <div className="card">
              <GenerationControls
                onGenerate={handleGeneratePuzzle}
                isLoading={isLoading}
                disabled={isLoading}
              />
            </div>
          </motion.div>

          {/* Right: Puzzle Display */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <PuzzleViewer
              puzzle={puzzle}
              isLoading={isLoading}
              onDownload={handleDownload}
              onShare={handleShare}
            />
          </motion.div>
        </div>

        {/* Features section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-20 grid md:grid-cols-3 gap-6"
        >
          {[
            {
              icon: '🎓',
              title: 'Educational',
              description:
                'Perfect for schools and homeschooling. Engage children with interactive visual puzzles.',
            },
            {
              icon: '🚀',
              title: 'Instant Generation',
              description: 'Create unlimited puzzles in seconds. Each one is unique and AI-crafted.',
            },
            {
              icon: '🖨️',
              title: 'Print & Share',
              description: 'Download as PDF, print A4 worksheets, or share online with friends.',
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              whileHover={{ scale: 1.05 }}
              className="card text-center"
            >
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.section>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-24 border-t border-gray-200 bg-white/50 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-600 text-sm">
          <p>
            Made with ❤️ for children, parents, and educators. Powered by AI.
          </p>
          <p className="mt-2">© 2024 Spot the Difference Generator. All rights reserved.</p>
        </div>
      </motion.footer>
    </main>
  );
}
