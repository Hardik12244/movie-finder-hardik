'use client';

import React from 'react';
import { useMediaTracking } from '@/context/MediaTrackingContext';
import { Film, Tv, PlayCircle, Eye, CheckCircle2, XCircle, Repeat, Clock, Activity, Award, Calendar } from 'lucide-react';
import Image from 'next/image';
import { getImageUrl } from '@/lib/utils';
import Link from 'next/link';

export default function StatsPage() {
  const { trackItems, activities, isHydrated } = useMediaTracking();

  if (!isHydrated) {
    return (
      <div className="max-w-[1440px] mx-auto w-full px-4 md:px-8 py-12">
        <div className="h-10 w-48 bg-[var(--color-surface)] animate-pulse rounded-[var(--radius-md)] mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="h-28 bg-[var(--color-surface)] animate-pulse rounded-[var(--radius-xl)]" />
          ))}
        </div>
      </div>
    );
  }

  const totalMoviesWatched = trackItems.filter(i => i.mediaType === 'movie' && (i.status === 'completed' || i.watchedDate)).length;
  const totalShowsWatched = trackItems.filter(i => i.mediaType === 'tv' && i.status === 'completed').length;
  
  let totalEpisodesWatched = 0;
  trackItems.filter(i => i.mediaType === 'tv').forEach(i => {
    totalEpisodesWatched += (i.watchedEpisodes || []).length;
  });

  const currentlyWatchingCount = trackItems.filter(i => i.status === 'currently_watching').length;
  const completedCount = trackItems.filter(i => i.status === 'completed').length;
  const droppedCount = trackItems.filter(i => i.status === 'dropped').length;
  
  let totalRewatchCount = 0;
  trackItems.forEach(i => {
    if (i.rewatchCount) totalRewatchCount += i.rewatchCount;
  });

  // Watch Time Estimate: 120 mins per movie, 45 mins per episode
  const totalMinutes = (totalMoviesWatched * 120) + (totalEpisodesWatched * 45);
  const hours = Math.floor(totalMinutes / 60);
  const days = (hours / 24).toFixed(1);

  // Format date grouping for timeline
  const formatTimeAgo = (isoStr: string) => {
    try {
      const date = new Date(isoStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      if (diffHours < 24) return 'Today';
      if (diffHours < 48) return 'Yesterday';
      const daysAgo = Math.floor(diffHours / 24);
      return `${daysAgo} days ago`;
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto w-full px-4 md:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[rgba(255,255,255,0.06)]">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-purple-600 text-white shadow-lg">
            <Activity className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-[34px] font-extrabold tracking-tight text-[var(--color-text-primary)]">
              Stats Dashboard
            </h1>
            <p className="text-[14px] text-[var(--color-text-secondary)] mt-0.5">
              Personal analytics, time estimates, and media activity history
            </p>
          </div>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-5 shadow-lg relative overflow-hidden group hover:border-[var(--color-primary)] transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Movies Finished</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400"><Film className="w-5 h-5" /></div>
          </div>
          <div className="text-[32px] font-extrabold text-[var(--color-text-primary)]">{totalMoviesWatched}</div>
          <p className="text-[12px] text-[var(--color-text-secondary)] mt-1">Total feature films</p>
        </div>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-5 shadow-lg relative overflow-hidden group hover:border-[var(--color-primary)] transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Shows Completed</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400"><Tv className="w-5 h-5" /></div>
          </div>
          <div className="text-[32px] font-extrabold text-[var(--color-text-primary)]">{totalShowsWatched}</div>
          <p className="text-[12px] text-[var(--color-text-secondary)] mt-1">Entire TV series finished</p>
        </div>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-5 shadow-lg relative overflow-hidden group hover:border-[var(--color-primary)] transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Episodes Watched</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400"><PlayCircle className="w-5 h-5" /></div>
          </div>
          <div className="text-[32px] font-extrabold text-[var(--color-text-primary)]">{totalEpisodesWatched}</div>
          <p className="text-[12px] text-[var(--color-text-secondary)] mt-1">Individual TV episodes</p>
        </div>

        <div className="bg-gradient-to-br from-[rgba(124,92,252,0.15)] to-[rgba(168,85,247,0.15)] border border-[var(--color-primary)]/40 rounded-[var(--radius-xl)] p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-bold uppercase tracking-wider text-purple-300">Watch Time Est.</span>
            <div className="p-2 rounded-lg bg-[var(--color-primary)]/20 text-purple-300"><Clock className="w-5 h-5" /></div>
          </div>
          <div className="text-[32px] font-extrabold text-white">{hours} hrs</div>
          <p className="text-[12px] text-purple-300/80 mt-1">Approx. {days} full days of cinema</p>
        </div>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Currently Watching</span>
            <div className="p-2 rounded-lg bg-green-500/10 text-green-400"><Eye className="w-5 h-5" /></div>
          </div>
          <div className="text-[28px] font-extrabold text-[var(--color-text-primary)]">{currentlyWatchingCount}</div>
        </div>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Completed Total</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400"><CheckCircle2 className="w-5 h-5" /></div>
          </div>
          <div className="text-[28px] font-extrabold text-[var(--color-text-primary)]">{completedCount}</div>
        </div>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Rewatch Counter</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400"><Repeat className="w-5 h-5" /></div>
          </div>
          <div className="text-[28px] font-extrabold text-[var(--color-text-primary)]">{totalRewatchCount}</div>
        </div>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Dropped Content</span>
            <div className="p-2 rounded-lg bg-red-500/10 text-red-400"><XCircle className="w-5 h-5" /></div>
          </div>
          <div className="text-[28px] font-extrabold text-[var(--color-text-primary)]">{droppedCount}</div>
        </div>
      </div>

      {/* Activity Timeline Section */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-2xl)] p-6 md:p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6 text-amber-400" />
            <h2 className="text-[24px] font-bold text-[var(--color-text-primary)]">
              Activity Timeline
            </h2>
          </div>
          <span className="text-[13px] text-[var(--color-text-secondary)] font-medium">
            Chronological journal events
          </span>
        </div>

        {activities.length === 0 ? (
          <div className="text-center py-12 text-[var(--color-text-muted)]">
            No activity recorded yet. Start watching episodes or changing status on titles to build your personal timeline!
          </div>
        ) : (
          <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-[rgba(255,255,255,0.1)]">
            {activities.map((act) => (
              <div key={act.id} className="relative flex items-start gap-4">
                <div className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full bg-[var(--color-primary)] ring-4 ring-[var(--color-surface)]" />

                <Link
                  href={`/${act.mediaType}/${act.mediaId}`}
                  className="shrink-0 w-12 aspect-[2/3] relative rounded-[var(--radius-sm)] overflow-hidden bg-[var(--color-surface-elevated)] border border-[rgba(255,255,255,0.1)] hover:scale-105 transition-transform"
                >
                  <Image
                    src={getImageUrl(act.posterPath, 'w92')}
                    alt={act.mediaTitle}
                    fill
                    className="object-cover"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-[12px] font-bold text-[var(--color-primary)] uppercase tracking-wider">
                      {formatTimeAgo(act.timestamp)}
                    </span>
                    <span className="text-[11px] text-[var(--color-text-muted)] flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[15px] font-semibold text-[var(--color-text-primary)] mt-0.5 leading-snug">
                    {act.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
