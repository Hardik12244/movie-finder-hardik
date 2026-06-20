'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useReducedMotion } from 'framer-motion';

import { Suspense } from 'react';

function RouteProgressBarInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const shouldReduceMotion = useReducedMotion();

  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    // End navigation when URL actually changes
    if (isNavigating) {
      const immediateTimer = setTimeout(() => {
        setProgress(100);
        setTimeout(() => {
          setIsVisible(false);
          setIsNavigating(false);
          setTimeout(() => setProgress(0), 300); // Wait for fade out
        }, 150);
      }, 0);
      return () => clearTimeout(immediateTimer);
    }
  }, [pathname, searchParams, isNavigating]);

  useEffect(() => {
    const handleStart = () => {
      setIsNavigating(true);
      setIsVisible(true);
      setProgress(0);
      // Small tick to ensure browser applies 0 width without transition
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setProgress(85), 50);
    };

    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function (...args) {
      handleStart();
      return originalPushState.apply(this, args);
    };
    
    window.history.replaceState = function (...args) {
      handleStart();
      return originalReplaceState.apply(this, args);
    };

    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target || !target.href) return;
      
      const isExternal = target.host !== window.location.host;
      const isAnchor = target.hash && target.pathname === window.location.pathname;
      const isTargetBlank = target.target === '_blank';
      
      if (!isExternal && !isAnchor && !isTargetBlank && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
        if (target.href !== window.location.href) {
          handleStart();
        }
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
      document.removeEventListener('click', handleClick);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (shouldReduceMotion) return null;

  return (
    <div 
      className="fixed top-0 left-0 h-[3px] z-[100] pointer-events-none"
      style={{
        width: `${progress}%`,
        background: 'linear-gradient(90deg, #7C5CFC, #F2C14E)',
        opacity: isVisible ? (progress === 100 ? 0 : 1) : 0,
        transition: progress === 0 
          ? 'none'
          : `width ${progress === 100 ? '150ms' : '800ms'} cubic-bezier(0.4, 0, 0.2, 1), opacity 300ms ease ${progress === 100 ? '150ms' : '0ms'}`,
      }}
    />
  );
}

export function RouteProgressBar() {
  return (
    <Suspense fallback={null}>
      <RouteProgressBarInner />
    </Suspense>
  );
}
