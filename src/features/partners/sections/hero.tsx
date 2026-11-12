import { ButtonLink, HeadlineText, Photo, TextLink } from '@/components/ee/primitives';
import type { Link, PartnersHeroContent } from '@/services/content';

/*
 * Partners hero: a mono label and the headline across the top. Below, a wide editorial photo
 * on the left; the right column holds the lead and the booking button at the top (visible on
 * the first screen) and a still from Elite's own summit at the bottom, level with the photo.
 * A thin strip of approved numbers closes the section.
 *
 * Motion hooks (lib/motion/page-motion.tsx): data-hero-title, data-hero-item, data-parallax.
 */
export function PartnersHero({
  content,
  bookCall,
  inquiryHref,
}: {
  content: PartnersHeroContent;
  bookCall: Link;
  inquiryHref: string;
}) {
  return (
    <section className="pt-hero" aria-labelledby="pt-hero-title">
      <div className="wrap">
        <p className="pt-label" data-hero-item>
          <span className="pt-label__dot" aria-hidden="true" />
          {content.label}
        </p>
        <h1 id="pt-hero-title" className="hm-display pt-hero__title" data-hero-title>
          <HeadlineText headline={content.headline} />
        </h1>

        <div className="pt-hero__grid">
          <div className="pt-hero__side">
            <p className="pt-hero__lead" data-hero-item>
              {content.lead}
            </p>
            <div className="pt-hero__ctas" data-hero-item>
              <ButtonLink link={bookCall} />
              <TextLink link={{ label: 'Send an inquiry', href: inquiryHref }} />
            </div>
          </div>

          <div className="pt-hero__main-wrap" data-hero-item>
            <Photo
              image={content.image}
              sizes="(min-width: 992px) 62vw, 100vw"
              priority
              parallax
              reveal={false}
              className="pt-hero__main"
            />
          </div>

          <figure className="pt-hero__inset" data-hero-item>
            <Photo image={content.inset} sizes="(min-width: 992px) 26vw, 100vw" priority reveal={false} />
            <figcaption className="pt-caption">{content.insetCaption}</figcaption>
          </figure>
        </div>

        <dl className="pt-facts" data-inview>
          {content.facts.map((fact) => (
            <div key={fact.label} className="pt-facts__item">
              <dt className="pt-facts__label">{fact.label}</dt>
              <dd className="pt-facts__value" data-count>
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
