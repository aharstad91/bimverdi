'use client';

import { useState } from 'react';

export function ChangePasswordSection() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setError('Alle felt er påkrevd');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Nye passord stemmer ikke overens');
      return;
    }

    if (formData.newPassword.length < 8) {
      setError('Nytt passord må være minst 8 tegn langt');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/profile/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          current_password: formData.currentPassword,
          new_password: formData.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Kunne ikke endre passord');
      }

      setSuccess('Passord endret');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Noe gikk galt');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900">Endre passord</h2>

      {error && (
        <div className="mt-4 rounded-md bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-4 rounded-md bg-green-50 p-4 text-sm text-green-800">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
            Nåværende passord
          </label>
          <input
            type="password"
            id="currentPassword"
            value={formData.currentPassword}
            onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
            Nytt passord
          </label>
          <input
            type="password"
            id="newPassword"
            minLength={8}
            value={formData.newPassword}
            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
          <p className="mt-1 text-sm text-gray-500">Minst 8 tegn</p>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Bekreft nytt passord
          </label>
          <input
            type="password"
            id="confirmPassword"
            minLength={8}
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Endrer...' : 'Endre passord'}
          </button>
        </div>
      </form>
    </div>
  );
}
