import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Movie } from '@/lib/tmdb/types';
import { getImageUrl } from '@/lib/utils';
import { RatingBadge } from './RatingBadge';
import { FavoriteButton } from './FavoriteButton';

export function MovieCard({ movie }: { movie: Movie }) {
  // Normally we would map genreIds to text, using 'Movie' as fallback for now
  const primaryGenre = 'Movie';
  
  return (
    <Link href={`/movie/${movie.id}`} className="group flex flex-col bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-1 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-lg)] hover:-translate-y-1 transition-all duration-150 ease-[var(--ease-standard)] h-full overflow-hidden">
      <div className="relative aspect-[2/3] w-full rounded-[var(--radius-card)] overflow-hidden bg-[var(--color-surface-elevated)]">
        <Image
          src={getImageUrl(movie.posterPath, 'w342')}
          alt={movie.title}
          fill
          className="object-cover transition-transform duration-200 ease-[var(--ease-standard)] group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />
        
        <div className="absolute top-[var(--space-2)] left-[var(--space-2)] z-10 pointer-events-none">
          <RatingBadge rating={movie.rating} />
        </div>
        
        <div className="absolute top-0 right-0 bottom-0 left-0 z-20 pointer-events-none">
          {/* We wrap FavoriteButton to allow pointer events on just the button */}
          <div className="pointer-events-auto">
            <FavoriteButton movie={movie} variant="card" />
          </div>
        </div>
      </div>
      
      <div className="p-[var(--space-3)] flex flex-col gap-1 mt-1">
        <h3 className="text-[20px] font-semibold leading-tight text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors truncate">
          {movie.title}
        </h3>
        <div className="text-[13px] text-[var(--color-text-secondary)] tracking-[0.01em]">
          {movie.releaseYear || 'Unknown'} • {primaryGenre}
        </div>
      </div>
    </Link>
  );
}
