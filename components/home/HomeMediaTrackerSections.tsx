'use client';

import React from 'react';
import { useMediaTracking } from '@/context/MediaTrackingContext';
import { PlayCircle, Layers, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl } from '@/lib/utils';
import { motion } from 'framer-motion';

export function HomeMediaTrackerSections() {
  const { trackItems, isHydrated } = useMediaTracking();

  if (!isHydrated) return null;

  const currentlyWatching = trackItems.filter(i => i.status === 'currently_watching');

  if (currentlyWatching.length === 0) return null;

  // Find first TV show with watched episodes to calculate "Up Next"
  const activeShow = currentlyWatching.find(i => i.mediaType === 'tv');
  let upNextText = '';
  let upNextHref = '';

  if (activeShow) {
    const watched = activeShow.watchedEpisodes || [];
    let highestS = 1;
    let highestE = 0;

    watched.forEach(k => {
      const match = k.match(/^S(\d+)E(\d+)$/);
      if (match) {
        const s = parseInt(match[1], 10);
        const e = parseInt(match[2], 10);
        if (s > highestS || (s === highestS && e > highestE)) {
          highestS = s;
          highestE = e;
        }
      }
    });

    const nextS = highestS;
    const nextE = highestE + 1;
    upNextText = `${activeShow.title} — S0${nextS}E0${nextE}`;
    upNextHref = `/tv/${activeShow.id}`;
  }

  return (
    <div className="max-w-[1440px] mx-auto w-full px-4 md:px-8 pt-8 space-y-8">
      {/* Up Next Banner */}
      {activeShow && upNextText && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[rgba(124,92,252,0.2)] via-[rgba(16,185,129,0.15)] to-transparent border border-[var(--color-primary)]/40 rounded-[var(--radius-xl)] p-5 md:p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary)] flex items-center justify-center text-white shadow-lg shrink-0">
              <PlayCircle className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-accent)] bg-[var(--color-accent)]/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Up Next
                </span>
              </div>
              <h3 className="text-[20px] font-extrabold text-[var(--color-text-primary)] mt-1">
                Continue: <span className="text-purple-300">{upNextText}</span>
              </h3>
            </div>
          </div>

          <Link
            href={upNextHref}
            className="flex items-center gap-2 px-5 py-3 bg-[var(--color-primary)] hover:bg-[#6c4bdb] text-white font-bold text-[14px] rounded-[var(--radius-md)] transition-transform hover:scale-105 shadow-md shrink-0 self-stretch sm:self-auto justify-center"
          >
            <span>Resume Episode</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      )}

      {/* Continue Watching Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[24px] font-bold text-[var(--color-text-primary)] flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-green-400" />
            <span>Continue Watching</span>
          </h2>
          <span className="text-[14px] font-medium text-[var(--color-text-secondary)]">
            {currentlyWatching.length} {currentlyWatching.length === 1 ? 'item' : 'items'} in progress
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {currentlyWatching.slice(0, 4).map(item => {
            const watchedCount = (item.watchedEpisodes || []).length;
            const totalCount = item.totalEpisodes || 10;
            const pct = item.mediaType === 'tv' ? Math.min(100, Math.round((watchedCount / totalCount) * 100)) : 50;

            return (
              <motion.div
                key={`${item.mediaType}_${item.id}`}
                whileHover={{ y: -5 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <Link
                  href={`/${item.mediaType}/${item.id}`}
                  className="group flex flex-col bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-3 shadow-md hover:border-green-500/40 transition-all overflow-hidden h-full"
                >
                  <div className="flex gap-3">
                    <div className="relative w-20 aspect-[2/3] rounded-[var(--radius-md)] overflow-hidden shrink-0 bg-[var(--color-surface-elevated)]">
                      <Image
                        src={getImageUrl(item.posterPath, 'w185')}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="flex flex-col justify-between flex-1 min-w-0 py-0.5">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-green-400 bg-green-500/10 px-2 py-0.5 rounded">
                          {item.mediaType === 'tv' ? 'TV Show' : 'Movie'}
                        </span>
                        <h3 className="font-bold text-[15px] text-[var(--color-text-primary)] group-hover:text-green-400 transition-colors line-clamp-2 mt-1.5">
                          {item.title}
                        </h3>
                      </div>

                      <div className="mt-2">
                        {item.mediaType === 'tv' ? (
                          <div className="text-[12px] font-semibold text-[var(--color-text-secondary)]">
                            {watchedCount} / {totalCount} Episodes
                          </div>
                        ) : (
                          <div className="text-[12px] font-semibold text-[var(--color-text-secondary)]">
                            In Progress
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {item.mediaType === 'tv' && (
                    <div className="w-full bg-[rgba(255,255,255,0.06)] h-1.5 rounded-full overflow-hidden mt-3">
                      <div
                        className="bg-green-400 h-full transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
