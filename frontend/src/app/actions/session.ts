'use server';

import { getSession } from '@/lib/session';
import type { SessionData } from '@/lib/session';

/**
 * Get current session data
 * This is a Server Action that can be called from Client Components
 */
export async function getCurrentSession(): Promise<SessionData | null> {
  const session = await getSession();

  if (!session.isLoggedIn) {
    return null;
  }

  return {
    userId: session.userId,
    email: session.email,
    firstName: session.firstName,
    lastName: session.lastName,
    role: session.role,
    isLoggedIn: session.isLoggedIn,
  };
}
