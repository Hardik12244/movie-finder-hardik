'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Movie } from '../lib/tmdb/types';

interface FavoritesContextType {
  favorites: Movie[];
  addFavorite: (movie: Movie) => void;
  removeFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
  isHydrated: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('cinefolio_favorites');
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to parse favorites from local storage', e);
    }
    setIsHydrated(true);
  }, []);

  const persistFavorites = (newFavorites: Movie[]) => {
    setFavorites(newFavorites);
    try {
      localStorage.setItem('cinefolio_favorites', JSON.stringify(newFavorites));
    } catch (e) {
      console.error('Failed to save favorites to local storage', e);
    }
  };

  const addFavorite = useCallback((movie: Movie) => {
    setFavorites(prev => {
      if (prev.some(m => m.id === movie.id)) return prev;
      const next = [...prev, movie];
      persistFavorites(next);
      return next;
    });
  }, []);

  const removeFavorite = useCallback((id: number) => {
    setFavorites(prev => {
      const next = prev.filter(m => m.id !== id);
      persistFavorites(next);
      return next;
    });
  }, []);

  const isFavorite = useCallback((id: number) => {
    return favorites.some(m => m.id === id);
  }, [favorites]);

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite, isHydrated }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
