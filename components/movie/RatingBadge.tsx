import React from 'react';
import { Star } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { formatRating } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface RatingBadgeProps {
  rating: number;
  className?: string;
  size?: 'sm' | 'lg';
  voteCount?: number;
}

export function RatingBadge({ rating, className, size = 'sm', voteCount }: RatingBadgeProps) {
  if (size === 'lg') {
    return (
      <div className={cn("flex flex-col gap-1", className)}>
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-[var(--color-accent)] fill-[var(--color-accent)]" />
          <span className="text-[18px] font-semibold">{formatRating(rating)}</span>
          <span className="text-[13px] text-[var(--color-text-muted)]">/10</span>
        </div>
        {voteCount !== undefined && (
          <span className="text-[13px] text-[var(--color-text-secondary)]">
            {voteCount.toLocaleString()} ratings
          </span>
        )}
      </div>
    );
  }

  return (
    <Badge variant="rating" className={cn("gap-1", className)}>
      <Star className="w-3.5 h-3.5 text-[var(--color-accent)] fill-[var(--color-accent)]" />
      <span className="font-semibold text-[13px]">{formatRating(rating)}</span>
    </Badge>
  );
}
