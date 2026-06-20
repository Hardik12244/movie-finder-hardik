'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
}

function PaginationInner({ currentPage, totalPages, basePath = '/' }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    
    const queryStr = params.toString() ? `?${params.toString()}` : '';
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    router.push(`${basePath}${queryStr}`);
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-6 mt-[var(--space-12)]">
      <Button
        variant="icon"
        size="icon"
        disabled={currentPage <= 1}
        aria-disabled={currentPage <= 1}
        onClick={() => handlePageChange(currentPage - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>

      <div className="font-medium text-[15px] text-[var(--color-text-secondary)] tabular-nums tracking-wide" aria-live="polite">
        Page <span className="text-[var(--color-text-primary)]">{currentPage}</span> of {totalPages}
      </div>

      <Button
        variant="icon"
        size="icon"
        disabled={currentPage >= totalPages}
        aria-disabled={currentPage >= totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        aria-label="Next page"
      >
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );
}

export function Pagination({ currentPage, totalPages, basePath = '/' }: PaginationProps) {
  return (
    <Suspense fallback={null}>
      <PaginationInner currentPage={currentPage} totalPages={totalPages} basePath={basePath} />
    </Suspense>
  );
}

