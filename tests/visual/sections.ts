/**
 * Named homepage regions for section-level screenshots. Selectors rely only on classes
 * and attributes shared by the React reference and the Next.js build.
 */
export const SECTIONS: readonly { name: string; selector: string }[] = [
  { name: 'hero', selector: 'header.section_header-centered' },
  { name: 'trusted-companies', selector: '.section_logo1' },
  { name: 'events-featured', selector: '.section_cta25.bg-radial-gradient' },
  { name: 'events-by-city', selector: '.section_cta25:not(.bg-radial-gradient)' },
  { name: 'learn-from-the-best', selector: '.section_layout1.bg-gradient-blue' },
  { name: 'expand-your-network', selector: '.section_cta8' },
  { name: 'stay-ahead', selector: '.section_layout1:not(.bg-gradient-blue)' },
  { name: 'impact-stories', selector: '.section_testimonial1' },
  { name: 'membership-benefits', selector: '.section_blog44' },
  { name: 'newsletter', selector: '.section_cta8-2' },
  { name: 'sponsorship', selector: 'section:has(> [data-w-id="bf418e48-711c-d77e-849f-3945261b7091"])' },
  { name: 'footer-wordmark', selector: 'section:has(.footer-wordmark)' },
  { name: 'footer', selector: '.footer1_component' },
];
