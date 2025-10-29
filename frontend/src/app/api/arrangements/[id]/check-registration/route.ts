import { NextRequest, NextResponse } from 'next/server';

const WP_API_BASE = process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.replace('/index.php?rest_route=', '');

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: arrangementId } = await params;
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { registered: false },
        { status: 200 }
      );
    }

    // Forward to WordPress API
    const url = `${WP_API_BASE}/wp-json/bimverdi/v1/arrangement/${arrangementId}/check-registration?email=${encodeURIComponent(email)}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Don't cache this check
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ registered: false }, { status: 200 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error checking registration:', error);
    return NextResponse.json(
      { registered: false },
      { status: 200 }
    );
  }
}
