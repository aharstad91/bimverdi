import { getSession } from '@/lib/session';
import { ProfileSection } from '@/components/profile/ProfileSection';

export default async function ProfilPage() {
  const session = await getSession();

  return (
    <div className="bg-white rounded-b-lg shadow-sm border border-gray-200 border-t-0 p-6">
      <div className="max-w-3xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Rediger profil</h2>
          <p className="text-gray-600 mt-1">
            Oppdater din profilinformasjon og kontaktdetaljer
          </p>
        </div>

        <ProfileSection userId={session.userId!} />
      </div>
    </div>
  );
}

