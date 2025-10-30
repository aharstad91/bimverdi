/**
 * Min Side Header - Server Component
 *
 * Handles session extraction and renders header with plain data only.
 * This prevents serialization warnings by ensuring only plain objects
 * are passed to the Client Component LogoutButton.
 */

import { getSessionServer } from '@/app/actions/auth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogoutButton } from '@/components/auth/LogoutButton';

export async function MinSideHeader() {
  const session = await getSessionServer();

  // Extract only plain values (no methods/objects that can't serialize)
  const firstName = session.firstName || '';
  const lastName = session.lastName || '';
  const initials = `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase();

  return (
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
            Velkommen, {firstName} {lastName}
          </p>
        </div>
      </div>
      <LogoutButton />
    </div>
  );
}
