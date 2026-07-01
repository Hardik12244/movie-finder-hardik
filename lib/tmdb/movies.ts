import { fetchTMDB, normalizeMovie, normalizeTVShow } from './client';
import { TMDBResponse, TMDBMovie, PaginatedMovies, TMDBMovieDetail, MovieDetail, TMDBTVShow, Movie } from './types';

const ITEMS_PER_APP_PAGE = 12;
const ITEMS_PER_TMDB_PAGE = 20;

async function getMergedAppPage(
  fetchFn: (tmdbPage: number) => Promise<TMDBResponse<TMDBMovie>>,
  appPage: number
): Promise<PaginatedMovies> {
  const startIndex = (appPage - 1) * ITEMS_PER_APP_PAGE;
  const endIndex = appPage * ITEMS_PER_APP_PAGE - 1;

  const startTmdbPage = Math.floor(startIndex / ITEMS_PER_TMDB_PAGE) + 1;
  const endTmdbPage = Math.floor(endIndex / ITEMS_PER_TMDB_PAGE) + 1;

  let results: TMDBMovie[] = [];
  let totalResults = 0;

  if (startTmdbPage === endTmdbPage) {
    const data = await fetchFn(startTmdbPage);
    totalResults = data.total_results;
    results = data.results;
  } else {
    // Fetch both pages in parallel
    const [page1Data, page2Data] = await Promise.all([
      fetchFn(startTmdbPage),
      fetchFn(endTmdbPage).catch(() => null) // Ignore error if second page doesn't exist
    ]);
    totalResults = page1Data.total_results; 
    results = [...page1Data.results, ...(page2Data?.results || [])];
  }

  const localStartIndex = startIndex % ITEMS_PER_TMDB_PAGE;
  const slicedResults = results.slice(localStartIndex, localStartIndex + ITEMS_PER_APP_PAGE);
  const normalizedResults = slicedResults.map(normalizeMovie);

  return {
    page: appPage,
    results: normalizedResults,
    totalPages: Math.ceil(totalResults / ITEMS_PER_APP_PAGE),
    totalResults,
  };
}

export async function getPopularMovies(page: number = 1): Promise<PaginatedMovies> {
  return getMergedAppPage((tmdbPage) => {
    return fetchTMDB<TMDBResponse<TMDBMovie>>(`/movie/popular?page=${tmdbPage}`);
  }, page);
}

export async function searchMovies(query: string, page: number = 1): Promise<PaginatedMovies> {
  if (!query.trim()) {
    return {
      page,
      results: [],
      totalPages: 0,
      totalResults: 0,
    };
  }

  const startIndex = (page - 1) * ITEMS_PER_APP_PAGE;
  const endIndex = page * ITEMS_PER_APP_PAGE - 1;

  const startTmdbPage = Math.floor(startIndex / ITEMS_PER_TMDB_PAGE) + 1;
  const endTmdbPage = Math.floor(endIndex / ITEMS_PER_TMDB_PAGE) + 1;

  const fetchMulti = (tmdbPage: number) =>
    fetchTMDB<TMDBResponse<any>>(`/search/multi?query=${encodeURIComponent(query)}&page=${tmdbPage}`);

  let results: any[] = [];
  let totalResults = 0;

  if (startTmdbPage === endTmdbPage) {
    const data = await fetchMulti(startTmdbPage);
    totalResults = data.total_results;
    results = data.results;
  } else {
    const [page1Data, page2Data] = await Promise.all([
      fetchMulti(startTmdbPage),
      fetchMulti(endTmdbPage).catch(() => null)
    ]);
    totalResults = page1Data.total_results;
    results = [...page1Data.results, ...(page2Data?.results || [])];
  }

  // Filter out people or other media types
  const filtered = results.filter(item => item.media_type === 'movie' || item.media_type === 'tv');
  const localStartIndex = startIndex % ITEMS_PER_TMDB_PAGE;
  const slicedResults = filtered.slice(localStartIndex, localStartIndex + ITEMS_PER_APP_PAGE);

  const normalizedResults: Movie[] = slicedResults.map(item => {
    if (item.media_type === 'tv' || item.first_air_date !== undefined || item.name !== undefined) {
      return normalizeTVShow(item as TMDBTVShow);
    }
    return normalizeMovie(item as TMDBMovie);
  });

  return {
    page,
    results: normalizedResults,
    totalPages: Math.ceil(totalResults / ITEMS_PER_APP_PAGE),
    totalResults,
  };
}


export async function getMovieById(id: string | number): Promise<MovieDetail> {
  const data = await fetchTMDB<TMDBMovieDetail>(`/movie/${id}`);
  return {
    ...normalizeMovie(data),
    runtime: data.runtime,
    genres: data.genres,
    tagline: data.tagline,
    status: data.status,
    originalLanguage: data.original_language,
    popularity: data.popularity,
    budget: data.budget || 0,
    revenue: data.revenue || 0,
    productionCompanies: data.production_companies?.map(c => ({
      id: c.id,
      name: c.name,
      logoPath: c.logo_path,
      originCountry: c.origin_country,
    })) || [],
  };
}

export async function getTrendingMovies(timeWindow: 'day' | 'week' = 'week', page: number = 1): Promise<PaginatedMovies> {
  return getMergedAppPage((tmdbPage) => {
    return fetchTMDB<TMDBResponse<TMDBMovie>>(`/trending/movie/${timeWindow}?page=${tmdbPage}`);
  }, page);
}

export async function getTopRatedMovies(page: number = 1): Promise<PaginatedMovies> {
  return getMergedAppPage((tmdbPage) => {
    return fetchTMDB<TMDBResponse<TMDBMovie>>(`/movie/top_rated?page=${tmdbPage}`);
  }, page);
}

export async function getSimilarMovies(id: string | number, page: number = 1): Promise<PaginatedMovies> {
  return getMergedAppPage((tmdbPage) => {
    return fetchTMDB<TMDBResponse<TMDBMovie>>(`/movie/${id}/similar?page=${tmdbPage}`);
  }, page);
}

export async function getRecommendedMovies(id: string | number, page: number = 1): Promise<PaginatedMovies> {
  return getMergedAppPage((tmdbPage) => {
    return fetchTMDB<TMDBResponse<TMDBMovie>>(`/movie/${id}/recommendations?page=${tmdbPage}`);
  }, page);
}

export async function getMoviesByGenre(genreId: string | number, page: number = 1): Promise<PaginatedMovies> {
  return getMergedAppPage((tmdbPage) => {
    return fetchTMDB<TMDBResponse<TMDBMovie>>(`/discover/movie?with_genres=${genreId}&sort_by=popularity.desc&page=${tmdbPage}`);
  }, page);
}
