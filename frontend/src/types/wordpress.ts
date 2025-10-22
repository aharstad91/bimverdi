// WordPress Post Types
export interface WPPost {
  id: number;
  date: string;
  slug: string;
  status: string;
  type: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  author: number;
  featured_media: number;
  categories: number[];
  tags: number[];
  acf?: Record<string, any>;
}

// Custom Post Types
export interface Member extends WPPost {
  acf: {
    company_name?: string;
    logo?: any;
    description?: string;
    website?: string;
    contact_email?: string;
    contact_phone?: string;
    address?: string;
    membership_level?: string;
    services?: string[];
    city?: string;
    postal_code?: string;
    org_number?: string;
    employees?: number;
    founded_year?: number;
  };
}

export interface Tool extends WPPost {
  acf: {
    tool_name?: string;
    tool_type?: string;
    description?: string;
    download_link?: string;
    documentation_link?: string;
    version?: string;
    author?: string;
    compatibility?: string[];
    owner_member?: number; // Member post ID
    tool_logo?: any;
    tool_description?: string;
    tool_category?: string;
    tool_vendor?: string;
    tool_website?: string;
    tool_price_range?: string;
    tool_platforms?: string[];
    tool_features?: string;
  };
}

export interface Case extends WPPost {
  acf: {
    project_name?: string;
    client?: string;
    year?: string;
    description?: string;
    challenge?: string;
    solution?: string;
    results?: string;
    technologies?: string[];
    images?: any[];
    related_members?: number[];
    related_tools?: number[];
  };
}

export interface Event extends WPPost {
  acf: {
    event_name?: string;
    event_type?: 'project' | 'arrangement' | 'webinar' | 'conference';
    start_date?: string;
    end_date?: string;
    location?: string;
    is_online?: boolean;
    registration_link?: string;
    description?: string;
    organizer?: string;
    max_participants?: number;
    current_participants?: number;
  };
}

// User/Profile Types
export interface UserProfile {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  company?: string;
  role: 'member' | 'admin' | 'contributor';
  membershipLevel?: 'basic' | 'premium' | 'enterprise';
  avatar?: string;
  consents: {
    marketing: boolean;
    dataSharing: boolean;
    newsletter: boolean;
  };
}

// API Response Types
export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}
