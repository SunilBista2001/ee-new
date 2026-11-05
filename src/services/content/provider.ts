import type { HomePageContent, SiteSettings } from './types';

/**
 * The single seam between pages and their content source.
 *
 * Pages and layouts call `getContentProvider()` (see ./index.ts) and never import a
 * concrete source. Today the implementation is `staticContentProvider`; a Sanity-backed
 * provider can implement this same interface (GROQ queries in src/sanity/queries map
 * documents to these types) without any change to page or section components.
 *
 * Methods are async on purpose: a remote CMS is async, so callers are written for it now.
 */
export interface ContentProvider {
  getSiteSettings(): Promise<SiteSettings>;
  getHomePage(): Promise<HomePageContent>;
}
