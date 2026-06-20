import React from 'react';

export function ApertureLoader() {
  return (
    <div className="flex flex-col items-center justify-center gap-[var(--space-4)]">
      <div className="relative w-14 h-14 flex items-center justify-center">
        {/* Outer Ring */}
        <div className="absolute inset-0 border border-[var(--color-border)] rounded-full opacity-50" />
        
        {/* Blade Group */}
        <svg 
          width="56" 
          height="56" 
          viewBox="0 0 56 56" 
          className="aperture-group"
        >
          <g fill="var(--color-primary)" opacity="0.9" transform="translate(28, 28)">
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
              <polygon 
                key={i}
                points="-3,-3 0,-20 3,-3" 
                transform={`rotate(${angle})`}
              />
            ))}
          </g>
        </svg>
      </div>
      <span className="text-[13px] text-[var(--color-text-secondary)] font-medium">Loading</span>
      
      <style dangerouslySetInnerHTML={{__html: `
        @media (prefers-reduced-motion: no-preference) {
          .aperture-group {
            animation: aperture-pulse 1.6s cubic-bezier(0.2, 0, 0, 1) infinite;
            transform-origin: center;
          }
        }
        @keyframes aperture-pulse {
          0%, 100% {
            transform: scale(1) rotate(0deg);
          }
          50% {
            transform: scale(0.45) rotate(30deg);
          }
        }
      `}} />
    </div>
  );
}
