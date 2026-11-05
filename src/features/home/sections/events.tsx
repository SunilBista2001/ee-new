import Image from 'next/image';
import { CityEvents } from '../components/city-events';
import { EventRow } from '../components/event-row';
import { FeaturedEvent } from '../components/featured-event';
import { AccentHeading } from '@/components/ui/accent-heading';
import { INITIAL_STYLE, MOTION_IDS } from '@/lib/motion/reveal-config';
import type { EventsContent } from '@/services/content';

export function Events({ content }: { content: EventsContent }) {
  const { heading, headingImage } = content;
  return (
    <>
      <section
        aria-labelledby="events-heading"
        data-w-id={MOTION_IDS.events.section}
        style={INITIAL_STYLE.hidden}
        className="section_cta25 bg-radial-gradient"
      >
        <div className="padding-global">
          <div className="container-large">
            <div className="padding-section-large">
              <div className="cta25_component">
                <div className="margin-bottom margin-medium">
                  <div className="text-align-center">
                    <div className="align-center">
                      <div className="margin-bottom margin-small">
                        <div
                          id="events-heading"
                          data-w-id={MOTION_IDS.events.title}
                          style={INITIAL_STYLE.slideUp}
                          className="events-title"
                        >
                          <h2 className="heading-style-h1">{heading.before}</h2>
                          <div className="event-mic highlight-wrapper">
                            <div className="wipe-wrapper">
                              <div className="img-highlight" aria-hidden="true" />
                              <Image
                                src={headingImage.src}
                                alt={headingImage.alt}
                                width={headingImage.width}
                                height={headingImage.height}
                              />
                            </div>
                          </div>
                          <h2 className="heading-style-h1">
                            {heading.after}
                            <span data-scramble="" className="h1-span">
                              {heading.accent}
                            </span>
                          </h2>
                        </div>
                      </div>
                    </div>
                    <div className="max-width-large align-center">
                      <h3 style={INITIAL_STYLE.hidden} className="events-subheading">
                        {content.intro}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
              <div className="padding-top padding-medium">
                <FeaturedEvent event={content.featured} detailsLabel={content.detailsLabel} />
              </div>
            </div>
          </div>
        </div>
      </section>
      <CityEvents
        cities={content.cities}
        selectCityLabel={content.selectCityLabel}
        rows={content.events.map((event) => ({
          key: event.slug,
          city: event.city,
          content: <EventRow event={event} detailsLabel={content.detailsLabel} />,
        }))}
        emptyState={
          <div className="no-events text-align-center">
            <div className="check-back-soon">
              {/* Styled by the legacy `h1` element rules; exposed to assistive tech as a level-2 heading. */}
              <AccentHeading
                as="h1"
                aria-level={2}
                heading={content.emptyState}
                data-w-id={MOTION_IDS.events.emptyState}
                style={INITIAL_STYLE.slideUp}
              />
            </div>
          </div>
        }
      />
    </>
  );
}
