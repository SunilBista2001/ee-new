import { SectionIndex } from '@/components/ee/primitives';
import type { AboutStoryContent } from '@/services/content';
import { cn } from '@/lib/utils';
import { PhotoSlot } from '../components/photo-slot';

/**
 * How it started: the founder's story in his own voice. A narrow reading column runs beside a
 * thin rail; a few markers on the rail ("2016", "Now") hint at the passing years without
 * turning it into a corporate timeline. The turning point is set larger. "Then" and "Now"
 * photos follow side by side, below a hairline that separates them from the text.
 */
export function AboutStory({ content }: { content: AboutStoryContent }) {
  return (
    <section id="story" className="section ab-story" aria-labelledby="ab-story-title" tabIndex={-1}>
      <div className="wrap">
        <SectionIndex index={content.index} label={content.label} />

        <div className="ab-story__grid">
          <h2 id="ab-story-title" className="hm-h2 ab-story__title" data-reveal="lines">
            {content.heading}
          </h2>

          <div className="ab-story__body">
            <ol className="ab-story__rail" data-inview>
              {content.paragraphs.map((text, i) => {
                const marker = content.markers[i];
                return (
                  <li
                    key={text}
                    className={cn(
                      'ab-story__step',
                      i === 0 && 'is-first',
                      i === content.emphasisIndex && 'is-turn',
                      marker && 'has-marker',
                    )}
                    data-reveal="fade"
                  >
                    {marker ? <span className="ab-story__marker">{marker}</span> : null}
                    <p>{text}</p>
                  </li>
                );
              })}
            </ol>

            <p className="ab-story__sign" data-reveal="fade">
              <span className="ab-story__sign-name">{content.signature.name}</span>
              <span className="ab-story__sign-role">{content.signature.role}</span>
            </p>
          </div>
        </div>

        <div className="ab-story__photos" data-stagger>
          {content.photos.map((slot) => (
            <div key={slot.tag} data-stagger-item>
              <PhotoSlot slot={slot} sizes="(min-width: 768px) 46vw, 92vw" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
