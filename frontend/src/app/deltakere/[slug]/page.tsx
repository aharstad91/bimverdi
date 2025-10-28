import { getCustomPostBySlug, getCustomPosts } from '@/lib/wordpress';
import { Deltaker, Tool } from '@/types/wordpress';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Image from 'next/image';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Helper function to get membership level display text
function getMembershipLevelBadge(level?: string): { text: string; color: string } {
  const levels: Record<string, { text: string; color: string }> = {
    'deltaker': { text: 'Deltaker (D)', color: 'bg-blue-100 text-blue-800' },
    'partner': { text: 'Partner (P)', color: 'bg-purple-100 text-purple-800' },
    'prosjektdeltaker': { text: 'Prosjektdeltaker (PD)', color: 'bg-green-100 text-green-800' },
    'egen_avtale': { text: 'Egen avtale', color: 'bg-gray-100 text-gray-800' },
  };
  return levels[level || 'deltaker'] || levels['deltaker'];
}

// Helper function to format business categories
function formatCategories(categories?: string[]): string[] {
  if (!categories || categories.length === 0) return [];

  const categoryLabels: Record<string, string> = {
    'architect': 'Arkitekt/rådgiver',
    'consultant': 'Rådgivende ingeniør',
    'contractor': 'Entreprenør/byggmester',
    'developer': 'Boligutvikler',
    'client': 'Bestiller/byggherre',
    'producer': 'Byggevareprodusent',
    'retailer': 'Byggevarehandel',
    'property': 'Eiendom/drift',
    'tool_vendor': 'Leverandør av digitale verktøy, innhold og løsninger',
    'service_provider': 'Tjenesteleverandør',
    'organization': 'Organisasjon, nettverk m.m.',
    'public': 'Offentlig instans',
    'education': 'Utdanningsinstitusjon',
    'research': 'Forskningsinstitutt',
  };

  return categories.map(cat => categoryLabels[cat] || cat);
}

