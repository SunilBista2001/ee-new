import Image from 'next/image';
import { BrandMark, ButtonLink, SectionIndex } from '@/components/ee/primitives';
import type { EventCard, EventsContent } from '@/services/content';

function PinIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M8 14s4.5-4.2 4.5-7.5a4.5 4.5 0 0 0-9 0C3.5 9.8 8 14 8 14Z"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="6.5" r="1.6" fill="none" stroke="currentColor" />
    </svg>
  );
}

function FormatIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <rect x="2.5" y="3.5" width="11" height="10" rx="2" fill="none" stroke="currentColor" />
      <path d="M2.5 6.5h11M5.5 2v3M10.5 2v3" fill="none" stroke="currentColor" strokeLinecap="round" />
    </svg>
  );
}

/** Year / day / month badge. `label` is the full date for assistive tech. */
function DateBadge({ year, day, month, label }: { year: string; day: string; month: string; label: string }) {
  return (
    <div className="date-badge" aria-label={label} role="img">
      <span className="date-badge__year">{year}</span>
      <span className="date-badge__day">{day}</span>
      <span className="date-badge__month">{month}</span>
    </div>
  );
}

function EventRow({ event }: { event: EventCard }) {
  return (
    <li className="ev-row" data-stagger-item>
      <DateBadge {...event.badge} label={event.date} />
      <div className="ev-row__main">
        <p className="ev-row__status mono">{event.status}</p>
        <h4 className="ev-row__title">
          <span className="hl">{event.title}</span>
        </h4>
        <p className="ev-row__text">{event.description}</p>
      </div>
      <dl className="ev-row__facts">
        <div>
          <dt className="sr-only">Location</dt>
          <dd>
            <PinIcon />
            {event.location}
          </dd>
        </div>
        <div>
          <dt className="sr-only">Format</dt>
          <dd>
            <FormatIcon />
            {event.category}
          </dd>
        </div>
      </dl>
      <ButtonLink link={event.cta} size="sm" className="ev-row__cta" />
    </li>
  );
}

/**
 * Event discovery. No next event is public yet, so the featured slot is an announcement with
 * no date, city or price; past events below are clearly marked as past.
 */
export function Events({ content }: { content: EventsContent }) {
  const { announcement } = content;
  return (
    <section id="events" className="section events" aria-labelledby="events-title" tabIndex={-1}>
      <div className="wrap">
        <SectionIndex
          index={content.index}
          label={content.label}
          aside={<ButtonLink link={content.allEventsCta} variant="secondary" size="sm" />}
        />

        <div className="events__head">
          <h2 id="events-title" className="h2 events__title" data-reveal="lines">
            {content.headingStart}{' '}
            <span className="pill-img pill-img--sm">
              <Image
                src={content.headingImage.src}
                alt=""
                width={content.headingImage.width}
                height={content.headingImage.height}
                sizes="200px"
                style={content.headingImage.focus ? { objectPosition: content.headingImage.focus } : undefined}
              />
            </span>{' '}
            {content.headingEnd}
          </h2>
          <p className="events__intro" data-reveal="fade">
            {content.intro}
          </p>
        </div>

        <div className="ev-feature" data-reveal="fade">
          <div className="ev-feature__visual on-beige">
            <BrandMark className="ev-feature__mark" />
            <div className="date-badge date-badge--tba" aria-hidden="true">
              <span className="date-badge__year">Next</span>
              <span className="date-badge__day">TBA</span>
              <span className="date-badge__month">Date</span>
            </div>
            <p className="ev-feature__fig mono" aria-hidden="true">
              Fig. 02 — The next room
            </p>
          </div>
          <div className="ev-feature__copy">
            <p className="tag tag--accent">
              <span className="dot dot--live" aria-hidden="true" />
              {announcement.label}
            </p>
            <h3 className="ev-feature__title">{announcement.title}</h3>
            <p className="ev-feature__text">{announcement.text}</p>
            <div className="ev-feature__actions">
              <ButtonLink link={announcement.primaryCta} />
              <ButtonLink link={announcement.secondaryCta} variant="secondary" icon={false} />
            </div>
          </div>
        </div>

        <div className="ev-list">
          <h3 className="ev-list__heading mono">{content.pastHeading}</h3>
          <ul className="ev-list__rows" data-stagger>
            {content.past.map((event) => (
              <EventRow key={event.title} event={event} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
