import sharp from 'sharp';
import { Difference, DifferenceType, EditingInstructions } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Core difference engine for tracking and managing puzzle differences
 */
export class DifferenceEngine {
  /**
   * Generate structured difference metadata
   * Maps editing instructions to trackable difference objects
   */
  static generateDifferences(
    instructions: EditingInstructions,
    imageWidth: number = 1024,
    imageHeight: number = 1024
  ): Difference[] {
    const differences: Difference[] = [];

    // Missing objects
    if (instructions.objectToRemove) {
      differences.push({
        id: uuidv4(),
        type: 'missing_object',
        x: Math.random() * (imageWidth - 100) + 50,
        y: Math.random() * (imageHeight - 100) + 50,
        width: 80,
        height: 80,
        description: `Missing: ${instructions.objectToRemove}`,
      });
    }

    // Added objects
    if (instructions.objectToAdd) {
      differences.push({
        id: uuidv4(),
        type: 'added_object',
        x: Math.random() * (imageWidth - 100) + 50,
        y: Math.random() * (imageHeight - 100) + 50,
        width: 80,
        height: 80,
        description: `Added: ${instructions.objectToAdd}`,
      });
    }

    // Color changes
    if (instructions.colorChanges) {
      instructions.colorChanges.forEach((change) => {
        differences.push({
          id: uuidv4(),
          type: 'color_change',
          x: Math.random() * (imageWidth - 100) + 50,
          y: Math.random() * (imageHeight - 100) + 50,
          width: 100,
          height: 100,
          description: `Color changed on ${change.object}`,
        });
      });
    }

    // Object movements
    if (instructions.movements) {
      instructions.movements.forEach((movement) => {
        differences.push({
          id: uuidv4(),
          type: 'object_movement',
          x: Math.random() * (imageWidth - 100) + 50,
          y: Math.random() * (imageHeight - 100) + 50,
          width: 80,
          height: 80,
          description: `${movement.object} moved`,
        });
      });
    }

    // Expression changes
    if (instructions.expressions) {
      instructions.expressions.forEach((expression) => {
        differences.push({
          id: uuidv4(),
          type: 'expression_change',
          x: Math.random() * (imageWidth - 100) + 50,
          y: Math.random() * (imageHeight - 100) + 50,
          width: 100,
          height: 100,
          description: `${expression.character}'s expression changed`,
        });
      });
    }

    return differences;
  }

  /**
   * Validate difference coordinates are within image bounds
   */
  static validateCoordinates(
    differences: Difference[],
    imageWidth: number,
    imageHeight: number
  ): Difference[] {
    return differences.map((diff) => ({
      ...diff,
      x: Math.max(20, Math.min(diff.x, imageWidth - 60)),
      y: Math.max(20, Math.min(diff.y, imageHeight - 60)),
      width: Math.min(diff.width, imageWidth - diff.x - 20),
      height: Math.min(diff.height, imageHeight - diff.y - 20),
    }));
  }

  /**
   * Calculate difference statistics for difficulty assessment
   */
  static calculateDifficultyMetrics(differences: Difference[]): {
    totalCount: number;
    byType: Record<DifferenceType, number>;
    averageVisibility: number;
  } {
    const byType: Record<DifferenceType, number> = {
      missing_object: 0,
      added_object: 0,
      color_change: 0,
      clothing_change: 0,
      expression_change: 0,
      food_change: 0,
      object_movement: 0,
      accessory_change: 0,
      background_change: 0,
    };

    differences.forEach((diff) => {
      byType[diff.type]++;
    });

    // Calculate average visibility (larger areas = more visible)
    const averageVisibility =
      differences.reduce((sum, d) => sum + d.width * d.height, 0) / differences.length / 10000;

    return {
      totalCount: differences.length,
      byType,
      averageVisibility,
    };
  }

  /**
   * Distribute differences evenly across image canvas
   * Prevents clustering of differences in one area
   */
  static distributeEvenly(
    differences: Difference[],
    imageWidth: number = 1024,
    imageHeight: number = 1024,
    gridSize: number = 4
  ): Difference[] {
    const cellWidth = imageWidth / gridSize;
    const cellHeight = imageHeight / gridSize;
    const usedCells = new Set<string>();

    return differences.map((diff) => {
      let cellX = Math.floor(diff.x / cellWidth);
      let cellY = Math.floor(diff.y / cellHeight);

      // If cell is used, find nearest empty cell
      while (usedCells.has(`${cellX},${cellY}`) && usedCells.size < gridSize * gridSize) {
        cellX = (cellX + 1) % gridSize;
        if (cellX === 0) {
          cellY = (cellY + 1) % gridSize;
        }
      }

      usedCells.add(`${cellX},${cellY}`);

      const x = cellX * cellWidth + cellWidth / 2 - diff.width / 2;
      const y = cellY * cellHeight + cellHeight / 2 - diff.height / 2;

      return {
        ...diff,
        x: Math.max(20, Math.min(x, imageWidth - diff.width - 20)),
        y: Math.max(20, Math.min(y, imageHeight - diff.height - 20)),
      };
    });
  }

