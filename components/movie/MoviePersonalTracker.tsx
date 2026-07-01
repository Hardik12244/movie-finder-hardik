'use client';

import React, { useState } from 'react';
import { useMediaTracking } from '@/context/MediaTrackingContext';
import { StatusSelector } from '../states/StatusSelector';
import { StatusBadge } from '../states/StatusBadge';
import { CheckCircle, Repeat, Calendar, Star, FileText, Save, Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MoviePersonalTrackerProps {
  movie: {
    id: number;
    title: string;
    posterPath: string | null;
    backdropPath: string | null;
    releaseYear: string;
    rating: number;
  };
}

export function MoviePersonalTracker({ movie }: MoviePersonalTrackerProps) {
  const { getItem, updateMovieReview, markMovieRewatch, completeRewatch, setStatus, isHydrated } = useMediaTracking();
  
  const item = isHydrated ? getItem(movie.id, 'movie') : undefined;
  const isRewatching = item?.status === 'rewatching';
  
  const [personalRating, setPersonalRating] = useState<number | undefined>(item?.personalRating);
  const [watchedDate, setWatchedDate] = useState<string>(item?.watchedDate || '');
  const [personalNotes, setPersonalNotes] = useState<string>(item?.personalNotes || '');
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [finishDate, setFinishDate] = useState<string>(() => new Date().toISOString().split('T')[0]);

  React.useEffect(() => {
    if (item) {
      if (personalRating === undefined) setPersonalRating(item.personalRating);
      if (!watchedDate) setWatchedDate(item.watchedDate || '');
      if (!isEditingNotes) setPersonalNotes(item.personalNotes || '');
    }
  }, [item]); // eslint-disable-line react-hooks/exhaustive-deps

  const mediaMeta = {
    id: movie.id,
    mediaType: 'movie' as const,
    title: movie.title,
    posterPath: movie.posterPath,
    backdropPath: movie.backdropPath,
    releaseYear: movie.releaseYear,
    tmdbRating: movie.rating,
  };

  const handleMarkWatched = () => {
    const today = new Date().toISOString().split('T')[0];
    updateMovieReview(mediaMeta, { watchedDate: watchedDate || today });
  };

  const handleStartRewatch = () => {
    setStatus(mediaMeta, 'rewatching');
  };

  const handleSaveNotes = () => {
    updateMovieReview(mediaMeta, { personalNotes });
    setIsEditingNotes(false);
  };

  const handleRatingSelect = (ratingVal: number) => {
    setPersonalRating(ratingVal);
    updateMovieReview(mediaMeta, { personalRating: ratingVal });
  };

  if (!isHydrated) {
    return <div className="w-full h-48 bg-[var(--color-surface)] animate-pulse rounded-[var(--radius-lg)] my-6" />;
  }

  const formatDateDisplay = (dateStr?: string) => {
    if (!dateStr) return null;
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-6 my-8 shadow-lg">
      {/* Rewatch Mode Banner */}
      {isRewatching && (
        <div className="mb-6 p-4 rounded-[var(--radius-lg)] bg-gradient-to-r from-purple-900/40 via-purple-800/20 to-purple-900/40 border border-purple-500/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-full text-purple-300">
              <Repeat className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="font-bold text-[16px] text-purple-200">
                Rewatch Pass #{ (item?.rewatchCount || 0) + 1 } in Progress
              </h4>
              <p className="text-[13px] text-purple-300/80">
                You are currently rewatching this movie. Log your completion date below when done.
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
              <CheckCircle className="w-4 h-4" />
              <span>Finish Rewatch</span>
            </button>
          </div>
        </div>
      )}

      {item?.status === 'plan_to_rewatch' && (
        <div className="mb-6 p-4 rounded-[var(--radius-lg)] bg-gradient-to-r from-indigo-900/40 via-indigo-800/20 to-indigo-900/40 border border-indigo-500/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-full text-indigo-300">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-[16px] text-indigo-200">
                In Your Rewatch Queue
              </h4>
              <p className="text-[13px] text-indigo-300/80">
                You planned to rewatch this movie. Ready to begin your rewatch pass?
              </p>
            </div>
          </div>
          <button
            onClick={handleStartRewatch}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-[13px] rounded-[var(--radius-md)] transition-colors shadow-lg flex items-center gap-1.5 shrink-0"
          >
            <Repeat className="w-4 h-4" />
            <span>Start Rewatching</span>
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[rgba(255,255,255,0.06)]">
        <div>
          <h3 className="text-[20px] font-bold text-[var(--color-text-primary)] flex items-center gap-3">
            <span>Personal Media Journal</span>
            {item?.status && <StatusBadge status={item.status} size="md" />}
          </h3>
          <p className="text-[14px] text-[var(--color-text-secondary)] mt-1">
            Track watch status, personal score, and private notes.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <StatusSelector media={mediaMeta} />
          
          <button
            onClick={handleMarkWatched}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[13px] rounded-[var(--radius-md)] transition-colors shadow-sm"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Mark as Watched</span>
          </button>

          {/* 3-Button Rewatch System */}
          <div className="flex items-center rounded-[var(--radius-md)] bg-[#1a142b] border border-purple-500/40 p-1 gap-1 shadow-inner">
            <button
              onClick={() => setStatus(mediaMeta, 'plan_to_rewatch')}
              className={cn(
                "px-3 py-1.5 rounded-[var(--radius-sm)] text-[12px] font-bold transition-all flex items-center gap-1.5",
                item?.status === 'plan_to_rewatch'
                  ? "bg-indigo-600 text-white shadow-md scale-105"
                  : "text-indigo-300 hover:bg-indigo-500/20 hover:text-white"
              )}
              title="Add to planned rewatch queue"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Add to Rewatch</span>
            </button>

            <button
              onClick={handleStartRewatch}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-sm)] text-[12px] font-bold transition-all",
                item?.status === 'rewatching'
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
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Rewatch Done</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        {/* Rating Column */}
        <div className="flex flex-col gap-3 bg-[var(--color-surface-elevated)] p-4 rounded-[var(--radius-lg)] border border-[rgba(255,255,255,0.04)]">
          <span className="text-[13px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400" />
            Your Rating (1–10)
          </span>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
              const isSelected = item?.personalRating === num || personalRating === num;
              return (
                <button
                  key={num}
                  onClick={() => handleRatingSelect(num)}
                  className={cn(
                    'w-8 h-8 rounded-[var(--radius-sm)] font-bold text-[13px] transition-all flex items-center justify-center',
                    isSelected
                      ? 'bg-amber-400 text-black shadow-[0_0_12px_rgba(251,191,36,0.4)] scale-105'
                      : 'bg-[rgba(255,255,255,0.05)] text-[var(--color-text-secondary)] hover:bg-[rgba(255,255,255,0.1)] hover:text-white'
                  )}
                >
                  {num}
                </button>
              );
            })}
          </div>
          {item?.personalRating && (
            <span className="text-[12px] text-amber-400 font-semibold mt-1">
              ★ {item.personalRating}/10 Personal Score
            </span>
          )}
        </div>

        {/* Watch History Column */}
        <div className="flex flex-col gap-3 bg-[var(--color-surface-elevated)] p-4 rounded-[var(--radius-lg)] border border-[rgba(255,255,255,0.04)]">
          <span className="text-[13px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-400" />
            Watch History
          </span>
          <div className="flex flex-col gap-2 pt-1 text-[14px]">
            <div className="flex items-center justify-between">
              <span className="text-[var(--color-text-secondary)]">Watched:</span>
              <span className="font-semibold text-[var(--color-text-primary)]">
                {formatDateDisplay(item?.watchedDate) || 'Not logged yet'}
              </span>
            </div>
            {item?.rewatchedDate && (
              <div className="flex items-center justify-between">
                <span className="text-[var(--color-text-secondary)]">Rewatched:</span>
                <span className="font-semibold text-purple-400">
                  {formatDateDisplay(item?.rewatchedDate)}
                </span>
              </div>
            )}
            {item?.rewatchCount ? (
              <div className="flex items-center justify-between">
                <span className="text-[var(--color-text-secondary)]">Rewatch Count:</span>
                <span className="font-semibold text-purple-400">{item.rewatchCount} times</span>
              </div>
            ) : null}
          </div>
          <div className="mt-auto pt-2 flex items-center gap-2">
            <input
              type="date"
              value={watchedDate}
              onChange={(e) => {
                setWatchedDate(e.target.value);
                updateMovieReview(mediaMeta, { watchedDate: e.target.value });
              }}
              className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-sm)] px-2 py-1 text-[12px] text-[var(--color-text-primary)] outline-none flex-1"
            />
          </div>
        </div>

        {/* Personal Notes Column */}
        <div className="flex flex-col gap-3 bg-[var(--color-surface-elevated)] p-4 rounded-[var(--radius-lg)] border border-[rgba(255,255,255,0.04)]">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              Personal Notes
            </span>
            {!isEditingNotes && (
              <button
                onClick={() => setIsEditingNotes(true)}
                className="text-[12px] text-[var(--color-primary)] hover:underline font-semibold"
              >
                {item?.personalNotes ? 'Edit' : '+ Add Note'}
              </button>
            )}
          </div>
          
          {isEditingNotes ? (
            <div className="flex flex-col gap-2 pt-1 flex-1">
              <textarea
                value={personalNotes}
                onChange={(e) => setPersonalNotes(e.target.value)}
                placeholder="Write your private review or thoughts..."
                rows={3}
                className="w-full bg-[var(--color-surface)] border border-[var(--color-primary)] rounded-[var(--radius-sm)] p-2 text-[13px] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] outline-none resize-none"
              />
              <button
                onClick={handleSaveNotes}
                className="self-end flex items-center gap-1.5 px-3 py-1 bg-[var(--color-primary)] hover:bg-[#6c4bdb] text-white text-[12px] font-semibold rounded-[var(--radius-sm)] transition-colors"
              >
                <Save className="w-3 h-3" />
                <span>Save</span>
              </button>
            </div>
          ) : (
            <div className="pt-1 text-[13px] text-[var(--color-text-secondary)] italic line-clamp-4">
              {item?.personalNotes || 'No notes added yet.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
