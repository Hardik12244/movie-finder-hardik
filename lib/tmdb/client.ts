import { TMDBMovie, Movie } from './types';
import { formatYear } from '../utils';

const BASE_URL = 'https://api.themoviedb.org/3';

export async function fetchTMDB<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  if (!apiKey) {
    throw new Error('TMDB API Key is missing. Please set NEXT_PUBLIC_TMDB_API_KEY in .env.local');
  }

  // Handle query params safely if endpoint already has ?
  const separator = endpoint.includes('?') ? '&' : '?';
  const url = `${BASE_URL}${endpoint}${separator}api_key=${apiKey}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`TMDB API Error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

export function normalizeMovie(movie: TMDBMovie): Movie {
  return {
    id: movie.id,
    title: movie.title,
    posterPath: movie.poster_path,
    backdropPath: movie.backdrop_path,
    releaseYear: formatYear(movie.release_date),
    rating: movie.vote_average,
    voteCount: movie.vote_count,
    overview: movie.overview,
    genreIds: movie.genre_ids,
    popularity: movie.popularity,
  };
}
