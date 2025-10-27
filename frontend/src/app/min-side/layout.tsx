import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { MinSideTabs } from '@/components/min-side/MinSideTabs';
import { LogoutButton } from '@/components/auth/LogoutButton';
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
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="border rounded-lg mb-8">
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 border">
                <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Min Side</h1>
                <p className="text-sm text-muted-foreground">
                  Velkommen, {session.firstName} {session.lastName}
                </p>
              </div>
            </div>
            <LogoutButton />
          </div>

          {/* Tabs */}
          <MinSideTabs />
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
}
