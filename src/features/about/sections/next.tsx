import { SectionIndex } from '@/components/ee/primitives';
import type { AboutNextContent } from '@/services/content';

/**
 * Where we're going: the two lines carry the ambition; the cities follow as a typographic
 * index, each name with its coordinates in small mono, the only geography on the page.
 */
export function AboutNext({ content }: { content: AboutNextContent }) {
  return (
    <section id="next" className="section ab-next" aria-labelledby="ab-next-title" tabIndex={-1}>
      <div className="wrap">
        <SectionIndex index={content.index} label={content.label} />

        <div className="ab-next__grid">
          <div className="ab-next__head">
            <h2 id="ab-next-title" className="sr-only">
              {content.heading}
            </h2>
            {content.lines.map((line) => (
              <p key={line} className="hm-h2 ab-next__line" data-reveal="lines">
                {line}
              </p>
            ))}
          </div>

          <div className="ab-next__cities">
            <p className="ab-next__list-label" data-reveal="fade">
              {content.listLabel}
              <span>{String(content.cities.length).padStart(2, '0')}</span>
            </p>
            <ul className="ab-cities" data-inview data-stagger>
              {content.cities.map((city, i) => (
                <li key={city.name} className="ab-city" data-stagger-item>
                  <span className="ab-city__num" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="ab-city__name">{city.name}</span>
                  <span className="ab-city__coords">{city.coords}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
