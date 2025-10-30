import { redirect } from 'next/navigation';
import { getSessionServer } from '@/app/actions/auth';
import { MinSideTabs } from '@/components/min-side/MinSideTabs';
import { MinSideHeader } from '@/components/min-side/MinSideHeader';

export default async function MinSideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionServer();

  // Redirect to login if not authenticated
  if (!session.isLoggedIn) {
    redirect('/logg-inn?returnUrl=/min-side');
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="border rounded-lg mb-8">
          {/* Header */}
          <MinSideHeader />

          {/* Tabs */}
          <MinSideTabs />
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
}
