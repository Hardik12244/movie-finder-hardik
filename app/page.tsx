import { getPopularMovies } from '@/lib/tmdb/movies';
import { MovieGrid } from '@/components/movie/MovieGrid';
import { Pagination } from '@/components/pagination/Pagination';
import { Hero } from '@/components/home/Hero';
import { Movie } from '@/lib/tmdb/types';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  const page = typeof params.page === 'string' ? parseInt(params.page, 10) : 1;
  const validPage = isNaN(page) || page < 1 ? 1 : page;

  let movies: Movie[] = [];
  let totalPages = 0;
  let hasError = false;

  try {
    const data = await getPopularMovies(validPage);
    movies = data.results;
    totalPages = data.totalPages;
  } catch (error) {
    console.error(error);
    hasError = true;
  }

  return (
    <div className="flex flex-col w-full">
      {validPage === 1 && !hasError && movies.length > 0 && (
        <Hero movie={movies[0]} />
      )}
      
      <div id="browse-grid" className="max-w-[1440px] mx-auto w-full px-[var(--space-4)] md:px-[var(--space-6)] py-[var(--space-12)]">
        {validPage === 1 && !hasError && (
          <h2 className="text-[28px] font-bold tracking-tight mb-[var(--space-8)] text-[var(--color-text-primary)]">
            Popular Movies
          </h2>
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
