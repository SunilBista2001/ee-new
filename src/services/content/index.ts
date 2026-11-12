import 'server-only';
import { cache } from 'react';
import type { ContentProvider } from './provider';
import { staticContentProvider } from './static-content';

/**
 * Returns the active content provider. When Sanity is connected, select it here
 * (e.g. based on an env flag) — nothing else in the app needs to change.
 */
export function getContentProvider(): ContentProvider {
  return staticContentProvider;
}

/** Request-deduplicated accessors for Server Components (layout + page share one read). */
export const getSiteSettings = cache(() => getContentProvider().getSiteSettings());
export const getHomePage = cache(() => getContentProvider().getHomePage());
export const getPartnersPage = cache(() => getContentProvider().getPartnersPage());

export type * from './types';
export type { ContentProvider } from './provider';
