'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentSession } from '@/app/actions/session';
import { getUserMember, searchMembers, setUserMember } from '@/lib/member-api';
import type { SimpleMember } from '@/types/user';

export default function MittMedlemPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<number | null>(null);
  const [member, setMember] = useState<SimpleMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SimpleMember[]>([]);
  const [searching, setSearching] = useState(false);
  const [associating, setAssociating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadUserAndMember();
  }, []);

  const loadUserAndMember = async () => {
    try {
      const session = await getCurrentSession();

      if (!session || !session.isLoggedIn || !session.userId) {
        router.push('/logg-inn?returnUrl=/min-side/mitt-medlem');
        return;
      }

      setUserId(session.userId);

      // Load member if exists
      const userMember = await getUserMember(session.userId);
      setMember(userMember);
    } catch (error) {
      console.error('Error loading user/member:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setMessage({ type: 'error', text: 'Vennligst skriv inn et søk' });
      return;
    }

    setSearching(true);
    setMessage(null);

    try {
      const results = await searchMembers(searchQuery);
      setSearchResults(results.members);

      if (results.members.length === 0) {
        setMessage({ type: 'error', text: 'Ingen medlemsforetak funnet' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Feil ved søk' });
    } finally {
      setSearching(false);
    }
  };

  const handleAssociateMember = async (memberId: number) => {
    if (!userId) return;

    setAssociating(true);
    setMessage(null);

    try {
      const success = await setUserMember(userId, memberId);

      if (success) {
        setMessage({ type: 'success', text: 'Koblet til medlemsforetak!' });
        // Reload member
        const userMember = await getUserMember(userId);
        setMember(userMember);
        setSearchResults([]);
        setSearchQuery('');
      } else {
        setMessage({ type: 'error', text: 'Kunne ikke koble til medlemsforetak' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Feil ved kobling' });
    } finally {
      setAssociating(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-b-lg border border-gray-200 border-t-0 p-6">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-b-lg border border-gray-200 border-t-0 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Mitt Medlemsforetak</h1>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        {member ? (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-2">{member.title}</h2>
                {member.acf?.company_name && (
                  <p className="text-gray-700 mb-2">
                    <span className="font-semibold">Bedrift:</span> {member.acf.company_name}
                  </p>
                )}
                {member.acf?.city && (
                  <p className="text-gray-700 mb-2">
                    <span className="font-semibold">Sted:</span> {member.acf.city}
                  </p>
                )}
                {member.acf?.website && (
                  <a
                    href={member.acf.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Besøk nettside →
                  </a>
                )}
              </div>
              {member.acf?.logo && (
                <img
                  src={member.acf.logo.url || member.acf.logo}
                  alt={member.title}
                  className="w-24 h-24 object-contain rounded-lg bg-white p-2"
                />
              )}
            </div>

            {member.acf?.description && (
              <div className="mt-4 p-4 bg-white rounded-lg">
                <div dangerouslySetInnerHTML={{ __html: member.acf.description }} className="prose prose-sm" />
              </div>
            )}

            <div className="mt-6 flex gap-4">
              <button
                onClick={() => router.push('/min-side/verktoy')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Administrer verktøy
              </button>
              <button
                onClick={() => setMember(null)}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Endre tilknytning
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800">
                <span className="font-semibold">Du er ikke koblet til noe medlemsforetak.</span>
                <br />
                Søk etter og koble deg til ditt foretak for å administrere verktøy og innhold.
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Søk etter medlemsforetak
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Skriv bedriftsnavn, org.nr eller by..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={handleSearch}
                  disabled={searching}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {searching ? 'Søker...' : 'Søk'}
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Tips: Du kan søke på deler av navnet, organisasjonsnummer eller by
              </p>
            </div>

            {searchResults.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 mb-3">Søkeresultater:</h3>
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:border-blue-300 hover:bg-blue-50 transition"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{result.title}</h4>
                      {result.acf?.company_name && (
                        <p className="text-sm text-gray-600">{result.acf.company_name}</p>
                      )}
                      <div className="flex gap-4 mt-1">
                        {result.acf?.org_number && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Org.nr:</span> {result.acf.org_number}
                          </p>
                        )}
                        {result.acf?.city && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">By:</span> {result.acf.city}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleAssociateMember(result.id)}
                      disabled={associating}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {associating ? 'Kobler...' : 'Velg'}
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Finner du ikke ditt foretak?</h3>
              <p className="text-gray-700 mb-4">
                Kontakt BimVerdi administrasjon for å få lagt til ditt medlemsforetak i systemet.
              </p>
              <a
                href="mailto:kontakt@bimverdi.no"
                className="inline-block bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
              >
                Send e-post
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
