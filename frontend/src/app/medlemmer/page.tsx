import { getCustomPosts } from '@/lib/wordpress';
import { Member } from '@/types/wordpress';
import Link from 'next/link';

export default async function MembersPage() {
  try {
    const members = await getCustomPosts<Member>('members');

    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Medlemsbedrifter
            </h1>
            <p className="text-xl text-gray-600">
              Møt våre medlemsbedrifter som jobber med BIM
            </p>
          </div>

          {members.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Ingen medlemmer funnet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {member.title.rendered}
                    </h2>
                    <div
                      className="text-gray-600 mb-4"
                      dangerouslySetInnerHTML={{ __html: member.excerpt.rendered }}
                    />
                    
                    {member.acf && (
                      <div className="space-y-2 text-sm">
                        {member.acf.company_name && (
                          <p className="text-gray-700">
                            <span className="font-semibold">Bedrift:</span> {member.acf.company_name}
                          </p>
                        )}
                        {member.acf.city && (
                          <p className="text-gray-700">
                            <span className="font-semibold">By:</span> {member.acf.city}
                          </p>
                        )}
                        {member.acf.employees && (
                          <p className="text-gray-700">
                            <span className="font-semibold">Ansatte:</span> {member.acf.employees}
                          </p>
                        )}
                        {member.acf.website && (
                          <a
                            href={member.acf.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Besøk nettside →
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              ← Tilbake til forsiden
            </Link>
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
              Feil ved lasting av medlemmer
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
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              ← Tilbake til forsiden
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
