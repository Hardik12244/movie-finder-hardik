'use client';

import React, { useMemo } from 'react';
import { useFavorites } from '@/context/FavoritesContext';
import { MovieGrid } from '@/components/movie/MovieGrid';
import { EmptyState } from '@/components/states/EmptyState';
import { Bookmark, Star, Calendar, Film } from 'lucide-react';
import { MovieCarousel } from '@/components/movie/MovieCarousel';
import { Movie } from '@/lib/tmdb/types';
import { GENRE_MAP } from '@/lib/utils';
import { motion } from 'framer-motion';

export function FavoritesClient({ trending }: { trending: Movie[] }) {
  const { favorites, isHydrated } = useFavorites();

  const analytics = useMemo(() => {
    if (favorites.length === 0) return null;

    let totalRating = 0;
    const genreCounts: Record<string, number> = {};
    let minYear = 9999;
    let maxYear = 0;

    favorites.forEach(movie => {
      totalRating += movie.rating;
      
      const year = movie.releaseYear ? parseInt(movie.releaseYear) : 0;
      if (year) {
        if (year < minYear) minYear = year;
        if (year > maxYear) maxYear = year;
      }

      movie.genreIds?.forEach(id => {
        const name = GENRE_MAP[id];
        if (name) {
          genreCounts[name] = (genreCounts[name] || 0) + 1;
        }
      });
    });

    const topGenre = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Mixed';
    const avgRating = (totalRating / favorites.length).toFixed(1);
    const yearsCovered = minYear !== 9999 ? `${minYear} - ${maxYear}` : 'N/A';

    return {
      saved: favorites.length,
      avgRating,
      topGenre,
      yearsCovered
    };
  }, [favorites]);

  if (!isHydrated) {
    return (
      <div className="max-w-[1440px] mx-auto w-full px-[var(--space-4)] md:px-[var(--space-6)] py-[var(--space-12)]">
        <MovieGrid isLoading={true} />
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto w-full px-[var(--space-4)] md:px-[var(--space-6)] py-[var(--space-8)]">
      {favorites.length > 0 ? (
        <>
          <div className="flex flex-col gap-[var(--space-8)] mb-[var(--space-12)]">
            <h2 className="text-[32px] md:text-[40px] font-bold tracking-tight text-[var(--color-text-primary)]">
              Your Watchlist
            </h2>
            
            {/* Analytics Dashboard */}
            {analytics && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-[var(--space-4)]">
                <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay:0.1}} className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-[var(--radius-lg)] p-[var(--space-5)] flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[rgba(124,92,252,0.15)] flex items-center justify-center shrink-0">
                    <Bookmark className="w-5 h-5 text-[var(--color-primary)]" />
                  </div>
                  <div>
                    <div className="text-[12px] text-[var(--color-text-muted)] uppercase tracking-wider font-semibold">Saved</div>
                    <div className="text-[20px] font-bold text-[var(--color-text-primary)]">{analytics.saved}</div>
                  </div>
                </motion.div>

                <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay:0.2}} className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-[var(--radius-lg)] p-[var(--space-5)] flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[rgba(245,158,11,0.15)] flex items-center justify-center shrink-0">
                    <Star className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <div className="text-[12px] text-[var(--color-text-muted)] uppercase tracking-wider font-semibold">Avg Rating</div>
                    <div className="text-[20px] font-bold text-[var(--color-text-primary)]">{analytics.avgRating}</div>
                  </div>
                </motion.div>

                <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay:0.3}} className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-[var(--radius-lg)] p-[var(--space-5)] flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[rgba(16,185,129,0.15)] flex items-center justify-center shrink-0">
                    <Film className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <div className="text-[12px] text-[var(--color-text-muted)] uppercase tracking-wider font-semibold">Top Genre</div>
                    <div className="text-[18px] font-bold text-[var(--color-text-primary)] truncate">{analytics.topGenre}</div>
                  </div>
                </motion.div>

                <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay:0.4}} className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-[var(--radius-lg)] p-[var(--space-5)] flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[rgba(236,72,153,0.15)] flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-pink-500" />
                  </div>
                  <div>
                    <div className="text-[12px] text-[var(--color-text-muted)] uppercase tracking-wider font-semibold">Era</div>
                    <div className="text-[16px] font-bold text-[var(--color-text-primary)]">{analytics.yearsCovered}</div>
                  </div>
                </motion.div>
              </div>
            )}
          </div>
          
          <MovieGrid movies={favorites} />
        </>
      ) : (
        <div className="pt-[10vh] flex flex-col items-center">
          <EmptyState
            icon={Bookmark}
            title="Your Watchlist is Empty"
            description="Movies you save will show up here. Build your personalized collection."
            action={{
              label: "Discover Movies",
              href: "/"
            }}
          />
          
          <div className="w-full mt-[var(--space-16)] pt-[var(--space-8)] border-t border-[rgba(255,255,255,0.05)]">
            <h3 className="text-center text-[var(--color-text-secondary)] font-medium mb-[var(--space-6)] uppercase tracking-widest text-[13px]">
              Trending Alternatives
            </h3>
            <MovieCarousel title="" movies={trending} />
          </div>
        </div>
      )}
    </div>
  );
}
