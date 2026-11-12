import Image from 'next/image';
import { Photo, SectionIndex, TextLink } from '@/components/ee/primitives';
import type { FounderContent } from '@/services/content';

/**
 * Who's behind it: Elite's own portrait of Splash on the left, captioned; on the right his
 * name set large and the record as a short definition list (label → line), with the Mint Ave
 * mark beside the agency he founded.
 */
export function PartnersFounder({ content }: { content: FounderContent }) {
  return (
    <section id="founder" className="section pt-founder" aria-labelledby="pt-founder-title" tabIndex={-1}>
      <div className="wrap">
        <SectionIndex index={content.index} label={content.label} />

        <div className="pt-founder__grid">
          <figure className="pt-founder__figure">
            <Photo
              image={content.portrait}
              sizes="(min-width: 992px) 34vw, 90vw"
              parallax
              className="pt-founder__photo"
            />
            <figcaption className="pt-caption">
              {content.fullName} · {content.role}
            </figcaption>
          </figure>

          <div className="pt-founder__body">
            <h2 id="pt-founder-title" className="hm-display pt-founder__name" data-reveal="lines">
              {content.name}
            </h2>
            <p className="pt-founder__role" data-reveal="fade">
              {content.role}
            </p>

            <dl className="pt-record" data-stagger>
              {content.credentials.map((item) => (
                <div key={item.label} className="pt-record__row" data-stagger-item>
                  <dt className="pt-record__label">{item.label}</dt>
                  <dd className="pt-record__text">
                    {item.logo ? (
                      <Image
                        src={item.logo.src}
                        alt=""
                        width={item.logo.width}
                        height={item.logo.height}
                        sizes="96px"
                        className="pt-record__logo"
                      />
                    ) : null}
                    {item.text}
                  </dd>
                </div>
              ))}
            </dl>

            <ul className="pt-founder__links" data-reveal="fade" aria-label={`${content.name} online`}>
              {content.links.map((link) => (
                <li key={link.href}>
                  <TextLink link={link} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
