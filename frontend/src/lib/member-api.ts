/**
 * Member Management API Functions
 */

import type { SimpleMember, MemberSearchResult } from '@/types/user';

const API_BASE = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'http://localhost:8888/bimverdi/wordpress/index.php?rest_route=';

/**
 * Get user's associated member
 */
export async function getUserMember(userId: number): Promise<SimpleMember | null> {
  try {
    const response = await fetch(
      `${API_BASE}/bimverdi/v1/profile/${userId}/member`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch user member');
    }

    const data = await response.json();
    return data.member;
  } catch (error) {
    console.error('Error fetching user member:', error);
    return null;
  }
}

/**
 * Associate user with member
 */
export async function setUserMember(userId: number, memberId: number): Promise<boolean> {
  try {
    const response = await fetch(
      `${API_BASE}/bimverdi/v1/profile/${userId}/member`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ member_id: memberId }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to set user member');
    }

    return true;
  } catch (error) {
    console.error('Error setting user member:', error);
    return false;
  }
}

/**
 * Search for members
 */
export async function searchMembers(query: string): Promise<MemberSearchResult> {
  try {
    const response = await fetch(
      `${API_BASE}/bimverdi/v1/members/search&query=${encodeURIComponent(query)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to search members');
    }

    return await response.json();
  } catch (error) {
    console.error('Error searching members:', error);
    return { members: [], total: 0 };
  }
}
