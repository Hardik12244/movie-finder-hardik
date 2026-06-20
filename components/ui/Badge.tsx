import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'rating' | 'genre';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-[var(--radius-sm)] px-[var(--space-2)] py-[2px] text-[12px] font-semibold tracking-[0.06em] uppercase",
        {
          "bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)]": variant === 'default',
          "bg-[rgba(8,9,12,0.75)] backdrop-blur-[8px] text-[var(--color-text-primary)] normal-case tracking-normal font-normal": variant === 'rating',
          "bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)]": variant === 'genre',
        },
        className
      )}
      {...props}
    />
  );
}
