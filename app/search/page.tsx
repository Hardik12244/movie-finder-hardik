import { searchMovies, getTrendingMovies } from '@/lib/tmdb/movies';
import { MovieGrid } from '@/components/movie/MovieGrid';
import { Pagination } from '@/components/pagination/Pagination';
import { EmptyState } from '@/components/states/EmptyState';
import { MovieCarousel } from '@/components/movie/MovieCarousel';
import { SearchX, Sparkles } from 'lucide-react';
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
  let trending: Movie[] = [];
  let totalPages = 0;

  if (query) {
    const data = await searchMovies(query, validPage);
    movies = data.results;
    totalPages = data.totalPages;
  }
  
  // Always fetch trending for empty states / initial discovery
  if (!query || movies.length === 0) {
    const trendingData = await getTrendingMovies('week', 1);
    trending = trendingData.results.slice(0, 15);
  }

  return (
    <div className="max-w-[1440px] mx-auto w-full px-4 md:px-8 py-12">
      {query && movies.length > 0 && (
        <div className="flex items-baseline gap-3 mb-[var(--space-8)]">
          <h2 className="text-[28px] font-bold tracking-tight text-[var(--color-text-primary)]">
            Search results for &ldquo;{query}&rdquo;
          </h2>
          <span className="text-[15px] font-medium text-[var(--color-text-secondary)]">
            Found matches
          </span>
        </div>
      )}

      {!query ? (
        <div className="pt-[5vh] flex flex-col items-center">
          <EmptyState
            icon={Sparkles}
            title="Discover Movies"
            description="Type in the search bar above to find specific movies, or check out what's trending right now."
          />
          <div className="w-full mt-[var(--space-12)] border-t border-[rgba(255,255,255,0.05)] pt-[var(--space-8)]">
             <MovieCarousel title="Trending Right Now" movies={trending} />
          </div>
        </div>
      ) : movies.length === 0 ? (
        <div className="pt-[5vh] flex flex-col items-center">
          <EmptyState
            icon={SearchX}
            title={`No results for "${query}"`}
            description="We couldn't find any exact matches. Try a different title, or check the spelling."
            action={{
              label: "Clear Search",
              href: "/"
            }}
          />
          <div className="w-full mt-[var(--space-12)] border-t border-[rgba(255,255,255,0.05)] pt-[var(--space-8)]">
             <h3 className="text-center text-[var(--color-text-secondary)] font-medium mb-[var(--space-6)] uppercase tracking-widest text-[13px]">
               You Might Like These Instead
             </h3>
             <MovieCarousel title="" movies={trending} />
          </div>
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
