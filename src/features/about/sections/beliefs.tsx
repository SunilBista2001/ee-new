import { Photo, SectionIndex } from '@/components/ee/primitives';
import type { AboutBeliefsContent } from '@/services/content';
import { cn } from '@/lib/utils';

/**
 * What we believe: three beliefs as full-width editorial rows on hairlines that draw in, each
 * with a large numeral. The middle belief carries a small photo from the room; the last, the
 * shortest, is set as a closing statement on its own.
 */
export function AboutBeliefs({ content }: { content: AboutBeliefsContent }) {
  const last = content.beliefs.length - 1;
  return (
    <section id="beliefs" className="section ab-beliefs" aria-labelledby="ab-beliefs-title" tabIndex={-1}>
      <div className="wrap">
        <SectionIndex index={content.index} label={content.label} />
        <h2 id="ab-beliefs-title" className="hm-h2 hm-head" data-reveal="lines">
          {content.heading}
        </h2>

        <ol className="ab-beliefs__list">
          {content.beliefs.map((belief, i) => (
            <li
              key={belief.title}
              className={cn('ab-belief', belief.image && 'has-image', i === last && 'is-last')}
              data-inview
            >
              <span className="ab-belief__num" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="ab-belief__title" data-reveal="lines">
                {belief.title}
              </h3>
              <div className="ab-belief__body" data-reveal="fade">
                <p className="ab-belief__text">{belief.text}</p>
                {belief.image ? (
                  <Photo image={belief.image} sizes="(min-width: 992px) 20vw, 60vw" className="ab-belief__photo" />
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
