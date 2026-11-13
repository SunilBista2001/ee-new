import type { Metadata } from 'next';
import { SiteFooter } from '@/components/ee/site-footer';
import { SiteNav } from '@/components/ee/site-nav';
import { PodcastMotion } from '@/features/podcast/components/podcast-motion';
import { PodcastEpisodes } from '@/features/podcast/sections/episodes';
import { PodcastHero } from '@/features/podcast/sections/hero';
import { PodcastNotify } from '@/features/podcast/sections/notify';
import { PodcastStudio } from '@/features/podcast/sections/studio';
import { PageMotion } from '@/lib/motion/page-motion';
import { SmoothScroll } from '@/lib/motion/smooth-scroll';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { settingsForSubpage } from '@/lib/site-links';
import { getPodcastPage, getSiteSettings } from '@/services/content';

export const dynamic = 'force-static';

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPodcastPage();
  return buildPageMetadata(seo);
}

/**
 * Podcast (/podcast). Pre-launch: an announcement, a look behind the scenes and the launch
 * list. The episodes section appears on its own once episodes are added to the content.
 */
export default async function PodcastPage() {
  const [baseSettings, page] = await Promise.all([getSiteSettings(), getPodcastPage()]);
  const settings = settingsForSubpage(baseSettings);

  return (
    <>
      <SiteNav brand={settings.brand} navigation={settings.navigation} contact={settings.contact} homeHref="/" />
      <main id="main-content" className="hm-page pc-page" tabIndex={-1}>
        <PodcastHero content={page.hero} show={page.show} />
        <PodcastStudio content={page.studio} />
        <PodcastEpisodes content={page.episodesSection} episodes={page.episodes} />
        <PodcastNotify content={page.notify} show={page.show} />
      </main>
      <SiteFooter settings={settings} />
      <SmoothScroll />
      <PageMotion />
      <PodcastMotion />
    </>
  );
}
