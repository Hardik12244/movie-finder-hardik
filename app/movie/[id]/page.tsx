import { getMovieById, getSimilarMovies, getRecommendedMovies } from '@/lib/tmdb/movies';
import Image from 'next/image';
import { getImageUrl } from '@/lib/utils';
import { RatingBadge } from '@/components/movie/RatingBadge';
import { FavoriteButton } from '@/components/movie/FavoriteButton';
import { Badge } from '@/components/ui/Badge';
import { Clock, Globe, Activity, Info, DollarSign, Building2, TrendingUp } from 'lucide-react';
import { MovieCarousel } from '@/components/movie/MovieCarousel';
import { RecentlyViewedTracker } from '@/components/movie/RecentlyViewed';
import { MoviePersonalTracker } from '@/components/movie/MoviePersonalTracker';
import { Movie } from '@/lib/tmdb/types';

export default async function MovieDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  
  let movie;
  let similar: Movie[] = [];
  let recommendations: Movie[] = [];
  let hasError = false;

  try {
    const [movieData, similarData, recommendedData] = await Promise.all([
      getMovieById(id),
      getSimilarMovies(id),
      getRecommendedMovies(id)
    ]);
    
    movie = movieData;
    similar = similarData.results;
    recommendations = recommendedData.results;
  } catch (error) {
    console.error(error);
    hasError = true;
  }

  if (hasError || !movie) {
    return (
      <div className="flex-1 flex items-center justify-center py-20 text-[var(--color-error)]">
        Failed to load movie details. Please try again.
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    if (!amount || amount === 0) return 'Unknown';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="w-full relative min-h-[calc(100vh-72px)] bg-[var(--color-bg)] flex flex-col pb-[var(--space-16)]">
      <RecentlyViewedTracker movie={movie} />
      {/* Immersive Backdrop */}
      <div className="w-full h-[45vh] md:h-[60vh] lg:h-[75vh] relative">
        <Image
          src={getImageUrl(movie.backdropPath, 'w1280')}
          alt={`${movie.title} backdrop`}
          fill
          priority
          className="object-cover object-top opacity-50 md:opacity-80 mix-blend-lighten"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#08090C] via-[rgba(8,9,12,0.85)] to-transparent w-[100%] md:w-[70%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090C] via-[rgba(8,9,12,0.3)] to-transparent top-[30%]" />
      </div>

      <div className="max-w-[1440px] mx-auto w-full px-[var(--space-4)] md:px-[var(--space-8)] lg:px-[var(--space-12)] -mt-[25vh] md:-mt-[40vh] lg:-mt-[50vh] relative z-10">
        <div className="flex flex-col md:flex-row gap-[var(--space-8)] lg:gap-[var(--space-16)]">
          {/* Poster Column */}
          <div className="shrink-0 mx-auto md:mx-0 w-[200px] md:w-[300px] lg:w-[380px]">
            <div className="relative aspect-[2/3] w-full rounded-[var(--radius-xl)] overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.8)] border-[4px] border-[rgba(255,255,255,0.05)] bg-[var(--color-surface-elevated)] group">
              <Image
                src={getImageUrl(movie.posterPath, 'w500')}
                alt={movie.title}
                fill
                priority
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 200px, (max-width: 1024px) 300px, 380px"
              />
            </div>
            
            <div className="mt-[var(--space-6)] hidden md:block">
              <FavoriteButton movie={movie} variant="detail" />
            </div>
          </div>

          {/* Content Column */}
          <div className="flex flex-col flex-1 pt-0 md:pt-[var(--space-12)] items-center md:items-start text-center md:text-left">
            <h1 className="text-[44px] md:text-[64px] lg:text-[80px] font-bold leading-[1.05] tracking-[-0.02em] text-[var(--color-text-primary)] mb-[var(--space-2)] drop-shadow-2xl">
              {movie.title}
            </h1>
            
            {movie.tagline && (
              <h2 className="text-[20px] md:text-[28px] font-medium text-[var(--color-text-secondary)] italic mb-[var(--space-6)] max-w-[800px] opacity-80">
                &ldquo;{movie.tagline}&rdquo;
              </h2>
            )}
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-center md:justify-start gap-[var(--space-6)] lg:gap-[var(--space-8)] mb-[var(--space-8)] w-full">
              <RatingBadge rating={movie.rating} size="lg" voteCount={movie.voteCount} />
              
              <div className="hidden lg:block w-[1px] h-[48px] bg-[rgba(255,255,255,0.1)]" />
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-6 text-[15px] font-medium text-[var(--color-text-secondary)]">
                <div className="flex flex-col items-center lg:items-start gap-1">
                  <span className="text-[12px] uppercase tracking-wider text-[var(--color-text-muted)] flex items-center gap-1"><Clock className="w-3 h-3" /> Runtime</span>
                  <span className="text-[var(--color-text-primary)]">{movie.runtime > 0 ? `${movie.runtime} min` : 'Unknown'}</span>
                </div>
                <div className="flex flex-col items-center lg:items-start gap-1">
                  <span className="text-[12px] uppercase tracking-wider text-[var(--color-text-muted)] flex items-center gap-1"><Globe className="w-3 h-3" /> Language</span>
                  <span className="text-[var(--color-text-primary)] uppercase">{movie.originalLanguage || 'EN'}</span>
                </div>
                <div className="flex flex-col items-center lg:items-start gap-1">
                  <span className="text-[12px] uppercase tracking-wider text-[var(--color-text-muted)] flex items-center gap-1"><Activity className="w-3 h-3" /> Popularity</span>
                  <span className="text-[var(--color-text-primary)]">{movie.popularity ? Math.round(movie.popularity) : 'N/A'}</span>
                </div>
                <div className="flex flex-col items-center lg:items-start gap-1">
                  <span className="text-[12px] uppercase tracking-wider text-[var(--color-text-muted)] flex items-center gap-1"><Info className="w-3 h-3" /> Status</span>
                  <span className="text-[var(--color-text-primary)]">{movie.status || 'Released'}</span>
                </div>
              </div>
            </div>

            <div className="md:hidden w-full mb-[var(--space-8)] flex justify-center">
              <FavoriteButton movie={movie} variant="detail" />
            </div>

            {movie.genres && movie.genres.length > 0 && (
              <div className="flex gap-2 flex-wrap justify-center md:justify-start mb-[var(--space-10)]">
                {movie.genres.map(g => (
                  <Badge key={g.id} variant="genre" className="px-5 py-2.5 text-[15px] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.08)] transition-colors shadow-sm">
                    {g.name}
                  </Badge>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-[var(--space-8)] w-full max-w-[1000px]">
              {/* Overview */}
              <div className="bg-[rgba(26,27,32,0.6)] backdrop-blur-xl border border-[rgba(255,255,255,0.05)] rounded-[var(--radius-xl)] p-[var(--space-6)] md:p-[var(--space-8)] shadow-[0_16px_40px_rgba(0,0,0,0.3)]">
                <h3 className="text-[22px] font-semibold text-[var(--color-text-primary)] mb-[var(--space-4)]">
                  Overview
                </h3>
                <p className="text-[16px] md:text-[18px] leading-[1.8] text-[rgba(245,245,247,0.85)]">
                  {movie.overview || 'No overview available for this movie.'}
                </p>
              </div>

              {/* Quick Stats Panel */}
              <div className="bg-[rgba(26,27,32,0.4)] backdrop-blur-xl border border-[rgba(255,255,255,0.05)] rounded-[var(--radius-xl)] p-[var(--space-6)] shadow-sm flex flex-col gap-[var(--space-6)]">
                <h3 className="text-[18px] font-semibold text-[var(--color-text-primary)] border-b border-[rgba(255,255,255,0.05)] pb-3">
                  Quick Stats
                </h3>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[rgba(255,255,255,0.05)] flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-[var(--color-success)]" />
                  </div>
                  <div>
                    <div className="text-[12px] text-[var(--color-text-muted)] uppercase tracking-wider font-semibold">Budget</div>
                    <div className="text-[15px] font-medium text-[var(--color-text-primary)]">{formatCurrency(movie.budget)}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[rgba(255,255,255,0.05)] flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-[var(--color-primary)]" />
                  </div>
                  <div>
                    <div className="text-[12px] text-[var(--color-text-muted)] uppercase tracking-wider font-semibold">Revenue</div>
                    <div className="text-[15px] font-medium text-[var(--color-text-primary)]">{formatCurrency(movie.revenue)}</div>
                  </div>
                </div>

                {movie.productionCompanies && movie.productionCompanies.length > 0 && (
                  <div className="flex items-center gap-3 pt-2">
                    <div className="w-10 h-10 rounded-full bg-[rgba(255,255,255,0.05)] flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5 text-[var(--color-text-secondary)]" />
                    </div>
                    <div>
                      <div className="text-[12px] text-[var(--color-text-muted)] uppercase tracking-wider font-semibold">Studios</div>
                      <div className="text-[14px] text-[var(--color-text-primary)] line-clamp-2">
                        {movie.productionCompanies.map(c => c.name).join(', ')}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="w-full max-w-[1000px]">
              <MoviePersonalTracker
                movie={{
                  id: movie.id,
                  title: movie.title,
                  posterPath: movie.posterPath,
                  backdropPath: movie.backdropPath,
                  releaseYear: movie.releaseYear,
                  rating: movie.rating,
                }}
              />
            </div>

          </div>
        </div>
      </div>

      {/* Discovery Carousels */}
      <div className="mt-[var(--space-16)] space-y-[var(--space-8)]">
        {recommendations.length > 0 && (
          <MovieCarousel title="Because You Viewed This" movies={recommendations.slice(0, 15)} />
        )}
        {similar.length > 0 && (
          <MovieCarousel title="Similar Movies" movies={similar.slice(0, 15)} />
        )}
      </div>
    </div>
  );
}
