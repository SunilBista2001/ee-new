import type { Metadata } from 'next';
import { SiteFooter } from '@/components/ee/site-footer';
import { SiteNav } from '@/components/ee/site-nav';
import { Audience } from '@/features/home/sections/audience';
import { Calendar } from '@/features/home/sections/calendar';
import { Ecosystem } from '@/features/home/sections/ecosystem';
import { Gallery } from '@/features/home/sections/gallery';
import { Hero } from '@/features/home/sections/hero';
import { Newsletter } from '@/features/home/sections/newsletter';
import { PartnerBand } from '@/features/home/sections/partner-band';
import { Podcast } from '@/features/home/sections/podcast';
import { Proof } from '@/features/home/sections/proof';
import { Testimonials } from '@/features/home/sections/testimonials';
import { Why } from '@/features/home/sections/why';
import { PageMotion } from '@/lib/motion/page-motion';
import { SmoothScroll } from '@/lib/motion/smooth-scroll';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { getHomePage, getSiteSettings } from '@/services/content';
import { getUpcomingEvents } from '@/services/events/luma';

/** Fully static: content is read at build time. Revisit (ISR / tag revalidation) with Sanity. */
export const dynamic = 'force-static';
/** The Luma event list is refreshed hourly (see services/events/luma.ts). */
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getHomePage();
  return buildPageMetadata(seo);
}

export default async function HomePage() {
  const [settings, home] = await Promise.all([getSiteSettings(), getHomePage()]);
  const events = await getUpcomingEvents(home.calendar.calendarId);

  return (
    <>
      <SiteNav brand={settings.brand} navigation={settings.navigation} contact={settings.contact} />
      <main id="main-content" className="hm-page" tabIndex={-1}>
        {/* Section order follows the content brief (Home, sections 1 to 11). */}
        <Hero content={home.hero} />
        <Proof content={home.proof} />
        <Why content={home.why} />
        <Audience content={home.audience} />
        <Ecosystem content={home.ecosystem} />
        <Calendar content={home.calendar} events={events} />
        <Gallery content={home.gallery} />
        <Testimonials content={home.testimonials} />
        <Podcast content={home.podcast} />
        <PartnerBand content={home.partnerBand} />
        <Newsletter content={home.newsletter} copy={settings.newsletter} />
      </main>
      <SiteFooter settings={settings} />
      <SmoothScroll />
      <PageMotion />
    </>
  );
}
