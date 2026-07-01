'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { MediaTrackItem, WatchStatus, ActivityItem } from '../lib/types/mediaTracking';

interface MediaMeta {
  id: number;
  mediaType: 'movie' | 'tv';
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseYear: string;
  tmdbRating: number;
  totalEpisodes?: number;
  totalSeasons?: number;
}

interface MediaTrackingContextType {
  trackItems: MediaTrackItem[];
  activities: ActivityItem[];
  getItem: (id: number, mediaType: 'movie' | 'tv') => MediaTrackItem | undefined;
  setStatus: (meta: MediaMeta, status: WatchStatus) => void;
  removeItem: (id: number, mediaType: 'movie' | 'tv') => void;
  toggleEpisodeWatched: (meta: MediaMeta, episodeKey: string, episodeTitle?: string) => void;
  markSeasonWatched: (meta: MediaMeta, seasonNumber: number, episodeKeys: string[]) => void;
  markSeasonUnwatched: (meta: MediaMeta, seasonNumber: number, episodeKeys: string[]) => void;
  markShowCompleted: (meta: MediaMeta, allEpisodeKeys: string[]) => void;
  markShowRewatching: (meta: MediaMeta) => void;
  completeRewatch: (meta: MediaMeta, finishDate?: string) => void;
  updateMovieReview: (meta: MediaMeta, updates: { watchedDate?: string; rewatchedDate?: string; personalRating?: number; personalNotes?: string }) => void;
  markMovieRewatch: (meta: MediaMeta) => void;
  isHydrated: boolean;
}

const MediaTrackingContext = createContext<MediaTrackingContextType | undefined>(undefined);

const JOURNAL_STORAGE_KEY = 'cinefolio_media_journal';
const ACTIVITY_STORAGE_KEY = 'cinefolio_activity_history';

import { useSession } from 'next-auth/react';

