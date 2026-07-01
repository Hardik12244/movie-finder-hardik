'use server';

import { getSeasonEpisodes } from '@/lib/tmdb/tv';
import { TVEpisode } from '@/lib/tmdb/types';

export async function fetchSeasonEpisodesAction(tvId: number, seasonNumber: number): Promise<TVEpisode[]> {
  try {
    return await getSeasonEpisodes(tvId, seasonNumber);
  } catch (err) {
    console.error(`Failed to fetch season ${seasonNumber} for show ${tvId}`, err);
    return [];
  }
}
