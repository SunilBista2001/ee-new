import Image from 'next/image';
import type { ReactNode } from 'react';
import { ArrowIcon, BrandMark, ButtonLink, HeadlineText } from '@/components/ee/primitives';
import { PhotoWallTrack } from '@/features/home/components/photo-wall-track';
import type { HeroContent, HeroHighlight, ImageAsset } from '@/services/content';

/*
 * Hero: an editorial two-line headline over a curved wall of real summit photography.
 *
 * Everything around the photo wall is real content: the event formats (Learn / Connect / Share)
 * are pinned on the wall, a verified attendee figure and the speakers card sit either side, and
 * the bottom corners carry social proof and the brand line. From 1200px the side pieces float
 * around the composition (joined to the wall by hairline connectors); below that they fall into
 * a regular flow under the wall.
 *
 * Motion hooks (see lib/motion/page-motion.tsx): data-hero-title, data-hero-item,
 * data-hero-panel (wall entrance), data-hero-float (cards pop in), data-float (scroll drift).
 */

const HIGHLIGHT_ICONS: Record<HeroHighlight['icon'], ReactNode> = {
  learn: (
    <>
      <rect x="7.5" y="2.5" width="5" height="9" rx="2.5" />
      <path d="M4.5 9.5a5.5 5.5 0 0 0 11 0M10 15v2.5" />
    </>
  ),
  connect: (
    <>
      <circle cx="7" cy="7" r="2.75" />
      <circle cx="13.5" cy="8" r="2.25" />
      <path d="M2.5 16.5c.6-2.6 2.3-4 4.5-4s3.9 1.4 4.5 4M12.5 12.6c.3-.1.7-.1 1-.1 1.9 0 3.3 1.2 3.9 3.5" />
    </>
  ),
  share: (
    <>
      <path d="M3 5.5A2.5 2.5 0 0 1 5.5 3h6A2.5 2.5 0 0 1 14 5.5v3A2.5 2.5 0 0 1 11.5 11H8l-3 2.5V11h0A2 2 0 0 1 3 9V5.5Z" />
      <path d="M14 7h.5A2.5 2.5 0 0 1 17 9.5V12a2 2 0 0 1-2 2v2.5L12 14H9.5" />
    </>
  ),
};

function Avatars({ images, size = 'md' }: { images: ImageAsset[]; size?: 'sm' | 'md' }) {
  return (
    <span className={`hero-avatars hero-avatars--${size}`} aria-hidden="true">
      {images.map((image) => (
        <span key={image.src} className="hero-avatars__item">
          <Image
            src={image.src}
            alt=""
            width={image.width}
            height={image.height}
            sizes="44px"
            style={image.focus ? { objectPosition: image.focus } : undefined}
          />
        </span>
      ))}
    </span>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M12 0c.5 6.6 5.4 11.5 12 12-6.6.5-11.5 5.4-12 12-.5-6.6-5.4-11.5-12-12C6.6 11.5 11.5 6.6 12 0Z" />
    </svg>
  );
}

/** Rotating text seal with the brand mark in the middle. Purely decorative. */
function Seal({ text }: { text: string }) {
  return (
    <div className="hero-seal" aria-hidden="true">
      <svg viewBox="0 0 120 120" className="hero-seal__ring">
        <defs>
          <path id="hero-seal-path" d="M60 60m-46 0a46 46 0 1 1 92 0a46 46 0 1 1-92 0" />
        </defs>
        <text>
          <textPath href="#hero-seal-path" textLength="288" lengthAdjust="spacing">
            {text.toUpperCase()}
          </textPath>
        </text>
      </svg>
      <BrandMark className="hero-seal__mark" />
    </div>
  );
}

/**
 * Concave wall of event photos. The middle frame carries the meaning; side frames add depth and
 * expand into the focal slot on hover (the middle frame steps back while they do).
 */
