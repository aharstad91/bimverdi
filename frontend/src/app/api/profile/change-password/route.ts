import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { changePassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session.isLoggedIn) {
      return NextResponse.json(
        { error: 'Ikke innlogget' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { current_password, new_password } = body;

    if (!current_password || !new_password) {
      return NextResponse.json(
        { error: 'Alle felt er påkrevd' },
        { status: 400 }
      );
    }

    const result = await changePassword({
      current_password,
      new_password,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Kunne ikke endre passord' },
      { status: 500 }
    );
  }
}
