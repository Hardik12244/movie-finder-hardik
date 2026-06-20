import React from 'react';
import { ApertureLoader } from '@/components/ui/ApertureLoader';

export default function RootLoading() {
  return (
    <div className="w-full min-h-[calc(100vh-72px)] flex items-center justify-center bg-[var(--color-bg)]">
      <ApertureLoader />
    </div>
  );
}
