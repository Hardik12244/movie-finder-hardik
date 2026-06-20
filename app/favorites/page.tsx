import React from 'react';
import { getTrendingMovies } from '@/lib/tmdb/movies';
import { FavoritesClient } from './FavoritesClient';

import { Movie } from '@/lib/tmdb/types';

export default async function FavoritesPage() {
  let trending: Movie[] = [];
  
  try {
    const data = await getTrendingMovies('week', 1);
    trending = data.results.slice(0, 10);
  } catch (error) {
    console.error('Failed to fetch trending for favorites empty state', error);
  }

  return <FavoritesClient trending={trending} />;
}
