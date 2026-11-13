import type { Metadata } from 'next';
import { SiteFooter } from '@/components/ee/site-footer';
import { SiteNav } from '@/components/ee/site-nav';
import { EventsFifteen } from '@/features/events/sections/fifteen';
import { EventsHero } from '@/features/events/sections/hero';
import { EventsSidequests } from '@/features/events/sections/sidequests';
import { Calendar } from '@/features/home/sections/calendar';
import { PageMotion } from '@/lib/motion/page-motion';
import { SmoothScroll } from '@/lib/motion/smooth-scroll';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { settingsForSubpage } from '@/lib/site-links';
import { getEventsPage, getSiteSettings } from '@/services/content';
import { getUpcomingEvents } from '@/services/events/luma';

export const dynamic = 'force-static';
/** The Luma event list is refreshed hourly (see services/events/luma.ts). */
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getEventsPage();
  return buildPageMetadata(seo);
}

export default async function EventsPage() {
  const [baseSettings, page] = await Promise.all([getSiteSettings(), getEventsPage()]);
  const settings = settingsForSubpage(baseSettings);
  const events = await getUpcomingEvents(page.calendar.calendarId);

  return (
    <>
      <SiteNav brand={settings.brand} navigation={settings.navigation} contact={settings.contact} homeHref="/" />
      <main id="main-content" className="hm-page ev-page" tabIndex={-1}>
        {/* Section order follows the Events brief. Sections 4 onward are still to be supplied;
            the calendar (target of the hero button) closes the page until then. */}
        <EventsHero content={page.hero} />
        <EventsFifteen content={page.fifteen} />
        <EventsSidequests content={page.sidequests} />
        <Calendar id="calendar" content={page.calendar} events={events} />
      </main>
      <SiteFooter settings={settings} />
      <SmoothScroll />
      <PageMotion />
    </>
  );
}
