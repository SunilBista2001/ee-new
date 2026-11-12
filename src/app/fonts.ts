import { Geist, Geist_Mono, Instrument_Serif, Inter_Tight } from 'next/font/google';

/*
 * Brand typography, self-hosted at build time by next/font.
 *
 *  Geist             variable sans for everything: headlines, body copy, labels.
 *  Geist Mono        small uppercase labels, indices and metadata.
 *  Inter Tight       homepage headlines and display numerals: Inter's tighter display cut.
 *  Instrument Serif  italic accent, kept for pages that use the `.serif` class.
 */
export const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
});

export const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});

export const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['italic'],
  variable: '--font-instrument',
  display: 'swap',
});

export const interTight = Inter_Tight({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter-tight',
  display: 'swap',
});

export const fontVariables = [geist.variable, geistMono.variable, instrumentSerif.variable, interTight.variable].join(
  ' ',
);
