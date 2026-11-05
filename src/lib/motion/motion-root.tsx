'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { initInteractions } from './interactions';

/**
 * The page wrapper and the only place scroll/hover motion is started. It is a Client
 * Component, but the sections passed as children stay Server Components.
 */
export function MotionRoot({ className, children }: { className?: string; children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return initInteractions(root, { reducedMotion });
  }, []);

  return (
    <div ref={rootRef} className={className}>
      {children}
    </div>
  );
}
