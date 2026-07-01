'use client';

import React, { useState } from 'react';
import { useMediaTracking } from '@/context/MediaTrackingContext';
import { MovieGrid } from '@/components/movie/MovieGrid';
import { EmptyState } from '@/components/states/EmptyState';
import { CheckCircle2, Film, Tv } from 'lucide-react';
import { Movie } from '@/lib/tmdb/types';
import { cn } from '@/lib/utils';

export default function CompletedPage() {
  const { trackItems, isHydrated } = useMediaTracking();
  const [filterType, setFilterType] = useState<'all' | 'movie' | 'tv'>('all');

  if (!isHydrated) {
    return (
      <div className="max-w-[1440px] mx-auto w-full px-4 md:px-8 py-12">
        <div className="h-10 w-48 bg-[var(--color-surface)] animate-pulse rounded-[var(--radius-md)] mb-8" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="aspect-[2/3] bg-[var(--color-surface)] animate-pulse rounded-[var(--radius-lg)]" />
          ))}
        </div>
      </div>
    );
  }

  const completedItems = trackItems
    .filter(item => item.status === 'completed')
    .filter(item => filterType === 'all' ? true : item.mediaType === filterType);

  const sortedItems = [...completedItems].sort((a, b) => {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  const movies: Movie[] = sortedItems.map(item => ({
    id: item.id,
    title: item.title,
    posterPath: item.posterPath,
    backdropPath: item.backdropPath,
    releaseYear: item.releaseYear,
    rating: item.tmdbRating,
    voteCount: 0,
    overview: '',
    genreIds: [],
    popularity: 100,
    mediaType: item.mediaType,
  }));

  const totalMovies = trackItems.filter(i => i.status === 'completed' && i.mediaType === 'movie').length;
  const totalShows = trackItems.filter(i => i.status === 'completed' && i.mediaType === 'tv').length;

  return (
    <div className="max-w-[1440px] mx-auto w-full px-4 md:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[rgba(255,255,255,0.06)]">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-[32px] font-bold tracking-tight text-[var(--color-text-primary)]">
                Completed Library
              </h1>
              <p className="text-[14px] text-[var(--color-text-secondary)] mt-0.5">
                All movies and TV series you have finished watching
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={cn(
              "px-3.5 py-1.5 rounded-[var(--radius-md)] text-[13px] font-semibold transition-colors border",
              filterType === 'all'
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                : "bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:text-white"
            )}
          >
            All ({totalMovies + totalShows})
          </button>
          <button
            onClick={() => setFilterType('movie')}
            className={cn(
              "flex items-center gap-1.5 px-3.5 py-1.5 rounded-[var(--radius-md)] text-[13px] font-semibold transition-colors border",
              filterType === 'movie'
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                : "bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:text-white"
            )}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Movies ({totalMovies})</span>
          </button>
          <button
            onClick={() => setFilterType('tv')}
            className={cn(
              "flex items-center gap-1.5 px-3.5 py-1.5 rounded-[var(--radius-md)] text-[13px] font-semibold transition-colors border",
              filterType === 'tv'
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                : "bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:text-white"
            )}
          >
            <Tv className="w-3.5 h-3.5" />
            <span>TV Shows ({totalShows})</span>
          </button>
        </div>
      </div>

      {completedItems.length === 0 ? (
        <div className="py-16">
          <EmptyState
            icon={CheckCircle2}
            title="No Completed Content Yet"
            description="When you finish watching a movie or all episodes of a TV show, mark it as Completed and it will appear right here in your trophy showcase!"
            action={{
              label: "Explore Browse",
              href: "/"
            }}
          />
        </div>
      ) : (
        <MovieGrid movies={movies} />
      )}
    </div>
  );
}
