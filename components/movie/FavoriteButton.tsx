'use client';

import React from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
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
  
  if (!isHydrated) {
    if (variant === 'card') {
      return (
        <div className="w-9 h-9 rounded-full bg-[rgba(8,9,12,0.2)] flex items-center justify-center pointer-events-none">
          <Heart className="w-4 h-4 text-[var(--color-text-primary)] opacity-30" />
        </div>
      );
    }
    return (
      <div className="inline-flex items-center justify-center gap-2 px-[var(--space-6)] py-3 rounded-[var(--radius-md)] text-[15px] font-medium bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] text-[var(--color-text-primary)] opacity-50 pointer-events-none">
        <Heart className="w-5 h-5 fill-transparent" />
        Add to Favorites
      </div>
    );
  }

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
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleFavorite}
        className={cn(
          "w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200 ease-[var(--ease-emphasized)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]",
          saved ? "bg-[rgba(8,9,12,0.9)] backdrop-blur-md [-webkit-backdrop-filter:blur(12px)]" : "bg-[rgba(8,9,12,0.5)] backdrop-blur-md [-webkit-backdrop-filter:blur(12px)] hover:bg-[rgba(8,9,12,0.8)]"
        )}
        aria-label={saved ? "Remove from favorites" : "Add to favorites"}
      >
        <motion.div
          initial={false}
          animate={{ scale: saved ? [1, 1.3, 1] : 1 }}
          transition={{ duration: 0.4 }}
        >
          <Heart 
            className={cn(
              "w-4 h-4 transition-all duration-200 ease-[var(--ease-emphasized)]",
              saved 
                ? "text-[var(--color-accent)] fill-[var(--color-accent)]" 
                : "text-[var(--color-text-primary)] opacity-60 fill-transparent hover:opacity-100"
            )} 
          />
        </motion.div>
      </motion.button>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleFavorite}
      className={cn(
        "inline-flex items-center justify-center gap-2 px-[var(--space-6)] py-3 rounded-[var(--radius-md)] text-[15px] font-medium transition-colors duration-200 ease-[var(--ease-emphasized)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]",
        saved
          ? "bg-[rgba(242,193,78,0.12)] border border-[var(--color-accent)] text-[var(--color-accent)]"
          : "bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] text-[var(--color-text-primary)]"
      )}
      aria-label={saved ? "Remove from favorites" : "Add to favorites"}
    >
      <motion.div
        initial={false}
        animate={{ scale: saved ? [1, 1.3, 1] : 1 }}
        transition={{ duration: 0.4 }}
      >
        <Heart 
          className={cn(
            "w-5 h-5 transition-all duration-200",
            saved ? "fill-[var(--color-accent)] text-[var(--color-accent)]" : "fill-transparent text-[var(--color-text-primary)]"
          )} 
        />
      </motion.div>
      {saved ? "Saved to Favorites" : "Add to Favorites"}
    </motion.button>
  );
}
