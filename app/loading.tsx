import React from 'react';
import { Loader2 } from 'lucide-react';

export default function RootLoading() {
  return (
    <div className="w-full min-h-[calc(100vh-72px)] flex flex-col items-center justify-center bg-[var(--color-bg)]">
      <div className="relative">
        <div className="absolute inset-0 bg-[var(--color-primary)] opacity-20 blur-xl rounded-full animate-pulse" />
        <Loader2 className="w-12 h-12 animate-spin text-[var(--color-primary)] relative z-10" />
      </div>
      <p className="mt-6 text-[var(--color-text-secondary)] font-medium tracking-wide animate-pulse">
        Loading amazing movies...
      </p>
    </div>
  );
}
