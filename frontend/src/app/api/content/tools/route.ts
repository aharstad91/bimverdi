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
      `${wpApiUrl}/wp/v2/tool?per_page=100&orderby=date&order=desc`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      console.error(`WordPress API error: ${response.statusText}`);
      return NextResponse.json([], { status: 200 });
    }

    const tools = await response.json();

    const formattedTools = tools.map((tool: any) => ({
      id: tool.id,
      title: tool.title?.rendered || 'Untitled',
      publishedDate: new Date(tool.date).toLocaleDateString('no-NO'),
      excerpt: tool.excerpt?.rendered?.replace(/<[^>]*>/g, '') || '',
      views: 0,
    }));

    return NextResponse.json(formattedTools);
  } catch (error) {
    console.error('Error fetching tools:', error);
    return NextResponse.json([], { status: 200 });
  }
}
