/**
 * Content models for the site. These types are the contract between the content source
 * (static data today, Sanity later) and the presentation components.
 *
 * Rules:
 *  - Content only. Layout concerns (Webflow grid ids, animation ids, CSS class variants)
 *    live in the presentation components, never here, so a CMS editor never sees them.
 *  - Images carry intrinsic dimensions so next/image can reserve space (no layout shift).
 *  - Rich inline emphasis (the pixel-font accent word in headings) is modelled explicitly
 *    as `AccentHeading` instead of HTML strings.
 */

export interface Link {
  label: string;
  href: string;
  /** Opens in a new tab with rel="noopener noreferrer". */
  external?: boolean;
}

/** An image rendered as-is: SVG, animated GIF or small logo, where optimisation adds nothing. */
export interface PlainImage {
  src: string;
  /** Empty string marks the image as decorative. */
  alt: string;
}

/** A raster image rendered through next/image; dimensions are the file's intrinsic size. */
export interface ImageAsset extends PlainImage {
  width: number;
  height: number;
}

/** A heading whose `accent` part is set in the pixel display font (".h1-span"). */
export interface AccentHeading {
  before: string;
  accent: string;
  after?: string;
  /** Put the accent on its own line (the source used a <br>). */
  breakBeforeAccent?: boolean;
}

// ─── Site-wide ────────────────────────────────────────────────────────────────

export interface Brand {
  name: string;
  poweredBy: Link;
}

export interface Podcast {
  title: string;
  description: string;
  href: string;
  image: ImageAsset;
}

export interface Navigation {
  primary: Link[];
  cta: Link;
  more: {
    label: string;
    newsletterHeading: string;
    podcastsHeading: string;
    podcasts: Podcast[];
    contactHeading: string;
    contactCta: Link;
  };
}

export interface FooterColumn {
  title: string;
  /** "social" columns use the boxed social link style. */
  variant: 'links' | 'social';
  links: Link[];
}

export interface Footer {
  newsletterHeading: string;
  columns: FooterColumn[];
  legal: Link[];
  copyright: string;
}

export interface NewsletterCopy {
  placeholder: string;
  submitLabel: string;
  successMessage: string;
  errorMessage: string;
  /** Shown under the input when the address is not valid. */
  invalidEmailMessage: string;
}

export interface SiteSettings {
  brand: Brand;
  navigation: Navigation;
  footer: Footer;
  newsletter: NewsletterCopy;
}

// ─── Homepage ─────────────────────────────────────────────────────────────────

export interface HeroContent {
  heading: AccentHeading;
  lead: string;
  cta: Link;
  /** Exactly four decorative/editorial images, in the order arc, circuit, man, woman. */
  images: [ImageAsset, ImageAsset, ImageAsset, ImageAsset];
}

export interface TrustedCompaniesContent {
  heading: string;
  logos: PlainImage[];
}

export interface EventDetails {
  slug: string;
  title: string;
  description?: string;
  city: string;
  /** ISO 8601 date-time with offset, e.g. 2026-11-10T18:00:00-05:00. */
  startsAt: string;
  endsAt: string;
  /** Display strings, pre-formatted by the content source (time zone aware). */
  display: {
    year: string;
    day: string;
    month: string;
    longDate: string;
    shortDate: string;
    featuredTime: string;
    start: string;
    end: string;
  };
  venue: string;
  price: string;
  soldOut: boolean;
  image: ImageAsset;
  href: string;
}

export interface EventsContent {
  heading: { before: string; accent: string; after: string };
  headingImage: ImageAsset;
  intro: string;
  featured: EventDetails;
  cities: string[];
  events: EventDetails[];
  selectCityLabel: string;
  emptyState: AccentHeading;
  detailsLabel: string;
}

export interface FeatureBlock {
  heading: AccentHeading;
  text: string;
  cta: Link;
  images?: { main: ImageAsset; overlay: ImageAsset };
}

export interface CommunityBenefitsContent {
  learn: FeatureBlock & { images: { main: ImageAsset; overlay: ImageAsset } };
  network: FeatureBlock;
  stayAhead: FeatureBlock & { images: { main: ImageAsset; overlay: ImageAsset } };
}

export interface Testimonial {
  company: string;
  quote: string;
  author: string;
  role: string;
  photo: ImageAsset;
  logo: PlainImage;
}

export interface ImpactStoriesContent {
  tagline: string;
  marqueeText: string;
  testimonials: Testimonial[];
}

export type BenefitIcon = 'maple-leaf' | 'handshake' | 'rocket';

export interface MembershipBenefit {
  icon: BenefitIcon;
  animation: string;
  tag: string;
  title: string;
  text: string;
}

export interface MembershipBenefitsContent {
  heading: string;
  cta: Link;
  benefits: MembershipBenefit[];
}

export interface NewsletterSectionContent {
  image: ImageAsset;
  headlineImage: ImageAsset;
  heading: string;
  text: string;
  consent: { before: string; link: Link; after: string };
}

export interface SponsorPerk {
  title: string;
  text: string;
}

export interface SponsorRow {
  /** Marquee scroll direction. */
  direction: 'left' | 'right';
  logos: PlainImage[];
}

export interface SponsorshipContent {
  tagline: string;
  heading: string;
  perks: SponsorPerk[];
  thankYou: { before: string; accent: string };
  sponsorRows: SponsorRow[];
  cta: Link;
}

export interface SeoContent {
  title: string;
  description: string;
  /** Path relative to the site URL, e.g. "/". */
  path: string;
  ogImage?: ImageAsset;
}

export interface HomePageContent {
  seo: SeoContent;
  hero: HeroContent;
  trustedCompanies: TrustedCompaniesContent;
  events: EventsContent;
  communityBenefits: CommunityBenefitsContent;
  impactStories: ImpactStoriesContent;
  membershipBenefits: MembershipBenefitsContent;
  newsletter: NewsletterSectionContent;
  sponsorship: SponsorshipContent;
}
