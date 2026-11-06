import { Geist, Geist_Mono, Instrument_Serif } from 'next/font/google';

/*
 * Brand typography, self-hosted at build time by next/font.
 *
 *  Geist             variable sans for everything: headlines, body copy, labels.
 *  Geist Mono        small uppercase labels, indices and metadata.
 *  Instrument Serif  italic, used sparingly for the closing phrase of a few headlines.
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

export const fontVariables = [geist.variable, geistMono.variable, instrumentSerif.variable].join(' ');
