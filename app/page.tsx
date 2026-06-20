import { getPopularMovies, getTrendingMovies, getTopRatedMovies, getMoviesByGenre } from '@/lib/tmdb/movies';
import { MovieGrid } from '@/components/movie/MovieGrid';
import { Pagination } from '@/components/pagination/Pagination';
import { Hero } from '@/components/home/Hero';
import { MovieCarousel } from '@/components/movie/MovieCarousel';
import { RecentlyViewedCarousel } from '@/components/movie/RecentlyViewed';
import { GenreFilter } from '@/components/home/GenreFilter';
import { Movie } from '@/lib/tmdb/types';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  const page = typeof params.page === 'string' ? parseInt(params.page, 10) : 1;
  const validPage = isNaN(page) || page < 1 ? 1 : page;
  
  const genreId = typeof params.genre === 'string' ? params.genre : undefined;

  let movies: Movie[] = [];
  let trending: Movie[] = [];
  let topRated: Movie[] = [];
  let totalPages = 0;
  let hasError = false;

  try {
    const mainGridData = genreId 
      ? await getMoviesByGenre(genreId, validPage)
      : await getPopularMovies(validPage);
      
    movies = mainGridData.results;
    totalPages = mainGridData.totalPages;

    if (validPage === 1 && !genreId) {
      const [trendingData, topRatedData] = await Promise.all([
        getTrendingMovies('week', 1),
        getTopRatedMovies(1)
      ]);
      trending = trendingData.results;
      topRated = topRatedData.results;
    }
  } catch (error) {
    console.error(error);
    hasError = true;
  }

  // The hero should be the #1 trending movie, or just the first popular movie
  const heroMovie = trending.length > 0 ? trending[0] : movies[0];

  return (
    <div className="flex flex-col w-full">
      {validPage === 1 && !hasError && heroMovie && !genreId && (
        <Hero movie={heroMovie} rank={1} isTrending={true} />
      )}
      
      {validPage === 1 && !hasError && !genreId && (
        <div className="relative z-20 -mt-[var(--space-12)] pb-[var(--space-8)]">
          <MovieCarousel title="Trending This Week" movies={trending.slice(1, 11)} />
        </div>
      )}

      {validPage === 1 && !hasError && !genreId && (
        <div className="pb-[var(--space-8)]">
          <MovieCarousel title="Top Rated Movies" movies={topRated.slice(0, 10)} />
        </div>
      )}
      
      {validPage === 1 && !hasError && !genreId && (
        <RecentlyViewedCarousel />
      )}
      
      <div id="browse-grid" className="max-w-[1440px] mx-auto w-full px-[var(--space-4)] md:px-[var(--space-6)] py-[var(--space-8)]">
        {validPage === 1 && !hasError && (
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-[var(--space-8)] gap-4">
            <h2 className="text-[28px] md:text-[32px] font-bold tracking-tight text-[var(--color-text-primary)]">
              {genreId ? 'Genre Discovery' : 'Popular Movies'}
            </h2>
            <GenreFilter currentGenre={genreId} />
          </div>
        )}
        
        {hasError ? (
          <div className="text-center py-20 text-[var(--color-error)]">
            Failed to load movies. Please check your API key or network connection.
          </div>
        ) : (
          <>
            <MovieGrid movies={movies} />
            <Pagination currentPage={validPage} totalPages={Math.min(totalPages, 500)} basePath="/" />
          </>
        )}
      </div>
    </div>
  );
}
