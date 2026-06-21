'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Movie } from '@/lib/tmdb/types';
import { MovieCard } from './MovieCard';
import { MovieCardSkeleton } from './MovieCardSkeleton';

interface MovieGridProps {
  movies?: Movie[];
  isLoading?: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export function MovieGrid({ movies = [], isLoading = false }: MovieGridProps) {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-[var(--space-4)] md:gap-[var(--space-6)] w-full"
    >
      {isLoading ? (
        Array.from({ length: 12 }).map((_, i) => (
          <motion.div key={`skeleton-${i}`} variants={itemVariants} className="h-full">
            <MovieCardSkeleton />
          </motion.div>
        ))
      ) : (
        movies.map((movie, i) => (
          <motion.div key={movie.id} variants={itemVariants} className="h-full">
            <MovieCard movie={movie} priority={i < 8} />
          </motion.div>
        ))
      )}
    </motion.div>
  );
}
