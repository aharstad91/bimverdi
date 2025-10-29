/**
 * GET /api/articles/[id] - Get single article
 * PUT /api/articles/[id] - Update article
 * DELETE /api/articles/[id] - Delete article
 */

'use server';

import { NextRequest, NextResponse } from 'next/server';
import { getSessionServer } from '@/app/actions/auth';

const WP_API_BASE =
  process.env.WORDPRESS_API_URL ||
  'http://localhost:8888/bimverdi/wordpress/wp-json';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get authenticated session
    const session = await getSessionServer();

    if (!session || !session.isLoggedIn || !session.userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const url = new URL(`${WP_API_BASE}/bimverdi/v1/member-articles/${id}`);
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
    // Get authenticated session
    const session = await getSessionServer();

    if (!session || !session.isLoggedIn || !session.userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const url = new URL(`${WP_API_BASE}/bimverdi/v1/member-articles/${id}`);
    url.searchParams.set('user_id', String(session.userId));

    const response = await fetch(url.toString(), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

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
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get authenticated session
    const session = await getSessionServer();

    if (!session || !session.isLoggedIn || !session.userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const url = new URL(`${WP_API_BASE}/bimverdi/v1/member-articles/${id}`);
    url.searchParams.set('user_id', String(session.userId));

    const response = await fetch(url.toString(), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

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
