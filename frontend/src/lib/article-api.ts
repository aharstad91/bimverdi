/**
 * Article API Client
 *
 * Client functions for all member article REST endpoints
 */

import type {
  Article,
  ArticleListResponse,
  ArticleFormData,
  ArticleCreateResponse,
  ArticleDeleteResponse,
  ArticleSubmitResponse,
  ArticleReviewData,
  ArticleReviewResponse,
  CompanyArticlesResponse,
} from '@/types/article';

const API_BASE =
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
  'http://localhost:8888/bimverdi/wordpress/index.php?rest_route=';

/**
 * Get user's articles
 */
export async function getUserArticles(): Promise<ArticleListResponse> {
  try {
    const response = await fetch('/api/articles', {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch articles: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user articles:', error);
    throw error;
  }
}

/**
 * Get single article by ID
 */
export async function getArticle(id: number): Promise<Article> {
  try {
    const response = await fetch(`/api/articles/${id}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch article: ${response.statusText}`);
    }

    const data = await response.json();
    return data.article;
  } catch (error) {
    console.error('Error fetching article:', error);
    throw error;
  }
}

/**
 * Create new article
 */
export async function createArticle(
  data: ArticleFormData
): Promise<ArticleCreateResponse> {
  try {
    const response = await fetch('/api/articles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to create article: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating article:', error);
    throw error;
  }
}

/**
 * Update existing article
 */
export async function updateArticle(
  id: number,
  data: Partial<ArticleFormData>
): Promise<ArticleCreateResponse> {
  try {
    const response = await fetch(`/api/articles/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update article: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating article:', error);
    throw error;
  }
}

/**
 * Delete article
 */
export async function deleteArticle(id: number): Promise<ArticleDeleteResponse> {
  try {
    const response = await fetch(`/api/articles/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete article: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting article:', error);
    throw error;
  }
}

/**
 * Submit article for review
 */
export async function submitArticle(id: number): Promise<ArticleSubmitResponse> {
  try {
    const response = await fetch(`/api/articles/${id}/submit`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to submit article: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error submitting article:', error);
    throw error;
  }
}

/**
 * Review article (admin only)
 */
export async function reviewArticle(
  id: number,
  data: ArticleReviewData
): Promise<ArticleReviewResponse> {
  try {
    const response = await fetch(`/api/articles/${id}/review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to review article: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error reviewing article:', error);
    throw error;
  }
}

/**
 * Get company's published articles
 */
export async function getCompanyArticles(
  companyId: number,
  limit: number = 10
): Promise<CompanyArticlesResponse> {
  try {
    const response = await fetch(
      `${API_BASE}/bimverdi/v1/companies/${companyId}/articles?limit=${limit}`,
      {
        method: 'GET',
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch company articles: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching company articles:', error);
    throw error;
  }
}
