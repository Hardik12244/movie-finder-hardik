'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Movie } from '@/lib/tmdb/types';
import { getImageUrl } from '@/lib/utils';
import { RatingBadge } from '../movie/RatingBadge';
import { Button } from '../ui/Button';

export function Hero({ movie }: { movie: Movie }) {
  if (!movie) return null;

  return (
    <div className="relative w-full h-[clamp(420px,56vw,640px)] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src={getImageUrl(movie.backdropPath, 'w1280')}
          alt={movie.title}
          fill
          priority
          className="object-cover object-top"
          sizes="100vw"
        />
        {/* Gradient overlays as specified in Phase 4.1 */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#08090C] via-[rgba(8,9,12,0.8)] to-[rgba(8,9,12,0.15)] w-[100%] md:w-[60%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090C] to-transparent top-[70%]" />
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto w-full px-[var(--space-4)] md:px-[var(--space-6)]">
        <div className="flex flex-col w-full md:w-[60%] lg:w-[50%]">
          <span className="text-[12px] font-semibold tracking-[0.06em] text-[var(--color-accent)] uppercase mb-[var(--space-2)]">
            Now Trending
          </span>
          
          <h1 className="text-[36px] md:text-[56px] font-bold leading-[1.1] tracking-[-0.02em] text-[var(--color-text-primary)] mb-[var(--space-4)] line-clamp-2 md:line-clamp-none">
            {movie.title}
          </h1>
          
          <div className="flex items-center gap-[var(--space-4)] text-[13px] text-[var(--color-text-secondary)] mb-[var(--space-5)]">
            <span>{movie.releaseYear || 'Unknown'}</span>
            <span>•</span>
            <span>Movie</span>
            <span>•</span>
            <RatingBadge rating={movie.rating} />
          </div>
          
          <p className="text-[15px] leading-[1.6] text-[var(--color-text-primary)] mb-[var(--space-8)] line-clamp-2">
            {movie.overview}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-[var(--space-4)]">
            <Link href={`/movie/${movie.id}`} passHref legacyBehavior>
              <Button variant="primary" size="md" className="w-full sm:w-auto px-[var(--space-5)]">
                View Details
              </Button>
            </Link>
            <Button 
              variant="secondary" 
              size="md" 
              className="w-full sm:w-auto"
              onClick={() => {
                const grid = document.getElementById('browse-grid');
                if (grid) {
                  const headerOffset = 80;
                  const elementPosition = grid.getBoundingClientRect().top;
                  const offsetPosition = elementPosition + window.scrollY - headerOffset;
                  window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                }
              }}
            >
              Browse All
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
