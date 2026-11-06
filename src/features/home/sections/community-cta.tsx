import Image from 'next/image';
import { ButtonLink, HeadlineText } from '@/components/ee/primitives';
import type { CommunityCtaContent } from '@/services/content';

/** Centered invitation with real community faces set inline in the headline. */
export function CommunityCta({ content }: { content: CommunityCtaContent }) {
  return (
    <section className="cta" aria-labelledby="cta-title">
      <div className="wrap">
        <div className="cta__panel" data-reveal="fade">
          <p className="cta__label mono">{content.label}</p>
          <h2 id="cta-title" className="display cta__title">
            {content.headingStart}{' '}
            <span className="faces" role="img" aria-label={content.facesCaption}>
              {content.faces.map((face) => (
                <Image key={face.src} src={face.src} alt="" width={96} height={96} />
              ))}
            </span>{' '}
            <HeadlineText headline={content.headingEnd} />
          </h2>
          <p className="cta__text">{content.text}</p>
          <ButtonLink link={content.cta} />
        </div>
      </div>
    </section>
  );
}
