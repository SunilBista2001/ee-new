import type { ReactNode } from 'react';

/** Small line icons for platform and social links. 20×20, stroke = currentColor. */
const paths: Record<string, ReactNode> = {
  instagram: (
    <>
      <rect x="3" y="3" width="14" height="14" rx="4" />
      <circle cx="10" cy="10" r="3.2" />
      <circle cx="14.2" cy="5.8" r="0.6" fill="currentColor" stroke="none" />
    </>
  ),
  linkedin: (
    <>
      <rect x="3" y="3" width="14" height="14" rx="2.5" />
      <path d="M6.8 9v4.6M6.8 6.6v.1M9.6 13.6V9m0 2.2c0-1.3.8-2.3 2-2.3s1.8.8 1.8 2.1v2.6" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="4.5" width="14" height="12.5" rx="2.5" />
      <path d="M3 8.5h14M7 2.8v3.2M13 2.8v3.2" />
    </>
  ),
  youtube: (
    <>
      <rect x="2.5" y="4.5" width="15" height="11" rx="3.5" />
      <path d="m8.6 7.6 3.6 2.4-3.6 2.4z" fill="currentColor" />
    </>
  ),
  spotify: (
    <>
      <circle cx="10" cy="10" r="7.5" />
      <path d="M6.3 8c2.6-.8 5.4-.6 7.6.6M6.8 10.5c2-.6 4.2-.4 5.9.5M7.3 12.9c1.5-.4 3.1-.3 4.3.4" />
    </>
  ),
  apple: (
    <>
      <path d="M6.2 13.6a5.6 5.6 0 1 1 7.6 0" />
      <path d="M7.9 11.6a3 3 0 1 1 4.2 0" />
      <circle cx="10" cy="9.4" r="1" fill="currentColor" stroke="none" />
      <path d="M10 11.6v4.4" />
    </>
  ),
  arrow: <path d="M6 14 14 6M8 6h6v6" />,
};

export type IconName = keyof typeof paths;

export function LinkIcon({ name }: { name: IconName }) {
  return (
    <svg
      viewBox="0 0 20 20"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] ?? paths.arrow}
    </svg>
  );
}

/** Picks an icon from a link's host. */
export function iconForHref(href: string): IconName {
  if (/instagram\.com/.test(href)) return 'instagram';
  if (/linkedin\.com/.test(href)) return 'linkedin';
  if (/youtube\.com|youtu\.be/.test(href)) return 'youtube';
  if (/spotify\.com/.test(href)) return 'spotify';
  if (/podcasts\.apple\.com/.test(href)) return 'apple';
  if (/luma\.com|lu\.ma/.test(href)) return 'calendar';
  return 'arrow';
}
