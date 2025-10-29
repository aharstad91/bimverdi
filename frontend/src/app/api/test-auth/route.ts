import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Forward all cookies from Next.js to WordPress
    const cookieHeader = request.headers.get('cookie') || '';

    // Use proper wp-json endpoint instead of index.php?rest_route
    const wpUrl = 'http://localhost:8888/bimverdi/wordpress/wp-json/bimverdi/v1/test-auth';

    const response = await fetch(wpUrl, {
      headers: {
        'Cookie': cookieHeader,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: 'WordPress API error', details: data },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Auth test error:', error);
    return NextResponse.json(
      { error: 'Failed to test authentication', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
