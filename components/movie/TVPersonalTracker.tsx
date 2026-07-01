'use client';

import React, { useState, useEffect } from 'react';
import { useMediaTracking } from '@/context/MediaTrackingContext';
import { StatusSelector } from '../states/StatusSelector';
import { StatusBadge } from '../states/StatusBadge';
import { TVSeason, TVEpisode } from '@/lib/tmdb/types';
import { fetchSeasonEpisodesAction } from '@/app/actions/tv';
import { CheckSquare, Square, CheckCircle2, Repeat, Loader2, Layers, Check, X, Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface TVPersonalTrackerProps {
  show: {
    id: number;
    title: string;
    posterPath: string | null;
    backdropPath: string | null;
    releaseYear: string;
    rating: number;
    numberOfSeasons: number;
    numberOfEpisodes: number;
    seasons: TVSeason[];
  };
  initialSeasonEpisodes: TVEpisode[];
}

export function TVPersonalTracker({ show, initialSeasonEpisodes }: TVPersonalTrackerProps) {
  const { getItem, toggleEpisodeWatched, markSeasonWatched, markSeasonUnwatched, markShowCompleted, markShowRewatching, completeRewatch, setStatus, isHydrated } = useMediaTracking();

  const [selectedSeasonNum, setSelectedSeasonNum] = useState<number>(
    show.seasons.length > 0 ? show.seasons[0].seasonNumber : 1
  );
  const [episodesMap, setEpisodesMap] = useState<Record<number, TVEpisode[]>>({
    [show.seasons.length > 0 ? show.seasons[0].seasonNumber : 1]: initialSeasonEpisodes,
  });
  const [loadingSeason, setLoadingSeason] = useState<boolean>(false);
  const [finishDate, setFinishDate] = useState<string>(() => new Date().toISOString().split('T')[0]);

  const mediaMeta = {
    id: show.id,
    mediaType: 'tv' as const,
    title: show.title,
    posterPath: show.posterPath,
    backdropPath: show.backdropPath,
    releaseYear: show.releaseYear,
    tmdbRating: show.rating,
    totalEpisodes: show.numberOfEpisodes,
    totalSeasons: show.numberOfSeasons,
  };

  const trackedItem = isHydrated ? getItem(show.id, 'tv') : undefined;
  const isRewatching = trackedItem?.status === 'rewatching';
  
  // In rewatch mode, checkmarks track the current rewatch pass
  const activeWatchedSet = new Set(
    isRewatching ? (trackedItem?.rewatchingEpisodes || []) : (trackedItem?.watchedEpisodes || [])
  );
  const historicalWatchedSet = new Set(trackedItem?.watchedEpisodes || []);

  const totalEpisodesCount = show.numberOfEpisodes || 1;
  const watchedEpisodesCount = activeWatchedSet.size;
  const completionPct = Math.min(100, Math.round((watchedEpisodesCount / totalEpisodesCount) * 100));

  useEffect(() => {
    if (!episodesMap[selectedSeasonNum]) {
      setLoadingSeason(true);
      fetchSeasonEpisodesAction(show.id, selectedSeasonNum)
        .then(eps => {
          setEpisodesMap(prev => ({ ...prev, [selectedSeasonNum]: eps }));
        })
        .finally(() => setLoadingSeason(false));
    }
  }, [selectedSeasonNum, show.id, episodesMap]);

  if (!isHydrated) {
    return <div className="w-full h-64 bg-[var(--color-surface)] animate-pulse rounded-[var(--radius-xl)] my-8" />;
  }

  const currentEpisodes = episodesMap[selectedSeasonNum] || [];

  const handleMarkSeasonWatched = () => {
    const keys = currentEpisodes.map(ep => `S${ep.seasonNumber}E${ep.episodeNumber}`);
    markSeasonWatched(mediaMeta, selectedSeasonNum, keys);
  };

  const handleMarkSeasonUnwatched = () => {
    const keys = currentEpisodes.map(ep => `S${ep.seasonNumber}E${ep.episodeNumber}`);
    markSeasonUnwatched(mediaMeta, selectedSeasonNum, keys);
  };

  const handleMarkEntireShowCompleted = () => {
    const allKeys: string[] = [];
    show.seasons.forEach(s => {
      for (let i = 1; i <= s.episodeCount; i++) {
        allKeys.push(`S${s.seasonNumber}E${i}`);
      }
    });
    markShowCompleted(mediaMeta, allKeys);
  };

  const isSeasonComplete = (seasonNum: number, epCount: number) => {
    if (epCount <= 0) return false;
    for (let i = 1; i <= epCount; i++) {
      if (!activeWatchedSet.has(`S${seasonNum}E${i}`)) return false;
    }
    return true;
  };

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-6 my-8 shadow-xl">
      {/* Rewatch Mode Banner */}
      {isRewatching && (
        <div className="mb-6 p-4 rounded-[var(--radius-lg)] bg-gradient-to-r from-purple-900/40 via-purple-800/20 to-purple-900/40 border border-purple-500/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-full text-purple-300">
              <Repeat className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="font-bold text-[16px] text-purple-200">
                Rewatch Pass #{ (trackedItem?.rewatchCount || 0) + 1 } in Progress
              </h4>
              <p className="text-[13px] text-purple-300/80">
                Check off episodes as you rewatch them. Your historical completion record remains preserved.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="flex flex-col">
              <label className="text-[11px] text-purple-300 font-semibold uppercase tracking-wider mb-1">Rewatch Date</label>
              <input
                type="date"
                value={finishDate}
                onChange={(e) => setFinishDate(e.target.value)}
                className="bg-[rgba(0,0,0,0.3)] border border-purple-500/30 rounded px-2.5 py-1 text-white text-[13px] outline-none focus:border-purple-400"
              />
            </div>
            <button
              onClick={() => completeRewatch(mediaMeta, finishDate)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[13px] rounded-[var(--radius-md)] transition-colors shadow-lg flex items-center gap-1.5 self-end"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Finish Rewatch</span>
            </button>
          </div>
        </div>
      )}

      {/* Top Header & Bulk Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[rgba(255,255,255,0.06)]">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-[22px] font-bold text-[var(--color-text-primary)]">
              TV Show Watch Journal
            </h3>
            {trackedItem?.status && <StatusBadge status={trackedItem.status} size="md" />}
          </div>
          <p className="text-[14px] text-[var(--color-text-secondary)] mt-1">
            Track your episode progress, mark completed seasons, and log rewatches.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <StatusSelector media={mediaMeta} />
          
          <button
            onClick={handleMarkEntireShowCompleted}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[13px] rounded-[var(--radius-md)] transition-colors shadow-sm"
            title="Mark all episodes across all seasons as watched"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Mark Show Completed</span>
          </button>

          {/* 3-Button Rewatch System */}
          <div className="flex items-center rounded-[var(--radius-md)] bg-[#1a142b] border border-purple-500/40 p-1 gap-1 shadow-inner">
            <button
              onClick={() => setStatus(mediaMeta, 'plan_to_rewatch')}
              className={cn(
                "px-3 py-1.5 rounded-[var(--radius-sm)] text-[12px] font-bold transition-all flex items-center gap-1.5",
                trackedItem?.status === 'plan_to_rewatch'
                  ? "bg-indigo-600 text-white shadow-md scale-105"
                  : "text-indigo-300 hover:bg-indigo-500/20 hover:text-white"
              )}
              title="Add to planned rewatch queue"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Add to Rewatch</span>
            </button>

            <button
              onClick={() => markShowRewatching(mediaMeta)}
              className={cn(
                "px-3 py-1.5 rounded-[var(--radius-sm)] text-[12px] font-bold transition-all flex items-center gap-1.5",
                trackedItem?.status === 'rewatching'
                  ? "bg-purple-600 text-white shadow-md scale-105"
                  : "text-purple-300 hover:bg-purple-500/20 hover:text-white"
              )}
              title="Actively rewatching right now"
            >
              <Repeat className="w-3.5 h-3.5" />
              <span>Rewatching</span>
            </button>

            <button
              onClick={() => completeRewatch(mediaMeta, finishDate)}
              className="px-3 py-1.5 rounded-[var(--radius-sm)] text-[12px] font-bold text-emerald-300 hover:bg-emerald-600 hover:text-white transition-all flex items-center gap-1.5"
              title="Finish and log rewatch"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Rewatch Done</span>
            </button>
          </div>
        </div>
      </div>

      {/* Watch Progress Banner */}
      <div className="bg-[var(--color-surface-elevated)] border border-[rgba(255,255,255,0.05)] rounded-[var(--radius-lg)] p-5 my-6">
        <div className="flex items-center justify-between text-[15px] font-semibold mb-2.5">
          <span className="text-[var(--color-text-primary)] flex items-center gap-2">
            <Layers className="w-4 h-4 text-[var(--color-primary)]" />
            {isRewatching ? 'Current Rewatch Progress' : 'Overall Watch Progress'}
          </span>
          <div className="flex items-center gap-3">
            <span className="text-[var(--color-text-secondary)]">
              <strong className="text-white text-[16px]">{watchedEpisodesCount}</strong> / {totalEpisodesCount} Episodes {isRewatching ? 'Rewatched' : 'Watched'}
            </span>
            <span className="bg-[var(--color-primary)]/20 text-[var(--color-primary)] px-2.5 py-0.5 rounded-full text-[13px] font-bold">
              {completionPct}%
            </span>
          </div>
        </div>

        <div className="w-full bg-[rgba(255,255,255,0.06)] h-3 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionPct}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={cn(
              "h-full rounded-full transition-all duration-300",
              completionPct === 100 ? "bg-emerald-500" : "bg-[var(--color-primary)]"
            )}
          />
        </div>
      </div>

      {/* Seasons Selector Tabs */}
      <div className="mt-6">
        <div className="flex items-center justify-between gap-4 flex-wrap pb-4 border-b border-[rgba(255,255,255,0.05)]">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 max-w-full no-scrollbar">
            {show.seasons.map(s => {
              const isSelected = s.seasonNumber === selectedSeasonNum;
              const completed = isSeasonComplete(s.seasonNumber, s.episodeCount);

              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedSeasonNum(s.seasonNumber)}
                  className={cn(
                    'px-4 py-2 rounded-[var(--radius-md)] text-[14px] font-semibold shrink-0 transition-all border flex items-center gap-1.5',
                    isSelected && completed
                      ? 'bg-emerald-600 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                      : isSelected
                      ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white shadow-md'
                      : completed
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25 hover:text-white'
                      : 'bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.06)] text-[var(--color-text-secondary)] hover:bg-[rgba(255,255,255,0.08)] hover:text-white'
                  )}
                >
                  {completed && <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />}
                  <span>{s.name || `Season ${s.seasonNumber}`}</span>
                </button>
              );
            })}
          </div>

          {/* Season Bulk Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkSeasonWatched}
              disabled={loadingSeason}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/30 text-[12px] font-semibold rounded-[var(--radius-sm)] transition-colors disabled:opacity-50"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Mark Season {isRewatching ? 'Rewatched' : 'Watched'}</span>
            </button>
            <button
              onClick={handleMarkSeasonUnwatched}
              disabled={loadingSeason}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/15 text-red-400 hover:bg-red-500/25 border border-red-500/30 text-[12px] font-semibold rounded-[var(--radius-sm)] transition-colors disabled:opacity-50"
            >
              <X className="w-3.5 h-3.5" />
              <span>Mark Season Unwatched</span>
            </button>
          </div>
        </div>

        {/* Episode Checklist */}
        <div className="pt-6">
          {loadingSeason ? (
            <div className="flex items-center justify-center py-16 text-[var(--color-text-muted)]">
              <Loader2 className="w-6 h-6 animate-spin mr-3 text-[var(--color-primary)]" />
              <span>Loading episode list...</span>
            </div>
          ) : currentEpisodes.length === 0 ? (
            <div className="text-center py-12 text-[var(--color-text-muted)]">
              No episodes found for this season.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentEpisodes.map(ep => {
                const epKey = `S${ep.seasonNumber}E${ep.episodeNumber}`;
                const isWatched = activeWatchedSet.has(epKey);
                const wasHistoricallyWatched = historicalWatchedSet.has(epKey);

                return (
                  <div
                    key={ep.id}
                    onClick={() => toggleEpisodeWatched(mediaMeta, epKey, ep.name)}
                    className={cn(
                      "group flex items-start gap-3.5 p-4 rounded-[var(--radius-lg)] border transition-all cursor-pointer select-none relative",
                      isWatched
                        ? "bg-[rgba(16,185,129,0.06)] border-emerald-500/30 hover:border-emerald-500/50"
                        : "bg-[var(--color-surface-elevated)] border-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.15)] hover:bg-[rgba(255,255,255,0.05)]"
                    )}
                  >
                    <div className="mt-0.5 shrink-0 transition-transform group-hover:scale-110">
                      {isWatched ? (
                        <CheckSquare className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Square className="w-5 h-5 text-[var(--color-text-muted)] group-hover:text-[var(--color-text-primary)]" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={cn(
                          "font-semibold text-[15px] truncate",
                          isWatched ? "text-emerald-300" : "text-[var(--color-text-primary)]"
                        )}>
                          E{ep.episodeNumber}. {ep.name}
                        </span>
                        {ep.airDate && (
                          <span className="text-[12px] text-[var(--color-text-muted)] shrink-0 font-medium">
                            {ep.airDate.split('-')[0]}
                          </span>
                        )}
                      </div>
                      <p className="text-[13px] text-[var(--color-text-secondary)] mt-1 line-clamp-2 leading-relaxed">
                        {ep.overview}
                      </p>
                      {isRewatching && !isWatched && wasHistoricallyWatched && (
                        <span className="inline-block mt-2 text-[11px] text-purple-300/70 font-medium bg-purple-500/10 px-2 py-0.5 rounded">
                          ✓ Previously watched in earlier pass
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
