'use client';

import React, { useState } from 'react';
import { WatchStatus } from '@/lib/types/mediaTracking';
import { useMediaTracking } from '@/context/MediaTrackingContext';
import { Bookmark, Eye, CheckCircle2, XCircle, PauseCircle, Repeat, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface StatusSelectorProps {
  media: {
    id: number;
    mediaType: 'movie' | 'tv';
    title: string;
    posterPath: string | null;
    backdropPath: string | null;
    releaseYear: string;
    tmdbRating: number;
    totalEpisodes?: number;
    totalSeasons?: number;
  };
}

const statuses: { value: WatchStatus; label: string; icon: React.ElementType; color: string }[] = [
  { value: 'plan_to_watch', label: 'Plan to Watch', icon: Bookmark, color: 'text-blue-400' },
  { value: 'currently_watching', label: 'Currently Watching', icon: Eye, color: 'text-green-400' },
  { value: 'completed', label: 'Completed', icon: CheckCircle2, color: 'text-emerald-400' },
  { value: 'dropped', label: 'Dropped', icon: XCircle, color: 'text-red-400' },
  { value: 'on_hold', label: 'On Hold', icon: PauseCircle, color: 'text-yellow-400' },
  { value: 'plan_to_rewatch', label: 'Plan to Rewatch', icon: Bookmark, color: 'text-indigo-400' },
  { value: 'rewatching', label: 'Rewatching', icon: Repeat, color: 'text-purple-400' },
];

export function StatusSelector({ media }: StatusSelectorProps) {
  const { getItem, setStatus, removeItem, isHydrated } = useMediaTracking();
  const [isOpen, setIsOpen] = useState(false);

  if (!isHydrated) {
    return <div className="h-10 w-44 bg-[var(--color-surface)] animate-pulse rounded-[var(--radius-md)]" />;
  }

  const currentItem = getItem(media.id, media.mediaType);
  const currentStatusObj = statuses.find(s => s.value === currentItem?.status);

  return (
    <div className="relative inline-block z-30">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-md)] font-semibold text-[14px] transition-all shadow-md border',
          currentStatusObj
            ? 'bg-[var(--color-surface-elevated)] border-[var(--color-primary)] text-white hover:bg-[var(--color-surface)]'
            : 'bg-[var(--color-primary)] border-transparent text-white hover:bg-[#6c4bdb]'
        )}
      >
        {currentStatusObj ? (
          <>
            <currentStatusObj.icon className={cn('w-4 h-4', currentStatusObj.color)} />
            <span>{currentStatusObj.label}</span>
          </>
        ) : (
          <>
            <Bookmark className="w-4 h-4" />
            <span>Add to List</span>
          </>
        )}
        <ChevronDown className={cn('w-4 h-4 transition-transform ml-1', isOpen && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -5 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 mt-2 w-56 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-[var(--radius-md)] shadow-2xl overflow-hidden z-50 py-1"
            >
              <div className="px-3 py-1.5 text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider border-b border-[rgba(255,255,255,0.05)]">
                Watch Status
              </div>
              {statuses.map(s => {
                const isSelected = currentItem?.status === s.value;
                return (
                  <button
                    key={s.value}
                    onClick={() => {
                      setStatus(media, s.value);
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-left text-[14px] font-medium text-[var(--color-text-primary)] hover:bg-[rgba(255,255,255,0.06)] transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <s.icon className={cn('w-4 h-4', s.color)} />
                      <span>{s.label}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[var(--color-primary)]" />}
                  </button>
                );
              })}

              {currentItem && (
                <div className="border-t border-[rgba(255,255,255,0.05)] mt-1 pt-1">
                  <button
                    onClick={() => {
                      removeItem(media.id, media.mediaType);
                      setIsOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left text-[13px] font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    Remove from tracking
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
