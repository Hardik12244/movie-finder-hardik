'use client';

import React from 'react';
import { useFavorites } from '@/context/FavoritesContext';
import { MovieGrid } from '@/components/movie/MovieGrid';
import { EmptyState } from '@/components/states/EmptyState';
import { Bookmark } from 'lucide-react';

export default function FavoritesPage() {
  const { favorites, isHydrated } = useFavorites();

  if (!isHydrated) {
    return (
      <div className="max-w-[1440px] mx-auto w-full px-[var(--space-4)] md:px-[var(--space-6)] py-[var(--space-12)]">
        <div className="flex items-baseline gap-3 mb-[var(--space-8)]">
          <h2 className="text-[28px] font-bold tracking-tight text-[var(--color-text-primary)] opacity-50">
            Your Favorites
          </h2>
        </div>
        <MovieGrid isLoading={true} />
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto w-full px-[var(--space-4)] md:px-[var(--space-6)] py-[var(--space-12)]">
      {favorites.length > 0 ? (
        <>
          <div className="flex items-baseline gap-3 mb-[var(--space-8)]">
            <h2 className="text-[28px] font-bold tracking-tight text-[var(--color-text-primary)]">
              Your Favorites
            </h2>
            <span className="text-[15px] font-medium text-[var(--color-text-secondary)]">
              {favorites.length} saved
            </span>
          </div>
          <MovieGrid movies={favorites} />
        </>
      ) : (
        <div className="pt-[10vh]">
          <EmptyState
            icon={Bookmark}
            title="No favorites yet"
            description="Movies you save will show up here. Tap the heart on any title to add it."
            action={{
              label: "Browse Movies",
              href: "/"
            }}
          />
        </div>
      )}
    </div>
  );
}
