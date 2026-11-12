import Image from 'next/image';
import { BrandMark, ButtonLink } from '@/components/ee/primitives';
import type { PartnerBandContent } from '@/services/content';

/**
 * Partner band: the one dark moment on the page. A full-bleed photo under an espresso wash
 * that opens out from an inset frame as it scrolls in; headline and a single button.
 */
export function PartnerBand({ content }: { content: PartnerBandContent }) {
  const { image } = content;
  return (
    <section className="hm-band" aria-labelledby="band-title">
      <div className="hm-band__panel" data-expand>
        <div className="hm-band__bg" aria-hidden="true">
          <Image
            src={image.src}
            alt=""
            width={image.width}
            height={image.height}
            sizes="100vw"
            style={image.focus ? { objectPosition: image.focus } : undefined}
            data-parallax=""
          />
        </div>
        <div className="wrap hm-band__inner">
          <BrandMark className="hm-band__mark" />
          <h2 id="band-title" className="hm-h2 hm-band__title" data-reveal="lines">
            {content.heading}
          </h2>
          <div data-reveal="fade">
            <ButtonLink link={content.cta} variant="light" />
          </div>
        </div>
      </div>
    </section>
  );
}
