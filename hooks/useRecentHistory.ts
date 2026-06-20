'use client';

import { useState, useEffect } from 'react';
import { Movie } from '@/lib/tmdb/types';

const RECENT_SEARCHES_KEY = 'cinefolio_recent_searches';
const RECENT_MOVIES_KEY = 'cinefolio_recent_movies';

export function useRecentHistory() {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [recentMovies, setRecentMovies] = useState<Movie[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const storedSearches = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (storedSearches) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setRecentSearches(JSON.parse(storedSearches));
      }

      const storedMovies = localStorage.getItem(RECENT_MOVIES_KEY);
      if (storedMovies) {
        setRecentMovies(JSON.parse(storedMovies));
      }
    } catch (e) {
      console.error('Failed to parse history from localStorage', e);
    }
    setIsHydrated(true);
  }, []);

  const addRecentSearch = (query: string) => {
    const q = query.trim();
    if (!q) return;

    setRecentSearches(prev => {
      // Remove duplicates and prepend
      const filtered = prev.filter(item => item.toLowerCase() !== q.toLowerCase());
      const updated = [q, ...filtered].slice(0, 5); // Keep last 5
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  };

  const addRecentMovie = (movie: Movie) => {
    setRecentMovies(prev => {
      // Remove duplicates by ID and prepend
      const filtered = prev.filter(m => m.id !== movie.id);
      const updated = [movie, ...filtered].slice(0, 10); // Keep last 10
      localStorage.setItem(RECENT_MOVIES_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return {
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
    recentMovies,
    addRecentMovie,
    isHydrated
  };
}
