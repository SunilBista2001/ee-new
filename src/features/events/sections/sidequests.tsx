import { Photo, SectionIndex, SlotText } from '@/components/ee/primitives';
import type { EventsSidequestsContent } from '@/services/content';

/**
 * Sidequests: the lighter, playful format. The statement leads; the kinds of things a
 * Sidequest can be follow as a short numbered run that ends open ("…"), and the next one is
 * set apart as a torn-off ticket stub. A tall padel photo and a small, slightly tilted
 * snapshot carry the mood, still inside the same frames and palette as the rest of the site.
 */
export function EventsSidequests({ content }: { content: EventsSidequestsContent }) {
  return (
    <section
      id="sidequests"
      className="section section--ivory on-beige ev-quests"
      aria-labelledby="ev-quests-title"
      tabIndex={-1}
    >
      <div className="wrap">
        <SectionIndex index={content.index} label={content.label} />

        <div className="ev-quests__grid">
          <div className="ev-quests__copy">
            <h2 id="ev-quests-title" className="hm-h2 ev-quests__title" data-reveal="lines">
              {content.heading}
            </h2>
            <p className="ev-quests__statement" data-reveal="fade">
              {content.statement}
            </p>
            <p className="ev-quests__text" data-reveal="fade">
              {content.text}
            </p>

            <ol className="ev-quests__ideas" data-stagger>
              {content.ideas.map((idea, i) => (
                <li key={idea} className="ev-quests__idea" data-stagger-item>
                  <span className="ev-quests__num" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="ev-quests__name">{idea}</span>
                </li>
              ))}
            </ol>

            <p className="ev-ticket" data-reveal="fade">
              <span className="ev-ticket__label">{content.next.label}</span>
              <span className="ev-ticket__text">
                <SlotText text={content.next.text} />
              </span>
            </p>
          </div>

          <div className="ev-quests__media">
            <Photo image={content.image} sizes="(min-width: 992px) 30vw, 70vw" parallax className="ev-quests__photo" />
            <div className="ev-quests__snap" data-drift="50">
              <Photo image={content.inset} sizes="(min-width: 992px) 16vw, 40vw" reveal="clip" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
