import type { CSSProperties } from 'react';
import { ButtonLink, Photo, SectionIndex } from '@/components/ee/primitives';
import type { EventsFifteenContent } from '@/services/content';

/**
 * The Fifteen: an intimate, invitation-like composition. A wide dinner photograph runs across
 * the section; the text sits beside it in a narrow column, like a place card: name, the line,
 * a short description, then a ruled foot with "By application." and the Apply button.
 * Fifteen small ticks under the name stand for the fifteen seats.
 */
export function EventsFifteen({ content }: { content: EventsFifteenContent }) {
  return (
    <section id="the-fifteen" className="section ev-fifteen" aria-labelledby="ev-fifteen-title" tabIndex={-1}>
      <div className="wrap">
        <SectionIndex index={content.index} label={content.label} />

        <div className="ev-fifteen__grid">
          <figure className="ev-fifteen__figure">
            <Photo image={content.image} sizes="(min-width: 992px) 60vw, 92vw" parallax className="ev-fifteen__photo" />
            <div className="ev-fifteen__inset" data-drift="-40">
              <Photo image={content.inset} sizes="(min-width: 992px) 16vw, 36vw" reveal="clip" />
            </div>
            <figcaption className="pt-caption">{content.caption}</figcaption>
          </figure>

          <div className="ev-fifteen__card">
            <h2 id="ev-fifteen-title" className="hm-h2 ev-fifteen__title" data-reveal="lines">
              {content.heading}
            </h2>
            <ol className="ev-seats" aria-hidden="true" data-inview>
              {Array.from({ length: 15 }, (_, i) => (
                <li key={i} style={{ '--i': i } as CSSProperties} />
              ))}
            </ol>
            <p className="ev-fifteen__statement" data-reveal="fade">
              {content.statement}
            </p>
            <p className="ev-fifteen__text" data-reveal="fade">
              {content.text}
            </p>
            <div className="ev-fifteen__foot" data-reveal="fade">
              <p className="ev-fifteen__detail">{content.detail}</p>
              <ButtonLink link={content.cta} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
