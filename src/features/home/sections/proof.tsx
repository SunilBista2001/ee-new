import Image from 'next/image';
import type { ProofContent } from '@/services/content';

/**
 * Proof strip: the three approved numbers, counted up as they enter, over a slow marquee of
 * partner logos. The logo list is rendered twice for a seamless loop (the copy is hidden from
 * assistive tech); with reduced motion the marquee stops and the logos wrap.
 */
export function Proof({ content }: { content: ProofContent }) {
  const logos = (copy: boolean) =>
    content.logos.map(({ name, logo }) => (
      <li key={`${name}-${copy ? 'b' : 'a'}`} className="hm-marquee__item">
        <Image
          src={logo.src}
          alt={copy ? '' : logo.alt}
          width={logo.width}
          height={logo.height}
          sizes="150px"
          className="hm-marquee__logo"
        />
      </li>
    ));

  return (
    <section className="hm-proof" aria-labelledby="proof-title">
      <div className="wrap">
        <h2 id="proof-title" className="sr-only">
          {content.label}
        </h2>

        <dl className="hm-stats" data-inview>
          {content.stats.map((stat) => (
            <div key={stat.label} className="hm-stat">
              <dt className="hm-stat__label">{stat.label}</dt>
              <dd className="hm-stat__value" data-count>
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="hm-marquee" role="group" aria-label={content.logosLabel} data-reveal="fade">
        <ul className="hm-marquee__track">{logos(false)}</ul>
        <ul className="hm-marquee__track" aria-hidden="true">
          {logos(true)}
        </ul>
      </div>
    </section>
  );
}
