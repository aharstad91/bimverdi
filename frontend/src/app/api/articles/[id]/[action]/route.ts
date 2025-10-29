/**
 * POST /api/articles/[id]/submit - Submit article for review
 * POST /api/articles/[id]/review - Admin review article
 */

'use server';

import { NextRequest, NextResponse } from 'next/server';
import { getSessionServer } from '@/app/actions/auth';

const WP_API_BASE =
  process.env.WORDPRESS_API_URL ||
  'http://localhost:8888/bimverdi/wordpress/wp-json';

export async function POST(
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
    const pathParts = request.nextUrl.pathname.split('/');
    const action = pathParts[pathParts.length - 1]; // 'submit' or 'review'

    let body: Record<string, unknown> = {};
    if (request.headers.get('content-type')?.includes('application/json')) {
      body = await request.json();
    }

    const url = new URL(
      `${WP_API_BASE}/bimverdi/v1/member-articles/${id}/${action}`
    );
    url.searchParams.set('user_id', String(session.userId));

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: Object.keys(body).length > 0 ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error processing article action:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process article' },
      { status: 500 }
    );
  }
}
