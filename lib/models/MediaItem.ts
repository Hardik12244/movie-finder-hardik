import mongoose, { Schema, Document, Model } from 'mongoose';
import { WatchStatus } from '@/lib/types/mediaTracking';

export interface IMediaItem extends Document {
  userEmail: string;
  mediaId: number;
  mediaType: 'movie' | 'tv';
  title: string;
  posterPath?: string | null;
  backdropPath?: string | null;
  releaseYear: string;
  tmdbRating: number;
  status?: WatchStatus;
  personalRating?: number;
  personalNotes?: string;
  watchedDate?: string;
  rewatchedDate?: string;
  rewatchCount?: number;
  watchedEpisodes?: string[];
  rewatchingEpisodes?: string[];
  totalEpisodes?: number;
  totalSeasons?: number;
  isFavorite?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MediaItemSchema: Schema<IMediaItem> = new Schema(
  {
    userEmail: {
      type: String,
      required: true,
      index: true,
    },
    mediaId: {
      type: Number,
      required: true,
    },
    mediaType: {
      type: String,
      required: true,
      enum: ['movie', 'tv'],
    },
    title: {
      type: String,
      required: true,
    },
    posterPath: { type: String, default: null },
    backdropPath: { type: String, default: null },
    releaseYear: { type: String, default: '' },
    tmdbRating: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['plan_to_watch', 'currently_watching', 'completed', 'dropped', 'on_hold', 'plan_to_rewatch', 'rewatching'],
    },
    personalRating: { type: Number },
    personalNotes: { type: String },
    watchedDate: { type: String },
    rewatchedDate: { type: String },
    rewatchCount: { type: Number, default: 0 },
    watchedEpisodes: [{ type: String }],
    rewatchingEpisodes: [{ type: String }],
    totalEpisodes: { type: Number },
    totalSeasons: { type: Number },
    isFavorite: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Compound index for fast lookup of a specific media item for a user
MediaItemSchema.index({ userEmail: 1, mediaId: 1, mediaType: 1 }, { unique: true });

const MediaItem: Model<IMediaItem> =
  mongoose.models.MediaItem || mongoose.model<IMediaItem>('MediaItem', MediaItemSchema);

export default MediaItem;
