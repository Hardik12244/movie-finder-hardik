import { getTVShowById, getSeasonEpisodes } from '@/lib/tmdb/tv';
import Image from 'next/image';
import { getImageUrl } from '@/lib/utils';
import { RatingBadge } from '@/components/movie/RatingBadge';
import { FavoriteButton } from '@/components/movie/FavoriteButton';
import { Badge } from '@/components/ui/Badge';
import { Clock, Globe, Activity, Info, Layers, Film } from 'lucide-react';
import { TVPersonalTracker } from '@/components/movie/TVPersonalTracker';
import { TVEpisode } from '@/lib/tmdb/types';

export default async function TVDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  
  let show;
  let initialEpisodes: TVEpisode[] = [];
  let hasError = false;

  try {
    show = await getTVShowById(id);
    if (show && show.seasons.length > 0) {
      initialEpisodes = await getSeasonEpisodes(id, show.seasons[0].seasonNumber);
    }
  } catch (error) {
    console.error(error);
    hasError = true;
  }

  if (hasError || !show) {
    return (
      <div className="flex-1 flex items-center justify-center py-20 text-[var(--color-error)]">
        Failed to load TV show details. Please try again.
      </div>
    );
  }

  return (
    <div className="w-full relative min-h-[calc(100vh-72px)] bg-[var(--color-bg)] flex flex-col pb-[var(--space-16)]">
      {/* Immersive Backdrop */}
      <div className="w-full h-[45vh] md:h-[60vh] lg:h-[75vh] relative">
        <Image
          src={getImageUrl(show.backdropPath, 'w1280')}
          alt={`${show.title} backdrop`}
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
                src={getImageUrl(show.posterPath, 'w500')}
                alt={show.title}
                fill
                priority
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 200px, (max-width: 1024px) 300px, 380px"
              />
            </div>
            
            <div className="mt-[var(--space-6)] hidden md:block">
              <FavoriteButton movie={show} variant="detail" />
            </div>
          </div>

          {/* Content Column */}
          <div className="flex flex-col flex-1 pt-0 md:pt-[var(--space-12)] items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-[var(--color-primary)] text-white text-[12px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-[var(--radius-sm)]">
                TV Series
              </span>
            </div>
            
            <h1 className="text-[44px] md:text-[64px] lg:text-[80px] font-bold leading-[1.05] tracking-[-0.02em] text-[var(--color-text-primary)] mb-[var(--space-2)] drop-shadow-2xl">
              {show.title}
            </h1>
            
            {show.tagline && (
              <h2 className="text-[20px] md:text-[28px] font-medium text-[var(--color-text-secondary)] italic mb-[var(--space-6)] max-w-[800px] opacity-80">
                &ldquo;{show.tagline}&rdquo;
              </h2>
            )}
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-center md:justify-start gap-[var(--space-6)] lg:gap-[var(--space-8)] mb-[var(--space-8)] w-full">
              <RatingBadge rating={show.rating} size="lg" voteCount={show.voteCount} />
              
              <div className="hidden lg:block w-[1px] h-[48px] bg-[rgba(255,255,255,0.1)]" />
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-6 text-[15px] font-medium text-[var(--color-text-secondary)]">
                <div className="flex flex-col items-center lg:items-start gap-1">
                  <span className="text-[12px] uppercase tracking-wider text-[var(--color-text-muted)] flex items-center gap-1"><Layers className="w-3 h-3" /> Seasons</span>
                  <span className="text-[var(--color-text-primary)] font-bold">{show.numberOfSeasons} Seasons</span>
                </div>
                <div className="flex flex-col items-center lg:items-start gap-1">
                  <span className="text-[12px] uppercase tracking-wider text-[var(--color-text-muted)] flex items-center gap-1"><Film className="w-3 h-3" /> Episodes</span>
                  <span className="text-[var(--color-text-primary)] font-bold">{show.numberOfEpisodes} Episodes</span>
                </div>
                <div className="flex flex-col items-center lg:items-start gap-1">
                  <span className="text-[12px] uppercase tracking-wider text-[var(--color-text-muted)] flex items-center gap-1"><Globe className="w-3 h-3" /> Language</span>
                  <span className="text-[var(--color-text-primary)] uppercase">{show.originalLanguage || 'EN'}</span>
                </div>
                <div className="flex flex-col items-center lg:items-start gap-1">
                  <span className="text-[12px] uppercase tracking-wider text-[var(--color-text-muted)] flex items-center gap-1"><Info className="w-3 h-3" /> Status</span>
                  <span className="text-[var(--color-text-primary)]">{show.status || 'Returning Series'}</span>
                </div>
              </div>
            </div>

            <div className="md:hidden w-full mb-[var(--space-8)] flex justify-center">
              <FavoriteButton movie={show} variant="detail" />
            </div>

            {show.genres && show.genres.length > 0 && (
              <div className="flex gap-2 flex-wrap justify-center md:justify-start mb-[var(--space-10)]">
                {show.genres.map(g => (
                  <Badge key={g.id} variant="genre" className="px-5 py-2.5 text-[15px] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.08)] transition-colors shadow-sm">
                    {g.name}
                  </Badge>
                ))}
              </div>
            )}

            <div className="w-full max-w-[1000px]">
              {/* Overview */}
              <div className="bg-[rgba(26,27,32,0.6)] backdrop-blur-xl border border-[rgba(255,255,255,0.05)] rounded-[var(--radius-xl)] p-[var(--space-6)] md:p-[var(--space-8)] shadow-[0_16px_40px_rgba(0,0,0,0.3)] mb-8">
                <h3 className="text-[22px] font-semibold text-[var(--color-text-primary)] mb-[var(--space-4)]">
                  Overview
                </h3>
                <p className="text-[16px] md:text-[18px] leading-[1.8] text-[rgba(245,245,247,0.85)]">
                  {show.overview || 'No overview available for this TV series.'}
                </p>
              </div>

              {/* Personal Watch Tracker Component */}
              <TVPersonalTracker show={show} initialSeasonEpisodes={initialEpisodes} />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
