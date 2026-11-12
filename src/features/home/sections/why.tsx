import { Photo, SectionIndex, TextLink } from '@/components/ee/primitives';
import type { WhyContent } from '@/services/content';

/**
 * Why we exist: an editorial spread. The headline runs wide across the top; below it a tall
 * photo with a smaller one overlapping its corner (each drifting at its own pace) sits beside
 * the argument, one idea per line. The short lines fill in word by word on scroll.
 */
export function Why({ content }: { content: WhyContent }) {
  const [main, inset] = content.images;
  return (
    <section id="about" className="section hm-why" aria-labelledby="why-title" tabIndex={-1}>
      <div className="wrap">
        <SectionIndex index={content.index} label={content.label} />
        <h2 id="why-title" className="hm-h2 hm-why__title" data-reveal="lines">
          {content.heading}
        </h2>

        <div className="hm-why__grid">
          <div className="hm-why__media">
            <Photo image={main} sizes="(min-width: 992px) 38vw, 80vw" parallax className="hm-why__main" />
            <div className="hm-why__inset" data-drift="32">
              <Photo image={inset} sizes="(min-width: 992px) 20vw, 44vw" />
            </div>
          </div>

          <div className="hm-why__body">
            <p className="hm-why__lines" data-reveal="words">
              {content.lines.map((line) => (
                <span key={line}>{line} </span>
              ))}
            </p>
            <p className="hm-why__turn" data-reveal="fade">
              {content.emphasis}
            </p>
            <p className="hm-why__text" data-reveal="fade">
              {content.body}
            </p>
            <p className="hm-why__closing" data-reveal="fade">
              {content.closing}
            </p>
            <div data-reveal="fade">
              <TextLink link={content.cta} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
