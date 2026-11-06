import { Photo, SectionIndex, TextLink } from '@/components/ee/primitives';
import type { IntroContent } from '@/services/content';

/**
 * About: a large statement that fills in word by word as it scrolls past, then an overlapping
 * photo pair beside a hairline spec table of verified facts.
 */
export function Intro({ content }: { content: IntroContent }) {
  const [main, inset] = content.images;
  return (
    <section id="about" className="section intro" aria-labelledby="about-title" tabIndex={-1}>
      <div className="wrap">
        <SectionIndex index={content.index} label={content.label} />

        {/* Heading and statement run together as one paragraph-shaped block. */}
        <div className="intro__statement" data-reveal="words">
          <h2 id="about-title" className="intro__lead-in">
            {content.heading}
          </h2>{' '}
          <p>{content.statement}</p>
        </div>

        <div className="intro__grid">
          <div className="intro__media">
            <Photo image={main} sizes="(min-width: 992px) 40vw, 90vw" parallax className="intro__main" />
            <Photo image={inset} sizes="(min-width: 992px) 18vw, 45vw" className="intro__inset" />
          </div>

          <div className="intro__copy">
            <p className="intro__detail" data-reveal="fade">
              {content.detail}
            </p>
            <dl className="spec" data-reveal="fade">
              {content.facts.map((fact) => (
                <div key={fact.label} className="spec__row">
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
            <p className="intro__note mono">{content.factsNote}</p>
            <div data-reveal="fade">
              <TextLink link={content.cta} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
