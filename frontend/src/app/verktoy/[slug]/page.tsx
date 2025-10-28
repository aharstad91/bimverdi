import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCustomPostBySlug, getCustomPostById } from '@/lib/wordpress';
import { Tool, Deltaker } from '@/types/wordpress';

interface VerktoyPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: VerktoyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = await getCustomPostBySlug('tools', slug) as Tool | null;

  if (!tool) {
    return {
      title: 'Verktøy ikke funnet - BIMVerdi',
    };
  }

  return {
    title: `${tool.title.rendered} - Verktøy - BIMVerdi`,
    description: tool.excerpt?.rendered?.replace(/<[^>]*>/g, '') || `Informasjon om ${tool.title.rendered}`,
  };
}

export default async function VerktoyPage({ params }: VerktoyPageProps) {
  const { slug } = await params;

  try {
    const tool = await getCustomPostBySlug('tools', slug) as Tool | null;

    if (!tool) {
      notFound();
    }

    // Fetch owner deltaker if available
    let owner: Deltaker | null = null;
    if (tool.acf?.owner_member) {
      try {
        owner = await getCustomPostById('deltakere', tool.acf.owner_member) as Deltaker;
      } catch (error) {
        console.error('Failed to fetch owner:', error);
      }
    }

    const categoryLabels: Record<string, string> = {
      'modeling': 'Modellering',
      'coordination': 'Koordinering',
      'visualization': 'Visualisering',
      'analysis': 'Analyse',
      'documentation': 'Dokumentasjon',
      'project_management': 'Prosjektstyring',
    };

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back button */}
          <Link
            href="/verktoy"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-6"
          >
            ← Tilbake til verktøyoversikten
          </Link>

          {/* Main card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            {/* Header with gradient */}
            <div className="bg-linear-to-r from-blue-600 to-blue-800 px-8 py-8 text-white">
              <div className="flex items-start gap-6">
                {/* Tool Logo */}
                {tool.acf?.tool_logo?.url && (
                  <div className="shrink-0">
                    <img
                      src={tool.acf.tool_logo.url}
                      alt={tool.acf.tool_logo.alt || tool.title.rendered}
                      className="w-24 h-24 object-contain bg-white rounded-lg p-2"
                    />
                  </div>
                )}

                <div className="flex-1">
                  {/* Category badge */}
                  {tool.acf?.tool_category && (
                    <span className="inline-block px-3 py-1 text-xs font-medium bg-white/20 rounded-full mb-3">
                      {categoryLabels[tool.acf.tool_category] || tool.acf.tool_category}
                    </span>
                  )}

                  <h1 className="text-3xl font-bold mb-2">
                    {tool.title.rendered}
                  </h1>

                  {tool.acf?.tool_vendor && (
                    <p className="text-blue-100 text-sm">
                      Leverandør: {tool.acf.tool_vendor}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="px-8 py-6 space-y-6">
              {/* Description */}
              {tool.acf?.tool_description && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Om verktøyet</h2>
                  <div
                    className="prose prose-sm max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: tool.acf.tool_description }}
                  />
                </section>
              )}

              {tool.content?.rendered && (
                <section>
                  <div
                    className="prose prose-sm max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: tool.content.rendered }}
                  />
                </section>
              )}

              {/* Features */}
              {tool.acf?.tool_features && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Hovedfunksjoner</h2>
                  <div className="text-sm text-gray-700 whitespace-pre-line">
                    {tool.acf.tool_features}
                  </div>
                </section>
              )}

              {/* Technical Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
                {tool.acf?.tool_website && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Nettside</p>
                    <a
                      href={tool.acf.tool_website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      {tool.acf.tool_website}
                    </a>
                  </div>
                )}

                {tool.acf?.tool_price_range && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Prisklasse</p>
                    <p className="text-gray-700 text-sm">{tool.acf.tool_price_range}</p>
                  </div>
                )}

                {tool.acf?.tool_platforms && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Plattformer</p>
                    <p className="text-gray-700 text-sm">{tool.acf.tool_platforms}</p>
                  </div>
                )}
              </div>

              {/* Owner Information */}
              {owner && (
                <section className="pt-6 border-t border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">
                    Eies/administreres av
                  </h2>
                  <Link
                    href={`/deltakere/${owner.slug}`}
                    className="inline-flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition"
                  >
                    {owner.acf?.logo?.url && (
                      <img
                        src={owner.acf.logo.url}
                        alt={owner.acf.logo.alt || owner.title.rendered}
                        className="w-16 h-16 object-contain"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {owner.title.rendered}
                      </h3>
                      {owner.acf?.membership_level && (
                        <span className="text-xs text-gray-500">
                          {owner.acf.membership_level === 'deltaker' && 'Deltaker (D)'}
                          {owner.acf.membership_level === 'partner' && 'Partner (P)'}
                          {owner.acf.membership_level === 'prosjektdeltaker' && 'Prosjektdeltaker (PD)'}
                          {owner.acf.membership_level === 'egen_avtale' && 'Egen avtale'}
                        </span>
                      )}
                    </div>
                  </Link>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading tool:', error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Feil ved lasting av verktøy
          </h1>
          <p className="text-gray-600">
            {error instanceof Error ? error.message : 'Ukjent feil'}
          </p>
        </div>
      </div>
    );
  }
}
