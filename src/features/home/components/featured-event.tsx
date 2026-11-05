import Image from 'next/image';
import { EventDetail } from './event-detail';
import { INITIAL_STYLE, MOTION_IDS } from '@/lib/motion/reveal-config';
import type { EventDetails } from '@/services/content';

/** Non-breaking separator between date and time, as rendered by the original CMS template. */
const TIME_SEPARATOR = ' |  ';

/** Large featured card ("Events that Hit Different"). */
export function FeaturedEvent({ event, detailsLabel }: { event: EventDetails; detailsLabel: string }) {
  const { display } = event;
  return (
    <div className="layout192_component">
      <div className="w-dyn-list">
        <div role="list" className="w-dyn-items">
          <div role="listitem" className="w-dyn-item">
            <article
              id="events"
              data-w-id={MOTION_IDS.events.featured}
              style={INITIAL_STYLE.slideUp}
              className="w-layout-grid layout192_content"
            >
              <div id="w-node-_541dd206-23bf-a984-673b-84a7b91ca995-a6a2ca3f" className="event-img-wrapper-home">
                <div className="date-badge">
                  <p>{display.year}</p>
                  <div className="event-date-no">{display.day}</div>
                  <p>{display.month}</p>
                </div>
                <Image
                  src={event.image.src}
                  alt={event.image.alt}
                  width={event.image.width}
                  height={event.image.height}
                  sizes="(max-width: 479px) 48vw, (max-width: 1279px) 49vw, 50vw"
                  className="layout192_image"
                />
              </div>
              <div id="w-node-_541dd206-23bf-a984-673b-84a7b91ca997-a6a2ca3f" className="event-right-col">
                <div className="margin-bottom margin-xxsmall">
                  <div className="text-style-tagline">{event.city}</div>
                </div>
                <div className="margin-bottom margin-xsmall">
                  <h2 data-scramble="">{event.title}</h2>
                </div>
                <div className="max-width-xsmall">
                  <div className="margin-bottom margin-small">
                    <p
                      data-w-id={MOTION_IDS.events.featuredDescription}
                      style={INITIAL_STYLE.hidden}
                      className={event.description ? undefined : 'w-dyn-bind-empty'}
                    >
                      {event.description}
                    </p>
                  </div>
                </div>
                <div className="margin-bottom margin-small">
                  <div className="detail-row">
                    <EventDetail icon="icon_time.svg" label="Date and time">
                      <div className="div-block-8">
                        <p>{display.shortDate}</p>
                        <p>{TIME_SEPARATOR}</p>
                        <p>{display.featuredTime}</p>
                      </div>
                    </EventDetail>
                    <EventDetail icon="icon_location2.svg" label="Location">
                      <div className="div-block-9">
                        <p>{event.venue}</p>
                      </div>
                    </EventDetail>
                    <EventDetail icon="icon_price.svg" label="Price">
                      <div className="div-block-9">
                        <p>{event.price}</p>
                      </div>
                    </EventDetail>
                  </div>
                </div>
                <div>
                  <div className="button-group is-center-mobile">
                    <a
                      href={event.href}
                      className="button is-secondary w-button"
                      aria-label={`${detailsLabel}: ${event.title}`}
                    >
                      {detailsLabel}
                    </a>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
}