export default async function DeltakerPage({ params }: PageProps) {
  const { slug } = await params;

  try {
    const deltaker = await getCustomPostBySlug('deltakere', slug) as Deltaker | null;

    if (!deltaker) {
      notFound();
    }

    // Fetch tools owned by this deltaker
    const allTools = await getCustomPosts<Tool>('tools');
    const deltakerTools = allTools.filter(
      tool => tool.acf?.owner_member === deltaker.id
    );

    const membershipBadge = getMembershipLevelBadge(deltaker.acf?.membership_level);
    const businessCategories = formatCategories(deltaker.acf?.business_categories);
    const customerTypes = formatCategories(deltaker.acf?.customer_types);

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back button */}
          <Link
            href="/deltakere"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-6"
          >
            ← Tilbake til deltakeroversikten
          </Link>

          {/* Main card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            {/* Header with logo and badge */}
            <div className="bg-linear-to-r from-blue-600 to-blue-700 px-8 py-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${membershipBadge.color} mb-3`}>
                    {membershipBadge.text}
                  </span>
                  <h1 className="text-3xl font-bold text-white">
                    {deltaker.acf?.company_name || deltaker.title.rendered}
                  </h1>
                  {deltaker.acf?.website && (
                    <a
                      href={deltaker.acf.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-100 hover:text-white text-sm mt-2"
                    >
                      🌐 {deltaker.acf.website.replace(/^https?:\/\//, '')}
                    </a>
                  )}
                </div>

                {deltaker.acf?.logo && (
                  <div className="ml-6 shrink-0">
                    <div className="w-24 h-24 bg-white rounded-lg p-2 shadow-lg">
                      <Image
                        src={deltaker.acf.logo.url || deltaker.acf.logo}
                        alt={`Logo for ${deltaker.acf?.company_name}`}
                        width={88}
                        height={88}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="px-8 py-6 space-y-8">
              {/* Main Contact */}
              {(deltaker.acf?.main_contact_name || deltaker.acf?.main_contact_title) && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Hovedkontakt</h2>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    {deltaker.acf?.main_contact_name && (
                      <p className="font-semibold text-gray-900">
                        {deltaker.acf.main_contact_name}
                      </p>
                    )}
                    {deltaker.acf?.main_contact_title && (
                      <p className="text-gray-600 text-sm mt-1">
                        {deltaker.acf.main_contact_title}
                      </p>
                    )}
                    {deltaker.acf?.main_contact_linkedin && (
                      <a
                        href={deltaker.acf.main_contact_linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm mt-2"
                      >
                        LinkedIn-profil →
                      </a>
                    )}
                  </div>
                </section>
              )}

              {/* Business Description */}
              {deltaker.acf?.description && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Virksomhetsbeskrivelse</h2>
                  <div
                    className="prose prose-sm max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: deltaker.acf.description }}
                  />
                </section>
              )}

              {/* Categories Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Business Categories */}
                {businessCategories.length > 0 && (
                  <section>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">
                      Våre virksomhetskategorier
                    </h3>
                    <ul className="space-y-1">
                      {businessCategories.map((category, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          {category}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* Customer Types */}
                {customerTypes.length > 0 && (
                  <section>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">
                      Våre kundetyper
                    </h3>
                    <ul className="space-y-1">
                      {customerTypes.map((type, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          {type}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>

              {/* Contact Info */}
              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Kontaktinformasjon</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {deltaker.acf?.contact_email && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">E-post</p>
                      <a
                        href={`mailto:${deltaker.acf.contact_email}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {deltaker.acf.contact_email}
                      </a>
                    </div>
                  )}

                  {deltaker.acf?.contact_phone && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Telefon</p>
                      <a
                        href={`tel:${deltaker.acf.contact_phone}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {deltaker.acf.contact_phone}
                      </a>
                    </div>
                  )}

                  {(deltaker.acf?.address || deltaker.acf?.city) && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Adresse</p>
                      <p className="text-gray-700">
                        {deltaker.acf?.address && <>{deltaker.acf.address}<br /></>}
                        {deltaker.acf?.postal_code && deltaker.acf?.city && (
                          <>{deltaker.acf.postal_code} {deltaker.acf.city}</>
                        )}
                      </p>
                    </div>
                  )}

                  {deltaker.acf?.org_number && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Organisasjonsnummer</p>
                      <p className="text-gray-700 font-mono">{deltaker.acf.org_number}</p>
                    </div>
                  )}
                </div>

                {deltaker.acf?.linkedin_company && (
                  <div className="mt-4">
                    <a
                      href={deltaker.acf.linkedin_company}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                      LinkedIn
                    </a>
                  </div>
                )}
              </section>

              {/* Related Tools */}
              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  Verktøy knyttet til denne profilen
                </h2>
                {deltakerTools.length === 0 ? (
                  <p className="text-gray-500 text-sm">
                    Har ikke registrert digitale verktøy eller tjenester i verktøyoversikten
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {deltakerTools.map((tool) => (
                      <Link
                        key={tool.id}
                        href={`/verktoy/${tool.slug}`}
                        className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition"
                      >
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {tool.title.rendered}
                        </h3>
                        {tool.acf?.tool_category && (
                          <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded mb-2">
                            {tool.acf.tool_category}
                          </span>
                        )}
                        {tool.excerpt?.rendered && (
                          <div
                            className="text-sm text-gray-600 line-clamp-2"
                            dangerouslySetInnerHTML={{ __html: tool.excerpt.rendered }}
                          />
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </section>

              {/* Placeholder for Articles */}
              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  Artikler relatert til denne profilen
                </h2>
                <p className="text-gray-500 text-sm">
                  Artikler kommer snart...
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading deltaker:', error);
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-red-900 mb-2">
              Feil ved lasting av deltaker
            </h2>
            <p className="text-red-700">
              {error instanceof Error ? error.message : 'Ukjent feil'}
            </p>
            <Link
              href="/deltakere"
              className="inline-block mt-4 text-blue-600 hover:text-blue-800"
            >
              ← Tilbake til deltakeroversikten
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
