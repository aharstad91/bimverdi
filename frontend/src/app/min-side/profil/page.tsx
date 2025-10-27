import { getSession } from '@/lib/session';
import { ProfileSection } from '@/components/profile/ProfileSection';

export default async function ProfilPage() {
  const session = await getSession();

  return (
    <div className="space-y-4">
      <ProfileSection userId={session.userId!} />
    </div>
  );
}

