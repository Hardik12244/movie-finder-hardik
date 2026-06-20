'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { Movie } from '@/lib/tmdb/types';
import { getImageUrl, GENRE_MAP } from '@/lib/utils';
import { RatingBadge } from '../movie/RatingBadge';
import { Button } from '../ui/Button';
import { Trophy, Clock } from 'lucide-react';

interface HeroProps {
  movie: Movie;
  rank?: number;
  isTrending?: boolean;
}

export function Hero({ movie, rank, isTrending }: HeroProps) {
  const { scrollY } = useScroll();
  const shouldReduceMotion = useReducedMotion();
  
  const yParallax = useTransform(scrollY, [0, 500], [0, shouldReduceMotion ? 0 : 150]);
  const opacityFade = useTransform(scrollY, [0, 300], [1, 0.3]);

  if (!movie) return null;

  const genres = movie.genreIds
    ?.map(id => GENRE_MAP[id])
    .filter(Boolean)
    .slice(0, 3) || ['Movie'];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
        delayChildren: shouldReduceMotion ? 0 : 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0 : 0.6, ease: [0.2, 0.65, 0.3, 0.9] as const }
    }
  };

  return (
    <div className="relative w-full min-h-[75vh] flex items-center overflow-hidden bg-[#08090C]">
      <motion.div 
        style={{ y: yParallax, opacity: opacityFade }}
        className="absolute inset-0 z-0"
      >
        <motion.div 
          initial={{ scale: shouldReduceMotion ? 1 : 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: shouldReduceMotion ? 0 : 1.5, ease: "easeOut" }}
          className="relative w-full h-full"
        >
          <Image
            src={getImageUrl(movie.backdropPath, 'w1280')}
            alt={movie.title}
            fill
            priority
            className="object-cover object-top"
            sizes="100vw"
          />
        </motion.div>
        
        {/* Deep Cinematic Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(8,9,12,1)] via-[rgba(8,9,12,0.85)] to-transparent w-[100%] md:w-[75%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090C] via-[rgba(8,9,12,0.3)] to-transparent top-[60%]" />
        <div className="absolute inset-0 bg-[rgba(8,9,12,0.15)]" />
      </motion.div>

      <div className="relative z-10 max-w-[1440px] mx-auto w-full px-[var(--space-4)] md:px-[var(--space-6)] lg:px-[var(--space-12)] py-[var(--space-12)]">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col w-full md:w-[70%] lg:w-[60%]"
        >
          <motion.div variants={itemVariants} className="mb-[var(--space-4)] flex items-center gap-3">
            {isTrending && rank && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-600/20 border border-amber-500/30 text-[12px] font-bold tracking-[0.08em] text-amber-500 uppercase shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <Trophy className="w-3.5 h-3.5" />
                #{rank} Trending
              </span>
            )}
            {!isTrending && (
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(124,92,252,0.15)] border border-[rgba(124,92,252,0.3)] text-[12px] font-bold tracking-[0.08em] text-[var(--color-primary)] uppercase">
                Featured
              </span>
            )}
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            className="text-[40px] md:text-[56px] lg:text-[72px] font-bold leading-[1.05] tracking-[-0.02em] text-[var(--color-text-primary)] mb-[var(--space-5)] drop-shadow-2xl"
          >
            {movie.title}
          </motion.h1>
          
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap items-center gap-[var(--space-4)] text-[14px] font-medium text-[var(--color-text-secondary)] mb-[var(--space-6)]"
          >
            <RatingBadge rating={movie.rating} voteCount={movie.voteCount} />
            <span className="opacity-50">•</span>
            <span>{movie.releaseYear || 'Unknown'}</span>
            <span className="opacity-50">•</span>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[var(--color-text-muted)]" />
              <span>{movie.popularity ? Math.round(movie.popularity) : 'Pop'} Score</span>
            </div>
            <span className="opacity-50">•</span>
            <div className="flex gap-2">
              {genres.map((genre, idx) => (
                <React.Fragment key={genre}>
                  <span>{genre}</span>
                  {idx < genres.length - 1 && <span className="opacity-50">•</span>}
                </React.Fragment>
              ))}
            </div>
          </motion.div>
          
          <motion.p 
            variants={itemVariants}
            className="text-[16px] md:text-[18px] leading-[1.6] text-[rgba(245,245,247,0.85)] mb-[var(--space-8)] max-w-[600px] drop-shadow-md line-clamp-3 md:line-clamp-4"
          >
            {movie.overview}
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-[var(--space-4)]">
            <Link href={`/movie/${movie.id}`} passHref legacyBehavior>
              <Button variant="primary" size="lg" className="w-full sm:w-auto px-[var(--space-8)] shadow-[0_4px_24px_rgba(124,92,252,0.4)] hover:shadow-[0_6px_32px_rgba(124,92,252,0.6)] group">
                <span className="relative z-10 flex items-center gap-2">
                  View Details
                </span>
                {/* Subtle glowing effect */}
                <div className="absolute inset-0 rounded-[var(--radius-md)] bg-[var(--color-primary)] opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
              </Button>
            </Link>
            <Button 
              variant="secondary" 
              size="lg" 
              className="w-full sm:w-auto bg-[rgba(255,255,255,0.08)] border-transparent hover:bg-[rgba(255,255,255,0.12)] backdrop-blur-md transition-colors duration-300"
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
              Browse Movies
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
