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
      `${wpApiUrl}/wp/v2/case?per_page=100&orderby=date&order=desc`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      console.error(`WordPress API error: ${response.statusText}`);
      return NextResponse.json([], { status: 200 });
    }

    const cases = await response.json();

    const formattedCases = cases.map((caseItem: any) => ({
      id: caseItem.id,
      title: caseItem.title?.rendered || 'Untitled',
      publishedDate: new Date(caseItem.date).toLocaleDateString('no-NO'),
      excerpt: caseItem.excerpt?.rendered?.replace(/<[^>]*>/g, '') || '',
      views: 0,
    }));

    return NextResponse.json(formattedCases);
  } catch (error) {
    console.error('Error fetching cases:', error);
    return NextResponse.json([], { status: 200 });
  }
}
