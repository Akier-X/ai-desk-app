import { NextRequest, NextResponse } from 'next/server';
import { generateOGPSVG } from '@/lib/ogp-generator';

/**
 * GET /api/ogp-image
 * Generate OGP preview image for setup sharing
 * Query params:
 *   - title: Setup title
 *   - budget: Total budget (integer)
 *   - items: JSON array of items [{name, price, brand}]
 *   - username: Creator username
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const title = searchParams.get('title');
    const budget = searchParams.get('budget');
    const itemsJson = searchParams.get('items');
    const username = searchParams.get('username');

    // Validation
    if (!title || !budget || !itemsJson || !username) {
      return NextResponse.json(
        {
          error:
            'Missing required parameters: title, budget, items, username',
        },
        { status: 400 }
      );
    }

    let items;
    try {
      items = JSON.parse(decodeURIComponent(itemsJson));
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid items JSON' },
        { status: 400 }
      );
    }

    // Generate OGP image
    const svgDataUri = generateOGPSVG({
      title,
      description: `Perfect desk setup with ${items.length} carefully selected components`,
      budget: parseInt(budget),
      items,
      username,
    });

    // Return as data URI response
    return NextResponse.json(
      {
        image: svgDataUri,
        format: 'data-uri',
        mimeType: 'image/svg+xml',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('OGP generation error:', error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to generate OGP image',
      },
      { status: 500 }
    );
  }
}
