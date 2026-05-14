import { PDFDocument, PDFPage, rgb } from 'pdf-lib';
import { Difference, ExportOptions, ExportResult } from '@/lib/types';
import fs from 'fs/promises';
import path from 'path';

/**
 * Export engine for handling various puzzle export formats
 */
export class ExportEngine {
  private static readonly outputDir = path.join(process.cwd(), 'public', 'exports');

  /**
   * Export puzzle as PNG image
   */
  static async exportPNG(
    imageBuffer: Buffer,
    filename?: string
  ): Promise<ExportResult> {
    try {
      const finalFilename = filename || `puzzle-${Date.now()}.png`;
      const filePath = path.join(this.outputDir, finalFilename);

      await fs.mkdir(this.outputDir, { recursive: true });
      await fs.writeFile(filePath, imageBuffer);

      return {
        success: true,
        filename: finalFilename,
        url: `/exports/${finalFilename}`,
      };
    } catch (error) {
      return {
        success: false,
        filename: filename || 'unknown',
        error: error instanceof Error ? error.message : 'Failed to export PNG',
      };
    }
  }

  /**
   * Export puzzle as PDF worksheet
   */
  static async exportPDF(
    originalImageUrl: string,
    modifiedImageUrl: string,
    answerImageUrl: string,
    differences: Difference[],
    theme: string,
    difficulty: string,
    filename?: string
  ): Promise<ExportResult> {
    try {
      const pdfDoc = PDFDocument.create();

      // Page 1: Puzzle instruction and images
      const page1 = pdfDoc.addPage([8.5 * 72, 11 * 72]); // A4 size
      const fontSize = 16;

      // Title
      page1.drawText('Spot the Difference Puzzle', {
        x: 50,
        y: page1.getHeight() - 50,
        size: 24,
        color: rgb(0.93, 0.55, 0.26),
      });

      // Theme and difficulty
      page1.drawText(`Theme: ${theme} | Difficulty: ${difficulty}`, {
        x: 50,
        y: page1.getHeight() - 80,
        size: 12,
        color: rgb(0.4, 0.4, 0.4),
      });

      // Instructions
      page1.drawText(
        'Find all the differences between the two pictures and circle them.',
        {
          x: 50,
          y: page1.getHeight() - 110,
          size: fontSize,
          color: rgb(0.2, 0.2, 0.2),
        }
      );

      page1.drawText(`Number of differences: ${differences.length}`, {
        x: 50,
        y: page1.getHeight() - 140,
        size: fontSize,
        color: rgb(0.93, 0.55, 0.26),
      });

      // Add images (would need to fetch and embed)
      // This is simplified - in production, you'd embed the actual images

      // Page 2: Answer key
      const page2 = pdfDoc.addPage([8.5 * 72, 11 * 72]);

      page2.drawText('Answer Key', {
        x: 50,
        y: page2.getHeight() - 50,
        size: 24,
        color: rgb(0.93, 0.55, 0.26),
      });

      // Draw answer key items
      let yOffset = page2.getHeight() - 100;
      differences.forEach((diff, index) => {
        page2.drawText(`${index + 1}. ${diff.description} (${diff.type})`, {
          x: 50,
          y: yOffset,
          size: 12,
          color: rgb(0.2, 0.2, 0.2),
        });
        yOffset -= 30;

        if (yOffset < 50) {
          yOffset = page2.getHeight() - 50;
        }
      });

      // Save PDF
      const finalFilename = filename || `puzzle-${Date.now()}.pdf`;
      const filePath = path.join(this.outputDir, finalFilename);

      await fs.mkdir(this.outputDir, { recursive: true });
      const pdfBytes = await pdfDoc.save();
      await fs.writeFile(filePath, pdfBytes);

      return {
        success: true,
        filename: finalFilename,
        url: `/exports/${finalFilename}`,
      };
    } catch (error) {
      return {
        success: false,
        filename: filename || 'unknown',
        error: error instanceof Error ? error.message : 'Failed to export PDF',
      };
    }
  }

