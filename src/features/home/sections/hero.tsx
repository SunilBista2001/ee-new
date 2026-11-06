import Image from 'next/image';
import { ButtonLink, HeadlineText } from '@/components/ee/primitives';
import type { HeroContent, ImageAsset } from '@/services/content';

function Floater({ image, index }: { image: ImageAsset; index: number }) {
  return (
    <div className={`hero__float hero__float--${index + 1}`} data-float={index} aria-hidden="true">
      <div className="hero__float-inner" data-hero-float>
        <Image
          src={image.src}
          alt=""
          width={image.width}
          height={image.height}
          sizes="220px"
          priority={index < 2}
          style={image.focus ? { objectPosition: image.focus } : undefined}
        />
      </div>
    </div>
  );
}

/**
 * Hero: a centered editorial headline with a photo pill set inline in the text, real event
 * photos floating around it, and a slim bottom bar with the lead and actions.
 */
export function Hero({ content }: { content: HeroContent }) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="wrap hero__stage">
        {content.floaters.map((image, i) => (
          <Floater key={image.src} image={image} index={i} />
        ))}

        <div className="hero__center">
          <p className="hero__meta" data-hero-item>
            <span className="hero__status">
              <span className="dot dot--live" aria-hidden="true" />
              {content.status.label}: <strong>{content.status.value}</strong>
            </span>
            <span className="hero__meta-sep" aria-hidden="true" />
            <span className="hero__coords">{content.meta}</span>
          </p>

          <h1 id="hero-title" className="display hero__title" data-hero-title>
            {content.headlineStart}{' '}
            <span className="pill-img" data-hero-pill>
              <Image
                src={content.inlineImage.src}
                alt=""
                width={content.inlineImage.width}
                height={content.inlineImage.height}
                sizes="240px"
                priority
                style={content.inlineImage.focus ? { objectPosition: content.inlineImage.focus } : undefined}
              />
            </span>{' '}
            <HeadlineText headline={content.headlineEnd} />
          </h1>
        </div>
      </div>

      <div className="wrap">
        <div className="hero__bar" data-hero-item>
          <p className="hero__lead">{content.lead}</p>
          <div className="hero__ctas">
            <ButtonLink link={content.primaryCta} />
            <ButtonLink link={content.secondaryCta} variant="secondary" icon={false} />
          </div>
        </div>
      </div>
    </section>
  );
}
