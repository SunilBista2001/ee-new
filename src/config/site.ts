/**
 * Deployment-level site configuration, read from the environment and validated once.
 *
 * NEXT_PUBLIC_SITE_URL   Absolute production origin, used for canonical URLs, sitemap and OG.
 *                        Falls back to the Vercel production URL when unset.
 * SITE_INDEXABLE         "true" only when the site may be indexed. Defaults to false so preview
 *                        deployments stay out of search results (see README › Launch checklist).
 * NEXT_PUBLIC_PARTNER_BOOKING_URL
 *                        Scheduling link behind every "Book a call" button on /partners (Calendly,
 *                        Cal.com, HubSpot meetings…). Unset: the buttons lead to the inquiry form.
 */
import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url().default('http://localhost:3000'),
  SITE_INDEXABLE: z
    .enum(['true', 'false'])
    .default('false')
    .transform((value) => value === 'true'),
  NEXT_PUBLIC_PARTNER_BOOKING_URL: z.url().optional(),
});

/**
 * On Vercel, fall back to the system variables it sets at build time (the production domain,
 * then the deployment's own URL), so canonical URLs never point at localhost when
 * NEXT_PUBLIC_SITE_URL has not been configured.
 */
const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;

const env = envSchema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || (vercelHost ? `https://${vercelHost}` : undefined),
  SITE_INDEXABLE: process.env.SITE_INDEXABLE,
  NEXT_PUBLIC_PARTNER_BOOKING_URL: process.env.NEXT_PUBLIC_PARTNER_BOOKING_URL || undefined,
});

export const siteConfig = {
  name: 'Elite Entrepreneurs',
  url: new URL(env.NEXT_PUBLIC_SITE_URL),
  locale: 'en_CA',
  language: 'en-CA',
  indexable: env.SITE_INDEXABLE,
  logo: '/assets/ee/brand/logo-brown.png',
  /** External booking link for partnership calls; null until configured. */
  partnerBookingUrl: env.NEXT_PUBLIC_PARTNER_BOOKING_URL ?? null,
} as const;
