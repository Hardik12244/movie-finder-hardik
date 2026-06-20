'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useDebounce } from '@/hooks/useDebounce';
import { useRecentHistory } from '@/hooks/useRecentHistory';
import { Search, Loader2, X, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

function SearchBarInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);
  const [isPending, setIsPending] = useState(false);
  
  const debouncedQuery = useDebounce(query, 400);
  const initialRender = useRef(true);
  const lastPushedQuery = useRef(initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  const { recentSearches, addRecentSearch, clearRecentSearches, isHydrated } = useRecentHistory();

  // Keyboard shortcut to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

    if (debouncedQuery === lastPushedQuery.current) {
      return;
    }

    setIsPending(true);
    lastPushedQuery.current = debouncedQuery;

    if (debouncedQuery.trim() !== '') {
      addRecentSearch(debouncedQuery);
      router.push(`/search?q=${encodeURIComponent(debouncedQuery)}&page=1`);
    } else {
      if (pathname === '/search') {
        router.push('/');
      }
    }
    
    const timer = setTimeout(() => setIsPending(false), 300);
    return () => clearTimeout(timer);
  }, [debouncedQuery, router, pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  const handleRecentClick = (recentQ: string) => {
    setQuery(recentQ);
    setIsFocused(false);
    // debounced effect will handle the push
  };

  const showRecentDropdown = isFocused && isHydrated && recentSearches.length > 0 && query.trim() === '';

  return (
    <div className="relative w-full max-w-md z-50">
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          const currentQ = searchParams.get('q') || '';
          if (query.trim() !== '' && query !== currentQ) {
            lastPushedQuery.current = query;
            addRecentSearch(query);
            router.push(`/search?q=${encodeURIComponent(query)}&page=1`);
            inputRef.current?.blur();
          } else if (query.trim() === '' && pathname === '/search') {
            router.push('/');
            inputRef.current?.blur();
          }
        }}
        className={cn(
          "relative flex items-center h-[48px] bg-[var(--color-surface)] border px-[var(--space-5)] transition-all duration-150 ease-[var(--ease-standard)] w-full",
          isFocused 
            ? "border-[var(--color-primary)] bg-[var(--color-surface-elevated)] shadow-[0_0_0_3px_rgba(124,92,252,0.25)] rounded-t-[var(--radius-md)] rounded-b-[var(--radius-md)]" 
            : "border-[var(--color-border)] hover:border-[rgba(168,168,179,0.5)] rounded-[var(--radius-md)]",
          showRecentDropdown && "rounded-b-none border-b-transparent"
        )}
      >
        {isPending ? (
          <Loader2 className="w-4 h-4 mr-3 animate-spin text-[var(--color-primary)] shrink-0" />
        ) : (
          <Search className="w-4 h-4 mr-3 text-[var(--color-text-secondary)] shrink-0" />
        )}
        
        <input
          ref={inputRef}
          type="text"
          placeholder="Search movies... (Press '/')"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            // Delay blur to allow clicking dropdown items
            setTimeout(() => setIsFocused(false), 200);
          }}
          className="flex-1 bg-transparent text-[15px] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] outline-none w-full"
        />

        <AnimatePresence>
          {query.length > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              type="button"
              onClick={handleClear}
              className="p-1 rounded-full hover:bg-[rgba(255,255,255,0.1)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors ml-2"
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </form>

      {/* Recent Searches Dropdown */}
      <AnimatePresence>
        {showRecentDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 w-full bg-[var(--color-surface-elevated)] border border-t-0 border-[var(--color-primary)] shadow-[0_8px_32px_rgba(0,0,0,0.4)] rounded-b-[var(--radius-md)] overflow-hidden z-50"
          >
            <div className="flex items-center justify-between px-4 py-2 bg-[rgba(255,255,255,0.02)] border-b border-[rgba(255,255,255,0.05)]">
              <span className="text-[12px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Recent Searches</span>
              <button 
                onClick={clearRecentSearches}
                className="text-[12px] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
              >
                Clear
              </button>
            </div>
            <ul>
              {recentSearches.map((recentQ, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => handleRecentClick(recentQ)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[rgba(255,255,255,0.04)] transition-colors text-left text-[14px] text-[var(--color-text-primary)]"
                  >
                    <Clock className="w-4 h-4 text-[var(--color-text-muted)]" />
                    {recentQ}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function SearchBar() {
  return (
    <Suspense fallback={<div className="h-[48px] w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)]"></div>}>
      <SearchBarInner />
    </Suspense>
  );
}
