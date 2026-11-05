import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

/** Routes served by this app. Add entries here as pages are migrated. */
const ROUTES = ['/'] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((path) => ({
    url: new URL(path, siteConfig.url).toString(),
    changeFrequency: 'weekly',
    priority: path === '/' ? 1 : 0.7,
  }));
}
