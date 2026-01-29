import { NextRequest, NextResponse } from 'next/server';
import { createSetup, getUserSetups, listSetups } from '@/lib/supabase';

/**
 * POST /api/setups
 * Create a new setup
 * Request: { title: string, description?: string, image_url?: string }
 * Response: Created setup object
 */
export async function POST(request: NextRequest) {
  try {
    // TODO: Extract user ID from auth headers
    const userId = request.headers.get('x-user-id') || 'demo-user-id';

    const body = await request.json();
    const { title, description, image_url } = body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Missing or invalid title' },
        { status: 400 }
      );
    }

    const setup = await createSetup(userId, {
      title,
      description: description || undefined,
      image_url: image_url || undefined,
    });

    return NextResponse.json(setup, { status: 201 });
  } catch (error) {
    console.error('Setup creation error:', error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to create setup',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/setups
 * List setups (public gallery or user's setups)
 * Query: user_id? (if provided, return only user's setups)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);

    let setups;
    if (userId) {
      // Get user's setups
      setups = await getUserSetups(userId, limit);
    } else {
      // Get public gallery
      setups = await listSetups(limit);
    }

    return NextResponse.json({ data: setups, count: setups.length });
  } catch (error) {
    console.error('Setup retrieval error:', error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to retrieve setups',
      },
      { status: 500 }
    );
  }
}
