import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function MinSidePage() {
  return (
    <div className="space-y-8">
      {/* Main Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Link href="/min-side/profil" className="group">
          <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg text-2xl">👤</div>
                <CardTitle className="text-xl">Min profil</CardTitle>
              </div>
              <CardDescription className="mt-2">
                Administrer din profil og kontaktinformasjon
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="w-full justify-start text-primary group-hover:translate-x-1 transition-transform">
                Gå til profil →
              </Button>
            </CardContent>
          </Card>
        </Link>

        {/* Password Card */}
        <Link href="/min-side/passord" className="group">
          <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg text-2xl">🔐</div>
                <CardTitle className="text-xl">Passord</CardTitle>
              </div>
              <CardDescription className="mt-2">
                Endre passord og sikkerhetsinformasjon
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="w-full justify-start text-primary group-hover:translate-x-1 transition-transform">
                Administrer passord →
              </Button>
            </CardContent>
          </Card>
        </Link>

        {/* Content Management */}
        <Link href="/min-side/innhold" className="group">
          <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg text-2xl">📄</div>
                <CardTitle className="text-xl">Mitt innhold</CardTitle>
              </div>
              <CardDescription className="mt-2">
                Administrer caser, verktøy, artikler og arrangementer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="w-full justify-start text-primary group-hover:translate-x-1 transition-transform">
                Se innhold →
              </Button>
            </CardContent>
          </Card>
        </Link>

        {/* Consents */}
        <Link href="/min-side/samtykker" className="group">
          <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg text-2xl">⚙️</div>
                <CardTitle className="text-xl">Samtykker</CardTitle>
              </div>
              <CardDescription className="mt-2">
                Administrer personverninnstillinger og samtykker
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="w-full justify-start text-primary group-hover:translate-x-1 transition-transform">
                Endre samtykker →
              </Button>
            </CardContent>
          </Card>
        </Link>

        {/* Membership */}
        <Link href="/min-side/medlemskap" className="group">
          <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg text-2xl">⭐</div>
                <CardTitle className="text-xl">Medlemskap</CardTitle>
              </div>
              <CardDescription className="mt-2">
                Se medlemsinfo og oppgrader abonnement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="w-full justify-start text-primary group-hover:translate-x-1 transition-transform">
                Se medlemskap →
              </Button>
            </CardContent>
          </Card>
        </Link>

        {/* My Member Company */}
        <Link href="/min-side/mitt-medlem" className="group">
          <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg text-2xl">🏢</div>
                <CardTitle className="text-xl">Mitt Foretak</CardTitle>
              </div>
              <CardDescription className="mt-2">
                Koble deg til ditt medlemsforetak og administrer verktøy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="w-full justify-start text-primary group-hover:translate-x-1 transition-transform">
                Administrer foretak →
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>

      <Separator />

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Hurtighandlinger</CardTitle>
          <CardDescription>Kom raskt i gang med nye oppføringer</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/min-side/innhold?type=case&action=new">
              <Card className="hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-primary/50">
                <CardContent className="pt-6">
                  <div className="text-center space-y-2">
                    <div className="text-4xl mb-2">📝</div>
                    <div className="font-semibold">Ny case</div>
                    <p className="text-sm text-muted-foreground">Legg til prosjekt</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/min-side/verktoy">
              <Card className="hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-primary/50">
                <CardContent className="pt-6">
                  <div className="text-center space-y-2">
                    <div className="text-4xl mb-2">🛠️</div>
                    <div className="font-semibold">Nytt verktøy</div>
                    <p className="text-sm text-muted-foreground">Publiser verktøy</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/min-side/innhold?type=post&action=new">
              <Card className="hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-primary/50">
                <CardContent className="pt-6">
                  <div className="text-center space-y-2">
                    <div className="text-4xl mb-2">📄</div>
                    <div className="font-semibold">Ny artikkel</div>
                    <p className="text-sm text-muted-foreground">Skriv innlegg</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/min-side/innhold?type=event&action=new">
              <Card className="hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-primary/50">
                <CardContent className="pt-6">
                  <div className="text-center space-y-2">
                    <div className="text-4xl mb-2">📅</div>
                    <div className="font-semibold">Nytt arrangement</div>
                    <p className="text-sm text-muted-foreground">Opprett event</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Statistikk</CardTitle>
          <CardDescription>Din aktivitet på BimVerdi</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center space-y-2">
              <Badge variant="secondary" className="text-2xl px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-100">
                12
              </Badge>
              <p className="text-sm text-muted-foreground">Publiserte caser</p>
            </div>
            <div className="text-center space-y-2">
              <Badge variant="secondary" className="text-2xl px-4 py-2 bg-green-100 text-green-700 hover:bg-green-100">
                8
              </Badge>
              <p className="text-sm text-muted-foreground">Verktøy</p>
            </div>
            <div className="text-center space-y-2">
              <Badge variant="secondary" className="text-2xl px-4 py-2 bg-purple-100 text-purple-700 hover:bg-purple-100">
                25
              </Badge>
              <p className="text-sm text-muted-foreground">Artikler</p>
            </div>
            <div className="text-center space-y-2">
              <Badge variant="secondary" className="text-2xl px-4 py-2 bg-orange-100 text-orange-700 hover:bg-orange-100">
                5
              </Badge>
              <p className="text-sm text-muted-foreground">Arrangementer</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
