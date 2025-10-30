'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2, AlertCircle } from 'lucide-react';

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  created_at?: string;
  published_date?: string;
  author?: {
    id: number;
    name: string;
  };
  company?: {
    id: number;
    name: string;
    slug: string;
  };
}

export default function ArtiklerPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/bimverdi/v1/articles/published&limit=20`
        );

        if (!response.ok) {
          throw new Error('Kunne ikke laste artikler');
        }

        const data = await response.json();
        setArticles(data.articles || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'En feil oppstod');
        console.error('Error fetching articles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Artikler</h1>
        <p className="text-lg text-gray-600">
          Kunnskapsartikler fra BimVerdi-medlemmer
        </p>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
          <div>
            <h3 className="font-semibold text-red-900">Feil ved lasting</h3>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Ingen artikler funnet ennå</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <article
              key={article.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                  {article.title}
                </h2>

                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {article.excerpt || article.content.replace(/<[^>]*>/g, '').substring(0, 150)}
                </p>

                {article.company && (
                  <div className="mb-4 pb-4 border-b border-gray-100">
                    <Link
                      href={`/deltakere/${article.company.slug}`}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {article.company.name}
                    </Link>
                  </div>
                )}

                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <span>
                    {article.published_date
                      ? new Date(article.published_date).toLocaleDateString('nb-NO')
                      : article.created_at
                        ? new Date(article.created_at).toLocaleDateString('nb-NO')
                        : 'Dato ukjent'}
                  </span>
                  {article.author && (
                    <span>{article.author.name}</span>
                  )}
                </div>

                <Link
                  href={`/artikler/${article.slug}`}
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Les artikkelen
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
