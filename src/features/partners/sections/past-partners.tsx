import Image from 'next/image';
import { SectionIndex } from '@/components/ee/primitives';
import type { ImageAsset, PastPartnersContent } from '@/services/content';

/**
 * Optical logo sizing: wide wordmarks would dominate at a shared height and compact marks
 * would vanish at a shared width. Scaling the height by 1/√(aspect ratio) gives every logo
 * roughly the same visual area while keeping its proportions.
 */
function logoHeight(logo: ImageAsset, base = 46): number {
  const aspect = logo.width / logo.height;
  return Math.round(Math.min(base, Math.max(18, (base * 1.25) / Math.sqrt(aspect))));
}

/** Past partners: a quiet logo wall on inner hairlines, no cards. */
export function PartnersPast({ content }: { content: PastPartnersContent }) {
  return (
    <section id="past-partners" className="section pt-past" aria-labelledby="pt-past-title" tabIndex={-1}>
      <div className="wrap">
        <SectionIndex index={content.index} label={content.label} />
        <h2 id="pt-past-title" className="hm-h2 pt-past__title" data-reveal="lines">
          {content.heading}
        </h2>

        <ul className="pt-wall" data-stagger>
          {content.partners.map(({ name, logo }) => (
            <li key={name} className="pt-wall__cell" data-stagger-item>
              <Image
                src={logo.src}
                alt={name}
                width={logo.width}
                height={logo.height}
                sizes="200px"
                className="pt-wall__logo"
                style={{ height: `${logoHeight(logo)}px` }}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
