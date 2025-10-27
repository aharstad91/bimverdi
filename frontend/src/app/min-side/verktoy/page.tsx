'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentSession } from '@/app/actions/session';
import { getUserMember } from '@/lib/member-api';
import { getMyTools, createTool, updateTool, deleteTool, type ToolFormData } from '@/lib/tools-api';
import type { Tool } from '@/types/wordpress';
import type { SimpleMember } from '@/types/user';

export default function MineSideVerktoyPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<number | null>(null);
  const [member, setMember] = useState<SimpleMember | null>(null);
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [formData, setFormData] = useState<ToolFormData>({
    title: '',
    content: '',
    acf: {},
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const session = await getCurrentSession();

      if (!session || !session.isLoggedIn || !session.userId) {
        router.push('/logg-inn?returnUrl=/min-side/verktoy');
        return;
      }

      setUserId(session.userId);

      // Load member
      const userMember = await getUserMember(session.userId);
      if (!userMember) {
        router.push('/min-side/mitt-medlem');
        return;
      }
      setMember(userMember);

      // Load tools
      const memberTools = await getMyTools(session.userId);
      setTools(memberTools);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setSubmitting(true);
    setMessage(null);

    try {
      if (editingTool) {
        await updateTool(userId, editingTool.id, formData);
        setMessage({ type: 'success', text: 'Verktøy oppdatert!' });
      } else {
        await createTool(userId, formData);
        setMessage({ type: 'success', text: 'Verktøy opprettet!' });
      }

      // Reset form
      setFormData({ title: '', content: '', acf: {} });
      setShowForm(false);
      setEditingTool(null);

      // Reload tools
      const memberTools = await getMyTools(userId);
      setTools(memberTools);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Feil ved lagring' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (tool: Tool) => {
    setEditingTool(tool);
    setFormData({
      title: tool.title.rendered,
      content: tool.content.rendered,
      acf: tool.acf || {},
    });
    setShowForm(true);
    setMessage(null);
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
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Feil ved sletting' });
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTool(null);
    setFormData({ title: '', content: '', acf: {} });
    setMessage(null);
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
            {member && (
              <p className="text-gray-600 mt-1">
                For {member.title}
              </p>
            )}
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              + Legg til verktøy
            </button>
          )}
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        {showForm && (
          <div className="mb-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {editingTool ? 'Rediger verktøy' : 'Legg til nytt verktøy'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Verktøynavn *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori
                </label>
                <select
                  value={formData.acf?.tool_category || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    acf: { ...formData.acf, tool_category: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Velg kategori</option>
                  <option value="modeling">Modellering</option>
                  <option value="coordination">Koordinering</option>
                  <option value="visualization">Visualisering</option>
                  <option value="analysis">Analyse</option>
                  <option value="documentation">Dokumentasjon</option>
                  <option value="project_management">Prosjektstyring</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Leverandør
                </label>
                <input
                  type="text"
                  value={formData.acf?.tool_vendor || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    acf: { ...formData.acf, tool_vendor: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nettside
                </label>
                <input
                  type="url"
                  value={formData.acf?.tool_website || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    acf: { ...formData.acf, tool_website: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Beskrivelse
                </label>
                <textarea
                  value={formData.content || ''}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Lagrer...' : editingTool ? 'Oppdater' : 'Opprett'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Avbryt
                </button>
              </div>
            </form>
          </div>
        )}

        {tools.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <span className="text-6xl mb-4 block">🛠️</span>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Ingen verktøy ennå</h3>
            <p className="text-gray-600 mb-4">
              Legg til ditt første verktøy for å komme i gang
            </p>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Legg til verktøy
              </button>
            )}
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
                      onClick={() => handleEdit(tool)}
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
