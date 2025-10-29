/**
 * GET /api/articles/[id] - Get single article
 * PUT /api/articles/[id] - Update article
 * DELETE /api/articles/[id] - Delete article
 */

import { NextRequest, NextResponse } from 'next/server';

const WP_API_BASE =
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
  'http://localhost:8888/bimverdi/wordpress/index.php?rest_route=';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookies = request.headers.get('cookie') || '';

    const response = await fetch(
      `${WP_API_BASE}/bimverdi/v1/member-articles/${params.id}`,
      {
        method: 'GET',
        headers: {
          Cookie: cookies,
        },
      }
    );

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch article' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const cookies = request.headers.get('cookie') || '';

    const response = await fetch(
      `${WP_API_BASE}/bimverdi/v1/member-articles/${params.id}`,
      {
        method: 'PUT',
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
    console.error('Error updating article:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update article' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookies = request.headers.get('cookie') || '';

    const response = await fetch(
      `${WP_API_BASE}/bimverdi/v1/member-articles/${params.id}`,
      {
        method: 'DELETE',
        headers: {
          Cookie: cookies,
        },
      }
    );

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete article' },
      { status: 500 }
    );
  }
}
