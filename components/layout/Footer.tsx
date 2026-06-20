import React from 'react';
import Link from 'next/link';
import { Film } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full bg-[var(--color-surface)] border-t border-[var(--color-border)] py-[var(--space-10)] mt-auto">
      <div className="max-w-[1440px] mx-auto px-[var(--space-4)] md:px-[var(--space-6)]">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 mb-[var(--space-8)]">
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Film className="w-5 h-5 text-[var(--color-primary)]" />
              <span className="font-bold text-[20px] tracking-tight">CineFolio</span>
            </Link>
            <p className="text-[13px] text-[var(--color-text-secondary)] max-w-[300px] text-center md:text-left">
              A fast, focused movie discovery tool that feels like a personal film archive, not a content firehose.
            </p>
          </div>
          
          <div className="flex items-center gap-8 text-[15px]">
            <Link href="/" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
              Browse
            </Link>
            <Link href="/favorites" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
              Favorites
            </Link>
          </div>
        </div>
        
        <div className="pt-[var(--space-6)] border-t border-[var(--color-border)] flex justify-center">
          <p className="text-[13px] text-[var(--color-text-secondary)]">
            Built for Jeevan — Hardik Garg
          </p>
        </div>
      </div>
    </footer>
  );
}
