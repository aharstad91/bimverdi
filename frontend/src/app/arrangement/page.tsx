import { Metadata } from 'next';
import { getCustomPosts } from '@/lib/wordpress';
import { Arrangement } from '@/types/wordpress';

export const metadata: Metadata = {
  title: 'Arrangementer | BIMVerdi',
  description: 'Kommende BIM-arrangementer, workshops og nettverkstreff',
};

export const revalidate = 3600; // Revalidate every hour

export default async function ArrangementPage() {
  const arrangements = await getCustomPosts<Arrangement>('arrangement', {
    perPage: 50,
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Arrangementer
        </h1>
        <p className="text-xl text-gray-600">
          Kommende BIM-arrangementer, workshops og nettverkstreff
        </p>
      </header>

      {arrangements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {arrangements.map((arrangement) => (
            <ArrangementCard key={arrangement.id} arrangement={arrangement} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <p className="text-xl text-gray-600">
            Ingen arrangementer for øyeblikket.
          </p>
          <p className="text-gray-500 mt-2">
            Kom tilbake senere for oppdateringer!
          </p>
        </div>
      )}
    </div>
  );
}

function ArrangementCard({ arrangement }: { arrangement: Arrangement }) {
  const { acf } = arrangement;
  const slug = arrangement.slug;

  // Format date
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    // YYYYMMDD format
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    const date = new Date(`${year}-${month}-${day}`);

    return date.toLocaleDateString('no-NO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getFormatIcon = (format?: string) => {
    switch (format) {
      case 'fysisk':
        return '📍';
      case 'digitalt':
        return '💻';
      case 'hybrid':
        return '🔄';
      default:
        return '';
    }
  };

  const getStatusBadge = (status?: string) => {
    const statusConfig = {
      paamelding_aapen: { text: 'Påmelding åpen', color: 'bg-green-100 text-green-800' },
      fullbooket: { text: 'Fullbooket', color: 'bg-orange-100 text-orange-800' },
      avlyst: { text: 'Avlyst', color: 'bg-red-100 text-red-800' },
      kommende: { text: 'Kommende', color: 'bg-blue-100 text-blue-800' },
    };

    const config = status ? statusConfig[status as keyof typeof statusConfig] : statusConfig.kommende;
    return config;
  };

  const statusBadge = getStatusBadge(acf?.arrangement_status);

  return (
    <a
      href={`/arrangement/${slug}`}
      className="block bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="relative h-48 bg-linear-to-br from-blue-600 to-blue-800">
        {/* Placeholder for image - can be added later */}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded text-sm font-semibold ${statusBadge.color}`}>
            {statusBadge.text}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3">
          {arrangement.title.rendered}
        </h3>

        <div className="space-y-2 text-sm text-gray-600 mb-4">
          {acf?.dato_start && (
            <div className="flex items-center">
              <span className="mr-2">📅</span>
              <span>{formatDate(acf.dato_start)}</span>
            </div>
          )}

          {acf?.tidspunkt_start && (
            <div className="flex items-center">
              <span className="mr-2">🕐</span>
              <span>{acf.tidspunkt_start}</span>
            </div>
          )}

          {acf?.moteformat && acf?.poststed && (
            <div className="flex items-center">
              <span className="mr-2">{getFormatIcon(acf.moteformat)}</span>
              <span>{acf.poststed}</span>
            </div>
          )}
        </div>

        {arrangement.excerpt?.rendered && (
          <div
            className="text-gray-600 text-sm line-clamp-3"
            dangerouslySetInnerHTML={{ __html: arrangement.excerpt.rendered }}
          />
        )}

        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
          {acf?.maks_deltakere && acf.maks_deltakere > 0 ? (
            <span className="text-sm text-gray-500">
              Max {acf.maks_deltakere} deltakere
            </span>
          ) : (
            <span className="text-sm text-gray-500">Ubegrenset</span>
          )}

          <span className="text-blue-600 font-semibold text-sm">
            Les mer →
          </span>
        </div>
      </div>
    </a>
  );
}
