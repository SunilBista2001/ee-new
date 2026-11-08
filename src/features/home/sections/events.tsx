import Image from 'next/image';
import { ArrowIcon, ButtonLink, SectionIndex, TextLink } from '@/components/ee/primitives';
import type { EventCard, EventsContent, Link } from '@/services/content';

/*
 * Events: an editorial showcase rather than a list.
 *
 *  - Featured: the latest edition on a wide venue photograph, with an ivory panel layered over
 *    its lower corner (oversized date, place, programme, details link).
 *  - Below, staggered: the next-edition announcement on a dark panel (no date, city or price
 *    until they are public) and earlier editions as photo cards that are clickable as a whole.
 *
 * Motion uses the shared reveal hooks; image zoom and link states are CSS only.
 */

const linkProps = (link: Link) =>
  link.external ? ({ target: '_blank', rel: 'noopener noreferrer' } as const) : ({} as const);

function PinIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M8 14s4.5-4.2 4.5-7.5a4.5 4.5 0 0 0-9 0C3.5 9.8 8 14 8 14Z" />
      <circle cx="8" cy="6.5" r="1.6" />
    </svg>
  );
}

function Num({ n }: { n: number }) {
  return <span className="ev-num">No. {String(n).padStart(2, '0')}</span>;
}

function Featured({ event }: { event: EventCard }) {
  return (
    <article className="ev-feature" aria-labelledby="ev-feature-title">
      <a
        className="ev-feature__media"
        href={event.cta.href}
        {...linkProps(event.cta)}
        tabIndex={-1}
        aria-hidden="true"
        data-reveal="clip"
      >
        <Image
          src={event.image.src}
          alt=""
          width={event.image.width}
          height={event.image.height}
          sizes="(min-width: 992px) 900px, 100vw"
          style={event.image.focus ? { objectPosition: event.image.focus } : undefined}
        />
        <span className="ev-feature__caption">
          <span>Fig. 01</span>
          {event.location}
        </span>
      </a>

      <div className="ev-feature__panel" data-reveal="fade">
        <p className="ev-meta">
          <Num n={1} />
          <span className="ev-meta__sep" aria-hidden="true" />
          {event.status} · {event.category}
        </p>

        <p className="ev-date">
          <span className="sr-only">{event.date}</span>
          <span className="ev-date__day" aria-hidden="true">
            {event.badge.day}
          </span>
          <span className="ev-date__rest" aria-hidden="true">
            <span>{event.badge.month}</span>
            <span>{event.badge.year}</span>
          </span>
        </p>

        <h3 id="ev-feature-title" className="ev-feature__title">
          {event.title}
        </h3>
        <p className="ev-place">
          <PinIcon />
          {event.location}
        </p>
        <p className="ev-feature__text">{event.description}</p>

        {event.programme ? (
          <ol className="ev-programme" aria-label="Programme">
            {event.programme.map((item) => (
              <li key={item.label}>
                <span className="ev-programme__label">{item.label}</span>
                <span>{item.text}</span>
              </li>
            ))}
          </ol>
        ) : null}

        <ButtonLink link={event.cta} size="sm" variant="secondary" className="ev-feature__cta" />
      </div>
    </article>
  );
}

function Next({ announcement }: { announcement: EventsContent['announcement'] }) {
  return (
    <article className="ev-next" aria-labelledby="ev-next-title" data-reveal="fade">
      <div className="ev-next__media" aria-hidden="true">
        <Image
          src={announcement.image.src}
          alt=""
          width={announcement.image.width}
          height={announcement.image.height}
          sizes="(min-width: 992px) 760px, 100vw"
          style={announcement.image.focus ? { objectPosition: announcement.image.focus } : undefined}
        />
      </div>

      <div className="ev-next__body">
        <p className="ev-next__top">
          <span className="ev-next__live">
            <span className="dot dot--live" aria-hidden="true" />
            {announcement.label}
          </span>
          <span className="ev-next__tba" aria-hidden="true">
            Date <em>to be announced</em>
          </span>
        </p>
        <h3 id="ev-next-title" className="ev-next__title">
          {announcement.title}
        </h3>
        <p className="ev-next__text">{announcement.text}</p>
        <div className="ev-next__actions">
          <ButtonLink link={announcement.primaryCta} variant="light" />
          <TextLink link={announcement.secondaryCta} className="ev-next__link" />
        </div>
      </div>
    </article>
  );
}

function EditionCard({ event, n }: { event: EventCard; n: number }) {
  const id = `ev-card-${n}`;
  return (
    <article className="ev-card" aria-labelledby={id} data-reveal="fade">
      <div className="ev-card__media">
        <Image
          src={event.image.src}
          alt=""
          width={event.image.width}
          height={event.image.height}
          sizes="(min-width: 992px) 480px, (min-width: 768px) 50vw, 100vw"
          style={event.image.focus ? { objectPosition: event.image.focus } : undefined}
        />
        <span className="ev-card__date" aria-hidden="true">
          <strong>{event.badge.day}</strong> {event.badge.month} {event.badge.year}
        </span>
      </div>

      <div className="ev-card__body">
        <p className="ev-meta">
          <Num n={n} />
          <span className="ev-meta__sep" aria-hidden="true" />
          {event.status} · {event.category}
        </p>
        <h3 id={id} className="ev-card__title">
          {/* Stretched link: the whole card is the click target. */}
          <a href={event.cta.href} {...linkProps(event.cta)} className="ev-card__link">
            {event.title}
            <span className="sr-only">
              , {event.date}. {event.cta.label}
              {event.cta.external ? ' (opens in a new tab)' : ''}
            </span>
          </a>
        </h3>
        <p className="ev-place">
          <PinIcon />
          {event.location}
          <span aria-hidden="true">· {event.date}</span>
        </p>
        <p className="ev-card__text">{event.description}</p>
        <span className="ev-card__go" aria-hidden="true">
          {event.cta.label}
          <span className="ev-card__chip">
            <ArrowIcon external={event.cta.external} />
          </span>
        </span>
      </div>
    </article>
  );
}

export function Events({ content }: { content: EventsContent }) {
  return (
    <section id="events" className="section events" aria-labelledby="events-title" tabIndex={-1}>
      <div className="wrap">
        <SectionIndex index={content.index} label={content.label} />

        <header className="events__head">
          <h2 id="events-title" className="events__title" data-reveal="lines">
            {content.heading.text}{' '}
            {content.heading.accent ? <span className="serif events__accent">{content.heading.accent}</span> : null}
          </h2>
          <p className="events__intro" data-reveal="fade">
            {content.intro}
          </p>
        </header>

        <Featured event={content.featured} />

        <div className="events__lower">
          <Next announcement={content.announcement} />
          {content.more.map((event, i) => (
            <EditionCard key={event.title} event={event} n={i + 2} />
          ))}
        </div>

        <div className="events__foot" data-reveal="fade">
          <ButtonLink link={content.allEventsCta} variant="secondary" />
        </div>
      </div>
    </section>
  );
}
