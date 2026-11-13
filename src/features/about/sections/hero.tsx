import { HeadlineText, Photo } from '@/components/ee/primitives';
import type { AboutHeroContent } from '@/services/content';

/*
 * About hero: typography first. The headline takes the top of the page; the lead sits apart,
 * low on the right, so the two read as statement and answer. A wide still from Elite's own
 * summit closes the first screen as a calm band, not a full-bleed takeover.
 *
 * Motion hooks (lib/motion/page-motion.tsx): data-hero-title, data-hero-item, data-parallax.
 */
export function AboutHero({ content }: { content: AboutHeroContent }) {
  return (
    <section className="ab-hero" aria-labelledby="ab-hero-title">
      <div className="wrap">
        <div className="ab-hero__head">
          <p className="pt-label" data-hero-item>
            <span className="pt-label__dot" aria-hidden="true" />
            {content.label}
          </p>
          <h1 id="ab-hero-title" className="hm-display ab-hero__title" data-hero-title>
            <HeadlineText headline={content.headline} />
          </h1>
          <p className="ab-hero__lead" data-hero-item>
            {content.lead}
          </p>
        </div>

        <figure className="ab-hero__figure" data-hero-item>
          <Photo
            image={content.image}
            sizes="(min-width: 1400px) 1320px, 100vw"
            priority
            parallax
            reveal={false}
            className="ab-hero__photo"
          />
          <figcaption className="pt-caption">{content.caption}</figcaption>
        </figure>
      </div>
    </section>
  );
}
