'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Movie } from '@/lib/tmdb/types';
import { MovieCard } from './MovieCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';

interface MovieCarouselProps {
  title: string;
  movies: Movie[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } }
};

export function MovieCarousel({ title, movies }: MovieCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = window.innerWidth > 768 ? 600 : 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="w-full py-[var(--space-6)]" ref={containerRef}>
      <div className="flex items-center justify-between mb-[var(--space-4)] px-[var(--space-4)] md:px-[var(--space-8)] lg:px-[var(--space-12)] max-w-[1440px] mx-auto">
        <h2 className="text-[20px] md:text-[24px] font-bold text-[var(--color-text-primary)] tracking-tight">
          {title}
        </h2>
        
        <div className="hidden md:flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => scroll('left')} className="w-9 h-9 p-0 rounded-full bg-[rgba(255,255,255,0.05)] border-none hover:bg-[rgba(255,255,255,0.1)]">
            <ChevronLeft className="w-5 h-5 text-[var(--color-text-secondary)]" />
          </Button>
          <Button variant="secondary" size="sm" onClick={() => scroll('right')} className="w-9 h-9 p-0 rounded-full bg-[rgba(255,255,255,0.05)] border-none hover:bg-[rgba(255,255,255,0.1)]">
            <ChevronRight className="w-5 h-5 text-[var(--color-text-secondary)]" />
          </Button>
        </div>
      </div>

      <div className="relative w-full">
        <motion.div 
          ref={scrollRef}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex overflow-x-auto gap-[var(--space-4)] md:gap-[var(--space-6)] pb-[var(--space-6)] px-[var(--space-4)] md:px-[var(--space-8)] lg:px-[var(--space-12)] scrollbar-hide snap-x snap-mandatory max-w-[1440px] mx-auto"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie) => (
            <motion.div 
              key={movie.id} 
              variants={itemVariants} 
              className="flex-shrink-0 w-[140px] md:w-[180px] lg:w-[220px] snap-start h-full"
            >
              <MovieCard movie={movie} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
