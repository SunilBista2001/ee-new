import { ButtonLink, SectionIndex } from '@/components/ee/primitives';
import type { Link, PartnersBenefitsContent } from '@/services/content';

/**
 * What partners get: on the tinted band. The heading and a booking button hold the left
 * column (sticky on desktop) while the six items run as an index of large words on hairlines.
 */
export function PartnersBenefits({ content, bookCall }: { content: PartnersBenefitsContent; bookCall: Link }) {
  return (
    <section id="benefits" className="section pt-get" aria-labelledby="pt-get-title" tabIndex={-1}>
      <div className="wrap">
        <SectionIndex index={content.index} label={content.label} />

        <div className="pt-get__layout">
          <div className="pt-get__head">
            <h2 id="pt-get-title" className="hm-h2" data-reveal="lines">
              {content.heading}
            </h2>
            <div data-reveal="fade">
              <ButtonLink link={bookCall} />
            </div>
          </div>

          <ol className="pt-get__list" data-stagger>
            {content.items.map((item, i) => (
              <li key={item} className="pt-get__item" data-stagger-item>
                <span className="pt-get__num" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="pt-get__name">{item}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
