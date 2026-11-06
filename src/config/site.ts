/**
 * Deployment-level site configuration, read from the environment and validated once.
 *
 * NEXT_PUBLIC_SITE_URL   Absolute production origin, used for canonical URLs, sitemap and OG.
 * SITE_INDEXABLE         "true" only when the site may be indexed. Defaults to false so preview
 *                        deployments stay out of search results (see README › Launch checklist).
 */
import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url().default('http://localhost:3000'),
  SITE_INDEXABLE: z
    .enum(['true', 'false'])
    .default('false')
    .transform((value) => value === 'true'),
});

const env = envSchema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  SITE_INDEXABLE: process.env.SITE_INDEXABLE,
});

export const siteConfig = {
  name: 'Elite Entrepreneurs',
  url: new URL(env.NEXT_PUBLIC_SITE_URL),
  locale: 'en_CA',
  language: 'en-CA',
  indexable: env.SITE_INDEXABLE,
  logo: '/assets/ee/brand/logo-brown.png',
} as const;
