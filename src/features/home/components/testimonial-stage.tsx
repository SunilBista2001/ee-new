'use client';

import Image from 'next/image';
import { useState, type KeyboardEvent } from 'react';
import { BrandMark, SlotText } from '@/components/ee/primitives';
import { cn } from '@/lib/utils';
import type { Testimonial } from '@/services/content';

/** Initials for a monogram; a name that is still a [placeholder] falls back to the brand mark. */
function initials(name: string): string | null {
  if (name.startsWith('[')) return null;
  return name
    .replace(/\[[^\]]*\]/g, '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

function Portrait({ item, sizes }: { item: Testimonial; sizes: string }) {
  if (item.photo) {
    return (
      <Image
        src={item.photo.src}
        alt=""
        width={item.photo.width}
        height={item.photo.height}
        sizes={sizes}
        style={item.photo.focus ? { objectPosition: item.photo.focus } : undefined}
      />
    );
  }
  const letters = initials(item.name);
  return <span className="tst__mono">{letters ?? <BrandMark className="tst__mono-mark" />}</span>;
}

/**
 * Testimonials, one at a time: a tall portrait, the quote set large, and the list of people
 * to switch between (click, tap or arrow keys). No autoplay.
 */
export function TestimonialStage({ items }: { items: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  const active = items[index]!;

  const onKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    const step =
      e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (index + step + items.length) % items.length;
    setIndex(next);
    e.currentTarget.querySelectorAll<HTMLButtonElement>('button')[next]?.focus();
  };

  return (
    <div className="tst" role="region" aria-label="Testimonials">
      <div className="tst__portrait" aria-hidden="true">
        {items.map((item, i) => (
          <div key={i} className={cn('tst__shot', i === index && 'is-active')}>
            <Portrait item={item} sizes="(min-width: 992px) 28vw, 40vw" />
          </div>
        ))}
      </div>

      <figure key={index} className="tst__body" aria-live="polite">
        <svg viewBox="0 0 40 32" className="tst__mark" aria-hidden="true">
          <path
            d="M0 32V19.6C0 8.8 6.1 2.2 16.4 0l1.5 4.3C11.6 6.3 8.6 10.2 8.4 16h8v16H0Zm22 0V19.6C22 8.8 28.1 2.2 38.4 0l1.5 4.3C33.6 6.3 30.6 10.2 30.4 16h8v16H22Z"
            fill="currentColor"
          />
        </svg>
        <blockquote className="tst__quote">
          <p>
            <SlotText text={active.quote} />
          </p>
        </blockquote>
        <figcaption className="tst__person">
          <span className="tst__name">
            <SlotText text={active.name} />
          </span>
          <span className="tst__company">
            <SlotText text={active.company} />
          </span>
        </figcaption>
      </figure>

      <ul className="tst__people" onKeyDown={onKeyDown}>
        {items.map((item, i) => (
          <li key={i}>
            <button
              type="button"
              className={cn('tst__pick', i === index && 'is-active')}
              onClick={() => setIndex(i)}
              aria-current={i === index ? 'true' : undefined}
            >
              <span className="tst__avatar" aria-hidden="true">
                <Portrait item={item} sizes="48px" />
              </span>
              <span className="tst__pick-name">
                <SlotText text={item.name} />
              </span>
              <span className="tst__pick-num" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
