import { fetchTMDB, normalizeTVShow } from './client';
import { TMDBResponse, TMDBTVShow, PaginatedMovies, TMDBTVShowDetail, TVShowDetail, TMDBEpisode, TVEpisode } from './types';

const ITEMS_PER_APP_PAGE = 12;
const ITEMS_PER_TMDB_PAGE = 20;

async function getMergedAppPage(
  fetchFn: (tmdbPage: number) => Promise<TMDBResponse<TMDBTVShow>>,
  appPage: number
): Promise<PaginatedMovies> {
  const startIndex = (appPage - 1) * ITEMS_PER_APP_PAGE;
  const endIndex = appPage * ITEMS_PER_APP_PAGE - 1;

  const startTmdbPage = Math.floor(startIndex / ITEMS_PER_TMDB_PAGE) + 1;
  const endTmdbPage = Math.floor(endIndex / ITEMS_PER_TMDB_PAGE) + 1;

  let results: TMDBTVShow[] = [];
  let totalResults = 0;

  if (startTmdbPage === endTmdbPage) {
    const data = await fetchFn(startTmdbPage);
    totalResults = data.total_results;
    results = data.results;
  } else {
    const [page1Data, page2Data] = await Promise.all([
      fetchFn(startTmdbPage),
      fetchFn(endTmdbPage).catch(() => null)
    ]);
    totalResults = page1Data.total_results;
    results = [...page1Data.results, ...(page2Data?.results || [])];
  }

  const localStartIndex = startIndex % ITEMS_PER_TMDB_PAGE;
  const slicedResults = results.slice(localStartIndex, localStartIndex + ITEMS_PER_APP_PAGE);
  const normalizedResults = slicedResults.map(normalizeTVShow);

  return {
    page: appPage,
    results: normalizedResults,
    totalPages: Math.ceil(totalResults / ITEMS_PER_APP_PAGE),
    totalResults,
  };
}

export async function getPopularTVShows(page: number = 1): Promise<PaginatedMovies> {
  return getMergedAppPage((tmdbPage) => {
    return fetchTMDB<TMDBResponse<TMDBTVShow>>(`/tv/popular?page=${tmdbPage}`);
  }, page);
}

export async function getTrendingTVShows(timeWindow: 'day' | 'week' = 'week', page: number = 1): Promise<PaginatedMovies> {
  return getMergedAppPage((tmdbPage) => {
    return fetchTMDB<TMDBResponse<TMDBTVShow>>(`/trending/tv/${timeWindow}?page=${tmdbPage}`);
  }, page);
}

export async function getTopRatedTVShows(page: number = 1): Promise<PaginatedMovies> {
  return getMergedAppPage((tmdbPage) => {
    return fetchTMDB<TMDBResponse<TMDBTVShow>>(`/tv/top_rated?page=${tmdbPage}`);
  }, page);
}

export async function getTVShowById(id: string | number): Promise<TVShowDetail> {
  const data = await fetchTMDB<TMDBTVShowDetail>(`/tv/${id}`);
  return {
    ...normalizeTVShow(data),
    runtime: 45, // typical default or estimate if not provided
    genres: data.genres || [],
    tagline: data.tagline || '',
    status: data.status || '',
    originalLanguage: data.original_language || 'en',
    budget: 0,
    revenue: 0,
    productionCompanies: [],
    mediaType: 'tv',
    numberOfSeasons: data.number_of_seasons || 1,
    numberOfEpisodes: data.number_of_episodes || 0,
    seasons: (data.seasons || []).map(s => ({
      id: s.id,
      name: s.name,
      seasonNumber: s.season_number,
      episodeCount: s.episode_count,
      posterPath: s.poster_path,
    })).filter(s => s.seasonNumber > 0), // filter out specials (season 0) usually
  };
}

export async function getSeasonEpisodes(tvId: string | number, seasonNumber: number): Promise<TVEpisode[]> {
  const data = await fetchTMDB<{ episodes: TMDBEpisode[] }>(`/tv/${tvId}/season/${seasonNumber}`);
  return (data.episodes || []).map(ep => ({
    id: ep.id,
    name: ep.name || `Episode ${ep.episode_number}`,
    episodeNumber: ep.episode_number,
    seasonNumber: ep.season_number || seasonNumber,
    overview: ep.overview || 'No description available for this episode.',
    stillPath: ep.still_path,
    airDate: ep.air_date || '',
  }));
}
