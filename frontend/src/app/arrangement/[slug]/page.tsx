import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCustomPostBySlug } from '@/lib/wordpress';
import { Arrangement } from '@/types/wordpress';
import { RegistrationForm } from '@/components/arrangement/RegistrationForm';
import { getSession } from '@/lib/session';
import { getUserProfile } from '@/lib/auth';

export const revalidate = 3600;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const arrangement = await getCustomPostBySlug('arrangement', slug) as Arrangement | null;

  if (!arrangement) {
    return {
      title: 'Arrangement ikke funnet | BIMVerdi',
    };
  }

  return {
    title: `${arrangement.title.rendered} | BIMVerdi`,
    description: arrangement.excerpt?.rendered?.replace(/<[^>]*>/g, '').substring(0, 160) || 'BIMVerdi arrangement',
  };
}

export default async function ArrangementPage({ params }: Props) {
  const { slug } = await params;
  const arrangement = await getCustomPostBySlug('arrangement', slug) as Arrangement | null;

  if (!arrangement) {
    notFound();
  }

  // Get user session for pre-filling form
  const session = await getSession();

  // Fetch full user profile if logged in (to get phone and company)
  let userProfile = null;
  if (session.isLoggedIn && session.userId) {
    try {
      userProfile = await getUserProfile(session.userId);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }

  // Check if user is already registered (only if logged in)
  let isRegistered = false;
  if (session.isLoggedIn && session.email) {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.replace('/index.php?rest_route=', '') || '';
      const checkUrl = `${apiUrl}/wp-json/bimverdi/v1/arrangement/${arrangement.id}/check-registration?email=${encodeURIComponent(session.email)}`;
      const checkResponse = await fetch(checkUrl, {
        cache: 'no-store' // Don't cache this check
      });
      if (checkResponse.ok) {
        const checkData = await checkResponse.json();
        isRegistered = checkData.registered || false;
      }
    } catch (error) {
      console.error('Error checking registration status:', error);
    }
  }

  const { acf } = arrangement;

  // Format date
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    const date = new Date(`${year}-${month}-${day}`);

    const months = [
      'januar', 'februar', 'mars', 'april', 'mai', 'juni',
      'juli', 'august', 'september', 'oktober', 'november', 'desember'
    ];

    return `${parseInt(day)}. ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const getFormatIcon = (format?: string) => {
    switch (format) {
      case 'fysisk': return '📍';
      case 'digitalt': return '💻';
      case 'hybrid': return '🔄';
      default: return '';
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

  // Determine if user can register
  const now = new Date();
  const deadlineDate = acf?.pameldingsfrist ? new Date(acf.pameldingsfrist) : null;
  const isDeadlinePassed = deadlineDate ? now > deadlineDate : false;
  const isFull = acf?.arrangement_status === 'fullbooket';
  const isCancelled = acf?.arrangement_status === 'avlyst';
  const membersOnly = acf?.kun_for_medlemmer || false;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <article className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Header Image */}
              <div className="relative h-64 bg-linear-to-br from-blue-600 to-blue-800">
                <div className="absolute top-6 right-6">
                  <span className={`px-4 py-2 rounded text-sm font-semibold ${statusBadge.color}`}>
                    {statusBadge.text}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <header className="mb-8">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    {arrangement.title.rendered}
                  </h1>

                  <div className="flex items-center gap-3 text-sm">
                    {acf?.moteformat && (
                      <span className="px-3 py-1 bg-gray-100 rounded text-gray-700">
                        {getFormatIcon(acf.moteformat)} {acf.moteformat.charAt(0).toUpperCase() + acf.moteformat.slice(1)}
                      </span>
                    )}
                  </div>
                </header>

                {/* Content Body */}
                <div
                  className="prose max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{ __html: arrangement.content.rendered }}
                />
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            {/* Praktisk info */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Praktisk informasjon
              </h3>

              <div className="space-y-4">
                {acf?.dato_start && (
                  <div>
                    <div className="text-sm font-semibold text-gray-600 mb-1">📅 Dato</div>
                    <div className="text-gray-900">{formatDate(acf.dato_start)}</div>
                  </div>
                )}

                {acf?.tidspunkt_start && (
                  <div>
                    <div className="text-sm font-semibold text-gray-600 mb-1">🕐 Tid</div>
                    <div className="text-gray-900">{acf.tidspunkt_start}</div>
                  </div>
                )}

                {(acf?.moteformat === 'fysisk' || acf?.moteformat === 'hybrid') && (
                  <>
                    {acf?.adresse && (
                      <div>
                        <div className="text-sm font-semibold text-gray-600 mb-1">📍 Adresse</div>
                        <div className="text-gray-900">{acf.adresse}</div>
                      </div>
                    )}
                    {acf?.poststed && (
                      <div>
                        <div className="text-sm font-semibold text-gray-600 mb-1">Sted</div>
                        <div className="text-gray-900">{acf.poststed}</div>
                      </div>
                    )}
                  </>
                )}

                {acf?.pameldingsfrist && (
                  <div>
                    <div className="text-sm font-semibold text-gray-600 mb-1">⏰ Påmeldingsfrist</div>
                    <div className="text-gray-900">
                      {new Date(acf.pameldingsfrist).toLocaleString('no-NO', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                )}

                {acf?.maks_deltakere && acf.maks_deltakere > 0 && (
                  <div>
                    <div className="text-sm font-semibold text-gray-600 mb-1">👥 Kapasitet</div>
                    <div className="text-gray-900">Max {acf.maks_deltakere} deltakere</div>
                  </div>
                )}
              </div>
            </div>

            {/* Påmelding */}
            <RegistrationForm
              arrangementId={arrangement.id}
              arrangementTitle={arrangement.title.rendered}
              isLoggedIn={session.isLoggedIn}
              userEmail={session.email || ''}
              userName={session.firstName && session.lastName ? `${session.firstName} ${session.lastName}` : ''}
              userPhone={userProfile?.acf?.phone || ''}
              userCompany={userProfile?.acf?.company || ''}
              isFull={isFull}
              isDeadlinePassed={isDeadlinePassed}
              membersOnly={membersOnly}
              isCancelled={isCancelled}
              isRegistered={isRegistered}
            />
          </aside>
        </div>
      </div>
    </div>
  );
}
