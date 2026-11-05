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
  themeColor: '#faf8f4', // --tt-off-white, the page background
};

/*
 * Same as Webflow's head snippet in the React build: flags JS / touch support on <html>
 * (the Webflow CSS keys off `w-mod-touch`) and keeps the mobile-nav `--vh` unit current.
 * It runs before first paint, hence `suppressHydrationWarning` on <html>.
 */
const HEAD_SCRIPT = `(function(w,d){var n=d.documentElement,t=' w-mod-';n.className+=t+'js';if('ontouchstart'in w||(w.DocumentTouch&&d instanceof DocumentTouch))n.className+=t+'touch';function vh(){n.style.setProperty('--vh',w.innerHeight*0.01+'px')}vh();w.addEventListener('resize',vh)})(window,document);`;

/*
 * Without JavaScript the scroll reveals never run, so show every animated element as-is.
 */
const NO_SCRIPT_CSS =
  '[data-w-id],.events-subheading{opacity:1!important;transform:none!important}.img-highlight{display:none}';

export default async function RootLayout({ children }: { children: ReactNode }) {
  const { brand } = await getSiteSettings();
  return (
    <html lang={siteConfig.language} className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: HEAD_SCRIPT }} />
        <noscript>
          <style>{NO_SCRIPT_CSS}</style>
        </noscript>
      </head>
      <body>
        <a
          href="#main-content"
          className="button w-button tw:absolute tw:-top-40 tw:left-4 tw:z-[10000] tw:focus:top-4"
        >
          Skip to content
        </a>
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: brand.name,
            url: siteConfig.url.toString(),
            inLanguage: siteConfig.language,
          }}
        />
        {children}
      </body>
    </html>
  );
}
