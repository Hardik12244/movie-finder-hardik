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
}

export interface TMDBMovieDetail extends TMDBMovie {
  runtime: number;
  genres: { id: number; name: string }[];
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
}

export interface MovieDetail extends Movie {
  runtime: number;
  genres: { id: number; name: string }[];
}

export interface PaginatedMovies {
  page: number;
  results: Movie[];
  totalPages: number;
  totalResults: number;
}
