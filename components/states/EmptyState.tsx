import React from 'react';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/Button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-[var(--space-16)] px-[var(--space-4)] max-w-[500px] mx-auto animate-in fade-in zoom-in-95 duration-500 ease-[var(--ease-standard)]">
      <div className="relative mb-[var(--space-6)]">
        <div className="absolute inset-0 bg-[var(--color-primary)] opacity-10 blur-xl rounded-full" />
        <div className="w-20 h-20 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] rounded-[var(--radius-xl)] flex items-center justify-center relative shadow-inner">
          <Icon className="w-10 h-10 text-[var(--color-primary)] opacity-80 stroke-[1.5]" />
        </div>
      </div>
      
      <h3 className="text-[24px] font-bold mb-3 text-[var(--color-text-primary)] tracking-tight">
        {title}
      </h3>
      <p className="text-[16px] text-[var(--color-text-secondary)] mb-[var(--space-8)] leading-relaxed max-w-[400px]">
        {description}
      </p>
      
      {action && (
        action.href ? (
          <Link href={action.href} passHref legacyBehavior>
            <Button variant={action.href === '/' ? 'primary' : 'secondary'} size="lg" className="min-w-[160px] shadow-[0_4px_16px_rgba(124,92,252,0.3)]">
              {action.label}
            </Button>
          </Link>
        ) : (
          <Button variant="primary" size="lg" onClick={action.onClick} className="min-w-[160px] shadow-[0_4px_16px_rgba(124,92,252,0.3)]">
            {action.label}
          </Button>
        )
      )}
    </div>
  );
}
