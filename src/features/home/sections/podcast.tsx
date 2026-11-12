import { ButtonLink, Photo } from '@/components/ee/primitives';
import type { PodcastContent } from '@/services/content';

/** Podcast: kept deliberately small. A thumbnail, the title and line, then the YouTube button. */
export function Podcast({ content }: { content: PodcastContent }) {
  return (
    <section id="podcast" className="hm-pod" aria-labelledby="pod-title" tabIndex={-1}>
      <div className="wrap">
        <div className="hm-pod__inner" data-reveal="fade">
          <Photo image={content.image} sizes="180px" reveal={false} className="hm-pod__img" />
          <div className="hm-pod__copy">
            <p className="mono hm-pod__label">
              <span className="hm-eq" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
              </span>
              {content.label}
            </p>
            <h2 id="pod-title" className="hm-pod__title">
              {content.heading}
            </h2>
            <p className="hm-pod__text">{content.text}</p>
          </div>
          <ButtonLink link={content.cta} variant="secondary" className="hm-pod__cta" />
        </div>
      </div>
    </section>
  );
}
