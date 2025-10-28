'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Calendar, Clock, MapPin, Trash2 } from 'lucide-react';

interface ArrangementRegistration {
  id: number;
  title: string;
  slug: string;
  registration_id: number;
  registered_at: string;
  acf: {
    dato_start?: string;
    tidspunkt_start?: string;
    poststed?: string;
    arrangement_status?: string;
    moteformat?: string;
  };
}

interface UserArrangements {
  upcoming: ArrangementRegistration[];
  past: ArrangementRegistration[];
}

export default function MyArrangementsCard() {
  const [arrangements, setArrangements] = useState<UserArrangements | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unregisteringId, setUnregisteringId] = useState<number | null>(null);

  useEffect(() => {
    fetchArrangements();
  }, []);

  const fetchArrangements = async () => {
    try {
      const response = await fetch('/api/arrangements/my-arrangements', {
        method: 'GET',
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error('Kunne ikke hente arrangementer');
      }

      const data = await response.json();
      setArrangements(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Noe gikk galt');
    } finally {
      setLoading(false);
    }
  };

  const handleUnregister = async (arrangementId: number) => {
    if (!confirm('Er du sikker på at du vil avmelde deg fra dette arrangementet?')) {
      return;
    }

    setUnregisteringId(arrangementId);

    try {
      const response = await fetch(
        `/api/arrangements/my-arrangements?arrangementId=${arrangementId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error('Kunne ikke avmelde fra arrangement');
      }

      // Refresh arrangements
      await fetchArrangements();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Noe gikk galt');
    } finally {
      setUnregisteringId(null);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    const date = new Date(`${year}-${month}-${day}`);

    return date.toLocaleDateString('no-NO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status?: string) => {
    const statusConfig = {
      paamelding_aapen: { text: 'Åpen', color: 'bg-green-100 text-green-800' },
      fullbooket: { text: 'Fullt', color: 'bg-orange-100 text-orange-800' },
      avlyst: { text: 'Avlyst', color: 'bg-red-100 text-red-800' },
      kommende: { text: 'Kommende', color: 'bg-blue-100 text-blue-800' },
    };

    const config = status ? statusConfig[status as keyof typeof statusConfig] : statusConfig.kommende;
    return config;
  };

  if (loading) {
    return (
      <Card className="h-full border">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg text-2xl">📅</div>
            <CardTitle className="text-xl">Mine arrangementer</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-gray-500">
            Laster...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full border border-red-200">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg text-2xl">⚠️</div>
            <CardTitle className="text-xl text-red-900">Feil</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const upcomingCount = arrangements?.upcoming?.length || 0;
  const pastCount = arrangements?.past?.length || 0;
  const totalCount = upcomingCount + pastCount;

  return (
    <Card className="h-full border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg text-2xl">📅</div>
            <CardTitle className="text-xl">Mine arrangementer</CardTitle>
          </div>
          <Badge variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-100">
            {totalCount} totalt
          </Badge>
        </div>
        <CardDescription className="mt-2">
          Arrangementer du er påmeldt
        </CardDescription>
      </CardHeader>
      <CardContent>
        {totalCount === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Du er ikke påmeldt noen arrangementer</p>
            <Link href="/arrangement">
              <Button variant="outline" size="sm">
                Se tilgjengelige arrangementer
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Upcoming Arrangements */}
            {upcomingCount > 0 && (
              <div>
                <h4 className="font-semibold text-sm text-gray-700 mb-3">
                  Kommende ({upcomingCount})
                </h4>
                <div className="space-y-2">
                  {arrangements?.upcoming.map((arr) => {
                    const statusBadge = getStatusBadge(arr.acf.arrangement_status);
                    return (
                      <div
                        key={arr.registration_id}
                        className="border rounded-lg p-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={`/arrangement/${arr.slug}`}
                            className="flex-1 hover:text-blue-600"
                          >
                            <h5 className="font-medium text-sm mb-2">{arr.title}</h5>
                            <div className="space-y-1 text-xs text-gray-600">
                              {arr.acf.dato_start && (
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-3 w-3" />
                                  <span>{formatDate(arr.acf.dato_start)}</span>
                                </div>
                              )}
                              {arr.acf.tidspunkt_start && (
                                <div className="flex items-center gap-2">
                                  <Clock className="h-3 w-3" />
                                  <span>{arr.acf.tidspunkt_start}</span>
                                </div>
                              )}
                              {arr.acf.poststed && (
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-3 w-3" />
                                  <span>{arr.acf.poststed}</span>
                                </div>
                              )}
                            </div>
                            <div className="mt-2">
                              <Badge className={`text-xs ${statusBadge.color}`}>
                                {statusBadge.text}
                              </Badge>
                            </div>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUnregister(arr.id)}
                            disabled={unregisteringId === arr.id}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Past Arrangements */}
            {pastCount > 0 && (
              <div>
                <h4 className="font-semibold text-sm text-gray-700 mb-3">
                  Tidligere ({pastCount})
                </h4>
                <div className="space-y-2">
                  {arrangements?.past.slice(0, 3).map((arr) => (
                    <Link
                      key={arr.registration_id}
                      href={`/arrangement/${arr.slug}`}
                      className="block border rounded-lg p-3 hover:bg-gray-50 transition-colors opacity-75"
                    >
                      <h5 className="font-medium text-sm mb-1">{arr.title}</h5>
                      <div className="text-xs text-gray-600">
                        {arr.acf.dato_start && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(arr.acf.dato_start)}</span>
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
                {pastCount > 3 && (
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    + {pastCount - 3} til
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
