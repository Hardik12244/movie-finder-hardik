import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-[var(--radius-md)] text-[15px] font-medium transition-all duration-100 ease-[var(--ease-standard)] disabled:opacity-40 disabled:pointer-events-none active:scale-[0.97]",
          {
            "bg-[var(--color-primary)] text-white hover:shadow-[var(--shadow-md)] hover:-translate-y-1": variant === 'primary',
            "bg-transparent border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface)]": variant === 'secondary',
            "bg-transparent text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)]": variant === 'ghost',
            "bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)] hover:border-[rgba(124,92,252,0.4)]": variant === 'icon', 
            "h-9 px-4": size === 'sm',
            "h-11 px-[var(--space-5)] py-[var(--space-3)]": size === 'md',
            "h-12 px-8": size === 'lg',
            "h-[44px] w-[44px] p-0": size === 'icon',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