  /**
   * Export as A4 worksheet (optimized for printing)
   */
  static async exportA4Worksheet(
    originalImageUrl: string,
    modifiedImageUrl: string,
    differences: Difference[],
    theme: string,
    difficulty: string,
    filename?: string
  ): Promise<ExportResult> {
    try {
      // Create HTML for A4 printing
      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Spot the Difference Puzzle</title>
  <style>
    @page {
      size: A4;
      margin: 1cm;
    }
    body {
      font-family: Arial, sans-serif;
      max-width: 21cm;
      margin: 0 auto;
      padding: 0;
      background: white;
    }
    .header {
      text-align: center;
      margin-bottom: 2cm;
    }
    .title {
      font-size: 28px;
      font-weight: bold;
      color: #eb8c42;
      margin: 0;
    }
    .subtitle {
      font-size: 14px;
      color: #666;
      margin: 5px 0 0 0;
    }
    .instructions {
      background: #f0fbff;
      padding: 10px;
      border-radius: 8px;
      margin-bottom: 20px;
      font-size: 14px;
    }
    .images-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 20px;
    }
    .image-box {
      text-align: center;
    }
    .image-box img {
      max-width: 100%;
      height: auto;
      border: 2px solid #eb8c42;
      border-radius: 8px;
    }
    .answer-section {
      page-break-before: always;
      margin-top: 2cm;
    }
    .answer-key {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }
    .answer-item {
      padding: 8px;
      background: #f9f9f9;
      border-left: 3px solid #00a3ff;
    }
    .answer-number {
      font-weight: bold;
      color: #eb8c42;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1 class="title">Spot the Difference</h1>
    <p class="subtitle">Theme: ${theme} | Difficulty: ${difficulty}</p>
  </div>
  
  <div class="instructions">
    <strong>Instructions:</strong> Find all the differences between the two pictures. 
    Circle them or write down the differences you find.
    <br>
    <strong>Total differences:</strong> ${differences.length}
  </div>
  
  <div class="images-container">
    <div class="image-box">
      <h3>Picture 1</h3>
      <img src="${originalImageUrl}" alt="Original image">
    </div>
    <div class="image-box">
      <h3>Picture 2</h3>
      <img src="${modifiedImageUrl}" alt="Modified image">
    </div>
  </div>

  <div class="answer-section">
    <h2 style="color: #eb8c42;">Answer Key</h2>
    <div class="answer-key">
      ${differences
        .map(
          (diff, index) =>
            `<div class="answer-item">
        <span class="answer-number">${index + 1}.</span> ${diff.description}
      </div>`
        )
        .join('\n')}
    </div>
  </div>
</body>
</html>
      `;

      const finalFilename = filename || `puzzle-${Date.now()}.html`;
      const filePath = path.join(this.outputDir, finalFilename);

      await fs.mkdir(this.outputDir, { recursive: true });
      await fs.writeFile(filePath, htmlContent);

      return {
        success: true,
        filename: finalFilename,
        url: `/exports/${finalFilename}`,
      };
    } catch (error) {
      return {
        success: false,
        filename: filename || 'unknown',
        error: error instanceof Error ? error.message : 'Failed to export A4 worksheet',
      };
    }
  }

  /**
   * Export as JSON for sharing/importing
   */
  static async exportJSON(
    puzzleData: any,
    filename?: string
  ): Promise<ExportResult> {
    try {
      const finalFilename = filename || `puzzle-${Date.now()}.json`;
      const filePath = path.join(this.outputDir, finalFilename);

      await fs.mkdir(this.outputDir, { recursive: true });
      await fs.writeFile(filePath, JSON.stringify(puzzleData, null, 2));

      return {
        success: true,
        filename: finalFilename,
        url: `/exports/${finalFilename}`,
      };
    } catch (error) {
      return {
        success: false,
        filename: filename || 'unknown',
        error: error instanceof Error ? error.message : 'Failed to export JSON',
      };
    }
  }

  /**
   * Generate shareable puzzle URL
   */
  static generateShareURL(puzzleId: string, baseUrl: string = 'https://spotdifference.app'): string {
    return `${baseUrl}/puzzle/${puzzleId}`;
  }

  /**
   * Generate social media share text
   */
  static generateShareText(theme: string, difficulty: string): string {
    const difficultyEmoji = { easy: '🟢', medium: '🟡', hard: '🔴' };
    return `I found all the differences in this ${difficulty} ${theme} "Spot the Difference" puzzle! 🎮 Can you find them all? ${difficultyEmoji[difficulty as keyof typeof difficultyEmoji]}`;
  }

  /**
   * Cleanup old exports (files older than specified days)
   */
  static async cleanupOldExports(daysOld: number = 7): Promise<number> {
    try {
      const files = await fs.readdir(this.outputDir);
      const now = Date.now();
      const maxAge = daysOld * 24 * 60 * 60 * 1000;
      let deletedCount = 0;

      for (const file of files) {
        const filePath = path.join(this.outputDir, file);
        const stats = await fs.stat(filePath);

        if (now - stats.mtimeMs > maxAge) {
          await fs.unlink(filePath);
          deletedCount++;
        }
      }

      return deletedCount;
    } catch (error) {
      console.error('Error cleaning up exports:', error);
      return 0;
    }
  }
}
