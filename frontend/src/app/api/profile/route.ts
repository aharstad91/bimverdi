import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getUserProfile, updateUserProfile } from '@/lib/auth';

// Get profile
export async function GET() {
  try {
    const session = await getSession();

    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json(
        { error: 'Ikke innlogget' },
        { status: 401 }
      );
    }

    const profile = await getUserProfile(session.userId);

    return NextResponse.json({
      id: profile.id,
      email: profile.email,
      firstName: profile.first_name,
      lastName: profile.last_name,
      acf: profile.acf,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { error: 'Kunne ikke hente profil' },
      { status: 500 }
    );
  }
}

// Update profile
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json(
        { error: 'Ikke innlogget' },
        { status: 401 }
      );
    }

    const body = await request.json();

    const updateData: any = {};

    if (body.firstName) {
      updateData.first_name = body.firstName;
    }
    if (body.lastName) {
      updateData.last_name = body.lastName;
    }
    if (body.email) {
      updateData.email = body.email;
    }
    if (body.acf) {
      updateData.acf = body.acf;
    }

    const updatedProfile = await updateUserProfile(session.userId, updateData);

    // Update session
    if (body.firstName) session.firstName = body.firstName;
    if (body.lastName) session.lastName = body.lastName;
    if (body.email) session.email = body.email;
    await session.save();

    return NextResponse.json({
      id: updatedProfile.id,
      email: updatedProfile.email,
      firstName: updatedProfile.first_name,
      lastName: updatedProfile.last_name,
      acf: updatedProfile.acf,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Kunne ikke oppdatere profil' },
      { status: 500 }
    );
  }
}
