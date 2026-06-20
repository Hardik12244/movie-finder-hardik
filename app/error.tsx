'use client';

import { useEffect } from 'react';
import { ErrorState } from '@/components/states/ErrorState';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="w-full min-h-[calc(100vh-72px)] flex items-center justify-center bg-[var(--color-bg)]">
      <ErrorState reset={reset} />
    </div>
  );
}
