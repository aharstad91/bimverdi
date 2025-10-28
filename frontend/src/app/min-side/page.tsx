import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import MyArrangementsCard from '@/components/min-side/MyArrangementsCard';

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
                <Button variant="outline" className="w-full justify-between text-primary hover:translate-x-1 transition-transform border group cursor-pointer">
                  <span className="flex items-center gap-2">
                    <span>👤</span> Min profil
                  </span>
                  <span className="opacity-50 group-hover:opacity-100 transition-opacity">→</span>
                </Button>
              </Link>
              <Link href="/min-side/passord">
                <Button variant="outline" className="w-full justify-between text-primary hover:translate-x-1 transition-transform border group cursor-pointer">
                  <span className="flex items-center gap-2">
                    <span>🔐</span> Passord
                  </span>
                  <span className="opacity-50 group-hover:opacity-100 transition-opacity">→</span>
                </Button>
              </Link>
              <Link href="/min-side/samtykker">
                <Button variant="outline" className="w-full justify-between text-primary hover:translate-x-1 transition-transform border group cursor-pointer">
                  <span className="flex items-center gap-2">
                    <span>⚙️</span> Samtykker
                  </span>
                  <span className="opacity-50 group-hover:opacity-100 transition-opacity">→</span>
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
                20 totalt
              </Badge>
            </div>
            <CardDescription className="mt-2">
              Administrer caser, verktøy, artikler og arrangementer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Stats with CTAs in boxes */}
              <div className="grid grid-cols-2 gap-3">
                {/* Caser Box */}
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="text-center space-y-1">
                    <div className="font-semibold text-blue-700 text-2xl">12</div>
                    <div className="text-sm text-muted-foreground">Caser</div>
                  </div>
                  <Link href="/min-side/innhold?type=case&action=new">
                    <Button variant="outline" size="sm" className="w-full justify-start text-xs cursor-pointer">
                      <span className="mr-1">📝</span> Ny case
                    </Button>
                  </Link>
                </div>

                {/* Verktøy Box */}
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="text-center space-y-1">
                    <div className="font-semibold text-green-700 text-2xl">8</div>
                    <div className="text-sm text-muted-foreground">Verktøy</div>
                  </div>
                  <Link href="/min-side/verktoy?action=new">
                    <Button variant="outline" size="sm" className="w-full justify-start text-xs cursor-pointer">
                      <span className="mr-1">�️</span> Nytt verktøy
                    </Button>
                  </Link>
                </div>
              </div>

              <Separator />

              <Link href="/min-side/innhold" className="block">
                <Button variant="outline" className="w-full justify-between text-primary hover:translate-x-1 transition-transform border group cursor-pointer">
                  <span>Se alt innhold</span>
                  <span className="opacity-50 group-hover:opacity-100 transition-opacity">→</span>
                </Button>
              </Link>
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
                <Button variant="outline" className="w-full justify-between text-primary hover:translate-x-1 transition-transform border group cursor-pointer">
                  <span className="flex items-center gap-2">
                    <span>⭐</span> Medlemskap
                  </span>
                  <span className="opacity-50 group-hover:opacity-100 transition-opacity">→</span>
                </Button>
              </Link>
              <Link href="/min-side/mitt-medlem">
                <Button variant="outline" className="w-full justify-between text-primary hover:translate-x-1 transition-transform border group cursor-pointer">
                  <span className="flex items-center gap-2">
                    <span>🏢</span> Mitt Foretak
                  </span>
                  <span className="opacity-50 group-hover:opacity-100 transition-opacity">→</span>
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

      {/* Arrangements Section */}
      <MyArrangementsCard />
    </div>
  );
}
