export type WatchStatus = 
  | 'plan_to_watch' 
  | 'currently_watching' 
  | 'completed' 
  | 'dropped' 
  | 'on_hold' 
  | 'plan_to_rewatch'
  | 'rewatching';

export interface MediaTrackItem {
  id: number;
  mediaType: 'movie' | 'tv';
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseYear: string;
  tmdbRating: number;
  status: WatchStatus;
  updatedAt: string; // ISO timestamp
  
  // Movie specific tracking
  watchedDate?: string; // e.g., '2026-06-12'
  rewatchedDate?: string;
  personalRating?: number; // 1 to 10
  personalNotes?: string;
  
  // TV show specific tracking
  totalEpisodes?: number;
  totalSeasons?: number;
  watchedEpisodes?: string[]; // Array of keys like 'S1E1', 'S1E2'
  rewatchingEpisodes?: string[]; // Array of keys checked during active rewatch pass
  
  // Rewatch tracking
  rewatchCount: number; // default 0
}

export interface ActivityItem {
  id: string; // unique ID or timestamp string
  timestamp: string; // ISO date string
  type: 'status_change' | 'episode_watched' | 'rated' | 'note_added' | 'rewatched';
  mediaId: number;
  mediaType: 'movie' | 'tv';
  mediaTitle: string;
  posterPath: string | null;
  description: string;
}
