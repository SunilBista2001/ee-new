'use client';

import { gsap } from 'gsap';
import { useId, useRef, useState, type ReactNode } from 'react';
import { SmallArrowDownIcon } from '@/components/icons/nav-icons';
import { INITIAL_STYLE, MOTION_IDS } from '@/lib/motion/reveal-config';
import { cn } from '@/lib/utils';

export interface CityEventRow {
  key: string;
  city: string;
  /** Server-rendered row content. */
  content: ReactNode;
}

interface CityEventsProps {
  cities: string[];
  rows: CityEventRow[];
  selectCityLabel: string;
  /** Server-rendered "Check Back Soon" heading, shown when a city has no events. */
  emptyState: ReactNode;
}

/**
 * City tabs (Finsweet CMS filter on the original) + the "Select City" toggle on phones.
 * Rows stay mounted and are hidden with `display: none`, so each reveal animation runs once.
 */
export function CityEvents({ cities, rows, selectCityLabel, emptyState }: CityEventsProps) {
  const [city, setCity] = useState(cities[0] ?? '');
  const [menuOpen, setMenuOpen] = useState(false);
  const arrowRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  // IX2 a-8 / a-9 (small + tiny breakpoints only; the toggle is hidden above 767px).
  const toggleMenu = () => {
    const next = !menuOpen;
    setMenuOpen(next);
    gsap.to(arrowRef.current, { rotation: next ? 180 : 0, duration: 0.5 });
  };

  const hasEvents = rows.some((row) => row.city === city);

  return (
    <section data-w-id={MOTION_IDS.events.citySection} style={INITIAL_STYLE.hidden} className="section_cta25">
      <div className="padding-global">
        <div className="container-large">
          <div className="padding-section-small">
            <div className="cta25_component">
              <div className="margin-bottom">
                <button
                  type="button"
                  className="ui-unstyled tab-dropdown"
                  aria-expanded={menuOpen}
                  aria-controls={menuId}
                  onClick={toggleMenu}
                >
                  <div className="tab-dropdown-icon">
                    <div className="text-block-2">{selectCityLabel}</div>
                    <div ref={arrowRef} className="tab-arrow w-embed">
                      <SmallArrowDownIcon />
                    </div>
                  </div>
                </button>
                <div id="event-tabs" className="w-form">
                  <form
                    id={menuId}
                    aria-label="Filter events by city"
                    className={cn('tabs-menu', menuOpen && 'is-open')}
                    onSubmit={(event) => event.preventDefault()}
                  >
                    {cities.map((label) => (
                      <label key={label} className={cn('tab_link w-radio', city === label && 'is-active')}>
                        <input
                          type="radio"
                          name="city"
                          className="w-form-formradioinput w-radio-input tw:sr-only"
                          value={label}
                          checked={city === label}
                          onChange={() => setCity(label)}
                        />
                        <span className="w-form-label">{label}</span>
                      </label>
                    ))}
                  </form>
                </div>
              </div>
              <div className="w-dyn-list">
                <div role="list" className="w-dyn-items">
                  {rows.map((row) => (
                    <div
                      key={row.key}
                      data-w-id={MOTION_IDS.events.row}
                      style={row.city === city ? INITIAL_STYLE.hidden : { ...INITIAL_STYLE.hidden, display: 'none' }}
                      role="listitem"
                      className="collection-item w-dyn-item"
                    >
                      {row.content}
                    </div>
                  ))}
                </div>
              </div>
              <div className="empty-state" style={{ display: hasEvents ? 'none' : 'block' }}>
                {emptyState}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
