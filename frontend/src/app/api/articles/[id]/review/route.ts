/**
 * POST /api/articles/[id]/review - Admin review article
 */

import { NextRequest, NextResponse } from 'next/server';

const WP_API_BASE =
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
  'http://localhost:8888/bimverdi/wordpress/index.php?rest_route=';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const cookies = request.headers.get('cookie') || '';

    const response = await fetch(
      `${WP_API_BASE}/bimverdi/v1/member-articles/${params.id}/review`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookies,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error reviewing article:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to review article' },
      { status: 500 }
    );
  }
}
