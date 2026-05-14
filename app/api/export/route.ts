import { NextRequest, NextResponse } from 'next/server';
import { ExportEngine } from '@/lib/export-engine';
import { ExportOptions } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { format, puzzleData, includeAnswer } = body as {
      format: string;
      puzzleData: any;
      includeAnswer: boolean;
    };

    if (!format || !puzzleData) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const { theme, difficulty, differences, originalImageUrl, modifiedImageUrl } = puzzleData;

    let result;

    switch (format) {
      case 'png':
        // For PNG, we would need the image buffer
        // This is a simplified version
        result = {
          success: true,
          url: originalImageUrl,
          filename: `puzzle-${Date.now()}.png`,
        };
        break;

      case 'pdf':
        result = await ExportEngine.exportPDF(
          originalImageUrl,
          modifiedImageUrl,
          originalImageUrl,
          differences,
          theme,
          difficulty
        );
        break;

      case 'a4':
        result = await ExportEngine.exportA4Worksheet(
          originalImageUrl,
          modifiedImageUrl,
          differences,
          theme,
          difficulty
        );
        break;

      case 'json':
        result = await ExportEngine.exportJSON(puzzleData);
        break;

      default:
        return NextResponse.json(
          { success: false, error: 'Unsupported format' },
          { status: 400 }
        );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Export failed',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/export/share - Generate shareable link
 */
export async function GET(request: NextRequest) {
  try {
    const puzzleId = request.nextUrl.searchParams.get('puzzleId');
    const baseUrl = request.nextUrl.origin;

    if (!puzzleId) {
      return NextResponse.json(
        { success: false, error: 'Missing puzzleId' },
        { status: 400 }
      );
    }

    const shareUrl = ExportEngine.generateShareURL(puzzleId, baseUrl);
    const shareText = ExportEngine.generateShareText('puzzle', 'medium');

    return NextResponse.json({
      success: true,
      shareUrl,
      shareText,
      socialLinks: {
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate share links',
      },
      { status: 500 }
    );
  }
}
