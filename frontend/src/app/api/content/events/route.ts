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
      `${wpApiUrl}/wp/v2/arrangement?per_page=100&orderby=date&order=desc`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      console.error(`WordPress API error: ${response.statusText}`);
      return NextResponse.json([], { status: 200 });
    }

    const events = await response.json();

    const formattedEvents = events.map((event: any) => ({
      id: event.id,
      title: event.title?.rendered || 'Untitled',
      publishedDate: new Date(event.date).toLocaleDateString('no-NO'),
      excerpt: event.excerpt?.rendered?.replace(/<[^>]*>/g, '') || '',
      views: 0,
    }));

    return NextResponse.json(formattedEvents);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json([], { status: 200 });
  }
}
