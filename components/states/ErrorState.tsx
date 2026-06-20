'use client';
import React, { useEffect, useState } from 'react';
import { WifiOff, RefreshCw, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';

interface ErrorStateProps {
  reset: () => void;
}

export function ErrorState({ reset }: ErrorStateProps) {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line
    setIsOffline(!navigator.onLine);
    
    const handleOnline = () => {
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

  const Icon = isOffline ? WifiOff : AlertTriangle;
  const title = isOffline ? "You're offline" : "Connection Error";
  const description = isOffline
    ? "It seems you've lost connection. Your saved favorites are still safe on this device."
    : "We couldn't reach the movie database. Please try again in a moment.";

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.2, 0.65, 0.3, 0.9] as const }}
      className="flex flex-col items-center justify-center text-center py-[var(--space-16)] px-[var(--space-4)] max-w-[500px] mx-auto w-full"
    >
      <div className="relative mb-[var(--space-6)]">
        <div className={`absolute inset-0 opacity-15 blur-2xl rounded-full ${isOffline ? 'bg-[var(--color-warning)]' : 'bg-[var(--color-error)]'}`} />
        <div className="w-20 h-20 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] rounded-[var(--radius-xl)] flex items-center justify-center relative shadow-inner">
          <Icon className={`w-10 h-10 stroke-[1.5] ${isOffline ? 'text-[var(--color-warning)]' : 'text-[var(--color-error)]'}`} />
        </div>
      </div>
      
      <h3 className="text-[24px] font-bold mb-3 text-[var(--color-text-primary)] tracking-tight">{title}</h3>
      <p className="text-[16px] text-[var(--color-text-secondary)] mb-[var(--space-8)] leading-relaxed max-w-[400px]">{description}</p>
      
      <Button variant="primary" size="lg" onClick={reset} className="gap-2 min-w-[160px] shadow-[0_4px_16px_rgba(255,255,255,0.05)]">
        <RefreshCw className="w-4 h-4" />
        {isOffline ? 'Retry' : 'Try Again'}
      </Button>
    </motion.div>
  );
}
