/**
 * GET /api/articles - List user's articles
 * POST /api/articles - Create new article
 */

import { NextRequest, NextResponse } from 'next/server';

const WP_API_BASE =
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
  'http://localhost:8888/bimverdi/wordpress/index.php?rest_route=';

export async function GET(request: NextRequest) {
  try {
    // Forward cookies to WordPress
    const cookies = request.headers.get('cookie') || '';

    const response = await fetch(`${WP_API_BASE}/bimverdi/v1/member-articles`, {
      method: 'GET',
      headers: {
        Cookie: cookies,
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
    const body = await request.json();
    const cookies = request.headers.get('cookie') || '';

    const response = await fetch(`${WP_API_BASE}/bimverdi/v1/member-articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookies,
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
