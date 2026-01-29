import { recommendGadgets } from '@/lib/ai-agent';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/recommend
 * Request: { input: string, budget: number, keywords?: string[] }
 * Response: RecommendationResult with gadget recommendations
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { input, budget, keywords = [] } = body;

    // Validation
    if (!input || typeof input !== 'string' || input.trim().length === 0) {
      return NextResponse.json(
        { error: 'Missing or invalid input' },
        { status: 400 }
      );
    }

    if (!budget || typeof budget !== 'number' || budget < 1000) {
      return NextResponse.json(
        { error: 'Invalid budget (minimum ¥1,000)' },
        { status: 400 }
      );
    }

    // Call AI recommendation engine
    const result = await recommendGadgets(input, budget, keywords);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Recommendation error:', error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to generate recommendations',
      },
      { status: 500 }
    );
  }
}
