import type { Metadata } from 'next';
import { SiteFooter } from '@/components/ee/site-footer';
import { SiteNav } from '@/components/ee/site-nav';
import { CommunityCta } from '@/features/home/sections/community-cta';
import { Experience } from '@/features/home/sections/experience';
import { Gallery } from '@/features/home/sections/gallery';
import { Guests } from '@/features/home/sections/guests';
import { Hero } from '@/features/home/sections/hero';
import { Intro } from '@/features/home/sections/intro';
import { Newsletter } from '@/features/home/sections/newsletter';
import { Partners } from '@/features/home/sections/partners';
import { Speakers } from '@/features/home/sections/speakers';
import { Stories } from '@/features/home/sections/stories';
import { PageMotion } from '@/lib/motion/page-motion';
import { SmoothScroll } from '@/lib/motion/smooth-scroll';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { getHomePage, getSiteSettings } from '@/services/content';

/** Fully static: content is read at build time. Revisit (ISR / tag revalidation) with Sanity. */
export const dynamic = 'force-static';

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getHomePage();
  return buildPageMetadata(seo);
}

export default async function HomePage() {
  const [settings, home] = await Promise.all([getSiteSettings(), getHomePage()]);

  return (
    <>
      <SiteNav brand={settings.brand} navigation={settings.navigation} contact={settings.contact} />
      <main id="main-content" tabIndex={-1}>
        <Hero content={home.hero} />
        <Partners content={home.partners} />
        <Intro content={home.intro} />
        <Guests content={home.guests} />
        <Experience content={home.experience} />
        <Speakers content={home.speakers} />
        <Stories content={home.stories} />
        <Gallery content={home.gallery} />
        <CommunityCta content={home.communityCta} />
        <Newsletter content={home.newsletter} copy={settings.newsletter} />
      </main>
      <SiteFooter settings={settings} />
      <SmoothScroll />
      <PageMotion />
    </>
  );
}