export function MediaTrackingProvider({ children }: { children: ReactNode }) {
  const [trackItems, setTrackItems] = useState<MediaTrackItem[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    try {
      const storedJournal = localStorage.getItem(JOURNAL_STORAGE_KEY);
      if (storedJournal) {
        setTrackItems(JSON.parse(storedJournal));
      }
      const storedActivity = localStorage.getItem(ACTIVITY_STORAGE_KEY);
      if (storedActivity) {
        setActivities(JSON.parse(storedActivity));
      }
    } catch (e) {
      console.error('Failed to parse media tracking data from localStorage', e);
    }
    setIsHydrated(true);
  }, []);

  // Cloud Database Sync when user logs in
  useEffect(() => {
    if (!session?.user?.email || !isHydrated) return;

    const syncWithCloud = async () => {
      try {
        // First push any existing local items that might not be in cloud
        if (trackItems.length > 0) {
          await fetch('/api/media', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: trackItems }),
          });
        }

        // Then fetch merged cloud database state
        const res = await fetch('/api/media');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.items) && data.items.length > 0) {
            const cloudItems: MediaTrackItem[] = data.items.map((item: any) => ({
              id: item.mediaId,
              mediaType: item.mediaType,
              title: item.title,
              posterPath: item.posterPath,
              backdropPath: item.backdropPath,
              releaseYear: item.releaseYear,
              tmdbRating: item.tmdbRating,
              status: item.status,
              personalRating: item.personalRating,
              personalNotes: item.personalNotes,
              watchedDate: item.watchedDate,
              rewatchedDate: item.rewatchedDate,
              rewatchCount: item.rewatchCount || 0,
              watchedEpisodes: item.watchedEpisodes || [],
              rewatchingEpisodes: item.rewatchingEpisodes || [],
              totalEpisodes: item.totalEpisodes,
              totalSeasons: item.totalSeasons,
              updatedAt: item.updatedAt || new Date().toISOString(),
            }));
            setTrackItems(cloudItems);
            localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(cloudItems));
          }
        }
      } catch (err) {
        console.error('Cloud database sync error:', err);
      }
    };

    syncWithCloud();
  }, [session?.user?.email, isHydrated]);

  const persistItems = useCallback((items: MediaTrackItem[]) => {
    setTrackItems(items);
    try {
      localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(items));
      // Background non-blocking sync to MongoDB
      if (session?.user?.email) {
        fetch('/api/media', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items }),
        }).catch(err => console.error('Background MongoDB save failed:', err));
      }
    } catch (e) {
      console.error('Failed to save media tracking data', e);
    }
  }, [session?.user?.email]);

  const persistActivities = useCallback((acts: ActivityItem[]) => {
    const trimmed = acts.slice(0, 100); // keep top 100 recent activities
    setActivities(trimmed);
    try {
      localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(trimmed));
    } catch (e) {
      console.error('Failed to save activity data', e);
    }
  }, []);

  const logActivity = useCallback((
    type: ActivityItem['type'],
    meta: { id: number; mediaType: 'movie' | 'tv'; title: string; posterPath: string | null },
    description: string
  ) => {
    const newAct: ActivityItem = {
      id: `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      type,
      mediaId: meta.id,
      mediaType: meta.mediaType,
      mediaTitle: meta.title,
      posterPath: meta.posterPath,
      description,
    };
    setActivities(prev => {
      const next = [newAct, ...prev];
      persistActivities(next);
      return next;
    });
  }, [persistActivities]);

  const getItem = useCallback((id: number, mediaType: 'movie' | 'tv') => {
    return trackItems.find(item => item.id === id && item.mediaType === mediaType);
  }, [trackItems]);

  const setStatus = useCallback((meta: MediaMeta, status: WatchStatus) => {
    setTrackItems(prev => {
      const existingIdx = prev.findIndex(item => item.id === meta.id && item.mediaType === meta.mediaType);
      const now = new Date().toISOString();
      let updatedList = [...prev];

      if (existingIdx >= 0) {
        const existing = updatedList[existingIdx];
        const oldStatus = existing.status;
        updatedList[existingIdx] = {
          ...existing,
          title: meta.title,
          posterPath: meta.posterPath || existing.posterPath,
          backdropPath: meta.backdropPath || existing.backdropPath,
          status,
          updatedAt: now,
          totalEpisodes: meta.totalEpisodes ?? existing.totalEpisodes,
          totalSeasons: meta.totalSeasons ?? existing.totalSeasons,
        };
        if (oldStatus !== status) {
          const statusNames: Record<WatchStatus, string> = {
            plan_to_watch: 'Plan to Watch',
            currently_watching: 'Currently Watching',
            completed: 'Completed',
            dropped: 'Dropped',
            on_hold: 'On Hold',
            plan_to_rewatch: 'Plan to Rewatch',
            rewatching: 'Rewatching',
          };
          logActivity('status_change', meta, `Marked "${meta.title}" as ${statusNames[status]}`);
        }
      } else {
        const newItem: MediaTrackItem = {
          id: meta.id,
          mediaType: meta.mediaType,
          title: meta.title,
          posterPath: meta.posterPath,
          backdropPath: meta.backdropPath,
          releaseYear: meta.releaseYear,
          tmdbRating: meta.tmdbRating,
          status,
          updatedAt: now,
          rewatchCount: status === 'rewatching' ? 1 : 0,
          totalEpisodes: meta.totalEpisodes,
          totalSeasons: meta.totalSeasons,
          watchedEpisodes: [],
        };
        updatedList.push(newItem);
        const statusNames: Record<WatchStatus, string> = {
          plan_to_watch: 'Plan to Watch',
          currently_watching: 'Currently Watching',
          completed: 'Completed',
          dropped: 'Dropped',
          on_hold: 'On Hold',
          plan_to_rewatch: 'Plan to Rewatch',
          rewatching: 'Rewatching',
        };
        logActivity('status_change', meta, `Added "${meta.title}" to ${statusNames[status]}`);
      }
      persistItems(updatedList);
      return updatedList;
    });
  }, [logActivity, persistItems]);

  const removeItem = useCallback((id: number, mediaType: 'movie' | 'tv') => {
    setTrackItems(prev => {
      const target = prev.find(item => item.id === id && item.mediaType === mediaType);
      if (target) {
        logActivity('status_change', target, `Removed "${target.title}" from media journal`);
      }
      const next = prev.filter(item => !(item.id === id && item.mediaType === mediaType));
      persistItems(next);
      return next;
    });
  }, [logActivity, persistItems]);

  const toggleEpisodeWatched = useCallback((meta: MediaMeta, episodeKey: string, episodeTitle?: string) => {
    setTrackItems(prev => {
      const existingIdx = prev.findIndex(item => item.id === meta.id && item.mediaType === meta.mediaType);
      const now = new Date().toISOString();
      let updatedList = [...prev];

      if (existingIdx >= 0) {
        const existing = updatedList[existingIdx];
        const isRewatching = existing.status === 'rewatching';
        
        const targetList = isRewatching 
          ? (existing.rewatchingEpisodes || []) 
          : (existing.watchedEpisodes || []);
        
        const isWatched = targetList.includes(episodeKey);
        const nextList = isWatched
          ? targetList.filter(k => k !== episodeKey)
          : [...targetList, episodeKey];

        let nextStatus = existing.status;
        if (!isRewatching && !isWatched && (nextStatus === 'plan_to_watch' || !nextStatus)) {
          nextStatus = 'currently_watching';
        }

        updatedList[existingIdx] = {
          ...existing,
          ...(isRewatching ? { rewatchingEpisodes: nextList } : { watchedEpisodes: nextList }),
          status: nextStatus,
          updatedAt: now,
          totalEpisodes: meta.totalEpisodes ?? existing.totalEpisodes,
        };

        if (!isWatched) {
          logActivity('episode_watched', meta, `${isRewatching ? 'Rewatched' : 'Watched'} ${meta.title} ${episodeKey}${episodeTitle ? ` - ${episodeTitle}` : ''}`);
        }
      } else {
        const newItem: MediaTrackItem = {
          id: meta.id,
          mediaType: meta.mediaType,
          title: meta.title,
          posterPath: meta.posterPath,
          backdropPath: meta.backdropPath,
          releaseYear: meta.releaseYear,
          tmdbRating: meta.tmdbRating,
          status: 'currently_watching',
          updatedAt: now,
          rewatchCount: 0,
          totalEpisodes: meta.totalEpisodes,
          totalSeasons: meta.totalSeasons,
          watchedEpisodes: [episodeKey],
        };
        updatedList.push(newItem);
        logActivity('episode_watched', meta, `Watched ${meta.title} ${episodeKey}${episodeTitle ? ` - ${episodeTitle}` : ''}`);
      }

      persistItems(updatedList);
      return updatedList;
    });
  }, [logActivity, persistItems]);

  const markSeasonWatched = useCallback((meta: MediaMeta, seasonNumber: number, episodeKeys: string[]) => {
    setTrackItems(prev => {
      const existingIdx = prev.findIndex(item => item.id === meta.id && item.mediaType === meta.mediaType);
      const now = new Date().toISOString();
      let updatedList = [...prev];

      if (existingIdx >= 0) {
        const existing = updatedList[existingIdx];
        const isRewatching = existing.status === 'rewatching';
        const currentSet = new Set(isRewatching ? (existing.rewatchingEpisodes || []) : (existing.watchedEpisodes || []));
        episodeKeys.forEach(k => currentSet.add(k));

        let nextStatus = existing.status;
        if (!isRewatching && nextStatus === 'plan_to_watch') {
          nextStatus = 'currently_watching';
        }

        updatedList[existingIdx] = {
          ...existing,
          ...(isRewatching ? { rewatchingEpisodes: Array.from(currentSet) } : { watchedEpisodes: Array.from(currentSet) }),
          status: nextStatus,
          updatedAt: now,
          totalEpisodes: meta.totalEpisodes ?? existing.totalEpisodes,
        };
      } else {
        const newItem: MediaTrackItem = {
          id: meta.id,
          mediaType: meta.mediaType,
          title: meta.title,
          posterPath: meta.posterPath,
          backdropPath: meta.backdropPath,
          releaseYear: meta.releaseYear,
          tmdbRating: meta.tmdbRating,
          status: 'currently_watching',
          updatedAt: now,
          rewatchCount: 0,
          totalEpisodes: meta.totalEpisodes,
          totalSeasons: meta.totalSeasons,
          watchedEpisodes: [...episodeKeys],
        };
        updatedList.push(newItem);
      }

      logActivity('episode_watched', meta, `Marked Season ${seasonNumber} of "${meta.title}" as watched`);
      persistItems(updatedList);
      return updatedList;
    });
  }, [logActivity, persistItems]);

  const markSeasonUnwatched = useCallback((meta: MediaMeta, seasonNumber: number, episodeKeys: string[]) => {
    setTrackItems(prev => {
      const existingIdx = prev.findIndex(item => item.id === meta.id && item.mediaType === meta.mediaType);
      if (existingIdx < 0) return prev;

      const updatedList = [...prev];
      const existing = updatedList[existingIdx];
      const isRewatching = existing.status === 'rewatching';
      const keysToRemove = new Set(episodeKeys);
      const targetList = isRewatching ? (existing.rewatchingEpisodes || []) : (existing.watchedEpisodes || []);
      const nextList = targetList.filter(k => !keysToRemove.has(k));

      updatedList[existingIdx] = {
        ...existing,
        ...(isRewatching ? { rewatchingEpisodes: nextList } : { watchedEpisodes: nextList }),
        updatedAt: new Date().toISOString(),
      };

      persistItems(updatedList);
      return updatedList;
    });
  }, [persistItems]);

  const markShowCompleted = useCallback((meta: MediaMeta, allEpisodeKeys: string[]) => {
    setTrackItems(prev => {
      const existingIdx = prev.findIndex(item => item.id === meta.id && item.mediaType === meta.mediaType);
      const now = new Date().toISOString();
      let updatedList = [...prev];

      if (existingIdx >= 0) {
        const existing = updatedList[existingIdx];
        const currentWatched = new Set(existing.watchedEpisodes || []);
        allEpisodeKeys.forEach(k => currentWatched.add(k));

        updatedList[existingIdx] = {
          ...existing,
          watchedEpisodes: Array.from(currentWatched),
          status: 'completed',
          updatedAt: now,
          totalEpisodes: meta.totalEpisodes ?? existing.totalEpisodes,
        };
      } else {
        const newItem: MediaTrackItem = {
          id: meta.id,
          mediaType: meta.mediaType,
          title: meta.title,
          posterPath: meta.posterPath,
          backdropPath: meta.backdropPath,
          releaseYear: meta.releaseYear,
          tmdbRating: meta.tmdbRating,
          status: 'completed',
          updatedAt: now,
          rewatchCount: 0,
          totalEpisodes: meta.totalEpisodes,
          totalSeasons: meta.totalSeasons,
          watchedEpisodes: [...allEpisodeKeys],
        };
        updatedList.push(newItem);
      }

      logActivity('status_change', meta, `Completed all episodes of "${meta.title}"`);
      persistItems(updatedList);
      return updatedList;
    });
  }, [logActivity, persistItems]);

  const markShowRewatching = useCallback((meta: MediaMeta) => {
    setTrackItems(prev => {
      const existingIdx = prev.findIndex(item => item.id === meta.id && item.mediaType === meta.mediaType);
      const now = new Date().toISOString();
      let updatedList = [...prev];

      if (existingIdx >= 0) {
        const existing = updatedList[existingIdx];
        updatedList[existingIdx] = {
          ...existing,
          status: 'rewatching',
          rewatchingEpisodes: [],
          updatedAt: now,
        };
      } else {
        const newItem: MediaTrackItem = {
          id: meta.id,
          mediaType: meta.mediaType,
          title: meta.title,
          posterPath: meta.posterPath,
          backdropPath: meta.backdropPath,
          releaseYear: meta.releaseYear,
          tmdbRating: meta.tmdbRating,
          status: 'rewatching',
          updatedAt: now,
          rewatchCount: 0,
          totalEpisodes: meta.totalEpisodes,
          totalSeasons: meta.totalSeasons,
          watchedEpisodes: [],
          rewatchingEpisodes: [],
        };
        updatedList.push(newItem);
      }

      logActivity('rewatched', meta, `Added "${meta.title}" to Rewatch list`);
      persistItems(updatedList);
      return updatedList;
    });
  }, [logActivity, persistItems]);

  const completeRewatch = useCallback((meta: MediaMeta, finishDate?: string) => {
    setTrackItems(prev => {
      const existingIdx = prev.findIndex(item => item.id === meta.id && item.mediaType === meta.mediaType);
      const now = new Date().toISOString();
      const todayStr = finishDate || now.split('T')[0];
      let updatedList = [...prev];

      if (existingIdx >= 0) {
        const existing = updatedList[existingIdx];
        const mergedWatched = new Set(existing.watchedEpisodes || []);
        (existing.rewatchingEpisodes || []).forEach(k => mergedWatched.add(k));

        updatedList[existingIdx] = {
          ...existing,
          status: 'completed',
          rewatchCount: (existing.rewatchCount || 0) + 1,
          rewatchedDate: todayStr,
          watchedEpisodes: Array.from(mergedWatched),
          rewatchingEpisodes: [],
          updatedAt: now,
        };
      } else {
        const newItem: MediaTrackItem = {
          id: meta.id,
          mediaType: meta.mediaType,
          title: meta.title,
          posterPath: meta.posterPath,
          backdropPath: meta.backdropPath,
          releaseYear: meta.releaseYear,
          tmdbRating: meta.tmdbRating,
          status: 'completed',
          updatedAt: now,
          rewatchCount: 1,
          rewatchedDate: todayStr,
          watchedEpisodes: [],
          rewatchingEpisodes: [],
        };
        updatedList.push(newItem);
      }

      logActivity('rewatched', meta, `Completed rewatch of "${meta.title}"`);
      persistItems(updatedList);
      return updatedList;
    });
  }, [logActivity, persistItems]);

  const updateMovieReview = useCallback((meta: MediaMeta, updates: { watchedDate?: string; rewatchedDate?: string; personalRating?: number; personalNotes?: string }) => {
    setTrackItems(prev => {
      const existingIdx = prev.findIndex(item => item.id === meta.id && item.mediaType === meta.mediaType);
      const now = new Date().toISOString();
      let updatedList = [...prev];

      if (existingIdx >= 0) {
        const existing = updatedList[existingIdx];
        updatedList[existingIdx] = {
          ...existing,
          ...updates,
          updatedAt: now,
        };
      } else {
        const newItem: MediaTrackItem = {
          id: meta.id,
          mediaType: meta.mediaType,
          title: meta.title,
          posterPath: meta.posterPath,
          backdropPath: meta.backdropPath,
          releaseYear: meta.releaseYear,
          tmdbRating: meta.tmdbRating,
          status: 'completed',
          updatedAt: now,
          rewatchCount: 0,
          ...updates,
        };
        updatedList.push(newItem);
      }

      if (updates.personalRating !== undefined) {
        logActivity('rated', meta, `Rated "${meta.title}" ${updates.personalRating}/10`);
      } else if (updates.personalNotes !== undefined) {
        logActivity('note_added', meta, `Updated personal notes for "${meta.title}"`);
      } else if (updates.watchedDate) {
        logActivity('status_change', meta, `Logged watch date (${updates.watchedDate}) for "${meta.title}"`);
      }

      persistItems(updatedList);
      return updatedList;
    });
  }, [logActivity, persistItems]);

  const markMovieRewatch = useCallback((meta: MediaMeta) => {
    setTrackItems(prev => {
      const existingIdx = prev.findIndex(item => item.id === meta.id && item.mediaType === meta.mediaType);
      const now = new Date().toISOString();
      let updatedList = [...prev];

      const todayStr = new Date().toISOString().split('T')[0];

      if (existingIdx >= 0) {
        const existing = updatedList[existingIdx];
        updatedList[existingIdx] = {
          ...existing,
          status: 'completed',
          rewatchCount: (existing.rewatchCount || 0) + 1,
          rewatchedDate: todayStr,
          updatedAt: now,
        };
      } else {
        const newItem: MediaTrackItem = {
          id: meta.id,
          mediaType: meta.mediaType,
          title: meta.title,
          posterPath: meta.posterPath,
          backdropPath: meta.backdropPath,
          releaseYear: meta.releaseYear,
          tmdbRating: meta.tmdbRating,
          status: 'completed',
          updatedAt: now,
          rewatchCount: 1,
          rewatchedDate: todayStr,
        };
        updatedList.push(newItem);
      }

      logActivity('rewatched', meta, `Marked rewatch for "${meta.title}"`);
      persistItems(updatedList);
      return updatedList;
    });
  }, [logActivity, persistItems]);

  return (
    <MediaTrackingContext.Provider
      value={{
        trackItems,
        activities,
        getItem,
        setStatus,
        removeItem,
        toggleEpisodeWatched,
        markSeasonWatched,
        markSeasonUnwatched,
        markShowCompleted,
        markShowRewatching,
        completeRewatch,
        updateMovieReview,
        markMovieRewatch,
        isHydrated,
      }}
    >
      {children}
    </MediaTrackingContext.Provider>
  );
}

export function useMediaTracking() {
  const context = useContext(MediaTrackingContext);
  if (context === undefined) {
    throw new Error('useMediaTracking must be used within a MediaTrackingProvider');
  }
  return context;
}
