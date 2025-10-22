import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { ProfileSection } from '@/components/profile/ProfileSection';
import { ChangePasswordSection } from '@/components/profile/ChangePasswordSection';
import { LogoutButton } from '@/components/auth/LogoutButton';

export const metadata: Metadata = {
  title: 'Min Side | BimVerdi',
  description: 'Administrer din profil og innstillinger',
};

export default async function MinSidePage() {
  const session = await getSession();

  // Redirect to login if not authenticated
  if (!session.isLoggedIn) {
    redirect('/logg-inn?returnUrl=/minside');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Min Side</h1>
          <p className="mt-2 text-gray-600">
            Velkommen, {session.firstName} {session.lastName}
          </p>
        </div>
        <LogoutButton />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          <ProfileSection userId={session.userId!} />
          <ChangePasswordSection />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Kontoinformasjon</h3>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="font-medium text-gray-500">E-post</dt>
                <dd className="text-gray-900">{session.email}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Rolle</dt>
                <dd className="text-gray-900">
                  {session.role === 'bimverdi_customer' ? 'Kunde' : session.role}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-lg border bg-blue-50 p-6">
            <h3 className="text-lg font-semibold text-blue-900">Tips</h3>
            <p className="mt-2 text-sm text-blue-700">
              Hold profilen din oppdatert for å få personaliserte anbefalinger og tilbud.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
