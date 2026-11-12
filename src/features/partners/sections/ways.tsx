import Image from 'next/image';
import { ArrowIcon, ButtonLink, SectionIndex, TextLink } from '@/components/ee/primitives';
import type { Link, PartnersWaysContent } from '@/services/content';

/**
 * Ways to work together: four numbered rows. Each row is one link to the inquiry form; on
 * hover (fine pointers) a photo opens out beside the title and the arrow slides. On touch
 * screens the photo is always shown, small. A booking button closes the list.
 */
export function PartnersWays({
  content,
  bookCall,
  inquiryHref,
}: {
  content: PartnersWaysContent;
  bookCall: Link;
  inquiryHref: string;
}) {
  return (
    <section id="ways" className="section pt-ways" aria-labelledby="pt-ways-title" tabIndex={-1}>
      <div className="wrap">
        <SectionIndex index={content.index} label={content.label} />
        <h2 id="pt-ways-title" className="hm-h2 pt-ways__title" data-reveal="lines">
          {content.heading}
        </h2>

        <ol className="pt-ways__list" data-stagger>
          {content.options.map((option, i) => (
            <li key={option.title} className="pt-way" data-stagger-item>
              <span className="pt-way__num" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="pt-way__title">
                <a href={inquiryHref} className="pt-way__link">
                  {option.title}
                </a>
              </h3>
              <span className="pt-way__media" aria-hidden="true">
                <Image
                  src={option.image.src}
                  alt=""
                  width={option.image.width}
                  height={option.image.height}
                  sizes="(min-width: 992px) 220px, 120px"
                  style={option.image.focus ? { objectPosition: option.image.focus } : undefined}
                />
              </span>
              <span className="pt-way__go" aria-hidden="true">
                <ArrowIcon />
              </span>
            </li>
          ))}
        </ol>

        <div className="pt-ways__cta" data-reveal="fade">
          <ButtonLink link={bookCall} />
          <TextLink link={{ label: 'Or send an inquiry', href: inquiryHref }} />
        </div>
      </div>
    </section>
  );
}
