import { PlainImage } from '@/components/media/plain-image';
import { EventDetail } from './event-detail';
import type { EventDetails } from '@/services/content';
import { cn } from '@/lib/utils';

/** Content of one row in the city-filtered event list (the row wrapper lives in <CityEvents>). */
export function EventRow({ event, detailsLabel }: { event: EventDetails; detailsLabel: string }) {
  const { display } = event;
  return (
    <div className="margin-top-bottom margin-52">
      <div className="event-row">
        <div id="w-node-f173d2d7-b62e-4bf6-04e0-5ffa16ca05d9-a6a2ca3f" className="date-description-container">
          <div className="date-badge-2 shadow-medium">
            <p className="paragraph-2">{display.year}</p>
            <div className="event-date-no">{display.day}</div>
            <p className="paragraph">{display.month}</p>
          </div>
          <div>
            <div className="margin-bottom margin-large">
              <div className="event-title-tag">
                <div>
                  <h4 aria-level={3} className="text-highlight-h1">
                    {event.title}
                  </h4>
                </div>
                <div className={cn('text-style-tagline sold-out', !event.soldOut && 'w-condition-invisible')}>
                  Sold Out
                </div>
              </div>
            </div>
            <div className="max-width-xsmall">
              <p className={event.description ? undefined : 'w-dyn-bind-empty'}>{event.description}</p>
            </div>
          </div>
        </div>
        <div id="w-node-_4cd6c7c4-6e81-5b13-e657-90041e6a1923-a6a2ca3f" className="event-right-col">
          <div className="col-3">
            <div className="detail-row">
              <div className="detail-container hide-desktop">
                <PlainImage image={{ src: '/assets/images/icon-calendar.svg', alt: 'Date' }} />
                <div>
                  <div className="div-block-8">
                    <p>{display.longDate}</p>
                  </div>
                  <div className="div-block-8">
                    <p>{display.start}</p>
                    <p>-</p>
                    <p>{display.end}</p>
                  </div>
                </div>
              </div>
              <div className="detail-container hide-mobile-landscape">
                <PlainImage image={{ src: '/assets/images/icon_time.svg', alt: 'Time' }} />
                <div className="div-block-8">
                  <p>{display.start}</p>
                  <p>-</p>
                  <p>{display.end}</p>
                </div>
              </div>
              <EventDetail icon="icon_location2.svg" label="Location">
                <div className="div-block-9">
                  <p>{event.venue}</p>
                </div>
              </EventDetail>
              <div className="tab-hide">
                <p>{event.city}</p>
              </div>
              <EventDetail icon="icon_price.svg" label="Price">
                <div className="div-block-9">
                  <p>{event.price}</p>
                </div>
              </EventDetail>
            </div>
            <div id="w-node-_9dfa7e12-81bb-bff0-6ddc-6552fb390bd4-a6a2ca3f" className="disable-event-btn">
              <a href={event.href} className="button w-button" aria-label={`${detailsLabel}: ${event.title}`}>
                {detailsLabel}
              </a>
              <div className="link-block w-condition-invisible" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
