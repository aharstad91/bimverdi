'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentSession } from '@/app/actions/session';
import { getUserMember } from '@/lib/member-api';
import { getMyTools, deleteTool } from '@/lib/tools-api';
import type { Tool } from '@/types/wordpress';
import type { SimpleMember } from '@/types/user';

export default function MineSideVerktoyPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<number | null>(null);
  const [member, setMember] = useState<SimpleMember | null>(null);
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      console.log('🔍 Loading data...');
      const session = await getCurrentSession();
      console.log('📝 Session:', session);

      if (!session || !session.isLoggedIn || !session.userId) {
        console.log('❌ No session, redirecting to login');
        router.push('/logg-inn?returnUrl=/min-side/verktoy');
        return;
      }

      setUserId(session.userId);
      console.log('👤 User ID:', session.userId);

      // Load member (optional - tools work without it)
      const userMember = await getUserMember(session.userId);
      console.log('🏢 User member:', userMember);
      setMember(userMember); // Can be null, that's OK

      // Load tools
      console.log('🔧 Fetching tools for user:', session.userId);
      const memberTools = await getMyTools(session.userId);
      console.log('✅ Tools received:', memberTools);
      setTools(memberTools);
    } catch (error) {
      console.error('❌ Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (toolId: number) => {
    router.push(`/min-side/verktoy/rediger/${toolId}`);
  };

  const handleDelete = async (toolId: number) => {
    if (!userId) return;
    if (!confirm('Er du sikker på at du vil slette dette verktøyet?')) return;

    try {
      await deleteTool(userId, toolId);
      setMessage({ type: 'success', text: 'Verktøy slettet!' });

      // Reload tools
      const memberTools = await getMyTools(userId);
      setTools(memberTools);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Feil ved sletting';
      setMessage({ type: 'error', text: errorMessage });
    }
  };

  const handleAddNew = () => {
    router.push('/min-side/verktoy/ny');
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
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mine Verktøy</h1>
            {member ? (
              <p className="text-gray-600 mt-1">
                For {member.title}
              </p>
            ) : (
              <p className="text-gray-600 mt-1">
                Personlige verktøy
              </p>
            )}
          </div>
          <button
            onClick={handleAddNew}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            + Legg til verktøy
          </button>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        {tools.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <span className="text-6xl mb-4 block">🛠️</span>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Ingen verktøy ennå</h3>
            <p className="text-gray-600 mb-4">
              Legg til ditt første verktøy for å komme i gang
            </p>
            <button
              onClick={handleAddNew}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Legg til verktøy
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tools.map((tool) => (
              <div
                key={tool.id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 flex-1">
                    {tool.title.rendered}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(tool.id)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Rediger
                    </button>
                    <button
                      onClick={() => handleDelete(tool.id)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Slett
                    </button>
                  </div>
                </div>

                {tool.acf?.tool_category && (
                  <span className="inline-block px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full mb-2">
                    {tool.acf.tool_category}
                  </span>
                )}

                {tool.acf?.tool_vendor && (
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-semibold">Leverandør:</span> {tool.acf.tool_vendor}
                  </p>
                )}

                {tool.acf?.tool_website && (
                  <a
                    href={tool.acf.tool_website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Besøk nettside →
                  </a>
                )}

                {tool.excerpt?.rendered && (
                  <div
                    className="mt-3 text-sm text-gray-600 line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: tool.excerpt.rendered }}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
