import { SectionIndex, SlotText } from '@/components/ee/primitives';
import type { AboutValuesContent } from '@/services/content';

const isPlaceholder = (text: string) => /^\[[^\]]+\]$/.test(text.trim());

/**
 * Values: four slots, each one short word and one sentence, set as columns on a single rule.
 * Edit `aboutPage.values.values` in the content source; bracketed text renders as a marked
 * placeholder until the final values are supplied.
 */
export function AboutValues({ content }: { content: AboutValuesContent }) {
  return (
    <section id="values" className="section ab-values" aria-labelledby="ab-values-title" tabIndex={-1}>
      <div className="wrap">
        <SectionIndex index={content.index} label={content.label} />
        <h2 id="ab-values-title" className="hm-h2 hm-head" data-reveal="lines">
          {content.heading}
        </h2>

        <ol className="ab-values__list" data-inview data-stagger>
          {content.values.map((value, i) => (
            <li key={i} className={isPlaceholder(value.word) ? 'ab-value is-pending' : 'ab-value'} data-stagger-item>
              <span className="ab-value__num" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="ab-value__word">
                <SlotText text={value.word} />
              </h3>
              <p className="ab-value__text">
                <SlotText text={value.text} />
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
