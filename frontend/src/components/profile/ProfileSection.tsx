'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ProfileData {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  acf: {
    phone?: string;
    company?: string;
    position?: string;
    address?: string;
    postal_code?: string;
    city?: string;
    bio?: string;
    newsletter_subscription?: boolean;
  };
}

interface ProfileSectionProps {
  userId: number;
}

export function ProfileSection({ userId }: ProfileSectionProps) {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile');
      if (!response.ok) throw new Error('Kunne ikke laste profil');
      const data = await response.json();
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Noe gikk galt');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!profile) return;

    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Kunne ikke lagre endringer');
      }

      setSuccess('Profil oppdatert');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Noe gikk galt');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-1/3 rounded bg-gray-200"></div>
          <div className="space-y-3">
            <div className="h-10 rounded bg-gray-200"></div>
            <div className="h-10 rounded bg-gray-200"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="rounded-lg border bg-red-50 p-6 text-red-800">
        Kunne ikke laste profil
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900">Profilinformasjon</h2>

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
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              Fornavn
            </label>
            <input
              type="text"
              id="firstName"
              value={profile.firstName}
              onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Etternavn
            </label>
            <input
              type="text"
              id="lastName"
              value={profile.lastName}
              onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            E-postadresse
          </label>
          <input
            type="email"
            id="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Telefon
            </label>
            <input
              type="tel"
              id="phone"
              value={profile.acf.phone || ''}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  acf: { ...profile.acf, phone: e.target.value },
                })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700">
              Firma
            </label>
            <input
              type="text"
              id="company"
              value={profile.acf.company || ''}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  acf: { ...profile.acf, company: e.target.value },
                })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="position" className="block text-sm font-medium text-gray-700">
            Stilling
          </label>
          <input
            type="text"
            id="position"
            value={profile.acf.position || ''}
            onChange={(e) =>
              setProfile({
                ...profile,
                acf: { ...profile.acf, position: e.target.value },
              })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Adresse
          </label>
          <input
            type="text"
            id="address"
            value={profile.acf.address || ''}
            onChange={(e) =>
              setProfile({
                ...profile,
                acf: { ...profile.acf, address: e.target.value },
              })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700">
              Postnummer
            </label>
            <input
              type="text"
              id="postal_code"
              value={profile.acf.postal_code || ''}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  acf: { ...profile.acf, postal_code: e.target.value },
                })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
              Poststed
            </label>
            <input
              type="text"
              id="city"
              value={profile.acf.city || ''}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  acf: { ...profile.acf, city: e.target.value },
                })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
            Om meg
          </label>
          <textarea
            id="bio"
            rows={4}
            value={profile.acf.bio || ''}
            onChange={(e) =>
              setProfile({
                ...profile,
                acf: { ...profile.acf, bio: e.target.value },
              })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="newsletter"
            checked={profile.acf.newsletter_subscription || false}
            onChange={(e) =>
              setProfile({
                ...profile,
                acf: { ...profile.acf, newsletter_subscription: e.target.checked },
              })
            }
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="newsletter" className="ml-2 text-sm text-gray-700">
            Motta nyhetsbrev
          </label>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {saving ? 'Lagrer...' : 'Lagre endringer'}
          </button>
        </div>
      </form>
    </div>
  );
}
