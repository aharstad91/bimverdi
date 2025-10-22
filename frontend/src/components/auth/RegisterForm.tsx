'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { RegisterFormData } from '@/types/user';

export function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    acceptTerms: false,
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      setError('Vennligst fyll ut alle påkrevde felt');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passordene er ikke like');
      return;
    }

    if (formData.password.length < 8) {
      setError('Passordet må være minst 8 tegn langt');
      return;
    }

    if (!formData.acceptTerms) {
      setError('Du må akseptere vilkårene for å registrere deg');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          first_name: formData.firstName,
          last_name: formData.lastName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registrering feilet');
      }

      // Redirect to login page
      router.push('/logg-inn?registered=true');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Noe gikk galt');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            Fornavn *
          </label>
          <input
            type="text"
            id="firstName"
            required
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Etternavn *
          </label>
          <input
            type="text"
            id="lastName"
            required
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          E-postadresse *
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
          Passord *
        </label>
        <input
          type="password"
          id="password"
          required
          minLength={8}
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        />
        <p className="mt-1 text-sm text-gray-500">Minst 8 tegn</p>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
          Bekreft passord *
        </label>
        <input
          type="password"
          id="confirmPassword"
          required
          minLength={8}
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        />
      </div>

      <div className="flex items-start">
        <input
          type="checkbox"
          id="acceptTerms"
          required
          checked={formData.acceptTerms}
          onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
          className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="acceptTerms" className="ml-2 text-sm text-gray-700">
          Jeg aksepterer{' '}
          <a href="/vilkar" className="text-blue-600 hover:underline">
            vilkårene
          </a>{' '}
          og{' '}
          <a href="/personvern" className="text-blue-600 hover:underline">
            personvernerklæringen
          </a>
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {loading ? 'Registrerer...' : 'Registrer deg'}
      </button>
    </form>
  );
}
