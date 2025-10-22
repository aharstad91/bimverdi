import { NextRequest, NextResponse } from 'next/server';
import { registerUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, first_name, last_name } = body;

    console.log('Registration attempt:', { email, first_name, last_name });

    // Validate required fields
    if (!email || !password || !first_name || !last_name) {
      return NextResponse.json(
        { error: 'Alle felt er påkrevd' },
        { status: 400 }
      );
    }

    // Register user via WordPress API
    const result = await registerUser({
      email,
      password,
      first_name,
      last_name,
    });

    console.log('Registration successful:', result);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Registrering feilet' },
      { status: 500 }
    );
  }
}
