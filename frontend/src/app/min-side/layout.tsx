import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { MinSideTabs } from '@/components/min-side/MinSideTabs';
import { LogoutButton } from '@/components/auth/LogoutButton';

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Min Side</h1>
            <p className="text-gray-600">
              Velkommen, {session.firstName} {session.lastName}
            </p>
          </div>
          <LogoutButton />
        </div>

        <MinSideTabs />

        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
