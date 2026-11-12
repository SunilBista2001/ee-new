'use client';

import Image from 'next/image';
import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { cn } from '@/lib/utils';
import type { PartnerStory } from '@/services/content';

type EmptyState = { title: string; text: string };

/** A story is complete once a quote has been supplied; person and result are shown when present. */
const hasStory = (story: PartnerStory) => Boolean(story.quote);

/**
 * One partner story: logo, quote, person and role, and one result. Every field after the logo
 * is optional; without a quote the card shows the explicit "in progress" state instead of
 * placeholder copy, so nothing on the page reads as a real testimonial until it is one.
 */
export function PartnerStoryCard({ story, emptyState }: { story: PartnerStory; emptyState: EmptyState }) {
  const complete = hasStory(story);
  return (
    <article className={cn('ps-card', !complete && 'is-empty')} aria-label={`${story.partner} partner story`}>
      <div className="ps-card__brand">
        <Image
          src={story.logo.src}
          alt={story.partner}
          width={story.logo.width}
          height={story.logo.height}
          sizes="220px"
          className="ps-card__logo"
        />
        <span className="ps-card__status mono">{complete ? 'Partner story' : 'In progress'}</span>
      </div>

      {complete ? (
        <figure className="ps-card__body">
          <blockquote className="ps-card__quote">
            <p>{story.quote}</p>
          </blockquote>
          {story.person ? (
            <figcaption className="ps-card__person">
              <span className="ps-card__name">{story.person.name}</span>
              <span className="ps-card__role">
                {story.person.role}, {story.partner}
              </span>
            </figcaption>
          ) : null}
        </figure>
      ) : (
        <div className="ps-card__body ps-card__empty">
          <p className="ps-card__empty-title">{emptyState.title}</p>
          <p className="ps-card__empty-text">{emptyState.text}</p>
          {/* Skeleton of the fields still to come: quote, person, role. */}
          <div className="ps-card__ghost" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </div>
      )}

      <div className="ps-card__result">
        <span className="ps-card__result-label mono">Result</span>
        {story.result ? (
          <p className="ps-card__result-value">
            <span className="ps-card__result-num">{story.result.value}</span>
            <span className="ps-card__result-text">{story.result.label}</span>
          </p>
        ) : (
          <p className="ps-card__result-pending">To be confirmed</p>
        )}
      </div>
    </article>
  );
}

/**
 * Partner stories as tabs: the logos are the tab list (click, or arrow keys / Home / End),
 * the active story fills the stage. No autoplay.
 */
export function PartnerStoryStage({ stories, emptyState }: { stories: PartnerStory[]; emptyState: EmptyState }) {
  const [index, setIndex] = useState(0);
  const tabsRef = useRef<HTMLDivElement>(null);
  const baseId = useId();
  const active = stories[index];
  if (!active) return null;

  const select = (next: number) => {
    setIndex(next);
    tabsRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const last = stories.length - 1;
    const map: Record<string, number> = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowDown: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      ArrowUp: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    };
    const next = map[e.key];
    if (next === undefined) return;
    e.preventDefault();
    select(next);
  };

  return (
    <div className="ps">
      <div ref={tabsRef} className="ps__tabs" role="tablist" aria-label="Partners" onKeyDown={onKeyDown}>
        {stories.map((story, i) => (
          <button
            key={story.partner}
            id={`${baseId}-tab-${i}`}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-controls={`${baseId}-panel`}
            tabIndex={i === index ? 0 : -1}
            className={cn('ps__tab', i === index && 'is-active')}
            onClick={() => setIndex(i)}
          >
            <span className="ps__tab-num mono" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="ps__tab-name">{story.partner}</span>
          </button>
        ))}
      </div>

      <div
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${index}`}
        className="ps__panel"
        tabIndex={0}
      >
        <div key={index} className="ps__swap">
          <PartnerStoryCard story={active} emptyState={emptyState} />
        </div>
      </div>
    </div>
  );
}
