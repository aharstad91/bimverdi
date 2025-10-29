import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const WP_API_BASE = process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.replace('/index.php?rest_route=', '');

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: arrangementId } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Du må være innlogget for å melde deg av' },
        { status: 401 }
      );
    }

    // Forward to WordPress API
    const url = `${WP_API_BASE}/wp-json/bimverdi/v1/arrangement/${arrangementId}/unregister?user_id=${session.user.id}`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Kunne ikke avmelde fra arrangement' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unregister error:', error);
    return NextResponse.json(
      { error: 'En feil oppstod ved avmelding' },
      { status: 500 }
    );
  }
}
