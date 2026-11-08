import Image from 'next/image';
import { SectionIndex } from '@/components/ee/primitives';
import type { GuestsContent } from '@/services/content';

const SLOTS = ['outer', 'side', 'featured', 'side', 'outer'] as const;

/**
 * Upcoming guests: the numbered section index, a two-line editorial heading and five overlapping
 * portraits with the middle one featured, over a faint oversized word.
 *
 * Motion: the heading lines and copy use the shared reveal hooks; the portraits rise in as one
 * staggered group (`data-stagger`). Hover lift lives in CSS on `translate`, so it never fights
 * the GSAP entrance (which owns `transform`).
 */
export function Guests({ content }: { content: GuestsContent }) {
  return (
    <section id="guests" className="section guests" aria-labelledby="guests-title" tabIndex={-1}>
      <div className="wrap">
        <SectionIndex index={content.index} label={content.label} />

        <header className="guests__head">
          <h2 id="guests-title" className="guests__title" data-reveal="lines">
            <span className="guests__line">{content.heading.text}</span>{' '}
            {content.heading.accent ? <span className="guests__line serif">{content.heading.accent}</span> : null}
          </h2>
        </header>

        <div className="guests__stage">
          <p className="guests__word" aria-hidden="true">
            {content.backdropWord}
          </p>
          <ul className="guests__row" data-stagger>
            {content.guests.map((photo, i) => (
              <li key={photo.src} className={`guest guest--${SLOTS[i]} guest--${i + 1}`} data-stagger-item>
                <div className="guest__frame">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    sizes={
                      SLOTS[i] === 'featured' ? '(min-width: 768px) 340px, 64vw' : '(min-width: 768px) 240px, 22vw'
                    }
                    style={photo.focus ? { objectPosition: photo.focus } : undefined}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="guests__text" data-reveal="fade">
          {content.description}
        </p>
      </div>
    </section>
  );
}
