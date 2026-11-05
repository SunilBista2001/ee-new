import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import type { SeoContent } from '@/services/content';

/** Builds page metadata from CMS-style SEO content: title, description, canonical, OG, Twitter. */
export function buildPageMetadata(seo: SeoContent): Metadata {
  const url = new URL(seo.path, siteConfig.url).toString();
  const images = seo.ogImage
    ? [{ url: seo.ogImage.src, width: seo.ogImage.width, height: seo.ogImage.height, alt: seo.ogImage.alt }]
    : undefined;

  return {
    title: { absolute: seo.title },
    description: seo.description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      title: seo.title,
      description: seo.description,
      images,
    },
    twitter: {
      card: images ? 'summary_large_image' : 'summary',
      title: seo.title,
      description: seo.description,
      images: images?.map((image) => image.url),
    },
  };
}
