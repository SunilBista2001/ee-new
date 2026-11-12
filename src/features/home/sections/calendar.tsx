import Image from 'next/image';
import { ArrowIcon, SectionIndex, TextLink } from '@/components/ee/primitives';
import type { CalendarContent } from '@/services/content';
import type { UpcomingEvent } from '@/services/events/luma';

const pad = (n: number) => String(n).padStart(2, '0');

function formatWhen(event: UpcomingEvent) {
  const start = new Date(event.startsAt);
  const date = new Intl.DateTimeFormat('en-CA', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: event.timeZone,
  }).format(start);
  const time = new Intl.DateTimeFormat('en-CA', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: event.timeZone,
  })
    .format(start)
    .replace(/\s?([ap])\.?m\.?/i, (_, m: string) => ` ${m.toUpperCase()}M`);
  return { date, time };
}

/**
 * Luma titles are often "Name | Host". The pipe breaks onto a new line as a stray vertical bar,
 * so keep the event name and drop the host suffix (every event here is hosted by Elite).
 */
function cleanTitle(title: string): string {
  const [name = title, ...rest] = title.split(/\s+\|\s+/);
  const suffix = rest.join(' ').trim();
  return suffix && !/^elite entrepreneurs$/i.test(suffix) ? `${name}, ${suffix}` : name;
}

/**
 * One upcoming event. Two halves split by the centre line: index chip and name on the left;
 * cover and detail pills on the right. Each part enters in turn as the row scrolls into view.
 */
function EventRow({ event, index }: { event: UpcomingEvent; index: number }) {
  const { date, time } = formatWhen(event);
  const title = cleanTitle(event.title);
  const tags = [date, time, event.place, event.soldOut ? 'Sold out' : event.price].filter((tag): tag is string =>
    Boolean(tag),
  );

  return (
    <li className="cal__row" data-stagger>
      <div className="cal__left">
        <span className="cal__num" aria-hidden="true" data-stagger-item>
          {pad(index + 1)}
        </span>
        <h3 className="cal__title" data-stagger-item>
          <a href={event.href} className="cal__link" target="_blank" rel="noopener noreferrer">
            {title}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </h3>
      </div>

      <div className="cal__right">
        <div className="cal__media" data-reveal="mask">
          <Image
            src={event.image}
            alt=""
            width={600}
            height={600}
            sizes="(min-width: 992px) 238px, (min-width: 640px) 200px, 60vw"
          />
        </div>

        <ul className="cal__tags" aria-label="Details">
          {tags.map((tag) => (
            <li key={tag} className="cal__tag" data-stagger-item>
              {tag}
            </li>
          ))}
        </ul>

        <span className="cal__go" aria-hidden="true" data-stagger-item>
          <ArrowIcon external />
        </span>
      </div>
    </li>
  );
}

/**
 * Coming up: the public Luma calendar as ruled rows between two halves, with a centre line
 * that draws down the section. If the events cannot be loaded, the Luma embed is shown
 * instead, so the section is never empty.
 */
export function Calendar({ content, events }: { content: CalendarContent; events: UpcomingEvent[] }) {
  return (
    <section id="events" className="section hm-cal" aria-labelledby="cal-title" tabIndex={-1}>
      <div className="wrap">
        <SectionIndex index={content.index} />

        <div className="cal" data-inview>
          <div className="cal__head">
            <h2 id="cal-title" className="hm-h2" data-reveal="lines">
              {content.heading}
            </h2>
            <div className="cal__head-side" data-reveal="fade">
              <TextLink link={content.link} />
            </div>
          </div>

          {events.length > 0 ? (
            <ol className="cal__list">
              {events.map((event, i) => (
                <EventRow key={event.id} event={event} index={i} />
              ))}
            </ol>
          ) : (
            <div className="cal__embed-frame" data-reveal="fade" data-lenis-prevent>
              <iframe
                src={content.embedUrl}
                title="Upcoming Elite Entrepreneurs events on Luma"
                loading="lazy"
                className="cal__embed"
                allow="fullscreen; payment"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
