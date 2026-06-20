import React from 'react';

export function MovieCardSkeleton() {
  return (
    <div className="flex flex-col bg-[var(--color-surface)] border border-[rgba(255,255,255,0.03)] rounded-[var(--radius-lg)] p-[6px] h-full overflow-hidden">
      <div className="relative aspect-[2/3] w-full rounded-[var(--radius-card)] overflow-hidden bg-[var(--color-surface-elevated)] animate-shimmer border border-[rgba(255,255,255,0.02)]">
        <div className="absolute top-[var(--space-2)] left-[var(--space-2)] z-10 w-[48px] h-[22px] rounded-[var(--radius-sm)] bg-[rgba(255,255,255,0.05)]" />
        <div className="absolute top-[var(--space-2)] right-[var(--space-2)] z-10 w-[32px] h-[32px] rounded-full bg-[rgba(255,255,255,0.05)]" />
      </div>
      
      <div className="p-[var(--space-3)] flex flex-col mt-1 flex-1 justify-between">
        <div>
          <div className="h-4 bg-[var(--color-surface-elevated)] rounded-sm animate-shimmer w-[85%] mb-2" />
          <div className="h-4 bg-[var(--color-surface-elevated)] rounded-sm animate-shimmer w-[50%]" />
        </div>
        <div className="h-3 bg-[var(--color-surface-elevated)] rounded-sm animate-shimmer w-[40%] mt-4" />
      </div>
    </div>
  );
}
