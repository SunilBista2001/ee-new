import { HeadlineText, Photo, SectionIndex } from '@/components/ee/primitives';
import type { AboutDifferentContent } from '@/services/content';

/**
 * How we're different, on a warm beige band. The opening line is the heading; the three points
 * fill in word by word beside two photos from Elite's summits, offset against each other. The
 * section ends on "Amazing people. Having fun." set at display size across the band.
 */
export function AboutDifferent({ content }: { content: AboutDifferentContent }) {
  const [main, inset] = content.images;
  return (
    <section id="different" className="section ab-diff on-beige" aria-labelledby="ab-diff-title" tabIndex={-1}>
      <div className="wrap">
        <SectionIndex index={content.index} label={content.label} />

        <div className="ab-diff__grid">
          <div className="ab-diff__copy">
            <h2 id="ab-diff-title" className="hm-h2 ab-diff__title" data-reveal="lines">
              {content.heading}
            </h2>
            <ol className="ab-diff__points">
              {content.points.map((point, i) => (
                <li key={point} className="ab-diff__point">
                  <span className="ab-diff__num" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p data-reveal="words">{point}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="ab-diff__media">
            <Photo image={main} sizes="(min-width: 992px) 30vw, 70vw" parallax className="ab-diff__main" />
            <div className="ab-diff__inset" data-drift="24">
              <Photo image={inset} sizes="(min-width: 992px) 16vw, 40vw" />
            </div>
          </div>
        </div>

        <p className="hm-display ab-diff__closing" data-reveal="lines">
          <HeadlineText headline={content.closing} />
        </p>
      </div>
    </section>
  );
}
