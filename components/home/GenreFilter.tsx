'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion, useReducedMotion } from 'framer-motion';

// Extract subset of popular genres for the chips
const POPULAR_GENRES = [
  { id: '28', name: 'Action' },
  { id: '12', name: 'Adventure' },
  { id: '35', name: 'Comedy' },
  { id: '18', name: 'Drama' },
  { id: '14', name: 'Fantasy' },
  { id: '878', name: 'Sci-Fi' },
  { id: '53', name: 'Thriller' }
];

function GenreFilterInner({ currentGenre }: { currentGenre?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const shouldReduceMotion = useReducedMotion();

  const handleSelect = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Toggle off if already selected
    if (currentGenre === id) {
      params.delete('genre');
    } else {
      params.set('genre', id);
    }
    
    // Reset to page 1 on genre change
    params.set('page', '1');
    
    // Use Next.js soft navigation
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {POPULAR_GENRES.map((genre) => {
        const isSelected = currentGenre === genre.id;
        
        return (
          <button
            key={genre.id}
            onClick={() => handleSelect(genre.id)}
            className={cn(
              "relative px-4 py-2 rounded-full text-[14px] font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]",
              isSelected 
                ? "text-[var(--color-bg)] font-bold shadow-[0_4px_16px_rgba(124,92,252,0.4)]" 
                : "text-[var(--color-text-secondary)] bg-[var(--color-surface)] border border-[rgba(255,255,255,0.05)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-text-primary)]"
            )}
          >
            {isSelected && (
              <motion.div
                layoutId={shouldReduceMotion ? undefined : "activeGenre"}
                className="absolute inset-0 bg-[var(--color-primary)] rounded-full -z-10"
                transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10">{genre.name}</span>
          </button>
        );
      })}
    </div>
  );
}

export function GenreFilter({ currentGenre }: { currentGenre?: string }) {
  return (
    <Suspense fallback={<div className="h-[40px] animate-pulse bg-[var(--color-surface)] rounded-full w-[300px]"></div>}>
      <GenreFilterInner currentGenre={currentGenre} />
    </Suspense>
  );
}
