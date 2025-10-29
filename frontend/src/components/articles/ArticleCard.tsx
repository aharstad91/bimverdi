/**
 * ArticleCard Component
 *
 * Displays article summary in a card format
 */

'use client';

import Link from 'next/link';
import { Article, formatArticleDate, formatWordCount } from '@/types/article';
import { StatusBadge } from './StatusBadge';

interface ArticleCardProps {
  article: Article;
  showActions?: boolean;
  onDelete?: (id: number) => void;
}

export function ArticleCard({ article, showActions = true, onDelete }: ArticleCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <Link
            href={`/min-side/mine-artikler/${article.id}`}
            className="text-xl font-semibold text-gray-900 hover:text-blue-600"
          >
            {article.title}
          </Link>
          <p className="mt-1 text-sm text-gray-500">
            {formatArticleDate(article.submission_date)}
          </p>
        </div>
        <StatusBadge status={article.status} />
      </div>

      {/* Excerpt */}
      {article.excerpt && (
        <p className="mb-4 text-gray-700 line-clamp-2">{article.excerpt}</p>
      )}

      {/* Meta info */}
      <div className="mb-4 flex flex-wrap gap-4 text-sm text-gray-600">
        <span>{formatWordCount(article.word_count)}</span>
        {article.company.name && (
          <>
            <span>•</span>
            <span>{article.company.name}</span>
          </>
        )}
        {article.published_date && (
          <>
            <span>•</span>
            <span>Publisert {formatArticleDate(article.published_date)}</span>
          </>
        )}
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex gap-3">
          <Link
            href={`/min-side/mine-artikler/${article.id}`}
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            {article.status === 'draft' || article.status === 'rejected'
              ? 'Rediger'
              : 'Vis'}
          </Link>

          {article.status === 'draft' && onDelete && (
            <button
              onClick={() => onDelete(article.id)}
              className="inline-flex items-center rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
            >
              Slett
            </button>
          )}

          {article.status === 'rejected' && article.review?.rejection_reason && (
            <div className="flex-1">
              <p className="rounded border border-red-200 bg-red-50 p-2 text-sm text-red-800">
                <strong>Årsak til avvisning:</strong> {article.review.rejection_reason}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
