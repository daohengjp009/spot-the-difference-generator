import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import {
  generateMasterScene,
  generateDifferenceInstructions,
  generateModifiedImage,
} from '@/lib/ai-engine';
import { DifferenceEngine } from '@/lib/difference-engine';
import { Theme, Difficulty, PuzzleMetadata, PuzzleResponse } from '@/lib/types';

// In-memory store for demo (use database in production)
const puzzleStore = new Map<string, PuzzleMetadata>();

// Job queue for tracking generation status
const jobQueue = new Map<
  string,
  {
    status: 'pending' | 'generating' | 'complete' | 'failed';
    progress: number;
    error?: string;
    result?: PuzzleMetadata;
  }
>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { theme = 'playground', difficulty = 'easy' } = body;

    // Validate inputs
    if (!isValidTheme(theme) || !isValidDifficulty(difficulty)) {
      return NextResponse.json(
        { success: false, error: 'Invalid theme or difficulty' },
        { status: 400 }
      );
    }

    const jobId = uuidv4();

    // Initialize job
    jobQueue.set(jobId, {
      status: 'pending',
      progress: 0,
    });

    // Start async generation
    generatePuzzleAsync(jobId, theme, difficulty);

    return NextResponse.json(
      {
        success: true,
        jobId,
        status: 'pending',
      },
      { status: 202 }
    );
  } catch (error) {
    console.error('Error in puzzle generation:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to start puzzle generation',
      },
      { status: 500 }
    );
  }
}

/**
 * Async puzzle generation with progress tracking
 */
async function generatePuzzleAsync(
  jobId: string,
  theme: Theme,
  difficulty: Difficulty
): Promise<void> {
  const startTime = Date.now();

  // Define updateJob OUTSIDE try block so it's available in catch
  const updateJob = (status: any) => {
    const job = jobQueue.get(jobId);
    if (job) {
      jobQueue.set(jobId, { ...job, ...status });
    }
  };

  try {
    updateJob({ status: 'generating', progress: 10 });

    // Step 1: Generate master scene
    console.log(`[${jobId}] Generating master scene for theme: ${theme}`);
    const seed = uuidv4();
    const originalImageUrl = await generateMasterScene(theme, seed);
    updateJob({ progress: 30 });

    // Step 2: Generate difference instructions
    console.log(`[${jobId}] Generating difference instructions`);
    const instructions = await generateDifferenceInstructions(theme, difficulty);
    updateJob({ progress: 50 });

    // Step 3: Generate modified image
    console.log(`[${jobId}] Generating modified image`);
    const modifiedImageUrl = await generateModifiedImage(originalImageUrl, theme, instructions);
    updateJob({ progress: 70 });

    // Step 4: Generate difference metadata
    console.log(`[${jobId}] Generating difference metadata`);
    let differences = DifferenceEngine.generateDifferences(instructions);
    differences = DifferenceEngine.validateCoordinates(differences, 1024, 1024);
    differences = DifferenceEngine.distributeEvenly(differences);
    updateJob({ progress: 85 });

    // Step 5: Create answer image (optional - for demo, we'll skip visual answer generation)
    const answerImageUrl = originalImageUrl; // In production, overlay circles on image

    // Create puzzle metadata
    const puzzle: PuzzleMetadata = {
      id: jobId,
      theme,
      difficulty,
      differenceCount: differences.length,
      differences,
      originalImageUrl,
      modifiedImageUrl,
      answerImageUrl,
      seed,
      createdAt: new Date(),
      generationTime: Date.now() - startTime,
    };

    // Store puzzle
    puzzleStore.set(jobId, puzzle);

    updateJob({
      status: 'complete',
      progress: 100,
      result: puzzle,
    });

    console.log(`[${jobId}] Generation complete in ${puzzle.generationTime}ms`);
  } catch (error) {
    console.error(`[${jobId}] Generation failed:`, error);
    updateJob({
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

/**
 * GET /api/puzzle/[jobId] - Check generation status or retrieve completed puzzle
 */
export async function GET(request: NextRequest) {
  try {
    const jobId = request.nextUrl.searchParams.get('jobId');

    if (!jobId) {
      return NextResponse.json(
        { success: false, error: 'Missing jobId parameter' },
        { status: 400 }
      );
    }

    const job = jobQueue.get(jobId);

    if (!job) {
      return NextResponse.json(
        { success: false, error: 'Job not found' },
        { status: 404 }
      );
    }

    if (job.status === 'complete' && job.result) {
      return NextResponse.json({
        success: true,
        status: 'complete',
        puzzle: job.result,
      });
    }

    return NextResponse.json({
      success: true,
      status: job.status,
      progress: job.progress,
      error: job.error,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to check job status',
      },
      { status: 500 }
    );
  }
}

function isValidTheme(theme: any): theme is Theme {
  const validThemes: Theme[] = [
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
  return validThemes.includes(theme);
}

function isValidDifficulty(difficulty: any): difficulty is Difficulty {
  const validDifficulties: Difficulty[] = ['easy', 'medium', 'hard'];
  return validDifficulties.includes(difficulty);
}
