'use client';

import { gsap } from 'gsap';
import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { PlainImage } from '@/components/media/plain-image';
import type { PlainImage as PlainImageAsset } from '@/services/content';
import { cn } from '@/lib/utils';

const DURATION_OUT = 0.1; // Webflow data-duration-out="100"
const DURATION_IN = 0.3; // Webflow data-duration-in="300"

export interface TestimonialTab {
  key: string;
  logo: PlainImageAsset;
  /** Server-rendered pane content. */
  pane: ReactNode;
}

/** Webflow Tabs with the original fade timings, as an accessible ARIA tablist. */
export function TestimonialTabs({ tabs, label }: { tabs: TestimonialTab[]; label: string }) {
  const baseId = useId();
  const [current, setCurrent] = useState(tabs[0]?.key ?? ''); // highlighted tab
  const [shown, setShown] = useState(current); // visible pane (switches after the fade-out)
  const panes = useRef(new Map<string, HTMLDivElement>());
  const tabButtons = useRef(new Map<string, HTMLButtonElement>());

  const select = (key: string) => {
    if (key === current) return;
    setCurrent(key);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      setShown(key);
      return;
    }
    gsap.to(panes.current.get(shown) ?? null, {
      opacity: 0,
      duration: DURATION_OUT,
      ease: 'power1.inOut',
      onComplete: () => {
        setShown(key);
        gsap.fromTo(
          panes.current.get(key) ?? null,
          { opacity: 0 },
          { opacity: 1, duration: DURATION_IN, ease: 'power1.inOut' },
        );
      },
    });
  };

  // Arrow keys move between tabs (WAI-ARIA tabs pattern, automatic activation).
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
    let nextIndex: number | undefined;
    if (step !== undefined) nextIndex = (index + step + tabs.length) % tabs.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = tabs.length - 1;
    const next = nextIndex === undefined ? undefined : tabs[nextIndex];
    if (!next) return;
    event.preventDefault();
    select(next.key);
    tabButtons.current.get(next.key)?.focus();
  };

  const tabId = (key: string) => `${baseId}-tab-${key}`;
  const paneId = (key: string) => `${baseId}-pane-${key}`;

  return (
    <div className="w-tabs">
      <div className="w-tab-content">
        {tabs.map((tab) => (
          <div
            key={tab.key}
            id={paneId(tab.key)}
            ref={(el) => {
              if (el) panes.current.set(tab.key, el);
              else panes.current.delete(tab.key);
            }}
            role="tabpanel"
            aria-labelledby={tabId(tab.key)}
            hidden={shown !== tab.key ? true : undefined}
            className={cn('w-tab-pane', shown === tab.key && 'w--tab-active')}
          >
            {tab.pane}
          </div>
        ))}
      </div>
      <div className="tab-menu w-tab-menu" role="tablist" aria-label={label}>
        {tabs.map((tab, index) => {
          const selected = current === tab.key;
          return (
            <button
              key={tab.key}
              id={tabId(tab.key)}
              ref={(el) => {
                if (el) tabButtons.current.set(tab.key, el);
                else tabButtons.current.delete(tab.key);
              }}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={paneId(tab.key)}
              tabIndex={selected ? 0 : -1}
              className={cn(
                'ui-unstyled tab-container',
                index === tabs.length - 1 && 'last',
                'w-inline-block w-tab-link',
                selected && 'w--current',
              )}
              onClick={() => select(tab.key)}
              onKeyDown={(event) => onKeyDown(event, index)}
            >
              <PlainImage image={tab.logo} className="testimonial1_logo" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
