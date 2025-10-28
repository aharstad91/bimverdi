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
export interface Deltaker extends WPPost {
  acf: {
    company_name?: string;
    membership_level?: 'deltaker' | 'partner' | 'prosjektdeltaker' | 'egen_avtale';
    logo?: any;
    description?: string;
    website?: string;
    org_number?: string;
    business_categories?: string[]; // architect, consultant, contractor, etc.
    customer_types?: string[]; // client, architect, contractor, etc.
    main_contact_name?: string;
    main_contact_title?: string;
    main_contact_linkedin?: string;
    contact_email?: string;
    contact_phone?: string;
    address?: string;
    city?: string;
    postal_code?: string;
    employees?: number;
    founded_year?: number;
    services?: string;
    linkedin_company?: string;
  };
}

// Legacy type alias for backwards compatibility
export type Member = Deltaker;

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

export interface Arrangement extends WPPost {
  acf: {
    dato_start?: string; // YYYYMMDD format
    tidspunkt_start?: string; // HH:mm format
    pameldingsfrist?: string; // Y-m-d H:i:s format
    moteformat?: 'fysisk' | 'digitalt' | 'hybrid';
    adresse?: string;
    poststed?: string;
    digital_link?: string;
    maks_deltakere?: number;
    kun_for_medlemmer?: boolean;
    arrangement_status?: 'kommende' | 'paamelding_aapen' | 'fullbooket' | 'avlyst';
    gf_form_id?: number;
  };
  arrangement_type?: number[]; // Taxonomy term IDs
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
