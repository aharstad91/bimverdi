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
        {/* Profile & Settings Card */}
        <Card className="h-full border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg text-2xl">👤</div>
                <CardTitle className="text-xl">Innstillinger</CardTitle>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                ✓ Fullført
              </Badge>
            </div>
            <CardDescription className="mt-2">
              Administrer profil, passord og personverninnstillinger
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Link href="/min-side/profil">
                <Button variant="ghost" className="w-full justify-start text-primary hover:translate-x-1 transition-transform">
                  <span className="mr-2">👤</span> Min profil
                </Button>
              </Link>
              <Link href="/min-side/passord">
                <Button variant="ghost" className="w-full justify-start text-primary hover:translate-x-1 transition-transform">
                  <span className="mr-2">🔐</span> Passord
                </Button>
              </Link>
              <Link href="/min-side/samtykker">
                <Button variant="ghost" className="w-full justify-start text-primary hover:translate-x-1 transition-transform">
                  <span className="mr-2">⚙️</span> Samtykker
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Content Management */}
        <Card className="h-full border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg text-2xl">📄</div>
                <CardTitle className="text-xl">Mitt innhold</CardTitle>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                45 totalt
              </Badge>
            </div>
            <CardDescription className="mt-2">
              Administrer caser, verktøy, artikler og arrangementer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Stats */}
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="space-y-1">
                  <div className="font-semibold text-blue-700">12</div>
                  <div className="text-muted-foreground">Caser</div>
                </div>
                <div className="space-y-1">
                  <div className="font-semibold text-green-700">8</div>
                  <div className="text-muted-foreground">Verktøy</div>
                </div>
                <div className="space-y-1">
                  <div className="font-semibold text-purple-700">25</div>
                  <div className="text-muted-foreground">Artikler</div>
                </div>
                <div className="space-y-1">
                  <div className="font-semibold text-orange-700">5</div>
                  <div className="text-muted-foreground">Events</div>
                </div>
              </div>

              <Separator />

              <Link href="/min-side/innhold" className="block">
                <Button variant="ghost" className="w-full justify-start text-primary hover:translate-x-1 transition-transform">
                  Se alt innhold →
                </Button>
              </Link>

              <Separator />

              <div className="grid grid-cols-2 gap-2">
                <Link href="/min-side/innhold?type=case&action=new">
                  <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                    <span className="mr-1">📝</span> Ny case
                  </Button>
                </Link>
                <Link href="/min-side/innhold?type=post&action=new">
                  <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                    <span className="mr-1">📄</span> Ny artikkel
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Membership & Company */}
        <Card className="h-full border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg text-2xl">⭐</div>
                <CardTitle className="text-xl">Medlemskap</CardTitle>
              </div>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
                Premium
              </Badge>
            </div>
            <CardDescription className="mt-2">
              Administrer medlemskap og foretak
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Link href="/min-side/medlemskap">
                <Button variant="ghost" className="w-full justify-start text-primary hover:translate-x-1 transition-transform">
                  <span className="mr-2">⭐</span> Medlemskap
                </Button>
              </Link>
              <Link href="/min-side/mitt-medlem">
                <Button variant="ghost" className="w-full justify-start text-primary hover:translate-x-1 transition-transform">
                  <span className="mr-2">🏢</span> Mitt Foretak
                </Button>
              </Link>
              <Separator />
              <div className="text-xs text-muted-foreground px-3 py-2 bg-indigo-50 rounded">
                <div className="flex items-center gap-2">
                  <span>✓</span>
                  <span>Koblet til foretak</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
