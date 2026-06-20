import React from 'react';

export default function MovieDetailLoading() {
  return (
    <div className="w-full relative min-h-[calc(100vh-72px)] bg-[var(--color-bg)] flex flex-col pb-[var(--space-16)] animate-pulse">
      {/* Immersive Backdrop Skeleton */}
      <div className="w-full h-[45vh] md:h-[60vh] lg:h-[75vh] relative bg-[rgba(255,255,255,0.02)]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#08090C] via-[rgba(8,9,12,0.85)] to-transparent w-[100%] md:w-[70%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090C] via-[rgba(8,9,12,0.3)] to-transparent top-[30%]" />
      </div>

      <div className="max-w-[1440px] mx-auto w-full px-[var(--space-4)] md:px-[var(--space-8)] lg:px-[var(--space-12)] -mt-[25vh] md:-mt-[40vh] lg:-mt-[50vh] relative z-10">
        <div className="flex flex-col md:flex-row gap-[var(--space-8)] lg:gap-[var(--space-16)]">
          {/* Poster Column Skeleton */}
          <div className="shrink-0 mx-auto md:mx-0 w-[200px] md:w-[300px] lg:w-[380px]">
            <div className="relative aspect-[2/3] w-full rounded-[var(--radius-xl)] bg-[rgba(255,255,255,0.05)] shadow-xl" />
            <div className="mt-[var(--space-6)] hidden md:block">
              <div className="w-full h-12 bg-[rgba(255,255,255,0.05)] rounded-[var(--radius-md)]" />
            </div>
          </div>

          {/* Content Column Skeleton */}
          <div className="flex flex-col flex-1 pt-0 md:pt-[var(--space-12)] items-center md:items-start text-center md:text-left w-full">
            <div className="w-3/4 h-16 md:h-20 lg:h-24 bg-[rgba(255,255,255,0.05)] rounded-lg mb-[var(--space-4)]" />
            <div className="w-1/2 h-8 bg-[rgba(255,255,255,0.03)] rounded-lg mb-[var(--space-8)]" />
            
            {/* Quick Stats Skeleton */}
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-[var(--space-8)] w-full max-w-[1000px] mt-[var(--space-10)]">
              <div className="bg-[rgba(26,27,32,0.6)] rounded-[var(--radius-xl)] p-[var(--space-6)] md:p-[var(--space-8)] h-[200px]" />
              <div className="bg-[rgba(26,27,32,0.4)] rounded-[var(--radius-xl)] p-[var(--space-6)] h-[200px]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
