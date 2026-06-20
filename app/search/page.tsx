import { searchMovies } from '@/lib/tmdb/movies';
import { MovieGrid } from '@/components/movie/MovieGrid';
import { Pagination } from '@/components/pagination/Pagination';
import { EmptyState } from '@/components/states/EmptyState';
import { SearchX } from 'lucide-react';
import { Movie } from '@/lib/tmdb/types';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  const query = typeof params.q === 'string' ? params.q : '';
  const pageStr = typeof params.page === 'string' ? params.page : '1';
  const page = parseInt(pageStr, 10);
  const validPage = isNaN(page) || page < 1 ? 1 : page;

  let movies: Movie[] = [];
  let totalPages = 0;
  let hasError = false;

  if (query) {
    try {
      const data = await searchMovies(query, validPage);
      movies = data.results;
      totalPages = data.totalPages;
    } catch (error) {
      console.error(error);
      hasError = true;
    }
  }

  return (
    <div className="max-w-[1440px] mx-auto w-full px-[var(--space-4)] md:px-[var(--space-6)] py-[var(--space-12)]">
      {query && !hasError && (
        <h2 className="text-[28px] font-bold tracking-tight mb-[var(--space-8)] text-[var(--color-text-primary)]">
          Search results for &ldquo;{query}&rdquo;
        </h2>
      )}

      {hasError ? (
        <div className="text-center py-20 text-[var(--color-error)]">
          Failed to load movies. Please try again later.
        </div>
      ) : !query ? (
        <div className="py-20 text-center text-[var(--color-text-secondary)]">
          Enter a search term above to find movies.
        </div>
      ) : movies.length === 0 ? (
        <div className="pt-[10vh]">
          <EmptyState
            icon={SearchX}
            title={`No results for "${query}"`}
            description="Try a different title, or check the spelling."
            action={{
              label: "Clear Search",
              href: "/"
            }}
          />
        </div>
      ) : (
        <>
          <MovieGrid movies={movies} />
          <Pagination currentPage={validPage} totalPages={Math.min(totalPages, 500)} basePath="/search" />
        </>
      )}
    </div>
  );
}
