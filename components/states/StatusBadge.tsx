'use client';

import React from 'react';
import { WatchStatus } from '@/lib/types/mediaTracking';
import { cn } from '@/lib/utils';
import { Bookmark, Eye, CheckCircle2, XCircle, PauseCircle, Repeat } from 'lucide-react';

interface StatusBadgeProps {
  status: WatchStatus;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showIcon?: boolean;
}

const statusConfig: Record<WatchStatus, { label: string; className: string; icon: React.ElementType }> = {
  plan_to_watch: {
    label: 'Plan to Watch',
    className: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    icon: Bookmark,
  },
  currently_watching: {
    label: 'Currently Watching',
    className: 'bg-green-500/20 text-green-400 border-green-500/30',
    icon: Eye,
  },
  completed: {
    label: 'Completed',
    className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    icon: CheckCircle2,
  },
  dropped: {
    label: 'Dropped',
    className: 'bg-red-500/20 text-red-400 border-red-500/30',
    icon: XCircle,
  },
  on_hold: {
    label: 'On Hold',
    className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    icon: PauseCircle,
  },
  plan_to_rewatch: {
    label: 'Plan to Rewatch',
    className: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    icon: Bookmark,
  },
  rewatching: {
    label: 'Rewatching',
    className: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    icon: Repeat,
  },
};

export function StatusBadge({ status, size = 'sm', className, showIcon = true }: StatusBadgeProps) {
  const config = statusConfig[status];
  if (!config) return null;

  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-semibold rounded-full border backdrop-blur-md transition-all shadow-sm',
        size === 'sm' && 'text-[11px] px-2.5 py-0.5',
        size === 'md' && 'text-[13px] px-3 py-1',
        size === 'lg' && 'text-[15px] px-4 py-1.5',
        config.className,
        className
      )}
    >
      {showIcon && <Icon className={cn('shrink-0', size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-3.5 h-3.5' : 'w-4 h-4')} />}
      <span>{config.label}</span>
    </span>
  );
}
