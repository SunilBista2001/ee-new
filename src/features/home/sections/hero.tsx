import { ButtonLink, HeadlineText, Photo } from '@/components/ee/primitives';
import type { HeroContent } from '@/services/content';

/*
 * Hero: an oversized serif headline, then the lead and buttons on the left while a small
 * photo hangs off the right and overlaps the wide main image below it. The main image is
 * full-bleed: it starts as an inset, rounded frame and opens to the full width as the page
 * scrolls, with the photo drifting inside it.
 *
 * Motion hooks (lib/motion/page-motion.tsx): data-hero-title, data-hero-item, data-expand,
 * data-parallax, data-drift.
 */
export function Hero({ content }: { content: HeroContent }) {
  return (
    <section className="hm-hero" aria-labelledby="hero-title">
      <div className="wrap hm-hero__head">
        <h1 id="hero-title" className="hm-display hm-hero__title" data-hero-title>
          <HeadlineText headline={content.headline} />
        </h1>

        <div className="hm-hero__row">
          <div className="hm-hero__side">
            <p className="hm-hero__lead" data-hero-item>
              {content.lead}
            </p>
            <div className="hm-hero__ctas" data-hero-item>
              <ButtonLink link={content.primaryCta} />
              <ButtonLink link={content.secondaryCta} variant="secondary" icon={false} />
            </div>
          </div>

          <div className="hm-hero__inset" data-hero-item>
            <div data-drift="28">
              <Photo image={content.inset} sizes="(min-width: 992px) 22vw, 40vw" priority reveal={false} />
            </div>
          </div>
        </div>
      </div>

      <div className="hm-hero__stage" data-hero-item>
        <div className="hm-hero__frame" data-expand="load">
          <Photo image={content.image} sizes="100vw" priority parallax reveal={false} className="hm-hero__media" />
        </div>
      </div>
    </section>
  );
}
