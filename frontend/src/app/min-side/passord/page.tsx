import { ChangePasswordSection } from '@/components/profile/ChangePasswordSection';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function PassordPage() {
  return (
    <div className="space-y-6">
      <ChangePasswordSection />

      <Separator />

      {/* Additional Security Options */}
      <Card>
        <CardHeader>
          <CardTitle>Ytterligere sikkerhet</CardTitle>
          <CardDescription>Ekstra sikkerhetstiltak for kontoen din</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div>
              <h4 className="font-medium">To-faktor autentisering (2FA)</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Legg til ekstra sikkerhet til kontoen din
              </p>
            </div>
            <Button>Aktiver</Button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div>
              <h4 className="font-medium">Aktive økter</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Se og administrer enheter som er logget inn
              </p>
            </div>
            <Button variant="outline">Administrer</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

