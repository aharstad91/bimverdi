/**
 * POST /api/articles/[id]/submit - Submit article for review
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
    const cookies = request.headers.get('cookie') || '';

    const response = await fetch(
      `${WP_API_BASE}/bimverdi/v1/member-articles/${params.id}/submit`,
      {
        method: 'POST',
        headers: {
          Cookie: cookies,
        },
      }
    );

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error submitting article:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to submit article' },
      { status: 500 }
    );
  }
}
