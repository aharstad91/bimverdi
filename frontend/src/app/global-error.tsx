'use client';

import { GlobalErrorFallback } from '@/components/ErrorBoundary';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="no">
      <body>
        <GlobalErrorFallback error={error} reset={reset} />
      </body>
    </html>
  );
}
