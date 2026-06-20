import { getMovieById } from '@/lib/tmdb/movies';
import Image from 'next/image';
import { getImageUrl } from '@/lib/utils';
import { RatingBadge } from '@/components/movie/RatingBadge';
import { FavoriteButton } from '@/components/movie/FavoriteButton';
import { Badge } from '@/components/ui/Badge';

export default async function MovieDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  
  let movie;
  let hasError = false;

  try {
    movie = await getMovieById(id);
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

  return (
    <div className="w-full relative min-h-[calc(100vh-72px)] bg-[var(--color-bg)] flex flex-col pb-[var(--space-12)]">
      {/* Backdrop */}
      <div className="w-full h-[200px] md:h-[280px] lg:h-[420px] relative">
        <Image
          src={getImageUrl(movie.backdropPath, 'w1280')}
          alt={`${movie.title} backdrop`}
          fill
          priority
          className="object-cover object-top"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(8,9,12,0.2)] to-[var(--color-bg)]" />
      </div>

      <div className="max-w-[1440px] mx-auto w-full px-[var(--space-4)] lg:px-[var(--space-8)] -mt-[var(--space-8)] md:-mt-[var(--space-12)] lg:-mt-[var(--space-16)] relative z-10">
        <div className="flex flex-col md:flex-row gap-[var(--space-6)] lg:gap-[var(--space-8)]">
          {/* Poster */}
          <div className="shrink-0 mx-auto md:mx-0">
            <div className="relative w-[140px] h-[210px] md:w-[180px] md:h-[270px] lg:w-[240px] lg:h-[360px] rounded-[var(--radius-card)] overflow-hidden shadow-[var(--shadow-lg)] border-[4px] border-[var(--color-surface-elevated)]">
              <Image
                src={getImageUrl(movie.posterPath, 'w500')}
                alt={movie.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 140px, (max-width: 1024px) 180px, 240px"
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col flex-1 pt-0 md:pt-[var(--space-12)] lg:pt-[var(--space-16)] items-center md:items-start text-center md:text-left">
            <h1 className="text-[28px] md:text-[36px] font-bold leading-[1.2] tracking-[-0.015em] text-[var(--color-text-primary)] mb-[var(--space-2)]">
              {movie.title}
            </h1>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-[13px] text-[var(--color-text-secondary)] mb-[var(--space-4)]">
              <span>{movie.releaseYear || 'Unknown'}</span>
              {movie.runtime > 0 && (
                <>
                  <span>•</span>
                  <span>{movie.runtime} min</span>
                </>
              )}
              {movie.genres && movie.genres.length > 0 && (
                <>
                  <span>•</span>
                  <div className="flex gap-2 flex-wrap justify-center md:justify-start">
                    {movie.genres.map(g => (
                      <Badge key={g.id} variant="genre">{g.name}</Badge>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-end w-full max-w-[680px] gap-[var(--space-4)] mb-[var(--space-8)]">
              <RatingBadge rating={movie.rating} size="lg" voteCount={movie.voteCount} />
              
              <div className="md:ml-auto w-full sm:w-auto mt-4 md:mt-0">
                <div className="w-full sm:w-auto flex justify-center md:justify-end">
                  <FavoriteButton movie={movie} variant="detail" />
                </div>
              </div>
            </div>

            <div className="w-full max-w-[680px]">
              <h3 className="text-[20px] font-semibold text-[var(--color-text-primary)] mb-[var(--space-2)]">
                Overview
              </h3>
              <p className="text-[15px] leading-[1.6] text-[var(--color-text-primary)]">
                {movie.overview || 'No overview available for this movie.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
