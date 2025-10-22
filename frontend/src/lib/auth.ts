/**
 * WordPress API Client for User Management
 */

const WP_API_BASE = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'http://localhost:8888/bimverdi/wordpress/index.php?rest_route=';

interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface UserProfile {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  display_name: string;
  role: string;
  acf: {
    phone?: string;
    company?: string;
    position?: string;
    address?: string;
    postal_code?: string;
    city?: string;
    profile_picture?: {
      url: string;
      alt: string;
    };
    bio?: string;
    newsletter_subscription?: boolean;
  };
}

interface UpdateProfileData {
  first_name?: string;
  last_name?: string;
  email?: string;
  acf?: Partial<UserProfile['acf']>;
}

interface ChangePasswordData {
  current_password: string;
  new_password: string;
}

/**
 * Register a new user
 */
export async function registerUser(data: RegisterData): Promise<{ success: boolean; message: string; user_id?: number }> {
  const url = `${WP_API_BASE}/bimverdi/v1/register`;
  console.log('Registering user to:', url);
  console.log('Request data:', { ...data, password: '[REDACTED]' });

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  console.log('Response status:', response.status);
  console.log('Response headers:', Object.fromEntries(response.headers.entries()));

  // Check if response is JSON
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();
    console.error('Non-JSON response:', text.substring(0, 200));
    throw new Error('Server returnerte ugyldig svar. Sjekk WordPress konfigurasjon.');
  }

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Registrering feilet');
  }

  return result;
}

/**
 * Login user - WordPress custom endpoint
 */
export async function loginUser(data: LoginData): Promise<UserProfile> {
  const url = `${WP_API_BASE}/bimverdi/v1/login`;
  console.log('Logging in user to:', url);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  console.log('Login response status:', response.status);

  // Check if response is JSON
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();
    console.error('Non-JSON response:', text.substring(0, 200));
    throw new Error('Server returnerte ugyldig svar.');
  }

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Ugyldig e-post eller passord');
  }

  return result.user;
}

/**
 * Get user profile by user ID
 */
export async function getUserProfile(userId: number): Promise<UserProfile> {
  const url = `${WP_API_BASE}/bimverdi/v1/profile/${userId}`;
  console.log('🔍 Fetching profile from:', url);

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  console.log('📥 Profile response status:', response.status);

  if (!response.ok) {
    const error = await response.json();
    console.error('❌ Profile fetch error:', error);
    throw new Error(error.message || 'Kunne ikke hente brukerprofil');
  }

  const data = await response.json();
  console.log('✅ Profile data received:', data);
  return data;
}

/**
 * Update user profile
 */
export async function updateUserProfile(userId: number, data: UpdateProfileData): Promise<UserProfile> {
  const url = `${WP_API_BASE}/bimverdi/v1/profile/${userId}`;
  console.log('📝 Updating profile at:', url, 'with data:', data);

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  console.log('📥 Update response status:', response.status);

  if (!response.ok) {
    const error = await response.json();
    console.error('❌ Profile update error:', error);
    throw new Error(error.message || 'Kunne ikke oppdatere profil');
  }

  const result = await response.json();
  console.log('✅ Profile updated:', result);
  return result;
}

/**
 * Change password
 */
export async function changePassword(data: ChangePasswordData): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${WP_API_BASE}/bimverdi/v1/change-password`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Kunne ikke endre passord');
  }

  return result;
}

/**
 * Request password reset
 */
export async function forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${WP_API_BASE}/bimverdi/v1/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Kunne ikke sende e-post');
  }

  return result;
}

/**
 * Reset password with token
 */
export async function resetPassword(email: string, resetKey: string, newPassword: string): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${WP_API_BASE}/bimverdi/v1/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      reset_key: resetKey,
      new_password: newPassword,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Kunne ikke tilbakestille passord');
  }

  return result;
}