  /**
   * Generate circle overlay SVG for answer display
   */
  static generateAnswerOverlaySVG(
    differences: Difference[],
    imageWidth: number = 1024,
    imageHeight: number = 1024
  ): string {
    const circles = differences
      .map(
        (diff, index) =>
          `<circle cx="${diff.x + diff.width / 2}" cy="${diff.y + diff.height / 2}" r="${Math.max(diff.width, diff.height) / 2}" 
          fill="none" stroke="#ff4444" stroke-width="3" opacity="0.8"/>
        <text x="${diff.x + diff.width / 2}" y="${diff.y + diff.height / 2}" 
          text-anchor="middle" dy="0.3em" font-size="24" font-weight="bold" fill="#ff4444">${index + 1}</text>`
      )
      .join('\n');

    return `<svg width="${imageWidth}" height="${imageHeight}" xmlns="http://www.w3.org/2000/svg">
      ${circles}
    </svg>`;
  }

  /**
   * Create answer key with descriptions
   */
  static createAnswerKey(
    differences: Difference[]
  ): Array<{
    number: number;
    type: DifferenceType;
    description: string;
    coordinates: { x: number; y: number };
  }> {
    return differences.map((diff, index) => ({
      number: index + 1,
      type: diff.type,
      description: diff.description,
      coordinates: { x: Math.round(diff.x), y: Math.round(diff.y) },
    }));
  }

  /**
   * Export differences as JSON metadata
   */
  static exportMetadata(differences: Difference[]): string {
    return JSON.stringify(differences, null, 2);
  }
}

/**
 * Image processing utilities
 */
export class ImageProcessor {
  /**
   * Download and buffer image from URL
   */
  static async downloadImage(imageUrl: string): Promise<Buffer> {
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();
    return Buffer.from(buffer);
  }

  /**
   * Get image dimensions
   */
  static async getImageDimensions(
    imageBuffer: Buffer
  ): Promise<{ width: number; height: number }> {
    const metadata = await sharp(imageBuffer).metadata();
    return {
      width: metadata.width || 1024,
      height: metadata.height || 1024,
    };
  }

  /**
   * Draw answer overlay on image
   */
  static async drawAnswerOverlay(
    imageBuffer: Buffer,
    differences: Difference[],
    circleColor: string = '#ff4444',
    circleWidth: number = 3
  ): Promise<Buffer> {
    const metadata = await sharp(imageBuffer).metadata();
    const width = metadata.width || 1024;
    const height = metadata.height || 1024;

    // Create SVG overlay
    const svgOverlay = Buffer.from(
      `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        ${differences
          .map(
            (diff, index) =>
              `<circle cx="${diff.x + diff.width / 2}" cy="${diff.y + diff.height / 2}" 
              r="${Math.max(diff.width, diff.height) / 2}" fill="none" stroke="${circleColor}" 
              stroke-width="${circleWidth}" opacity="0.8"/>
            <text x="${diff.x + diff.width / 2}" y="${diff.y + diff.height / 2}" 
              text-anchor="middle" dy="0.3em" font-size="28" font-weight="bold" 
              fill="${circleColor}" font-family="Arial">${index + 1}</text>`
          )
          .join('\n')}
      </svg>`
    );

    return sharp(imageBuffer).composite([{ input: svgOverlay, blend: 'screen' }]).png().toBuffer();
  }

  /**
   * Optimize image for web
   */
  static async optimizeImage(
    imageBuffer: Buffer,
    quality: number = 80,
    maxWidth: number = 1024
  ): Promise<Buffer> {
    return sharp(imageBuffer)
      .resize(maxWidth, maxWidth, {
        fit: 'cover',
        withoutEnlargement: true,
      })
      .jpeg({ quality, progressive: true })
      .toBuffer();
  }

  /**
   * Create side-by-side comparison image
   */
  static async createComparisonImage(
    originalBuffer: Buffer,
    modifiedBuffer: Buffer
  ): Promise<Buffer> {
    const padding = 20;
    const metadata1 = await sharp(originalBuffer).metadata();
    const metadata2 = await sharp(modifiedBuffer).metadata();

    const width = (metadata1.width || 1024) + (metadata2.width || 1024) + padding * 3;
    const height = Math.max(metadata1.height || 1024, metadata2.height || 1024) + padding * 2;

    const background = Buffer.from(
      `<svg width="${width}" height="${height}" style="background:white">
        <rect width="${width}" height="${height}" fill="white"/>
      </svg>`
    );

    return sharp(background)
      .composite([
        { input: originalBuffer, left: padding, top: padding },
        {
          input: modifiedBuffer,
          left: (metadata1.width || 1024) + padding * 2,
          top: padding,
        },
      ])
      .png()
      .toBuffer();
  }
}
