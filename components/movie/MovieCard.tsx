'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Movie } from '@/lib/tmdb/types';
import { getImageUrl, GENRE_MAP } from '@/lib/utils';
import { RatingBadge } from './RatingBadge';
import { FavoriteButton } from './FavoriteButton';
import { useMediaTracking } from '@/context/MediaTrackingContext';
import { StatusBadge } from '../states/StatusBadge';

export function MovieCard({ movie, priority = false }: { movie: Movie, priority?: boolean }) {
  const { getItem, isHydrated } = useMediaTracking();
  const mediaType = movie.mediaType === 'tv' ? 'tv' : 'movie';
  const primaryGenre = movie.genreIds?.[0] ? GENRE_MAP[movie.genreIds[0]] : (mediaType === 'tv' ? 'TV Series' : 'Movie');
  
  const trackedItem = isHydrated ? getItem(movie.id, mediaType) : undefined;
  const href = `/${mediaType}/${movie.id}`;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="h-full"
    >
      <Link href={href} className="group flex flex-col bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-[6px] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-elevated)] hover:border-[rgba(124,92,252,0.3)] transition-all duration-300 ease-[var(--ease-emphasized)] h-full overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]">
        <div className="relative aspect-[2/3] w-full rounded-[var(--radius-card)] overflow-hidden bg-[var(--color-surface-elevated)]">
          <Image
            src={getImageUrl(movie.posterPath, 'w342')}
            alt={movie.title}
            fill
            priority={priority}
            className="object-cover transition-transform duration-500 ease-[var(--ease-standard)] group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(8,9,12,0.8)] via-transparent to-[rgba(8,9,12,0.2)] opacity-80 group-hover:opacity-40 transition-opacity duration-300" />
          
          <div className="absolute top-[var(--space-2)] left-[var(--space-2)] z-10 pointer-events-none flex flex-col gap-1.5 items-start">
            <RatingBadge rating={movie.rating} />
            {trackedItem?.status && (
              <StatusBadge status={trackedItem.status} size="sm" showIcon={false} />
            )}
          </div>
          
          <div className="absolute top-[var(--space-2)] right-[var(--space-2)] z-20 pointer-events-none">
            <div className="pointer-events-auto">
              <FavoriteButton movie={movie} variant="card" />
            </div>
          </div>
        </div>
        
        <div className="p-[var(--space-3)] flex flex-col gap-1 mt-1 flex-1 justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              {mediaType === 'tv' && (
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[var(--color-primary)]/20 text-[var(--color-primary)] px-1.5 py-0.5 rounded-[var(--radius-sm)]">
                  TV
                </span>
              )}
            </div>
            <h3 className="text-[16px] font-semibold leading-tight text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
              {movie.title}
            </h3>
          </div>
          <div className="text-[13px] font-medium text-[var(--color-text-muted)] tracking-[0.01em] mt-2">
            {movie.releaseYear || 'Unknown'} <span className="mx-1 opacity-50">•</span> {primaryGenre}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

