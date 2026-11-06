import Image from 'next/image';
import { SectionHeader } from '@/components/ee/primitives';
import type { ExperienceContent } from '@/services/content';

/**
 * What happens at Elite: an index of four rows (number, title, description, fact). On hover
 * a row opens a small photo; on touch screens the photo is always shown.
 */
export function Experience({ content }: { content: ExperienceContent }) {
  return (
    <section id="experience" className="section experience" aria-labelledby="experience-title" tabIndex={-1}>
      <div className="wrap">
        <SectionHeader
          id="experience-title"
          index={content.index}
          label={content.label}
          heading={content.heading}
          intro={content.intro}
          split
        />

        <ol className="xp-list" data-stagger>
          {content.pillars.map((pillar, i) => (
            <li key={pillar.title} className="xp-row" data-stagger-item>
              <span className="xp-row__num mono" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="xp-row__thumb" aria-hidden="true">
                <Image
                  src={pillar.image.src}
                  alt=""
                  width={pillar.image.width}
                  height={pillar.image.height}
                  sizes="160px"
                  style={pillar.image.focus ? { objectPosition: pillar.image.focus } : undefined}
                />
              </span>
              <h3 className="xp-row__title">{pillar.title}</h3>
              <p className="xp-row__text">{pillar.text}</p>
              <p className="xp-row__meta mono">{pillar.meta}</p>
              <svg viewBox="0 0 16 16" className="xp-row__arrow" aria-hidden="true">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
