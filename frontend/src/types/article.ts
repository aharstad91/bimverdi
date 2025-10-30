/**
 * Article Types for BimVerdi Member Article System
 */

/**
 * Article status types
 */
export type ArticleStatus = 'draft' | 'pending' | 'admin_review' | 'publish' | 'rejected';

/**
 * Review status types
 */
export type ReviewStatus = 'pending' | 'approved' | 'rejected' | 'published';

/**
 * Article author information
 */
export interface ArticleAuthor {
  name: string;
  email: string;
}

/**
 * Article company information
 */
export interface ArticleCompany {
  id: number | null;
  name: string | null;
}

/**
 * Article review information (admin only)
 */
export interface ArticleReview {
  status: ReviewStatus;
  reviewer_notes?: string;
  reviewed_by?: number;
  reviewed_date?: string;
  rejection_reason?: string;
}

/**
 * Main Article type
 */
export interface Article {
  id: number;
  title: string;
  slug: string;
  status: ArticleStatus;
  excerpt: string;
  word_count: number;
  submission_date: string;
  author: ArticleAuthor;
  company: ArticleCompany;
  featured_image: string | null;
  published_date: string | null;
  content_html?: string; // Only included in full details
  review?: ArticleReview; // Only included in full details
}

/**
 * Article list response from API
 */
export interface ArticleListResponse {
  articles: Article[];
  total: number;
}

/**
 * Company articles response from API
 */
export interface CompanyArticlesResponse {
  company: {
    id: number;
    name: string;
    slug: string;
  };
  articles: Article[];
  total: number;
}

/**
 * Form data for creating/updating articles
 */
export interface ArticleFormData {
  title: string;
  content_html: string;
  excerpt?: string;
  status?: ArticleStatus;
}

/**
 * Article submission response
 */
export interface ArticleSubmitResponse {
  success: boolean;
  message: string;
  new_status: ArticleStatus;
}

/**
 * Article review action data
 */
export interface ArticleReviewData {
  action: 'approve' | 'reject';
  reviewer_notes?: string;
  rejection_reason?: string;
}

/**
 * Article review response
 */
export interface ArticleReviewResponse {
  success: boolean;
  message: string;
  new_status: ArticleStatus;
}

/**
 * Article create/update response
 */
export interface ArticleCreateResponse {
  success: boolean;
  article_id?: number;
  message: string;
  article?: Article;
}

/**
 * Article delete response
 */
export interface ArticleDeleteResponse {
  success: boolean;
  message: string;
}

/**
 * Status badge configuration
 */
export interface StatusBadgeConfig {
  label: string;
  color: 'gray' | 'yellow' | 'blue' | 'green' | 'red';
  description: string;
}

/**
 * Get status badge configuration
 */
export function getStatusBadge(status: ArticleStatus): StatusBadgeConfig {
  const badges: Record<ArticleStatus, StatusBadgeConfig> = {
    draft: {
      label: 'Kladd',
      color: 'gray',
      description: 'Artikkelen er ikke sendt inn ennå',
    },
    pending: {
      label: 'Venter',
      color: 'yellow',
      description: 'Artikkelen venter på gjennomgang',
    },
    admin_review: {
      label: 'Under gjennomgang',
      color: 'blue',
      description: 'Artikkelen er under gjennomgang av admin',
    },
    publish: {
      label: 'Publisert',
      color: 'green',
      description: 'Artikkelen er godkjent og publisert',
    },
    rejected: {
      label: 'Avvist',
      color: 'red',
      description: 'Artikkelen trenger endringer',
    },
  };

  return badges[status];
}

/**
 * Check if article can be edited
 */
export function canEditArticle(article: Article): boolean {
  return ['draft', 'pending', 'rejected'].includes(article.status);
}

/**
 * Check if article can be submitted
 */
export function canSubmitArticle(article: Article): boolean {
  return article.status === 'draft' && article.word_count > 0;
}

/**
 * Check if article can be deleted
 */
export function canDeleteArticle(article: Article): boolean {
  return article.status === 'draft';
}

/**
 * Format date string for display
 */
export function formatArticleDate(dateString: string | null): string {
  if (!dateString) return 'Ikke satt';

  const date = new Date(dateString);
  return new Intl.DateTimeFormat('nb-NO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Get readable word count
 */
export function formatWordCount(count: number | null | undefined): string {
  if (!count) return 'Ingen ord';
  if (count === 1) return '1 ord';
  return `${count.toLocaleString('nb-NO')} ord`;
}
