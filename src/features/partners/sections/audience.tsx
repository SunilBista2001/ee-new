import { Photo, SectionIndex } from '@/components/ee/primitives';
import type { PartnersAudienceContent } from '@/services/content';

/**
 * Who's in the room: set as type, not cards. The roles run as one large, wrapping line,
 * each with a small index, and close on the founders the room is built around, set apart in
 * brown on its own line. A letterboxed photo of the room itself sits beneath.
 */
export function PartnersAudience({ content }: { content: PartnersAudienceContent }) {
  return (
    <section id="audience" className="section pt-aud" aria-labelledby="pt-aud-title" tabIndex={-1}>
      <div className="wrap">
        <SectionIndex index={content.index} label={content.label} />

        <div className="pt-aud__layout">
          <h2 id="pt-aud-title" className="hm-h2 pt-aud__title" data-reveal="lines">
            {content.heading}
          </h2>

          <div className="pt-aud__body">
            <ul className="pt-roles" data-stagger>
              {content.items.map((item, i) => (
                <li key={item} className="pt-roles__item" data-stagger-item>
                  <span className="pt-roles__num" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="pt-aud__highlight" data-reveal="fade">
              <span className="pt-roles__num" aria-hidden="true">
                {String(content.items.length + 1).padStart(2, '0')}
              </span>
              {content.highlight}
            </p>
          </div>
        </div>

        <figure className="pt-aud__figure">
          <Photo image={content.image} sizes="100vw" parallax className="pt-aud__photo" />
          <figcaption className="pt-caption">{content.caption}</figcaption>
        </figure>
      </div>
    </section>
  );
}
