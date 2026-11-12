import Image from 'next/image';
import { SectionIndex } from '@/components/ee/primitives';
import type { AudienceContent } from '@/services/content';

/**
 * Who you'll meet: set as type, not cards. The "For" list runs large and numbered; the
 * "Not for" list sits beside it, quieter, and each line is struck through as it scrolls in.
 * A row of community faces closes the heading.
 */
export function Audience({ content }: { content: AudienceContent }) {
  return (
    <section id="community" className="section hm-aud" aria-labelledby="aud-title" tabIndex={-1}>
      <div className="wrap">
        <SectionIndex index={content.index} />

        <div className="hm-aud__head">
          <h2 id="aud-title" className="hm-h2" data-reveal="lines">
            {content.heading}
          </h2>
          <ul className="hm-faces" aria-hidden="true" data-stagger>
            {content.faces.map((face) => (
              <li key={face.src} className="hm-faces__item" data-stagger-item>
                <Image src={face.src} alt="" width={face.width} height={face.height} sizes="72px" />
              </li>
            ))}
          </ul>
        </div>

        <div className="hm-aud__grid">
          <div className="hm-aud__col hm-aud__col--for">
            <h3 className="hm-aud__title">{content.forList.title}</h3>
            <ol className="hm-aud__list" data-stagger>
              {content.forList.items.map((item, i) => (
                <li key={item} className="hm-aud__item" data-stagger-item>
                  <span className="hm-aud__num" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {item}
                </li>
              ))}
            </ol>
          </div>

          <div className="hm-aud__col hm-aud__col--not" data-inview>
            <h3 className="hm-aud__title">{content.notForList.title}</h3>
            <ul className="hm-aud__list">
              {content.notForList.items.map((item) => (
                <li key={item} className="hm-aud__item">
                  <span className="hm-aud__strike">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
