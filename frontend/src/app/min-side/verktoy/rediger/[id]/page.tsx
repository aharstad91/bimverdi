'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getCurrentSession } from '@/app/actions/session';
import { getMyTools, updateTool, type ToolFormData } from '@/lib/tools-api';
import type { Tool } from '@/types/wordpress';

export default function RedigerVerktoyPage() {
  const router = useRouter();
  const params = useParams();
  const toolId = params.id as string;

  const [userId, setUserId] = useState<number | null>(null);
  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<ToolFormData>({
    title: '',
    content: '',
    acf: {},
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadData();
  }, [toolId]);

  const loadData = async () => {
    try {
      const session = await getCurrentSession();

      if (!session || !session.isLoggedIn || !session.userId) {
        router.push('/logg-inn?returnUrl=/min-side/verktoy');
        return;
      }

      setUserId(session.userId);

      // Load all tools and find the one we're editing
      const tools = await getMyTools(session.userId);
      const foundTool = tools.find((t: Tool) => t.id === parseInt(toolId));

      if (!foundTool) {
        setMessage({ type: 'error', text: 'Verktøy ikke funnet' });
        setTimeout(() => router.push('/min-side/verktoy'), 2000);
        return;
      }

      setTool(foundTool);
      setFormData({
        title: foundTool.title.rendered,
        content: foundTool.content.rendered,
        acf: foundTool.acf || {},
      });
    } catch (error) {
      console.error('Error loading tool:', error);
      setMessage({ type: 'error', text: 'Feil ved lasting av verktøy' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !tool) return;

    setSubmitting(true);
    setMessage(null);

    try {
      await updateTool(userId, tool.id, formData);
      setMessage({ type: 'success', text: 'Verktøy oppdatert!' });

      // Redirect back to tools list after success
      setTimeout(() => router.push('/min-side/verktoy'), 1500);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Feil ved oppdatering';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/min-side/verktoy');
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

  if (!tool) {
    return (
      <div className="bg-white rounded-b-lg border border-gray-200 border-t-0 p-6">
        <div className="text-center py-12">
          <p className="text-red-600">Verktøy ikke funnet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-b-lg border border-gray-200 border-t-0 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <button
            onClick={handleCancel}
            className="text-gray-600 hover:text-gray-900 flex items-center gap-2 mb-4"
          >
            <span>←</span> Tilbake til verktøy
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Rediger verktøy</h1>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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
              rows={8}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {submitting ? 'Lagrer...' : 'Lagre endringer'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Avbryt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
