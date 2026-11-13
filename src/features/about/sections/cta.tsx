import { BrandMark, ButtonLink, Photo, TextLink } from '@/components/ee/primitives';
import type { AboutCtaContent } from '@/services/content';

/**
 * Closing call to action on a warm panel: the line and both actions on the left, the empty
 * ballroom of an Elite venue on the right, waiting for the room to fill.
 */
export function AboutCta({ content }: { content: AboutCtaContent }) {
  return (
    <section className="ab-cta" aria-labelledby="ab-cta-title">
      <div className="wrap">
        <div className="ab-cta__panel on-beige">
          <div className="ab-cta__copy">
            <BrandMark className="ab-cta__mark" />
            <h2 id="ab-cta-title" className="hm-h2 ab-cta__title" data-reveal="lines">
              {content.heading}
            </h2>
            <div className="ab-cta__actions" data-reveal="fade">
              <ButtonLink link={content.primaryCta} />
              <TextLink link={content.secondaryCta} />
            </div>
          </div>
          <figure className="ab-cta__figure">
            <Photo image={content.image} sizes="(min-width: 992px) 40vw, 92vw" parallax className="ab-cta__photo" />
            <figcaption className="pt-caption">{content.caption}</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
