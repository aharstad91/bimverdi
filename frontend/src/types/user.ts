/**
 * User and Authentication Types
 */

export interface User {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  displayName: string;
  role: 'bimverdi_customer' | 'administrator' | 'subscriber';
  acf: UserACF;
}

export interface UserACF {
  phone?: string;
  company?: string;
  position?: string;
  address?: string;
  postal_code?: string;
  city?: string;
  profile_picture?: {
    url: string;
    alt: string;
    width?: number;
    height?: number;
  };
  bio?: string;
  newsletter_subscription?: boolean;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  acceptTerms: boolean;
}

export interface LoginFormData {
  email: string;
  password: string;
  remember?: boolean;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
  acf?: Partial<UserACF>;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  email: string;
  resetKey: string;
  newPassword: string;
  confirmPassword: string;
}
