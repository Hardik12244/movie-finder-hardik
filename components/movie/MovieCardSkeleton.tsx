import React from 'react';

export function MovieCardSkeleton() {
  return (
    <div className="flex flex-col bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-1 overflow-hidden h-full">
      <div className="relative aspect-[2/3] w-full rounded-[var(--radius-card)] overflow-hidden bg-[var(--color-surface-elevated)] animate-shimmer" />
      <div className="p-[var(--space-3)] flex flex-col gap-2 mt-1">
        <div className="h-4 bg-[var(--color-surface-elevated)] rounded-[var(--radius-sm)] animate-shimmer w-3/4" />
        <div className="h-3 bg-[var(--color-surface-elevated)] rounded-[var(--radius-sm)] animate-shimmer w-1/2 mt-1" />
      </div>
    </div>
  );
}
