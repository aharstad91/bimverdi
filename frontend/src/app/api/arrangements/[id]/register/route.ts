import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

const WP_API_BASE = process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.replace('/index.php?rest_route=', '');

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: arrangementId } = await params;
    const body = await request.json();

    // Get session to see if user is logged in
    const session = await getSession();

    // If user is logged in, add user_id to the request
    if (session.isLoggedIn && session.userId) {
      body.user_id = session.userId;
    }

    // Forward to WordPress API
    const url = `${WP_API_BASE}/wp-json/bimverdi/v1/arrangement/${arrangementId}/register`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error registering for arrangement:', error);
    return NextResponse.json(
      { error: 'Failed to register' },
      { status: 500 }
    );
  }
}
