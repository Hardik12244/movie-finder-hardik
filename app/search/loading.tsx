import React from 'react';
import { MovieGrid } from '@/components/movie/MovieGrid';

export default function SearchLoading() {
  return (
    <div className="max-w-[1440px] mx-auto w-full px-[var(--space-4)] md:px-[var(--space-6)] py-[var(--space-12)]">
      <div className="w-64 h-10 bg-[rgba(255,255,255,0.05)] rounded-lg animate-pulse mb-[var(--space-8)]" />
      <MovieGrid isLoading={true} />
    </div>
  );
}
