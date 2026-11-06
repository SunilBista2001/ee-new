import Image from 'next/image';
import type { PartnersContent } from '@/services/content';

/**
 * Trust strip: verified partners of the 2026 summit as pill tiles on a slow marquee. The list
 * is rendered twice for a seamless loop; the copy is hidden from assistive tech. With
 * reduced motion the marquee stops and the tiles wrap instead.
 */
export function Partners({ content }: { content: PartnersContent }) {
  const tiles = (copy: boolean) =>
    content.partners.map((partner) => (
      <li key={`${partner.name}-${copy ? 'b' : 'a'}`} className="logo-pill">
        <Image
          src={partner.logo.src}
          alt={copy ? '' : partner.logo.alt}
          width={partner.logo.width}
          height={partner.logo.height}
          sizes="160px"
          className="logo-pill__img"
        />
      </li>
    ));

  return (
    <section className="partners" aria-labelledby="partners-title">
      <div className="wrap">
        <h2 id="partners-title" className="partners__label" data-reveal="fade">
          <span className="mono">{content.label}</span>
        </h2>
      </div>
      <div className="marquee" data-reveal="fade">
        <ul className="marquee__track">{tiles(false)}</ul>
        <ul className="marquee__track" aria-hidden="true">
          {tiles(true)}
        </ul>
      </div>
    </section>
  );
}
