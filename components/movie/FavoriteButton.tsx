'use client';

import React from 'react';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/context/FavoritesContext';
import { useToast } from '@/context/ToastContext';
import { Movie } from '@/lib/tmdb/types';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  movie: Movie;
  variant?: 'card' | 'detail';
}

export function FavoriteButton({ movie, variant = 'card' }: FavoriteButtonProps) {
  const { isFavorite, addFavorite, removeFavorite, isHydrated } = useFavorites();
  const { showToast } = useToast();
  
  if (!isHydrated) return null;

  const saved = isFavorite(movie.id);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (saved) {
      removeFavorite(movie.id);
      showToast({
        message: 'Removed from Favorites',
        type: 'info',
        action: {
          label: 'Undo',
          onClick: () => addFavorite(movie),
        }
      });
    } else {
      addFavorite(movie);
      showToast({
        message: 'Added to Favorites',
        type: 'success',
      });
    }
  };

  if (variant === 'card') {
    return (
      <button
        onClick={toggleFavorite}
        className={cn(
          "absolute top-[var(--space-2)] right-[var(--space-2)] w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ease-[var(--ease-emphasized)] hover:scale-110",
          saved ? "bg-[rgba(8,9,12,0.8)] backdrop-blur-md" : "bg-[rgba(8,9,12,0.6)] backdrop-blur-md hover:bg-[rgba(8,9,12,0.8)]"
        )}
        aria-label={saved ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart 
          className={cn(
            "w-4 h-4 transition-all duration-200 ease-[var(--ease-emphasized)]",
            saved 
              ? "text-[var(--color-accent)] fill-[var(--color-accent)] scale-110" 
              : "text-[var(--color-text-primary)] opacity-60 fill-transparent hover:opacity-100"
          )} 
        />
      </button>
    );
  }

  return (
    <button
      onClick={toggleFavorite}
      className={cn(
        "inline-flex items-center justify-center gap-2 px-[var(--space-5)] py-2.5 rounded-[var(--radius-md)] text-[15px] font-medium transition-all duration-200 ease-[var(--ease-emphasized)] active:scale-95",
        saved
          ? "bg-[rgba(242,193,78,0.12)] border border-[var(--color-accent)] text-[var(--color-accent)]"
          : "bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)]"
      )}
    >
      <Heart 
        className={cn(
          "w-5 h-5 transition-all duration-200",
          saved ? "fill-[var(--color-accent)] text-[var(--color-accent)] scale-110" : "fill-transparent text-[var(--color-text-primary)]"
        )} 
      />
      {saved ? "Saved to Favorites" : "Add to Favorites"}
    </button>
  );
}
