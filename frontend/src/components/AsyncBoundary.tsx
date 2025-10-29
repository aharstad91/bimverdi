import { Suspense } from 'react';

interface AsyncBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AsyncBoundary({
  children,
  fallback = <LoadingSpinner />
}: AsyncBoundaryProps) {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
    </div>
  );
}

// Wrapper for async server components with error handling
export async function withErrorHandling<T>(
  asyncFn: () => Promise<T>,
  fallbackValue: T
): Promise<T> {
  try {
    return await asyncFn();
  } catch (error) {
    console.error('Async component error:', error);
    return fallbackValue;
  }
}
