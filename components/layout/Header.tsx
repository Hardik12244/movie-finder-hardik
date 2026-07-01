'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Film, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { SearchBar } from '../search/SearchBar';
import { useFavorites } from '@/context/FavoritesContext';
import { cn } from '@/lib/utils';
import { useSession, signIn, signOut } from 'next-auth/react';

export function Header() {
  const pathname = usePathname();
  const { favorites, isHydrated } = useFavorites();
  const { data: session, status } = useSession();

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

        <div className="flex items-center gap-3 shrink-0">
          <nav className="flex items-center gap-1 sm:gap-2 shrink-0 overflow-x-auto max-w-full no-scrollbar">
            <Link 
              href="/"
              className={cn(
                "text-[14px] font-medium transition-colors hover:text-[var(--color-text-primary)] px-2.5 py-1.5 rounded-[var(--radius-md)]",
                pathname === '/' ? "text-[var(--color-text-primary)] bg-[var(--color-surface)]" : "text-[var(--color-text-secondary)]"
              )}
            >
              Browse
            </Link>
            <Link 
              href="/watchlist"
              className={cn(
                "text-[14px] font-medium transition-colors hover:text-[var(--color-text-primary)] px-2.5 py-1.5 rounded-[var(--radius-md)]",
                pathname === '/watchlist' ? "text-[var(--color-text-primary)] bg-[var(--color-surface)]" : "text-[var(--color-text-secondary)]"
              )}
            >
              Watchlist
            </Link>
            <Link 
              href="/watching"
              className={cn(
                "text-[14px] font-medium transition-colors hover:text-[var(--color-text-primary)] px-2.5 py-1.5 rounded-[var(--radius-md)]",
                pathname === '/watching' ? "text-[var(--color-text-primary)] bg-[var(--color-surface)]" : "text-[var(--color-text-secondary)]"
              )}
            >
              Watching
            </Link>
            <Link 
              href="/completed"
              className={cn(
                "text-[14px] font-medium transition-colors hover:text-[var(--color-text-primary)] px-2.5 py-1.5 rounded-[var(--radius-md)] hidden lg:inline-block",
                pathname === '/completed' ? "text-[var(--color-text-primary)] bg-[var(--color-surface)]" : "text-[var(--color-text-secondary)]"
              )}
            >
              Completed
            </Link>
            <Link 
              href="/rewatch"
              className={cn(
                "text-[14px] font-medium transition-colors hover:text-[var(--color-text-primary)] px-2.5 py-1.5 rounded-[var(--radius-md)] hidden xl:inline-block",
                pathname === '/rewatch' ? "text-[var(--color-text-primary)] bg-[var(--color-surface)]" : "text-[var(--color-text-secondary)]"
              )}
            >
              Rewatch
            </Link>
            <Link 
              href="/stats"
              className={cn(
                "text-[14px] font-medium transition-colors hover:text-[var(--color-text-primary)] px-2.5 py-1.5 rounded-[var(--radius-md)]",
                pathname === '/stats' ? "text-[var(--color-text-primary)] bg-[var(--color-surface)]" : "text-[var(--color-text-secondary)]"
              )}
            >
              Stats
            </Link>
            <Link 
              href="/favorites"
              className={cn(
                "text-[14px] font-medium transition-colors hover:text-[var(--color-text-primary)] px-2.5 py-1.5 rounded-[var(--radius-md)] flex items-center gap-1.5",
                pathname === '/favorites' ? "text-[var(--color-text-primary)] bg-[var(--color-surface)]" : "text-[var(--color-text-secondary)]"
              )}
            >
              <span>Favorites</span>
              {isHydrated && favorites.length > 0 && (
                <span className="bg-[var(--color-surface-elevated)] text-[var(--color-accent)] text-[11px] font-bold px-1.5 py-0.5 rounded-[var(--radius-sm)]">
                  {favorites.length}
                </span>
              )}
            </Link>
          </nav>

          {/* Direct Google Authentication Controls */}
          {status === 'loading' ? (
            <div className="w-8 h-8 rounded-full bg-[var(--color-surface)] animate-pulse" />
          ) : session?.user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-[rgba(255,255,255,0.1)]">
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || 'User'}
                  className="w-8 h-8 rounded-full border border-[var(--color-primary)] object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white font-bold text-[12px]">
                  <UserIcon className="w-4 h-4" />
                </div>
              )}
              <span className="text-[13px] font-bold hidden xl:inline-block max-w-[100px] truncate">
                {session.user.name?.split(' ')[0] || 'User'}
              </span>
              <button
                onClick={() => signOut()}
                className="p-1.5 text-[var(--color-text-secondary)] hover:text-red-400 transition-colors rounded-[var(--radius-sm)] hover:bg-red-500/10"
                title="Sign out of cloud sync"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn('google')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-[13px] rounded-[var(--radius-md)] shadow-md transition-all shrink-0 ml-1"
              title="Sign in with Google to sync cloud database"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">Sign in with Google</span>
              <span className="sm:hidden">Sign In</span>
            </button>
          )}
        </div>
      </div>
      
      {/* Mobile Search Bar Row */}
      <div className="md:hidden px-[var(--space-4)] pb-[var(--space-4)]">
        <SearchBar />
      </div>
    </header>
  );
}
