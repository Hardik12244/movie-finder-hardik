import React from 'react';
import { cn } from '@/lib/utils';

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-shimmer rounded-[var(--radius-sm)] bg-[var(--color-surface-elevated)]", className)}
      {...props}
    />
  );
}
