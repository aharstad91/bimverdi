import { getCustomPosts } from '@/lib/wordpress';
import { Deltaker } from '@/types/wordpress';
import Link from 'next/link';

// Helper function to get membership level display text
function getMembershipLevelText(level?: string): string {
  const levels: Record<string, string> = {
    'deltaker': 'Deltaker (D)',
    'partner': 'Partner (P)',
    'prosjektdeltaker': 'Prosjektdeltaker (PD)',
    'egen_avtale': 'Egen avtale',
  };
  return levels[level || 'deltaker'] || 'Deltaker (D)';
}

// Helper function to format business categories
function formatCategories(categories?: string[]): string {
  if (!categories || categories.length === 0) return '—';

  const categoryLabels: Record<string, string> = {
    'architect': 'Arkitekt/rådgiver',
    'consultant': 'Rådgivende ingeniør',
    'contractor': 'Entreprenør/byggmester',
    'developer': 'Boligutvikler',
    'client': 'Bestiller/byggherre',
    'producer': 'Byggevareprodusent',
    'retailer': 'Byggevarehandel',
    'property': 'Eiendom/drift',
    'tool_vendor': 'Leverandør av digitale verktøy',
    'service_provider': 'Tjenesteleverandør',
    'organization': 'Organisasjon/nettverk',
    'public': 'Offentlig instans',
    'education': 'Utdanningsinstitusjon',
    'research': 'Forskningsinstitutt',
  };

  return categories.map(cat => categoryLabels[cat] || cat).join(', ');
}

export default async function DeltakerePage() {
  try {
    const deltakere = await getCustomPosts<Deltaker>('deltakere');

    // Sort alphabetically by company name or title
    const sortedDeltakere = deltakere.sort((a, b) => {
      const nameA = a.acf?.company_name || a.title.rendered;
      const nameB = b.acf?.company_name || b.title.rendered;
      return nameA.localeCompare(nameB, 'no');
    });

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Deltakere
            </h1>
            <p className="text-lg text-gray-600">
              Oversikt over alle deltakere i BIM Verdi
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {deltakere.length} oppføringer
            </p>
          </div>

          {deltakere.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <p className="text-gray-500 text-lg">Ingen deltakere funnet</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              {/* Table Header */}
              <div className="bg-gray-100 border-b border-gray-200">
                <ul className="flex items-center px-6 py-3 text-sm font-semibold text-gray-700">
                  <li className="flex-2 min-w-0">Foretaksnavn</li>
                  <li className="flex-2 min-w-0 hidden md:block">Hvem er vi?</li>
                  <li className="flex-1 min-w-0 hidden lg:block">Rolle</li>
                  <li className="w-32 hidden xl:block">ID</li>
                </ul>
              </div>

              {/* Table Body */}
              <ul className="divide-y divide-gray-200">
                {sortedDeltakere.map((deltaker) => (
                  <li key={deltaker.id} className="hover:bg-gray-50 transition-colors">
                    <Link
                      href={`/deltakere/${deltaker.slug}`}
                      className="flex items-center px-6 py-4 text-sm"
                    >
                      <div className="flex-2 min-w-0 pr-4">
                        <p className="font-semibold text-blue-600 hover:text-blue-800 truncate">
                          {deltaker.acf?.company_name || deltaker.title.rendered}
                        </p>
                        {/* Mobile: Show categories */}
                        <p className="text-xs text-gray-500 mt-1 md:hidden line-clamp-1">
                          {formatCategories(deltaker.acf?.business_categories)}
                        </p>
                      </div>

                      <div className="flex-2 min-w-0 pr-4 hidden md:block">
                        <p className="text-gray-700 line-clamp-2">
                          {formatCategories(deltaker.acf?.business_categories)}
                        </p>
                      </div>

                      <div className="flex-1 min-w-0 pr-4 hidden lg:block">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {getMembershipLevelText(deltaker.acf?.membership_level)}
                        </span>
                      </div>

                      <div className="w-32 hidden xl:block">
                        <p className="text-gray-600 text-xs font-mono">
                          {deltaker.acf?.org_number || '—'}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Info text */}
          <div className="mt-6 text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p>
              📝 Du kan oppdatere din deltakerprofil ved å logge inn på{' '}
              <Link href="/min-side" className="text-blue-600 hover:text-blue-800 font-semibold">
                MinSide
              </Link>
              {' '}og velge Deltakerprofil.
            </p>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-red-900 mb-2">
              Feil ved lasting av deltakere
            </h2>
            <p className="text-red-700">
              {error instanceof Error ? error.message : 'Ukjent feil'}
            </p>
            <p className="text-sm text-red-600 mt-4">
              Sjekk at WordPress REST API er tilgjengelig på:{' '}
              <code className="bg-red-100 px-2 py-1 rounded">
                {process.env.NEXT_PUBLIC_WORDPRESS_API_URL}
              </code>
            </p>
          </div>
        </div>
      </div>
    );
  }
}
