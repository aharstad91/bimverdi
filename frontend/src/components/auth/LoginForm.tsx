'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import type { LoginFormData } from '@/types/user';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    remember: false,
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const registered = searchParams.get('registered') === 'true';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Vennligst fyll ut alle felt');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Innlogging feilet');
      }

      // Redirect to profile page or return URL
      const returnUrl = searchParams.get('returnUrl') || '/minside';
      router.push(returnUrl);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Noe gikk galt');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {registered && (
        <div className="rounded-md bg-green-50 p-4 text-sm text-green-800">
          Registrering vellykket! Du kan nå logge inn.
        </div>
      )}

      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            E-postadresse
          </label>
          <input
            type="email"
            id="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Passord
          </label>
          <input
            type="password"
            id="password"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember"
              checked={formData.remember}
              onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
              Husk meg
            </label>
          </div>

          <Link
            href="/glemt-passord"
            className="text-sm text-blue-600 hover:underline"
          >
            Glemt passord?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Logger inn...' : 'Logg inn'}
        </button>
      </form>

      <div className="text-center text-sm text-gray-600">
        Har du ikke konto?{' '}
        <Link href="/registrer" className="text-blue-600 hover:underline">
          Registrer deg her
        </Link>
      </div>
    </div>
  );
}
