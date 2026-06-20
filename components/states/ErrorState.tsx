'use client';
import React, { useEffect, useState } from 'react';
import { WifiOff, RefreshCw, Film } from 'lucide-react';
import { Button } from '../ui/Button';

interface ErrorStateProps {
  error?: Error;
  reset: () => void;
}

export function ErrorState({ reset }: ErrorStateProps) {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line
    setIsOffline(!navigator.onLine);
    
    const handleOnline = () => {
      // eslint-disable-next-line
      setIsOffline(false);
      reset(); // Auto retry when back online
    };
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [reset]);

  const title = isOffline ? "You're offline" : "Something went wrong";
  const description = isOffline
    ? "Check your connection and try again. Your favorites are safe — they're saved on this device."
    : "We couldn't load movies right now. This is on our end — please try again.";

  return (
    <div className="flex flex-col items-center justify-center text-center py-[var(--space-16)] max-w-md mx-auto w-full animate-in fade-in zoom-in-95 duration-200">
      <div className="mb-[var(--space-4)]">
        {isOffline ? (
          <WifiOff className="w-16 h-16 text-[var(--color-text-muted)] stroke-[1.5]" />
        ) : (
          <div className="relative">
            <Film className="w-16 h-16 text-[var(--color-error)] stroke-[1.5]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-1 bg-[var(--color-bg)] transform -rotate-45" />
            </div>
          </div>
        )}
      </div>
      
      <h3 className="text-[20px] font-semibold mb-2 text-[var(--color-text-primary)]">{title}</h3>
      <p className="text-[15px] text-[var(--color-text-secondary)] mb-[var(--space-6)]">{description}</p>
      
      <Button variant="primary" onClick={reset} className="gap-2">
        <RefreshCw className="w-4 h-4" />
        {isOffline ? 'Retry' : 'Try Again'}
      </Button>
    </div>
  );
}
