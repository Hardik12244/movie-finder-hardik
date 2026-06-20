'use client';

import React, { useEffect } from 'react';
import { useRecentHistory } from '@/hooks/useRecentHistory';
import { Movie } from '@/lib/tmdb/types';
import { MovieCarousel } from './MovieCarousel';

export function RecentlyViewedTracker({ movie }: { movie: Movie }) {
  const { addRecentMovie } = useRecentHistory();

  useEffect(() => {
    addRecentMovie(movie);
  }, [movie]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}

export function RecentlyViewedCarousel() {
  const { recentMovies, isHydrated } = useRecentHistory();

  if (!isHydrated || recentMovies.length === 0) return null;

  return (
    <div className="w-full relative z-10 border-t border-[rgba(255,255,255,0.05)] pt-[var(--space-8)] mt-[var(--space-8)]">
      <MovieCarousel title="Recently Viewed" movies={recentMovies} />
    </div>
  );
}
