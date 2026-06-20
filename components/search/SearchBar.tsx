'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDebounce } from '@/hooks/useDebounce';
import { Search, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

function SearchBarInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);
  const [isPending, setIsPending] = useState(false);
  
  const debouncedQuery = useDebounce(query, 400);
  const initialRender = useRef(true);
  const lastPushedQuery = useRef(initialQuery);

  // Sync state if URL changes externally (e.g., Back/Forward browser navigation)
  useEffect(() => {
    const currentQ = searchParams.get('q') || '';
    if (currentQ !== lastPushedQuery.current) {
      setQuery(currentQ);
      lastPushedQuery.current = currentQ;
    }
  }, [searchParams]);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    // Avoid pushing if the debounced query is what we already pushed
    // (prevents infinite loops between multiple SearchBars)
    if (debouncedQuery === lastPushedQuery.current) {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsPending(true);
    lastPushedQuery.current = debouncedQuery;

    if (debouncedQuery.trim() !== '') {
      router.push(`/search?q=${encodeURIComponent(debouncedQuery)}&page=1`);
    } else {
      if (window.location.pathname === '/search') {
        router.push('/');
      }
    }
    
    const timer = setTimeout(() => setIsPending(false), 300);
    return () => clearTimeout(timer);
  }, [debouncedQuery, router]);

  return (
    <form 
      onSubmit={(e) => {
        e.preventDefault();
        const currentQ = searchParams.get('q') || '';
        if (query.trim() !== '' && query !== currentQ) {
          lastPushedQuery.current = query;
          router.push(`/search?q=${encodeURIComponent(query)}&page=1`);
        } else if (query.trim() === '' && window.location.pathname === '/search') {
          router.push('/');
        }
      }}
      className={cn(
        "relative flex items-center h-[48px] bg-[var(--color-surface)] border rounded-[var(--radius-md)] px-[var(--space-5)] transition-all duration-150 ease-[var(--ease-standard)] w-full max-w-md",
        isFocused 
          ? "border-[var(--color-primary)] bg-[var(--color-surface-elevated)] shadow-[0_0_0_3px_rgba(124,92,252,0.25)]" 
          : "border-[var(--color-border)] hover:border-[rgba(168,168,179,0.5)]"
      )}
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 mr-3 animate-spin text-[var(--color-primary)] shrink-0" />
      ) : (
        <Search className="w-4 h-4 mr-3 text-[var(--color-text-secondary)] shrink-0" />
      )}
      
      <input
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="flex-1 bg-transparent text-[15px] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] outline-none w-full"
      />
    </form>
  );
}

export function SearchBar() {
  return (
    <Suspense fallback={<div className="h-[48px] w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)]"></div>}>
      <SearchBarInner />
    </Suspense>
  );
}
