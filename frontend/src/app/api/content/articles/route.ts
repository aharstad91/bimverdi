import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const wpApiUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

    if (!wpApiUrl) {
      return NextResponse.json(
        { error: 'WordPress API URL not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(
      `${wpApiUrl}/wp/v2/bv_member_article?per_page=100&orderby=date&order=desc`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      console.error(`WordPress API error: ${response.statusText}`);
      return NextResponse.json([], { status: 200 });
    }

    const articles = await response.json();

    const formattedArticles = articles.map((article: any) => ({
      id: article.id,
      title: article.title?.rendered || 'Untitled',
      publishedDate: new Date(article.date).toLocaleDateString('no-NO'),
      excerpt: article.excerpt?.rendered?.replace(/<[^>]*>/g, '') || '',
      views: 0,
    }));

    return NextResponse.json(formattedArticles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json([], { status: 200 });
  }
}
