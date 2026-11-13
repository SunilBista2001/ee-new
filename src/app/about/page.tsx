import type { Metadata } from 'next';
import { SiteFooter } from '@/components/ee/site-footer';
import { SiteNav } from '@/components/ee/site-nav';
import { AboutBeliefs } from '@/features/about/sections/beliefs';
import { AboutCta } from '@/features/about/sections/cta';
import { AboutDifferent } from '@/features/about/sections/different';
import { AboutHero } from '@/features/about/sections/hero';
import { AboutNext } from '@/features/about/sections/next';
import { AboutStory } from '@/features/about/sections/story';
import { AboutValues } from '@/features/about/sections/values';
import { PageMotion } from '@/lib/motion/page-motion';
import { SmoothScroll } from '@/lib/motion/smooth-scroll';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { settingsForSubpage } from '@/lib/site-links';
import { getAboutPage, getSiteSettings } from '@/services/content';

export const dynamic = 'force-static';

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getAboutPage();
  return buildPageMetadata(seo);
}

export default async function AboutPage() {
  const [baseSettings, page] = await Promise.all([getSiteSettings(), getAboutPage()]);
  const settings = settingsForSubpage(baseSettings);

  return (
    <>
      <SiteNav brand={settings.brand} navigation={settings.navigation} contact={settings.contact} homeHref="/" />
      <main id="main-content" className="hm-page ab-page" tabIndex={-1}>
        {/* Section order follows the About brief (sections 1 to 7). */}
        <AboutHero content={page.hero} />
        <AboutStory content={page.story} />
        <AboutBeliefs content={page.beliefs} />
        <AboutDifferent content={page.different} />
        <AboutValues content={page.values} />
        <AboutNext content={page.next} />
        <AboutCta content={page.cta} />
      </main>
      <SiteFooter settings={settings} />
      <SmoothScroll />
      <PageMotion />
    </>
  );
}
