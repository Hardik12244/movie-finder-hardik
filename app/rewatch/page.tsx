'use client';

import React from 'react';
import { useMediaTracking } from '@/context/MediaTrackingContext';
import { EmptyState } from '@/components/states/EmptyState';
import { Repeat, Film, Tv } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function RewatchPage() {
  const { trackItems, isHydrated } = useMediaTracking();

  if (!isHydrated) {
    return (
      <div className="max-w-[1440px] mx-auto w-full px-4 md:px-8 py-12">
        <div className="h-10 w-48 bg-[var(--color-surface)] animate-pulse rounded-[var(--radius-md)] mb-8" />
      </div>
    );
  }

  const activeRewatches = trackItems.filter(item => item.status === 'rewatching');
  const plannedRewatches = trackItems.filter(item => item.status === 'plan_to_rewatch');
  const pastRewatches = trackItems.filter(item => item.status !== 'rewatching' && item.status !== 'plan_to_rewatch' && (item.rewatchCount && item.rewatchCount > 0));

  const sortedPast = [...pastRewatches].sort((a, b) => (b.rewatchCount || 0) - (a.rewatchCount || 0));

  return (
    <div className="max-w-[1440px] mx-auto w-full px-4 md:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[rgba(255,255,255,0.06)]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <Repeat className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-[32px] font-bold tracking-tight text-[var(--color-text-primary)]">
              Rewatch List & Hall of Fame
            </h1>
            <p className="text-[14px] text-[var(--color-text-secondary)] mt-0.5">
              Titles you return to time and again ({activeRewatches.length + plannedRewatches.length + pastRewatches.length} titles)
            </p>
          </div>
        </div>
      </div>

      {activeRewatches.length === 0 && plannedRewatches.length === 0 && pastRewatches.length === 0 ? (
        <div className="py-16">
          <EmptyState
            icon={Repeat}
            title="No Rewatch History"
            description="Whenever you want to rewatch a favorite movie or show, use the 3-button rewatch system on its page!"
            action={{
              label: "Go to Browse",
              href: "/"
            }}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-12">
          {activeRewatches.length > 0 && (
            <div>
              <h2 className="text-[22px] font-bold tracking-tight text-purple-300 mb-6 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
                Currently Rewatching ({activeRewatches.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {activeRewatches.map(item => {
                  const href = `/${item.mediaType}/${item.id}`;
                  return (
                    <motion.div
                      key={`active_${item.mediaType}_${item.id}`}
                      whileHover={{ y: -6 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <Link
                        href={href}
                        className="group flex gap-4 bg-gradient-to-br from-purple-900/30 to-[var(--color-surface)] border border-purple-500/40 rounded-[var(--radius-xl)] p-3 shadow-md hover:border-purple-400 transition-all overflow-hidden h-full"
                      >
                        <div className="relative w-24 aspect-[2/3] rounded-[var(--radius-md)] overflow-hidden shrink-0 bg-[var(--color-surface-elevated)]">
                          <Image
                            src={getImageUrl(item.posterPath, 'w185')}
                            alt={item.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        <div className="flex flex-col justify-between flex-1 min-w-0 py-1">
                          <div>
                            <div className="flex items-center gap-1.5 mb-1 text-[11px] font-bold uppercase text-purple-300">
                              {item.mediaType === 'tv' ? <Tv className="w-3.5 h-3.5" /> : <Film className="w-3.5 h-3.5" />}
                              <span>{item.mediaType === 'tv' ? 'TV Show' : 'Movie'}</span>
                            </div>
                            <h3 className="font-bold text-[16px] text-[var(--color-text-primary)] group-hover:text-purple-300 transition-colors line-clamp-2">
                              {item.title}
                            </h3>
                          </div>

                          <div className="mt-3 bg-purple-500/25 border border-purple-500/50 rounded-[var(--radius-md)] px-3 py-1.5 text-center">
                            <span className="text-[12px] font-bold text-purple-200">
                              Rewatch Pass #{ (item.rewatchCount || 0) + 1 } Active →
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {plannedRewatches.length > 0 && (
            <div>
              <h2 className="text-[22px] font-bold tracking-tight text-indigo-300 mb-6 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                Planned Rewatches ({plannedRewatches.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {plannedRewatches.map(item => {
                  const href = `/${item.mediaType}/${item.id}`;
                  return (
                    <motion.div
                      key={`planned_${item.mediaType}_${item.id}`}
                      whileHover={{ y: -6 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <Link
                        href={href}
                        className="group flex gap-4 bg-[var(--color-surface)] border border-indigo-500/30 rounded-[var(--radius-xl)] p-3 shadow-md hover:border-indigo-400 transition-all overflow-hidden h-full"
                      >
                        <div className="relative w-24 aspect-[2/3] rounded-[var(--radius-md)] overflow-hidden shrink-0 bg-[var(--color-surface-elevated)]">
                          <Image
                            src={getImageUrl(item.posterPath, 'w185')}
                            alt={item.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        <div className="flex flex-col justify-between flex-1 min-w-0 py-1">
                          <div>
                            <div className="flex items-center gap-1.5 mb-1 text-[11px] font-bold uppercase text-indigo-300">
                              {item.mediaType === 'tv' ? <Tv className="w-3.5 h-3.5" /> : <Film className="w-3.5 h-3.5" />}
                              <span>{item.mediaType === 'tv' ? 'TV Show' : 'Movie'}</span>
                            </div>
                            <h3 className="font-bold text-[16px] text-[var(--color-text-primary)] group-hover:text-indigo-300 transition-colors line-clamp-2">
                              {item.title}
                            </h3>
                          </div>

                          <div className="mt-3 bg-indigo-500/15 border border-indigo-500/30 rounded-[var(--radius-md)] px-3 py-1.5 text-center">
                            <span className="text-[12px] font-bold text-indigo-300">
                              Queue for Rewatch
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {sortedPast.length > 0 && (
            <div>
              <h2 className="text-[22px] font-bold tracking-tight text-[var(--color-text-primary)] mb-6">
                Hall of Fame (Completed Rewatches)
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedPast.map(item => {
                  const href = `/${item.mediaType}/${item.id}`;
                  return (
                    <motion.div
                      key={`past_${item.mediaType}_${item.id}`}
                      whileHover={{ y: -6 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <Link
                        href={href}
                        className="group flex gap-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-3 shadow-md hover:border-purple-500/40 transition-all overflow-hidden h-full"
                      >
                        <div className="relative w-24 aspect-[2/3] rounded-[var(--radius-md)] overflow-hidden shrink-0 bg-[var(--color-surface-elevated)]">
                          <Image
                            src={getImageUrl(item.posterPath, 'w185')}
                            alt={item.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        <div className="flex flex-col justify-between flex-1 min-w-0 py-1">
                          <div>
                            <div className="flex items-center gap-1.5 mb-1 text-[11px] font-bold uppercase text-[var(--color-text-muted)]">
                              {item.mediaType === 'tv' ? <Tv className="w-3.5 h-3.5 text-purple-400" /> : <Film className="w-3.5 h-3.5 text-blue-400" />}
                              <span>{item.mediaType === 'tv' ? 'TV Show' : 'Movie'}</span>
                              <span className="opacity-50">•</span>
                              <span>{item.releaseYear}</span>
                            </div>
                            <h3 className="font-bold text-[16px] text-[var(--color-text-primary)] group-hover:text-purple-400 transition-colors line-clamp-2">
                              {item.title}
                            </h3>
                          </div>

                          <div className="mt-3 bg-purple-500/15 border border-purple-500/30 rounded-[var(--radius-md)] px-3 py-2 flex items-center justify-between">
                            <span className="text-[12px] font-semibold text-purple-300 flex items-center gap-1.5">
                              <Repeat className="w-3.5 h-3.5" />
                              Watched
                            </span>
                            <span className="text-[14px] font-extrabold text-white">
                              {item.rewatchCount || 1} {item.rewatchCount === 1 ? 'time' : 'times'}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
