import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

const WP_API_BASE = process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.replace('/index.php?rest_route=', '');

export async function GET() {
  try {
    // Get session
    const session = await getSession();

    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch arrangements from WordPress
    const url = `${WP_API_BASE}/wp-json/bimverdi/v1/my-arrangements?user_id=${session.userId}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching arrangements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch arrangements' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log('🗑️ DELETE request received');

    // Get session
    const session = await getSession();
    console.log('👤 Session:', { isLoggedIn: session.isLoggedIn, userId: session.userId });

    if (!session.isLoggedIn || !session.userId) {
      console.log('❌ Unauthorized - no session');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get arrangement ID from URL
    const { searchParams } = new URL(request.url);
    const arrangementId = searchParams.get('arrangementId');
    console.log('🎫 Arrangement ID:', arrangementId);

    if (!arrangementId) {
      console.log('❌ No arrangement ID provided');
      return NextResponse.json(
        { error: 'Arrangement ID required' },
        { status: 400 }
      );
    }

    // Unregister from WordPress
    const url = `${WP_API_BASE}/wp-json/bimverdi/v1/arrangement/${arrangementId}/unregister?user_id=${session.userId}`;
    console.log('🔗 Calling WordPress:', url);

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('📡 WordPress response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ WordPress error:', errorText);
      throw new Error(`WordPress API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Success:', data);

    return NextResponse.json(data);
  } catch (error) {
    console.error('💥 Error unregistering from arrangement:', error);
    return NextResponse.json(
      { error: 'Failed to unregister' },
      { status: 500 }
    );
  }
}
