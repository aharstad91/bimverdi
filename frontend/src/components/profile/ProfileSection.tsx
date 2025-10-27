'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
      <Card>
        <CardContent className="pt-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-1/3 rounded bg-gray-200"></div>
            <div className="space-y-3">
              <div className="h-10 rounded bg-gray-200"></div>
              <div className="h-10 rounded bg-gray-200"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Kunne ikke laste profil</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profilinformasjon</CardTitle>
        <CardDescription>Oppdater dine personlige detaljer og kontaktinformasjon</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4 border-green-500 bg-green-50 text-green-900">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">Fornavn</Label>
              <Input
                type="text"
                id="firstName"
                value={profile.firstName}
                onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Etternavn</Label>
              <Input
                type="text"
                id="lastName"
                value={profile.lastName}
                onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-postadresse</Label>
            <Input
              type="email"
              id="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Telefon</Label>
              <Input
                type="tel"
                id="phone"
                value={profile.acf.phone || ''}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    acf: { ...profile.acf, phone: e.target.value },
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Firma</Label>
              <Input
                type="text"
                id="company"
                value={profile.acf.company || ''}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    acf: { ...profile.acf, company: e.target.value },
                  })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Stilling</Label>
            <Input
              type="text"
              id="position"
              value={profile.acf.position || ''}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  acf: { ...profile.acf, position: e.target.value },
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Adresse</Label>
            <Input
              type="text"
              id="address"
              value={profile.acf.address || ''}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  acf: { ...profile.acf, address: e.target.value },
                })
              }
            />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="postal_code">Postnummer</Label>
              <Input
                type="text"
                id="postal_code"
                value={profile.acf.postal_code || ''}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    acf: { ...profile.acf, postal_code: e.target.value },
                  })
                }
              />
            </div>

            <div className="sm:col-span-2 space-y-2">
              <Label htmlFor="city">Poststed</Label>
              <Input
                type="text"
                id="city"
                value={profile.acf.city || ''}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    acf: { ...profile.acf, city: e.target.value },
                  })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Om meg</Label>
            <Textarea
              id="bio"
              rows={4}
              value={profile.acf.bio || ''}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  acf: { ...profile.acf, bio: e.target.value },
                })
              }
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="newsletter"
              checked={profile.acf.newsletter_subscription || false}
              onCheckedChange={(checked) =>
                setProfile({
                  ...profile,
                  acf: { ...profile.acf, newsletter_subscription: checked as boolean },
                })
              }
            />
            <Label
              htmlFor="newsletter"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Motta nyhetsbrev
            </Label>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={saving}>
              {saving ? 'Lagrer...' : 'Lagre endringer'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
