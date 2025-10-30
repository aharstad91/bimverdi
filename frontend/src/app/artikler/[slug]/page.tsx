import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content_html: string;
  status: string;
  published_date: string;
  author?: {
    id: number;
    name: string;
    email: string;
  };
  company?: {
    id: number;
    name: string;
    slug: string;
  };
  featured_image?: string;
}

async function getArticle(slug: string): Promise<Article | null> {
  try {
    const wpApiUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
    if (!wpApiUrl) {
      throw new Error('WordPress API URL not configured');
    }

    const response = await fetch(
      `${wpApiUrl}/bimverdi/v1/articles/${slug}`,
      { 
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.article || null;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article || article.status !== 'publish') {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-8">
          <Link
            href="/artikler"
            className="inline-flex items-center gap-2 mb-6 text-blue-100 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Tilbake til artikler
          </Link>

          <h1 className="text-4xl font-bold mb-4">{article.title}</h1>

          <div className="flex flex-wrap gap-4 items-center text-blue-100 text-sm">
            {article.published_date && (
              <time dateTime={article.published_date}>
                {new Date(article.published_date).toLocaleDateString('nb-NO', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            )}

            {article.author && (
              <div className="flex items-center gap-2">
                <span>Av</span>
                <span className="font-semibold">{article.author.name}</span>
              </div>
            )}

            {article.company && (
              <Link
                href={`/deltakere/${article.company.slug}`}
                className="font-semibold hover:text-white transition-colors"
              >
                {article.company.name}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {article.featured_image && (
        <div className="w-full h-96 bg-gray-200 overflow-hidden">
          <img
            src={article.featured_image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <article className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {article.excerpt && (
            <p className="text-xl text-gray-600 mb-8 font-semibold leading-relaxed">
              {article.excerpt}
            </p>
          )}

          <div
            className="prose prose-lg max-w-none text-gray-700"
            dangerouslySetInnerHTML={{
              __html: article.content_html,
            }}
          />
        </div>
      </article>

      {/* Footer / Related */}
      <div className="bg-gray-50 border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center">
              <Link
                href="/artikler"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Til alle artikler
              </Link>

              {article.company && (
                <Link
                  href={`/deltakere/${article.company.slug}`}
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Besøk {article.company.name}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
