'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Film } from 'lucide-react';
import { SearchBar } from '../search/SearchBar';
import { useFavorites } from '@/context/FavoritesContext';
import { cn } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();
  const { favorites, isHydrated } = useFavorites();

  return (
    <header className="sticky top-0 z-40 w-full bg-[var(--color-bg)]/80 backdrop-blur-md border-b border-[var(--color-border)] shadow-sm transition-all">
      <div className="max-w-[1440px] mx-auto px-[var(--space-4)] md:px-[var(--space-6)] h-[72px] flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="bg-[var(--color-primary)] p-1.5 rounded-[var(--radius-sm)] group-hover:scale-105 transition-transform duration-200">
            <Film className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-[20px] tracking-tight hidden sm:block">
            CineFolio
          </span>
        </Link>

        <div className="flex-1 max-w-md mx-auto w-full hidden md:block">
          <SearchBar />
        </div>

        <nav className="flex items-center gap-1 sm:gap-4 shrink-0">
          <Link 
            href="/"
            className={cn(
              "text-[15px] font-medium transition-colors hover:text-[var(--color-text-primary)] px-3 py-2 rounded-[var(--radius-md)]",
              pathname === '/' ? "text-[var(--color-text-primary)] bg-[var(--color-surface)]" : "text-[var(--color-text-secondary)]"
            )}
          >
            Browse
          </Link>
          <Link 
            href="/favorites"
            className={cn(
              "text-[15px] font-medium transition-colors hover:text-[var(--color-text-primary)] px-3 py-2 rounded-[var(--radius-md)] flex items-center gap-2",
              pathname === '/favorites' ? "text-[var(--color-text-primary)] bg-[var(--color-surface)]" : "text-[var(--color-text-secondary)]"
            )}
          >
            <span>Favorites</span>
            {isHydrated && favorites.length > 0 && (
              <span className="bg-[var(--color-surface-elevated)] text-[var(--color-accent)] text-[12px] font-bold px-2 py-0.5 rounded-[var(--radius-sm)]">
                {favorites.length}
              </span>
            )}
          </Link>
        </nav>
      </div>
      
      {/* Mobile Search Bar Row */}
      <div className="md:hidden px-[var(--space-4)] pb-[var(--space-4)]">
        <SearchBar />
      </div>
    </header>
  );
}
