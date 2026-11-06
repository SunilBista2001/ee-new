'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ButtonLink, SectionHeader } from '@/components/ee/primitives';
import type { SpeakersContent } from '@/services/content';
import { cn } from '@/lib/utils';

/**
 * Speakers as a people index: a list of names on the right and, on desktop, a large arched
 * portrait on the left that follows hover and keyboard focus. On smaller screens each row
 * carries its own portrait, so nothing depends on hover.
 */
export function Speakers({ content }: { content: SpeakersContent }) {
  const [active, setActive] = useState(0);
  const speaker = content.speakers[active]!;

  return (
    <section id="speakers" className="section speakers" aria-labelledby="speakers-title" tabIndex={-1}>
      <div className="wrap">
        <SectionHeader
          id="speakers-title"
          index={content.index}
          label={content.label}
          heading={content.heading}
          intro={content.intro}
          split
        />

        <div className="people">
          <div className="people__preview" aria-hidden="true">
            <div className="people__frame">
              {content.speakers.map((s, i) => (
                <Image
                  key={s.name}
                  src={s.photo.src}
                  alt=""
                  width={s.photo.width}
                  height={s.photo.height}
                  sizes="(min-width: 992px) 34vw, 1px"
                  className={cn('people__img', i === active && 'is-active')}
                  style={s.photo.focus ? { objectPosition: s.photo.focus } : undefined}
                />
              ))}
            </div>
            <div className="people__caption">
              <p className="people__caption-name">{speaker.name}</p>
              <p className="people__caption-text">{speaker.credential}</p>
            </div>
          </div>

          <ol className="people__list" data-stagger>
            {content.speakers.map((s, i) => {
              const inner = (
                <>
                  <span className="person__num mono" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="person__thumb" aria-hidden="true">
                    <Image
                      src={s.photo.src}
                      alt=""
                      width={s.photo.width}
                      height={s.photo.height}
                      sizes="96px"
                      style={s.photo.focus ? { objectPosition: s.photo.focus } : undefined}
                    />
                  </span>
                  <span className="person__body">
                    <span className="person__name">{s.name}</span>
                    <span className="person__credential">{s.credential}</span>
                  </span>
                  <span className="person__company mono">{s.company}</span>
                  {s.href ? (
                    <svg viewBox="0 0 16 16" className="person__arrow" aria-hidden="true">
                      <path
                        d="M5 11 11 5M6 5h5v5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  ) : null}
                </>
              );
              return (
                <li
                  key={s.name}
                  className={cn('person', i === active && 'is-active')}
                  data-stagger-item
                  onMouseEnter={() => setActive(i)}
                >
                  {s.href ? (
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="person__link"
                      onFocus={() => setActive(i)}
                    >
                      {inner}
                      <span className="sr-only"> (profile, opens in a new tab)</span>
                    </a>
                  ) : (
                    <div className="person__link">{inner}</div>
                  )}
                </li>
              );
            })}
            <li className="person person--invite" data-stagger-item>
              <div className="person__invite">
                <span>
                  <span className="person__name">{content.invite.title}</span>
                  <span className="person__credential">{content.invite.text}</span>
                </span>
                <ButtonLink link={content.invite.cta} size="sm" />
              </div>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}
