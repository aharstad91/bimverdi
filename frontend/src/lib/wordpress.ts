// WordPress API Configuration
const WP_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'http://localhost:8888/bimverdi/wordpress/wp-json';

export interface WPResponse<T> {
  data: T;
  total?: number;
  totalPages?: number;
}

/**
 * Fetch data from WordPress REST API
 */
export async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${WP_API_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`WordPress API error: ${response.statusText}`);
  }

  return response.json();
}/**
 * Fetch posts from WordPress
 */
export async function getPosts(params?: {
  page?: number;
  perPage?: number;
  categories?: string;
  tags?: string;
}) {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set('page', params.page.toString());
  if (params?.perPage) searchParams.set('per_page', params.perPage.toString());
  if (params?.categories) searchParams.set('categories', params.categories);
  if (params?.tags) searchParams.set('tags', params.tags);

  const query = searchParams.toString();
  return fetchAPI(`/wp/v2/posts${query ? `&${query}` : ''}`);
}

/**
 * Fetch single post by slug
 */
export async function getPostBySlug(slug: string) {
  const posts = await fetchAPI(`/wp/v2/posts&slug=${slug}`);
  return Array.isArray(posts) && posts.length > 0 ? posts[0] : null;
}

/**
 * Fetch custom post type entries
 */
export async function getCustomPosts<T = any>(
  postType: 'deltakere' | 'members' | 'tools' | 'cases' | 'events' | 'arrangement',
  params?: {
    page?: number;
    perPage?: number;
  }
): Promise<T[]> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set('page', params.page.toString());
  if (params?.perPage) searchParams.set('per_page', params.perPage.toString());

  const query = searchParams.toString();
  return fetchAPI<T[]>(`/wp/v2/${postType}${query ? `&${query}` : ''}`);
}

/**
 * Fetch single custom post by slug
 */
export async function getCustomPostBySlug(
  postType: 'deltakere' | 'members' | 'tools' | 'cases' | 'events' | 'arrangement',
  slug: string
) {
  const posts = await fetchAPI(`/wp/v2/${postType}&slug=${slug}`);
  return Array.isArray(posts) && posts.length > 0 ? posts[0] : null;
}

/**
 * Fetch single custom post by ID
 */
export async function getCustomPostById(
  postType: 'deltakere' | 'members' | 'tools' | 'cases' | 'events' | 'arrangement',
  id: number
) {
  return fetchAPI(`/wp/v2/${postType}/${id}`);
}

/**
 * Fetch ACF fields for a post
 */
export async function getACFFields(postType: string, postId: number) {
  return fetchAPI(`/wp/v2/${postType}/${postId}&acf_format=standard`);
}
