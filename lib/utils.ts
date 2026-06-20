import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRating(rating: number): string {
  if (!rating) return "NR";
  return rating.toFixed(1);
}

export function formatYear(dateString: string | null | undefined): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  return date.getFullYear().toString();
}

export function getImageUrl(path: string | null, size: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'w1280' | 'original' = 'w500'): string {
  if (!path) return '/fallback-poster.svg'; // Handled via public folder
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

export function useDebounce<T>(value: T, delay: number = 400): T {
  // We'll implement this as a hook, but wait, this file is lib/utils.ts
  // It's better to put hooks in hooks/useDebounce.ts
  throw new Error("useDebounce moved to hooks/useDebounce.ts");
}
