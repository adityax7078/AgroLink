import React from 'react';

/**
 * Loader component supporting standard spinner and skeleton shapes.
 * 
 * @param {Object} props - Component props.
 * @param {'spinner' | 'skeleton'} [props.variant='spinner'] - Visual loader type.
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - Spinner size.
 * @param {number} [props.lines=3] - Number of pulsing text skeleton lines (for skeleton variant).
 * @param {string} [props.className=''] - Additional custom CSS class.
 */
export function Loader({
  variant = 'spinner',
  size = 'md',
  lines = 3,
  className = '',
}) {
  if (variant === 'skeleton') {
    return (
      <div className={`space-y-3 animate-pulse w-full ${className}`}>
        {Array.from({ length: lines }).map((_, index) => {
          const widths = ['w-3/4', 'w-full', 'w-5/6', 'w-2/3', 'w-1/2'];
          const widthClass = widths[index % widths.length];
          return (
            <div
              key={index}
              className={`h-3.5 bg-slate-200 dark:bg-slate-700 rounded-lg ${widthClass}`}
            />
          );
        })}
      </div>
    );
  }

  const sizes = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`rounded-full border-solid border-slate-200 dark:border-slate-800 border-t-emerald-600 dark:border-t-emerald-400 animate-spin ${sizes[size]}`}
        role="status"
        aria-label="loading"
      />
    </div>
  );
}
