'use client';

import React, { useState } from 'react';
import { useMediaTracking } from '@/context/MediaTrackingContext';
import { MovieGrid } from '@/components/movie/MovieGrid';
import { EmptyState } from '@/components/states/EmptyState';
import { Bookmark, ArrowUpDown } from 'lucide-react';
import { Movie } from '@/lib/tmdb/types';

type SortOption = 'recent' | 'release' | 'popularity' | 'alphabetical';

export default function WatchlistPage() {
  const { trackItems, isHydrated } = useMediaTracking();
  const [sortBy, setSortBy] = useState<SortOption>('recent');

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

  const watchlistItems = trackItems.filter(item => item.status === 'plan_to_watch');

  const sortedItems = [...watchlistItems].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
    if (sortBy === 'release') {
      return (parseInt(b.releaseYear) || 0) - (parseInt(a.releaseYear) || 0);
    }
    if (sortBy === 'popularity') {
      return (b.tmdbRating || 0) - (a.tmdbRating || 0);
    }
    if (sortBy === 'alphabetical') {
      return a.title.localeCompare(b.title);
    }
    return 0;
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

  return (
    <div className="max-w-[1440px] mx-auto w-full px-4 md:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[rgba(255,255,255,0.06)]">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Bookmark className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-[32px] font-bold tracking-tight text-[var(--color-text-primary)]">
                My Watchlist
              </h1>
              <p className="text-[14px] text-[var(--color-text-secondary)] mt-0.5">
                Movies and TV shows you plan to watch next ({watchlistItems.length} items)
              </p>
            </div>
          </div>
        </div>

        {watchlistItems.length > 0 && (
          <div className="flex items-center gap-2 self-start md:self-auto">
            <ArrowUpDown className="w-4 h-4 text-[var(--color-text-muted)]" />
            <span className="text-[13px] font-medium text-[var(--color-text-secondary)] mr-1">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] px-3 py-1.5 text-[14px] font-medium text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)] transition-colors"
            >
              <option value="recent">Recently Added</option>
              <option value="release">Release Date</option>
              <option value="popularity">Popularity / Rating</option>
              <option value="alphabetical">Alphabetical (A-Z)</option>
            </select>
          </div>
        )}
      </div>

      {watchlistItems.length === 0 ? (
        <div className="py-16">
          <EmptyState
            icon={Bookmark}
            title="Your Watchlist is Empty"
            description="You haven't added any movies or TV shows to your Plan to Watch list yet. Browse or search for titles and click 'Add to List'!"
            action={{
              label: "Discover Content",
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
