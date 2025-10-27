import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { MinSideTabs } from '@/components/min-side/MinSideTabs';
import { LogoutButton } from '@/components/auth/LogoutButton';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default async function MinSideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Redirect to login if not authenticated
  if (!session.isLoggedIn) {
    redirect('/logg-inn?returnUrl=/min-side');
  }

  // Get user initials for avatar
  const initials = `${session.firstName?.[0] || ''}${session.lastName?.[0] || ''}`.toUpperCase();

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-8 shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-primary/20">
                  <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-1">Min Side</h1>
                  <p className="text-muted-foreground">
                    Velkommen, {session.firstName} {session.lastName}
                  </p>
                </div>
              </div>
              <LogoutButton />
            </div>
          </CardContent>
        </Card>

        <MinSideTabs />

        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
