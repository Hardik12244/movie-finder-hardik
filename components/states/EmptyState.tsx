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
    <div className="flex flex-col items-center justify-center text-center py-[var(--space-16)] max-w-md mx-auto animate-in fade-in zoom-in-95 duration-200">
      <Icon className="w-16 h-16 text-[var(--color-text-muted)] mb-[var(--space-4)] stroke-[1.5]" />
      <h3 className="text-[20px] font-semibold mb-2 text-[var(--color-text-primary)]">{title}</h3>
      <p className="text-[15px] text-[var(--color-text-secondary)] mb-[var(--space-6)]">{description}</p>
      
      {action && (
        action.href ? (
          <Link href={action.href} passHref legacyBehavior>
            <Button variant={action.href === '/' ? 'primary' : 'secondary'}>
              {action.label}
            </Button>
          </Link>
        ) : (
          <Button variant="primary" onClick={action.onClick}>
            {action.label}
          </Button>
        )
      )}
    </div>
  );
}