function PhotoWall({ stage, highlights }: Pick<HeroContent, 'stage' | 'highlights'>) {
  const [p1, p2, p3, p4] = stage.panels;
  const side = (image: ImageAsset, index: number) => (
    <div
      className={`hero-wall__panel hero-wall__panel--${index}`}
      data-panel={index}
      data-hero-panel
      aria-hidden="true"
    >
      <Image
        src={image.src}
        alt=""
        width={image.width}
        height={image.height}
        sizes="(min-width: 1200px) 560px, 60vw"
        preload={index === 2 || index === 3}
        style={image.focus ? { objectPosition: image.focus } : undefined}
      />
    </div>
  );

  return (
    <div className="hero-wall">
      <PhotoWallTrack>
        {side(p1, 1)}
        {side(p2, 2)}
        <figure className="hero-wall__panel hero-wall__panel--main" data-panel="main" data-hero-panel>
          <Image
            src={stage.main.src}
            alt={stage.main.alt}
            width={stage.main.width}
            height={stage.main.height}
            sizes="(min-width: 1200px) 560px, 70vw"
            preload
            quality={85}
            style={stage.main.focus ? { objectPosition: stage.main.focus } : undefined}
          />
        </figure>
        {side(p3, 3)}
        {side(p4, 4)}
      </PhotoWallTrack>

      <ul className="hero-wall__chips" aria-label="What happens at Elite">
        {highlights.map((item, i) => (
          <li key={item.title} className={`hero-chip-slot hero-chip-slot--${i + 1}`} data-hero-float>
            <span className="hero-chip glass">
              <span className="hero-chip__icon" aria-hidden="true">
                <svg viewBox="0 0 20 20">{HIGHLIGHT_ICONS[item.icon]}</svg>
              </span>
              <span className="hero-chip__text">
                <span className="hero-chip__title">{item.title}</span>
                <span className="hero-chip__meta">{item.meta}</span>
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Hero({ content }: { content: HeroContent }) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="wrap">
        <div className="hero__frame">
          <div className="hero__head">
            <p className="hero__meta" data-hero-item>
              <span className="hero__status">
                <span className="dot dot--live" aria-hidden="true" />
                {content.status.label}: <strong>{content.status.value}</strong>
              </span>
              <span className="hero__meta-sep" aria-hidden="true" />
              <span className="hero__coords">{content.meta}</span>
            </p>

            <h1 id="hero-title" className="display hero__title" data-hero-title>
              <span className="hero__line">{content.headlineStart}</span>{' '}
              <span className="hero__line">
                <HeadlineText headline={content.headlineEnd} />
              </span>
            </h1>

            <p className="hero__lead" data-hero-item>
              {content.lead}
            </p>

            <div className="hero__ctas" data-hero-item>
              <ButtonLink link={content.primaryCta} />
              <ButtonLink link={content.secondaryCta} variant="secondary" icon={false} />
            </div>
          </div>

          <PhotoWall stage={content.stage} highlights={content.highlights} />

          <div className="hero__cards">
            <div className="hero__card-slot hero__card-slot--stat" data-float="0">
              <div className="hero-card hero-card--stat glass" data-hero-float>
                <span className="hero-card__icon" aria-hidden="true">
                  <svg viewBox="0 0 20 20">{HIGHLIGHT_ICONS.connect}</svg>
                </span>
                <p className="hero-card__value">{content.stat.value}</p>
                <p className="hero-card__label">{content.stat.label}</p>
                <p className="hero-card__note">{content.stat.note}</p>
              </div>
            </div>

            <div className="hero__card-slot hero__card-slot--speakers" data-float="1">
              <a className="hero-card hero-card--speakers glass" href={content.speakers.link.href} data-hero-float>
                <span className="hero-card__row">
                  <Avatars images={content.speakers.avatars} />
                  <span className="hero-card__go" aria-hidden="true">
                    <ArrowIcon />
                  </span>
                </span>
                <span className="hero-card__title">{content.speakers.title}</span>
                <span className="hero-card__text">{content.speakers.text}</span>
                <span className="sr-only">{content.speakers.link.label}</span>
              </a>
            </div>
          </div>

          <div className="hero__foot" data-hero-item>
            <div className="hero-proof">
              <span className="hero-proof__rule" aria-hidden="true" />
              <p className="hero-proof__text">{content.proof.text}</p>
              <Avatars images={content.proof.avatars} size="sm" />
            </div>
            <div className="hero-note">
              <StarIcon className="hero-note__star" />
              <p className="hero-note__text">
                {content.note.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </p>
            </div>
          </div>

          <Seal text={content.seal} />

          {/* Hairlines from the side cards into the wall (wide screens only). */}
          <svg className="hero__lines" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true">
            <path d="M 92 550 C 84 680, 108 762, 146 774" />
            <path d="M 908 610 C 916 716, 894 774, 854 784" />
          </svg>
        </div>
      </div>
    </section>
  );
}
