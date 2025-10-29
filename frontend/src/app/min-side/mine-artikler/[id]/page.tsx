'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { TiptapEditor } from '@/components/articles/TiptapEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/articles/StatusBadge';
import { getArticle, updateArticle, submitArticle, deleteArticle } from '@/lib/article-api';
import { getSession } from '@/lib/session';
import type { Article } from '@/types/article';

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const articleId = params.id as string;

  const [article, setArticle] = useState<Article | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadArticle();
  }, [articleId]);

  const loadArticle = async () => {
    try {
      // Check authentication
      const session = await getSession();
      if (!session.isLoggedIn) {
        router.push('/logg-inn?returnUrl=/min-side/mine-artikler');
        return;
      }

      // Load article
      const data = await getArticle(Number(articleId));
      setArticle(data);
      setTitle(data.title);
      setContent(data.content_html || '');
      setExcerpt(data.excerpt || '');
      setWordCount(data.word_count || 0);
    } catch (error) {
      console.error('Error loading article:', error);
      setMessage({ type: 'error', text: 'Kunne ikke laste artikkel' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      setMessage({ type: 'error', text: 'Tittel og innhold er påkrevd' });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      await updateArticle(Number(articleId), {
        title,
        content_html: content,
        excerpt: excerpt || undefined,
      });

      setMessage({ type: 'success', text: 'Artikkel lagret' });

      // Reload article to get updated data
      await loadArticle();
    } catch (error) {
      console.error('Error saving article:', error);
      setMessage({ type: 'error', text: 'Kunne ikke lagre artikkel' });
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!article) return;

    if (!title.trim() || !content.trim()) {
      setMessage({ type: 'error', text: 'Tittel og innhold er påkrevd' });
      return;
    }

    const confirmed = window.confirm(
      'Er du sikker på at du vil sende artikkelen til godkjenning? Du kan ikke redigere den mens den er under gjennomgang.'
    );

    if (!confirmed) return;

    setSubmitting(true);
    setMessage(null);

    try {
      // Save first
      await updateArticle(article.id, {
        title,
        content_html: content,
        excerpt: excerpt || undefined,
      });

      // Then submit
      await submitArticle(article.id);

      setMessage({ type: 'success', text: 'Artikkel sendt til godkjenning!' });

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/min-side/mine-artikler');
      }, 2000);
    } catch (error) {
      console.error('Error submitting article:', error);
      setMessage({ type: 'error', text: 'Kunne ikke sende artikkel til godkjenning' });
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!article) return;

    const confirmed = window.confirm(
      'Er du sikker på at du vil slette denne artikkelen? Dette kan ikke angres.'
    );

    if (!confirmed) return;

    setDeleting(true);
    setMessage(null);

    try {
      await deleteArticle(article.id);
      setMessage({ type: 'success', text: 'Artikkel slettet' });

      setTimeout(() => {
        router.push('/min-side/mine-artikler');
      }, 1000);
    } catch (error) {
      console.error('Error deleting article:', error);
      setMessage({ type: 'error', text: 'Kunne ikke slette artikkel' });
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-gray-500">Laster artikkel...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-500">Artikkel ikke funnet</p>
              <div className="mt-4 text-center">
                <Button onClick={() => router.push('/min-side/mine-artikler')}>
                  Tilbake til mine artikler
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const canEdit = ['draft', 'rejected'].includes(article.status);
  const canSubmit = article.status === 'draft' || article.status === 'rejected';
  const canDelete = article.status === 'draft';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Rediger artikkel</h1>
            <p className="text-gray-600 mt-1">
              Status: <StatusBadge status={article.status} />
            </p>
          </div>
          <Button variant="outline" onClick={() => router.push('/min-side/mine-artikler')}>
            Tilbake
          </Button>
        </div>

        {/* Messages */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Read-only notice */}
        {!canEdit && (
          <Card className="mb-6 border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <p className="text-yellow-800">
                {article.status === 'pending' && 'Denne artikkelen er sendt til godkjenning og kan ikke redigeres.'}
                {article.status === 'admin_review' && 'Denne artikkelen er under gjennomgang og kan ikke redigeres.'}
                {article.status === 'publish' && 'Denne artikkelen er publisert og kan ikke redigeres.'}
              </p>
              {article.status === 'rejected' && article.review?.rejection_reason && (
                <div className="mt-4">
                  <p className="font-semibold text-red-800">Årsak til avvisning:</p>
                  <p className="mt-2 text-red-700">{article.review.rejection_reason}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Form */}
        <form onSubmit={handleSave}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Artikkeldetaljer</CardTitle>
              <CardDescription>
                {canEdit ? 'Rediger artikkelen og lagre endringer' : 'Artikkeldetaljer (kun lesing)'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">
                  Tittel <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="F.eks. BIM i praksis - våre erfaringer"
                  required
                  disabled={!canEdit}
                  maxLength={200}
                />
                <p className="text-sm text-gray-500">{title.length}/200 tegn</p>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label>
                  Innhold <span className="text-red-500">*</span>
                </Label>
                <TiptapEditor
                  content={content}
                  onChange={setContent}
                  onWordCount={setWordCount}
                  placeholder="Skriv artikkelen din her..."
                  editable={canEdit}
                />
                <p className="text-sm text-gray-500">{wordCount} ord</p>
              </div>

              {/* Excerpt */}
              <div className="space-y-2">
                <Label htmlFor="excerpt">
                  Kort beskrivelse (valgfritt)
                </Label>
                <Textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="En kort oppsummering av artikkelen (maks 200 tegn)"
                  rows={3}
                  maxLength={200}
                  disabled={!canEdit}
                />
                <p className="text-sm text-gray-500">{excerpt.length}/200 tegn</p>
              </div>

              {/* Author info (read-only) */}
              <div className="border-t pt-4 space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Forfatter:</span> {article.author.name}
                </p>
                {article.company.name && (
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Bedrift:</span> {article.company.name}
                  </p>
                )}
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Opprettet:</span>{' '}
                  {new Date(article.submission_date).toLocaleDateString('nb-NO')}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          {canEdit && (
            <div className="flex items-center justify-between">
              <div className="space-x-3">
                <Button type="submit" disabled={saving || submitting}>
                  {saving ? 'Lagrer...' : 'Lagre utkast'}
                </Button>
                {canSubmit && (
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={saving || submitting}
                    variant="default"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {submitting ? 'Sender inn...' : 'Send til godkjenning'}
                  </Button>
                )}
              </div>
              {canDelete && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleting || saving || submitting}
                >
                  {deleting ? 'Sletter...' : 'Slett artikkel'}
                </Button>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
