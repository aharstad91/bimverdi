import { redirect } from 'next/navigation';

/**
 * Redirect from old /minside to new /min-side
 * This ensures backward compatibility with bookmarks and links
 */
export default function MinSideRedirect() {
  redirect('/min-side');
}
