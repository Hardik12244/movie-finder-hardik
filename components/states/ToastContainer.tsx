'use client';

import React from 'react';
import { useToast } from '@/context/ToastContext';
import { Check, Heart, Info, AlertTriangle, AlertCircle } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-[var(--space-6)] right-[var(--space-6)] z-50 flex flex-col gap-2 max-w-[320px] w-full max-sm:right-4 max-sm:bottom-4 max-sm:left-4 max-sm:max-w-[calc(100%-32px)]">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="flex items-center gap-3 bg-[var(--color-surface-elevated)] p-[var(--space-4)] rounded-[var(--radius-md)] shadow-[var(--shadow-elevated)] animate-in slide-in-from-bottom-3 fade-in duration-200"
          style={{ transitionTimingFunction: 'var(--ease-emphasized)' }}
        >
          {toast.type === 'success' && <Check className="w-5 h-5 text-[var(--color-success)] shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-[var(--color-error)] shrink-0" />}
          {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-[var(--color-warning)] shrink-0" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-[var(--color-text-secondary)] shrink-0" />}
          {(!toast.type || toast.type === 'success') && !['error','warning','info'].includes(toast.type || '') && (
            <Heart className="w-5 h-5 text-[var(--color-accent)] fill-[var(--color-accent)] shrink-0" />
          )}
          
          <div className="flex-1 text-[13px] text-[var(--color-text-primary)]">
            {toast.message}
          </div>
          
          {toast.action && (
            <button
              onClick={() => {
                toast.action?.onClick();
                removeToast(toast.id);
              }}
              className="text-[13px] text-[var(--color-primary)] font-medium hover:underline shrink-0"
            >
              {toast.action.label}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
