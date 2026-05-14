// Core puzzle types
export interface Difference {
  id: string;
  type: DifferenceType;
  x: number;
  y: number;
  width: number;
  height: number;
  description: string;
}

export type DifferenceType =
  | 'missing_object'
  | 'added_object'
  | 'color_change'
  | 'clothing_change'
  | 'expression_change'
  | 'food_change'
  | 'object_movement'
  | 'accessory_change'
  | 'background_change';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type Theme =
  | 'playground'
  | 'picnic'
  | 'zoo'
  | 'underwater'
  | 'classroom'
  | 'dinosaurs'
  | 'fantasy'
  | 'city_park'
  | 'outer_space'
  | 'farm';

export interface PuzzleMetadata {
  id: string;
  theme: Theme;
  difficulty: Difficulty;
  differenceCount: number;
  differences: Difference[];
  originalImageUrl: string;
  modifiedImageUrl: string;
  answerImageUrl: string;
  seed: string;
  createdAt: Date;
  generationTime: number;
}

export interface PuzzleGenerationRequest {
  theme?: Theme;
  difficulty?: Difficulty;
  seed?: string;
}

export interface PuzzleResponse {
  success: boolean;
  puzzle?: PuzzleMetadata;
  error?: string;
  status?: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

// Image processing types
export interface ImageGenerationParams {
  prompt: string;
  size: '1024x1024' | '1792x1024' | '1024x1792';
  quality: 'standard' | 'hd';
  seed?: number;
}

export interface EditingInstructions {
  objectToRemove?: string;
  objectToAdd?: string;
  colorChanges?: ColorChange[];
  movements?: Movement[];
  expressions?: ExpressionChange[];
}

export interface ColorChange {
  object: string;
  fromColor: string;
  toColor: string;
}

export interface Movement {
  object: string;
  fromPosition: Position;
  toPosition: Position;
}

export interface ExpressionChange {
  character: string;
  fromExpression: string;
  toExpression: string;
}

export interface Position {
  x: number;
  y: number;
}

// UI State
export interface PuzzleViewerState {
  puzzle: PuzzleMetadata | null;
  isLoading: boolean;
  showAnswer: boolean;
  difficulty: Difficulty;
  theme: Theme;
  foundDifferences: string[];
  error: string | null;
}

// Database types (if using PostgreSQL)
export interface PuzzleRecord {
  id: string;
  theme: string;
  difficulty: string;
  original_image_url: string;
  modified_image_url: string;
  answer_image_url: string;
  differences: Difference[];
  seed: string;
  created_at: Date;
  generation_time: number;
  user_id?: string;
}

// Export options
export interface ExportOptions {
  format: 'png' | 'pdf' | 'a4';
  includeAnswer: boolean;
  quality: 'standard' | 'high';
  filename?: string;
}

export interface ExportResult {
  success: boolean;
  url?: string;
  error?: string;
  filename: string;
}
