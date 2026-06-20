import React from 'react';
import { Movie } from '@/lib/tmdb/types';
import { MovieCard } from './MovieCard';
import { MovieCardSkeleton } from './MovieCardSkeleton';

interface MovieGridProps {
  movies?: Movie[];
  isLoading?: boolean;
}

export function MovieGrid({ movies = [], isLoading = false }: MovieGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-[var(--space-4)] md:gap-[var(--space-6)] w-full">
      {isLoading ? (
        Array.from({ length: 12 }).map((_, i) => (
          <div key={`skeleton-${i}`} className="animate-in fade-in duration-200" style={{ animationDelay: `${i * 30}ms` }}>
            <MovieCardSkeleton />
          </div>
        ))
      ) : (
        movies.map((movie, i) => (
          <div key={movie.id} className="animate-in fade-in slide-in-from-bottom-2 duration-200" style={{ animationDelay: `${Math.min(i, 5) * 30}ms` }}>
            <MovieCard movie={movie} />
          </div>
        ))
      )}
    </div>
  );
}
