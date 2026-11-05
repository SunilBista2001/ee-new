import Image from 'next/image';
import { WipeImage } from '@/components/media/wipe-image';
import { AccentHeading } from '@/components/ui/accent-heading';
import { INITIAL_STYLE, MOTION_IDS } from '@/lib/motion/reveal-config';
import type { HeroContent } from '@/services/content';

/** Wrapper class of each floating hero image, in content order (arc, circuit, man, woman). */
const FLOATING_IMAGE_CLASSES = ['img-arc', 'img-circuit', 'img-man', 'img-woman'] as const;

export function Hero({ content }: { content: HeroContent }) {
  return (
    <>
      <div className="hero-gradient" />
      <header className="section_header-centered">
        <div className="hero-text-centered mobile-padding-hero">
          <div className="container-large">
            <div className="text-centered">
              <div className="padding-top padding-xxlarge">
                <div className="text-align-center">
                  <div className="max-width-xlarge">
                    <AccentHeading
                      as="h1"
                      heading={content.heading}
                      data-w-id={MOTION_IDS.hero.heading}
                      style={INITIAL_STYLE.slideUp}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="padding-global">
          <div className="container-large">
            <div className="padding-bottom padding-medium">
              <div className="cta8_component">
                <div id="w-node-_89cb5670-34e8-0c6e-446c-3cf8042ad810-a6a2ca3f" className="cta8_content">
                  <div data-w-id={MOTION_IDS.hero.lead} style={INITIAL_STYLE.hidden} className="text-size-large">
                    {content.lead}
                  </div>
                </div>
                <a
                  id="w-node-_89cb5670-34e8-0c6e-446c-3cf8042ad816-a6a2ca3f"
                  href={content.cta.href}
                  className="button is-secondary w-button"
                >
                  {content.cta.label}
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-parallax-container">
          {content.images.map((image, index) => (
            <div
              key={image.src}
              data-w-id={MOTION_IDS.hero.images[index]}
              className={`${FLOATING_IMAGE_CLASSES[index]} img-parallax`}
            >
              <WipeImage wrapperClass="wipe-container">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  loading="eager"
                  data-pixelate={index === 0 ? '' : undefined}
                />
              </WipeImage>
            </div>
          ))}
        </div>
        <div className="bg-grid" aria-hidden="true" />
      </header>
    </>
  );
}
