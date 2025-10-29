/**
 * Ny Artikkel - Create Article Page
 *
 * Form for creating new articles
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { createArticle } from '@/lib/article-api';
import { TiptapEditor } from '@/components/articles/TiptapEditor';

export default function NyArtikkelPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const session = await getSession();

      if (!session || !session.isLoggedIn) {
        router.push('/logg-inn?returnUrl=/min-side/mine-artikler/ny');
        return;
      }

      setLoading(false);
    } catch (error) {
      console.error('Error checking auth:', error);
      router.push('/logg-inn');
    }
  };

  const handleSaveDraft = async () => {
    if (!title.trim()) {
      setMessage({ type: 'error', text: 'Tittel må fylles ut' });
      return;
    }

    if (!content.trim()) {
      setMessage({ type: 'error', text: 'Innhold må fylles ut' });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const response = await createArticle({
        title: title.trim(),
        content_html: content,
        status: 'draft',
      });

      if (response.success && response.article_id) {
        setMessage({ type: 'success', text: 'Artikkel lagret som utkast' });

        // Redirect to edit page after 1 second
        setTimeout(() => {
          router.push(`/min-side/mine-artikler/${response.article_id}`);
        }, 1000);
      } else {
        setMessage({ type: 'error', text: response.message || 'Kunne ikke lagre artikkel' });
      }
    } catch (error) {
      console.error('Error saving article:', error);
      setMessage({ type: 'error', text: 'Kunne ikke lagre artikkel' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <p className="text-center text-gray-500">Laster...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ny Artikkel</h1>
            <p className="text-gray-600 mt-1">
              Skriv din artikkel og lagre som utkast eller send direkte til godkjenning
            </p>
          </div>
          <Link
            href="/min-side/mine-artikler"
            className="text-gray-600 hover:text-gray-900"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Link>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`rounded-lg border p-4 ${
            message.type === 'success'
              ? 'border-green-200 bg-green-50 text-green-800'
              : 'border-red-200 bg-red-50 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {/* Title */}
        <div className="mb-6">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Tittel <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Skriv en beskrivende tittel..."
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            maxLength={200}
          />
          <p className="mt-1 text-sm text-gray-500">{title.length}/200 tegn</p>
        </div>

        {/* Content Editor */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Innhold <span className="text-red-500">*</span>
          </label>
          <TiptapEditor
            content={content}
            onChange={setContent}
            onWordCount={setWordCount}
          />
          <p className="mt-2 text-sm text-gray-500">
            {wordCount} ord
            {wordCount < 100 && (
              <span className="text-amber-600 ml-2">
                (minimum 100 ord anbefalt)
              </span>
            )}
          </p>
        </div>

        {/* Guidelines */}
        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <h3 className="font-medium text-blue-900 mb-2">📝 Retningslinjer for artikler</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Skriv minst 100 ord</li>
            <li>• Bruk tydelige overskrifter og avsnitt</li>
            <li>• Fokuser på praktiske erfaringer og konkrete eksempler</li>
            <li>• Unngå markedsføring og selgende språk</li>
            <li>• Siter kilder når relevant</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleSaveDraft}
            disabled={saving || !title.trim() || !content.trim()}
            className="inline-flex items-center rounded-md bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Lagrer...' : 'Lagre utkast'}
          </button>

          <Link
            href="/min-side/mine-artikler"
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Avbryt
          </Link>
        </div>
      </div>
    </div>
  );
}
