import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { fontVariables } from './fonts';
import './globals.css';
import { siteConfig } from '@/config/site';
import { JsonLd } from '@/lib/seo/json-ld';
import { getSiteSettings } from '@/services/content';

export const metadata: Metadata = {
  metadataBase: siteConfig.url,
  applicationName: siteConfig.name,
  title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
  robots: siteConfig.indexable ? { index: true, follow: true } : { index: false, follow: false },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: siteConfig.logo,
  },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f5f0e8',
  colorScheme: 'light',
};

/*
 * Runs before first paint (hence `suppressHydrationWarning` on <html>):
 *  - `has-motion` when JS runs and the visitor allows motion. Every pre-animation state in the
 *    stylesheet is keyed on it, so without JS or with reduced motion content is simply visible.
 *  - a failsafe adds `motion-fallback` (shows everything) if the motion code never reports ready.
 */
const HEAD_SCRIPT = `(function(w,d){var n=d.documentElement;n.classList.add('js');try{if(!w.matchMedia('(prefers-reduced-motion: reduce)').matches)n.classList.add('has-motion');}catch(e){}w.setTimeout(function(){if(!n.classList.contains('motion-ready'))n.classList.add('motion-fallback')},4000)})(window,document);`;

export default async function RootLayout({ children }: { children: ReactNode }) {
  const { brand } = await getSiteSettings();
  return (
    <html lang={siteConfig.language} className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: HEAD_SCRIPT }} />
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: brand.name,
            url: siteConfig.url.toString(),
            logo: new URL(siteConfig.logo, siteConfig.url).toString(),
          }}
        />
        {children}
      </body>
    </html>
  );
}
