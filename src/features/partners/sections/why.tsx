import { Photo, SectionIndex } from '@/components/ee/primitives';
import type { PartnersWhyContent } from '@/services/content';

/**
 * Why brands partner with EE: the headline runs wide; the argument sits beside a tall photo
 * with a smaller one cut into its corner. The three reasons follow as numbered columns on a
 * rule that draws in, not as cards.
 */
export function PartnersWhy({ content }: { content: PartnersWhyContent }) {
  const [main, inset] = content.images;
  return (
    <section id="why" className="section pt-why" aria-labelledby="pt-why-title" tabIndex={-1}>
      <div className="wrap">
        <SectionIndex index={content.index} label={content.label} />
        <h2 id="pt-why-title" className="hm-h2 pt-why__title" data-reveal="lines">
          {content.heading}
        </h2>

        <div className="pt-why__grid">
          <div className="pt-why__body">
            <p className="pt-why__lines" data-reveal="words">
              {content.lines.map((line) => (
                <span key={line}>{line} </span>
              ))}
            </p>
            <p className="pt-why__text" data-reveal="fade">
              {content.body}
            </p>
          </div>

          <div className="pt-why__media">
            <Photo image={main} sizes="(min-width: 992px) 34vw, 70vw" parallax className="pt-why__main" />
            <div className="pt-why__inset" data-drift="28">
              <Photo image={inset} sizes="(min-width: 992px) 18vw, 40vw" />
            </div>
          </div>
        </div>

        <ol className="pt-reasons" data-inview data-stagger>
          {content.benefits.map((benefit, i) => (
            <li key={benefit.title} className="pt-reasons__item" data-stagger-item>
              <span className="pt-reasons__num" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="pt-reasons__title">{benefit.title}</h3>
              {benefit.text ? <p className="pt-reasons__text">{benefit.text}</p> : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
