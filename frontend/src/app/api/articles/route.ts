/**
 * GET /api/articles - List user's articles
 * POST /api/articles - Create new article
 */

'use server';

import { NextRequest, NextResponse } from 'next/server';
import { getSessionServer } from '@/app/actions/auth';

const WP_API_BASE =
  process.env.WORDPRESS_API_URL ||
  'http://localhost:8888/bimverdi/wordpress/wp-json';

export async function GET(_request: NextRequest) {
  try {
    // Get authenticated session
    const session = await getSessionServer();

    if (!session || !session.isLoggedIn || !session.userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Call WordPress API with user_id as parameter
    const url = new URL(`${WP_API_BASE}/bimverdi/v1/member-articles`);
    url.searchParams.set('user_id', String(session.userId));

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get authenticated session
    const session = await getSessionServer();

    if (!session || !session.isLoggedIn || !session.userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    const url = new URL(`${WP_API_BASE}/bimverdi/v1/member-articles`);
    url.searchParams.set('user_id', String(session.userId));

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create article' },
      { status: 500 }
    );
  }
}
