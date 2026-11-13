import type { CSSProperties } from 'react';
import { Photo, SectionIndex } from '@/components/ee/primitives';
import type { PodcastStudioContent } from '@/services/content';

/** Dial scale: 88 to 108, the end label sits where the needle settles. */
const DIAL_MIN = 88;
const DIAL_MAX = 108;
const DIAL_LOCK = 105;
const NUMBERS = Array.from({ length: (DIAL_MAX - DIAL_MIN) / 2 + 1 }, (_, i) => DIAL_MIN + i * 2);
const pct = (value: number) => ((value - DIAL_MIN) / (DIAL_MAX - DIAL_MIN)) * 100;

/**
 * Behind the scenes: a statement that fills in word by word as it is read, set against a
 * collage of two studio frames, then a radio dial whose needle tunes across the scale with the
 * scroll and settles on the show. Everything here is decorative except the statement and text.
 */
export function PodcastStudio({ content }: { content: PodcastStudioContent }) {
  const [main, second] = content.images;
  return (
    <section className="section pc-studio" aria-labelledby="pc-studio-title">
      <div className="wrap">
        <SectionIndex index={content.index} label={content.label} />
        <h2 id="pc-studio-title" className="sr-only">
          {content.label}
        </h2>

        <div className="pc-studio__grid">
          <div className="pc-studio__copy">
            <p className="pc-studio__statement" data-reveal="words">
              {content.statement}
            </p>
            <p className="pc-studio__text" data-reveal="fade">
              {content.text}
            </p>
          </div>

          <div className="pc-studio__collage">
            <figure className="pc-studio__main">
              <Photo image={main} sizes="(min-width: 992px) 40vw, 92vw" parallax />
              <figcaption className="pt-caption">{content.captions[0]}</figcaption>
            </figure>
            <figure className="pc-studio__second" data-drift="-36">
              <Photo image={second} sizes="(min-width: 992px) 18vw, 44vw" reveal="clip" />
              <figcaption className="pt-caption">{content.captions[1]}</figcaption>
            </figure>
          </div>
        </div>

        <div
          className="pc-dial is-locked"
          data-pc-dial
          aria-hidden="true"
          style={{ '--lock': `${pct(DIAL_LOCK)}%` } as CSSProperties}
        >
          <div className="pc-dial__labels">
            <span className="pc-dial__start">{content.dial.start}</span>
            <span className="pc-dial__end">{content.dial.end}</span>
          </div>
          <div className="pc-dial__track" data-pc-dial-track>
            <div className="pc-dial__ticks" />
            {NUMBERS.map((n, i) => (
              <span key={n} className={i % 2 ? 'pc-dial__num is-odd' : 'pc-dial__num'} style={{ left: `${pct(n)}%` }}>
                {n}
              </span>
            ))}
            <span className="pc-dial__station" />
            <span className="pc-dial__needle" data-pc-needle />
          </div>
        </div>
      </div>
    </section>
  );
}
