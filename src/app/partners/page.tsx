import type { Metadata } from 'next';
import { SiteFooter } from '@/components/ee/site-footer';
import { SiteNav } from '@/components/ee/site-nav';
import { siteConfig } from '@/config/site';
import { PartnersAudience } from '@/features/partners/sections/audience';
import { PartnersBenefits } from '@/features/partners/sections/benefits';
import { PartnersFounder } from '@/features/partners/sections/founder';
import { PartnersHero } from '@/features/partners/sections/hero';
import { PartnersInquiry } from '@/features/partners/sections/inquiry';
import { PartnersPast } from '@/features/partners/sections/past-partners';
import { PartnersStories } from '@/features/partners/sections/stories';
import { PartnersWays } from '@/features/partners/sections/ways';
import { PartnersWhy } from '@/features/partners/sections/why';
import { PageMotion } from '@/lib/motion/page-motion';
import { SmoothScroll } from '@/lib/motion/smooth-scroll';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { settingsForSubpage } from '@/lib/site-links';
import type { Link } from '@/services/content';
import { getPartnersPage, getSiteSettings } from '@/services/content';

export const dynamic = 'force-static';

const INQUIRY_HREF = '#inquiry';

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPartnersPage();
  return buildPageMetadata(seo);
}

export default async function PartnersPage() {
  const [baseSettings, page] = await Promise.all([getSiteSettings(), getPartnersPage()]);
  const settings = settingsForSubpage(baseSettings);

  // "Book a call" uses the configured scheduling link; until one is set, it leads to the form.
  const booking: Link | null = siteConfig.partnerBookingUrl
    ? { label: page.bookCallLabel, href: siteConfig.partnerBookingUrl, external: true }
    : null;
  const bookCall: Link = booking ?? { label: page.bookCallLabel, href: INQUIRY_HREF };

  return (
    <>
      <SiteNav brand={settings.brand} navigation={settings.navigation} contact={settings.contact} homeHref="/" />
      <main id="main-content" className="hm-page pt-page" tabIndex={-1}>
        {/* Section order follows the Partners brief (sections 1 to 9). */}
        <PartnersHero content={page.hero} bookCall={bookCall} inquiryHref={INQUIRY_HREF} />
        <PartnersAudience content={page.audience} />
        <PartnersWhy content={page.why} />
        <PartnersBenefits content={page.benefits} bookCall={bookCall} />
        <PartnersWays content={page.ways} bookCall={bookCall} inquiryHref={INQUIRY_HREF} />
        <PartnersFounder content={page.founder} />
        <PartnersStories content={page.stories} />
        <PartnersPast content={page.pastPartners} />
        <PartnersInquiry content={page.inquiry} bookCall={booking} contactEmail={settings.contact.email} />
      </main>
      <SiteFooter settings={settings} />
      <SmoothScroll />
      <PageMotion />
    </>
  );
}
