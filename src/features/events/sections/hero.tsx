import { ButtonLink, HeadlineText, Photo } from '@/components/ee/primitives';
import type { EventsHeroContent } from '@/services/content';
import { cn } from '@/lib/utils';

/** Frame shape per slot, in reading order: wide, tall, square, landscape. */
const SLOTS = ['is-wide', 'is-tall', 'is-square', 'is-land'] as const;
const SIZES = [
  '(min-width: 992px) 38vw, 92vw',
  '(min-width: 992px) 20vw, 46vw',
  '(min-width: 992px) 18vw, 46vw',
  '(min-width: 992px) 24vw, 92vw',
];

/**
 * Events hero: the claim, its answer, one button down to the calendar. Under it an editorial
 * strip of event photos in varied proportions, set on a shared baseline but stepping in height,
 * the way a contact sheet reads, rather than a uniform grid.
 *
 * Motion hooks (lib/motion/page-motion.tsx): data-hero-title, data-hero-item, data-drift.
 */
export function EventsHero({ content }: { content: EventsHeroContent }) {
  return (
    <section className="ev-hero" aria-labelledby="ev-hero-title">
      <div className="wrap">
        <div className="ev-hero__head">
          <p className="pt-label" data-hero-item>
            <span className="pt-label__dot" aria-hidden="true" />
            {content.label}
          </p>
          <h1 id="ev-hero-title" className="hm-display ev-hero__title" data-hero-title>
            <HeadlineText headline={content.headline} />
          </h1>
          <div className="ev-hero__side" data-hero-item>
            <p className="ev-hero__lead">{content.lead}</p>
            <ButtonLink link={content.primaryCta} />
          </div>
        </div>

        <ul className="ev-strip" aria-label="Moments from Elite Entrepreneurs events">
          {content.photos.slice(0, 4).map((photo, i) => (
            <li key={photo.src} className={cn('ev-strip__item', SLOTS[i])} data-hero-item>
              <Photo
                image={photo}
                sizes={SIZES[i] ?? '46vw'}
                priority={i < 2}
                reveal={false}
                className="ev-strip__photo"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
