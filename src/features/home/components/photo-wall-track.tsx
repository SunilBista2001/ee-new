'use client';

import { useState, type PointerEvent, type ReactNode } from 'react';

/**
 * The hero photo wall's row. Tracks which frame is focal (`data-active`): the pointer entering
 * a frame makes it focal and the wall returns to the middle frame when the pointer leaves the
 * row. Moving across the gaps between frames keeps the current one, so the row never flickers
 * back to the middle mid-move. All the sizing and transitions live in hero.css.
 */
export function PhotoWallTrack({ children }: { children: ReactNode }) {
  const [active, setActive] = useState('main');

  const onPointerOver = (event: PointerEvent<HTMLDivElement>) => {
    const panel = (event.target as Element).closest<HTMLElement>('[data-panel]');
    if (panel?.dataset.panel) setActive(panel.dataset.panel);
  };

  return (
    <div
      className="hero-wall__track"
      data-active={active}
      onPointerOver={onPointerOver}
      onPointerLeave={() => setActive('main')}
    >
      {children}
    </div>
  );
}
