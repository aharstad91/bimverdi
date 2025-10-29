/**
 * Mine Artikler - Article List Page
 *
 * Lists all user's articles with status filtering
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getSessionServer } from '@/app/actions/auth';
import { getUserArticles, deleteArticle } from '@/lib/article-api';
import { Article } from '@/types/article';
import { ArticleCard } from '@/components/articles/ArticleCard';

export default function MineArtiklerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [filter, setFilter] = useState<'all' | 'draft' | 'pending' | 'published' | 'rejected'>(
    'all'
  );
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  useEffect(() => {
    checkAuthAndLoadArticles();
  }, []);

  useEffect(() => {
    // Apply filter
    if (filter === 'all') {
      setFilteredArticles(articles);
    } else if (filter === 'pending') {
      setFilteredArticles(articles.filter((a) => a.status === 'pending' || a.status === 'admin_review'));
    } else if (filter === 'published') {
      setFilteredArticles(articles.filter((a) => a.status === 'publish'));
    } else {
      setFilteredArticles(articles.filter((a) => a.status === filter));
    }
  }, [filter, articles]);

  const checkAuthAndLoadArticles = async () => {
    try {
      const session = await getSessionServer();

      if (!session || !session.isLoggedIn) {
        router.push('/logg-inn?returnUrl=/min-side/mine-artikler');
        return;
      }

      // Load articles
      const response = await getUserArticles();
      setArticles(response.articles);
      setFilteredArticles(response.articles);
    } catch (error) {
      console.error('Error loading articles:', error);
      setMessage({ type: 'error', text: 'Kunne ikke laste artikler' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Er du sikker på at du vil slette denne artikkelen?')) {
      return;
    }

    try {
      await deleteArticle(id);
      setMessage({ type: 'success', text: 'Artikkel slettet' });

      // Remove from list
      setArticles((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      console.error('Error deleting article:', error);
      setMessage({ type: 'error', text: 'Kunne ikke slette artikkel' });
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-b-lg border border-gray-200 border-t-0 p-6">
        <p className="text-center text-gray-500">Laster artikler...</p>
      </div>
    );
  }

  const stats = {
    total: articles.length,
    draft: articles.filter((a) => a.status === 'draft').length,
    pending: articles.filter((a) => a.status === 'pending' || a.status === 'admin_review').length,
    published: articles.filter((a) => a.status === 'publish').length,
    rejected: articles.filter((a) => a.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mine Artikler</h1>
            <p className="text-gray-600 mt-1">
              Administrer dine artikler og send inn til publisering
            </p>
          </div>
          <Link
            href="/min-side/mine-artikler/ny"
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <svg
              className="mr-2 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Ny artikkel
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          <button
            onClick={() => setFilter('all')}
            className={`rounded-lg border p-3 text-center transition-colors ${
              filter === 'all'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-sm text-gray-600">Totalt</p>
          </button>
          <button
            onClick={() => setFilter('draft')}
            className={`rounded-lg border p-3 text-center transition-colors ${
              filter === 'draft'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <p className="text-2xl font-bold text-gray-900">{stats.draft}</p>
            <p className="text-sm text-gray-600">Utkast</p>
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`rounded-lg border p-3 text-center transition-colors ${
              filter === 'pending'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            <p className="text-sm text-gray-600">Til godkjenning</p>
          </button>
          <button
            onClick={() => setFilter('published')}
            className={`rounded-lg border p-3 text-center transition-colors ${
              filter === 'published'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <p className="text-2xl font-bold text-gray-900">{stats.published}</p>
            <p className="text-sm text-gray-600">Publisert</p>
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`rounded-lg border p-3 text-center transition-colors ${
              filter === 'rejected'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
            <p className="text-sm text-gray-600">Avvist</p>
          </button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`rounded-lg border p-4 ${
            message.type === 'success'
              ? 'border-green-200 bg-green-50 text-green-800'
              : 'border-red-200 bg-red-50 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Articles */}
      <div className="space-y-4">
        {filteredArticles.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              {filter === 'all' ? 'Ingen artikler ennå' : 'Ingen artikler med denne statusen'}
            </h3>
            <p className="mt-2 text-gray-600">
              {filter === 'all'
                ? 'Kom i gang ved å lage din første artikkel'
                : 'Prøv et annet filter for å se flere artikler'}
            </p>
            {filter === 'all' && (
              <Link
                href="/min-side/mine-artikler/ny"
                className="mt-4 inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Lag ny artikkel
              </Link>
            )}
          </div>
        ) : (
          filteredArticles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
