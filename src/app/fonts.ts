import localFont from 'next/font/local';

/*
 * Brand fonts, self-hosted and preloaded by next/font (replaces the manual <link rel=preload>
 * tags and @font-face rules of the React build). Each exposes a CSS variable that the legacy
 * Webflow stylesheet and the Tailwind tokens reference.
 *
 * adjustFontFallback is off: the original rendered its plain `sans-serif` fallback while fonts
 * loaded, and the metric-adjusted fallback would change line boxes for the brief swap period.
 */
export const artex = localFont({
  src: '../assets/fonts/artex-regular.ttf',
  variable: '--font-artex',
  weight: '400',
  display: 'swap',
  adjustFontFallback: false,
});

export const featureDisplay = localFont({
  src: '../assets/fonts/featuredisplay-regular.otf',
  variable: '--font-feature-display',
  weight: '400',
  display: 'swap',
  adjustFontFallback: false,
});

export const ppMondwest = localFont({
  src: '../assets/fonts/ppmondwest-regular-1.otf',
  variable: '--font-pp-mondwest',
  weight: '400',
  display: 'swap',
  adjustFontFallback: false,
});

export const fontVariables = [artex.variable, featureDisplay.variable, ppMondwest.variable].join(' ');
