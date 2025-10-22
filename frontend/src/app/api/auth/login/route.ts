import { NextRequest, NextResponse } from 'next/server';
import { loginUser } from '@/lib/auth';
import { getSession } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'E-post og passord er påkrevd' },
        { status: 400 }
      );
    }

    // Authenticate via WordPress
    const user = await loginUser({ email, password });

    // Create session
    const session = await getSession();
    session.userId = user.id;
    session.email = user.email;
    session.firstName = user.first_name;
    session.lastName = user.last_name;
    session.role = user.role;
    session.isLoggedIn = true;
    await session.save();

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        displayName: user.display_name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Innlogging feilet' },
      { status: 401 }
    );
  }
}
