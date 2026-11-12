import type { Link, Navigation, SiteSettings } from '@/services/content';

/**
 * The shared navigation and footer point at homepage sections with bare anchors ("#events").
 * On any other page those anchors must lead back to the homepage. `#top` and `#contact`
 * (the footer, present on every page) stay local.
 */
const LOCAL_ANCHORS = new Set(['#top', '#contact']);

const toHome = (link: Link): Link =>
  link.href.startsWith('#') && !LOCAL_ANCHORS.has(link.href) ? { ...link, href: `/${link.href}` } : link;

export function navigationForSubpage(navigation: Navigation): Navigation {
  return { primary: navigation.primary.map(toHome), cta: toHome(navigation.cta) };
}

export function settingsForSubpage(settings: SiteSettings): SiteSettings {
  return {
    ...settings,
    navigation: navigationForSubpage(settings.navigation),
    footer: {
      ...settings.footer,
      columns: settings.footer.columns.map((col) => ({ ...col, links: col.links.map(toHome) })),
    },
  };
}
