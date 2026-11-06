import Image from 'next/image';
import { SectionIndex } from '@/components/ee/primitives';
import type { GalleryContent } from '@/services/content';

/**
 * The Elite experience: a wide photo band with the heading set over it, then a horizontal
 * strip of moments (native scroll with snap points; nothing is pinned or hijacked).
 */
export function Gallery({ content }: { content: GalleryContent }) {
  const { feature } = content;
  return (
    <section id="inside" className="section gallery" aria-labelledby="gallery-title">
      <div className="wrap">
        <SectionIndex index={content.index} label={content.label} />
      </div>

      <div className="wrap">
        <figure className="band" data-reveal="clip">
          <Image
            src={feature.image.src}
            alt={feature.image.alt}
            width={feature.image.width}
            height={feature.image.height}
            sizes="(min-width: 1400px) 1320px, 100vw"
            style={feature.image.focus ? { objectPosition: feature.image.focus } : undefined}
            data-parallax=""
          />
          <div className="band__overlay">
            <h2 id="gallery-title" className="h2 band__title">
              {content.heading}
            </h2>
            <p className="band__intro">{content.intro}</p>
          </div>
          <figcaption className="band__fig mono">Fig. 01 — {feature.caption}</figcaption>
        </figure>
      </div>

      <div className="strip" tabIndex={0} role="region" aria-label="Event moments, scroll horizontally">
        <ul className="strip__track">
          {content.moments.map((moment, i) => (
            <li key={moment.caption} className="strip__item">
              <figure>
                <div className="strip__media">
                  <Image
                    src={moment.image.src}
                    alt={moment.image.alt}
                    width={moment.image.width}
                    height={moment.image.height}
                    sizes="(min-width: 768px) 360px, 75vw"
                    style={moment.image.focus ? { objectPosition: moment.image.focus } : undefined}
                  />
                </div>
                <figcaption className="strip__caption">
                  <span className="mono">Fig. {String(i + 2).padStart(2, '0')}</span>
                  {moment.caption}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>

      <div className="wrap">
        <ul className="gallery__formats" aria-label="Event formats" data-reveal="fade">
          {content.formats.map((format) => (
            <li key={format} className="tag">
              {format}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
