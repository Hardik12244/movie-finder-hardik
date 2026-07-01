export interface TMDBMovie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  overview: string;
  genre_ids: number[];
  popularity: number;
}

export interface TMDBMovieDetail extends TMDBMovie {
  runtime: number;
  genres: { id: number; name: string }[];
  tagline: string;
  status: string;
  original_language: string;
  budget: number;
  revenue: number;
  production_companies: { id: number; name: string; logo_path: string | null; origin_country: string }[];
}

export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

// Normalized app-level types
export interface Movie {
  id: number;
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseYear: string;
  rating: number;
  voteCount: number;
  overview: string;
  genreIds: number[];
  popularity: number;
  mediaType?: 'movie' | 'tv';
}

export interface MovieDetail extends Movie {
  runtime: number;
  genres: { id: number; name: string }[];
  tagline: string;
  status: string;
  originalLanguage: string;
  budget: number;
  revenue: number;
  productionCompanies: { id: number; name: string; logoPath: string | null; originCountry: string }[];
}

export interface PaginatedMovies {
  page: number;
  results: Movie[];
  totalPages: number;
  totalResults: number;
}

export interface TMDBTVShow {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
  overview: string;
  genre_ids: number[];
  popularity: number;
}

export interface TMDBSeason {
  id: number;
  name: string;
  season_number: number;
  episode_count: number;
  poster_path: string | null;
}

export interface TMDBTVShowDetail extends TMDBTVShow {
  number_of_seasons: number;
  number_of_episodes: number;
  seasons: TMDBSeason[];
  genres: { id: number; name: string }[];
  tagline: string;
  status: string;
  original_language: string;
}

export interface TMDBEpisode {
  id: number;
  name: string;
  episode_number: number;
  season_number: number;
  overview: string;
  still_path: string | null;
  air_date?: string;
}

export interface TVShow extends Movie {
  mediaType: 'tv';
}

export interface TVSeason {
  id: number;
  name: string;
  seasonNumber: number;
  episodeCount: number;
  posterPath: string | null;
}

export interface TVShowDetail extends MovieDetail {
  mediaType: 'tv';
  numberOfSeasons: number;
  numberOfEpisodes: number;
  seasons: TVSeason[];
}

export interface TVEpisode {
  id: number;
  name: string;
  episodeNumber: number;
  seasonNumber: number;
  overview: string;
  stillPath: string | null;
  airDate: string;
}

