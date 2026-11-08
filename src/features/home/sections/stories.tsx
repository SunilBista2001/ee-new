'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { SectionIndex } from '@/components/ee/primitives';
import { gsap } from '@/lib/motion/gsap';
import type { StoriesContent } from '@/services/content';
import { cn } from '@/lib/utils';

/**
 * Community stories on a soft accent band: a slow marquee of the brand line in outlined
 * type, then one quotation at a time with an arched portrait. Previous/next buttons, avatar
 * buttons and the arrow keys move between stories; there is no autoplay.
 */
export function Stories({ content }: { content: StoriesContent }) {
  const [index, setIndex] = useState(0);
  const slideRef = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  const items = content.testimonials;
  const active = items[index]!;

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const el = slideRef.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const tween = gsap.fromTo(
      el.querySelectorAll('[data-slide-part]'),
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out', stagger: 0.05 },
    );
    return () => {
      tween.kill();
    };
  }, [index]);

  const go = (next: number) => setIndex((next + items.length) % items.length);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      go(index + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      go(index - 1);
    }
  };

  const phrases = [...content.marquee, ...content.marquee];

  return (
    <section id="community" className="stories on-beige" aria-labelledby="stories-title" tabIndex={-1}>
      <div className="wrap">
        <SectionIndex index={content.index} label={content.label} />
        <div className="stories__head">
          <h2 id="stories-title" className="h2" data-reveal="lines">
            {content.heading}
          </h2>
          <p className="stories__intro" data-reveal="fade">
            {content.intro}
          </p>
        </div>
      </div>

      <div className="stories__marquee" aria-hidden="true">
        <div className="stories__marquee-track">
          {[0, 1].map((copy) => (
            <span key={copy} className="stories__marquee-set">
              {phrases.map((phrase, i) => (
                <span key={`${copy}-${i}`} className="stories__phrase">
                  {phrase}
                  <svg viewBox="0 0 48 24" className="stories__phrase-arrow">
                    <path d="M2 12h42M34 3l10 9-10 9" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <div className="wrap">
        <div
          className="story"
          role="region"
          aria-roledescription="carousel"
          aria-label="Community stories"
          onKeyDown={onKeyDown}
          data-reveal="fade"
        >
          <div ref={slideRef} className="story__slide" aria-live="polite" aria-atomic="true">
            <div className="story__portrait" data-slide-part>
              <Image src={active.photo.src} alt={active.photo.alt} fill sizes="(min-width: 992px) 320px, 60vw" />
            </div>
            <figure className="story__body">
              <svg viewBox="0 0 40 32" className="story__mark" aria-hidden="true" data-slide-part>
                <path
                  d="M0 32V19.6C0 8.8 6.1 2.2 16.4 0l1.5 4.3C11.6 6.3 8.6 10.2 8.4 16h8v16H0Zm22 0V19.6C22 8.8 28.1 2.2 38.4 0l1.5 4.3C33.6 6.3 30.6 10.2 30.4 16h8v16H22Z"
                  fill="currentColor"
                />
              </svg>
              <blockquote className="story__quote" data-slide-part>
                <p>{active.quote}</p>
              </blockquote>
              <figcaption className="story__person" data-slide-part>
                <span className="story__name">{active.name}</span>
                <span className="story__role mono">{active.role}</span>
              </figcaption>
            </figure>
          </div>

          <div className="story__controls">
            <div className="story__picks">
              {items.map((t, i) => (
                <button
                  key={t.name}
                  type="button"
                  className={cn('story__pick', i === index && 'is-active')}
                  aria-label={`Show story from ${t.name}`}
                  aria-current={i === index ? 'true' : undefined}
                  onClick={() => go(i)}
                >
                  <Image src={t.photo.src} alt="" width={64} height={64} />
                </button>
              ))}
            </div>
            <div className="story__progress" aria-hidden="true">
              <span className="mono">
                {String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
              </span>
              <span className="story__bar">
                <span style={{ transform: `scaleX(${(index + 1) / items.length})` }} />
              </span>
            </div>
            <div className="story__arrows">
              <button type="button" className="round-btn" aria-label="Previous story" onClick={() => go(index - 1)}>
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <path
                    d="M13 8H3M7 4 3 8l4 4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
              <button type="button" className="round-btn" aria-label="Next story" onClick={() => go(index + 1)}>
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
