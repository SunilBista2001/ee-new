/**
 * Content models for the site. These types are the contract between the content source
 * (static data today, Sanity later) and the presentation components.
 *
 * Rules:
 *  - Content only. Layout concerns (grid placement, animation hooks) live in components.
 *  - Raster images carry intrinsic dimensions so next/image can reserve space (no layout shift).
 *  - Only verified information. Where something is not confirmed yet (the next event's date,
 *    city, speakers or prices), the model has an explicit "announcement" state instead of
 *    placeholder facts.
 */

export interface Link {
  label: string;
  href: string;
  /** Opens in a new tab with rel="noopener noreferrer". */
  external?: boolean;
}

export interface ImageAsset {
  src: string;
  /** Empty string marks the image as decorative. */
  alt: string;
  width: number;
  height: number;
  /** CSS object-position for art direction, e.g. "50% 20%". */
  focus?: string;
}

/** A headline; `accent` is the closing phrase, set in the italic serif. */
export interface Headline {
  text: string;
  accent?: string;
}

// ─── Site-wide ────────────────────────────────────────────────────────────────

export interface Brand {
  name: string;
  shortName: string;
  tagline: string;
  /** Transparent single-colour mark, tinted with CSS (used as a mask). */
  mark: ImageAsset;
}

export interface Navigation {
  primary: Link[];
  cta: Link;
}

export interface ContactInfo {
  email: string;
  location: string;
}

export interface FooterContent {
  description: string;
  columns: { title: string; links: Link[] }[];
  copyright: string;
  credit: Link;
}

export interface NewsletterCopy {
  placeholder: string;
  submitLabel: string;
  successMessage: string;
  errorMessage: string;
  invalidEmailMessage: string;
}

export interface SiteSettings {
  brand: Brand;
  navigation: Navigation;
  contact: ContactInfo;
  footer: FooterContent;
  newsletter: NewsletterCopy;
}

// ─── Homepage ─────────────────────────────────────────────────────────────────
//
// Structure and copy follow the "EE Website: Page-by-Page Brief" (Home). Text in [brackets]
// is a placeholder from the brief: it renders as a visibly marked slot until real copy lands.

export interface HeroContent {
  /** `accent` closes the headline in the italic serif. */
  headline: Headline;
  lead: string;
  primaryCta: Link;
  secondaryCta: Link;
  /** Wide main photo and a small overlapping detail. */
  image: ImageAsset;
  inset: ImageAsset;
}

export interface ProofContent {
  /** Screen-reader heading for the strip. */
  label: string;
  stats: { value: string; label: string }[];
  logosLabel: string;
  logos: { name: string; logo: ImageAsset }[];
}

export interface WhyContent {
  index: string;
  label: string;
  heading: string;
  /** One idea per line. */
  lines: string[];
  /** The line given emphasis (the turn of the argument). */
  emphasis: string;
  body: string;
  /** Final line, set in the italic serif. */
  closing: string;
  cta: Link;
  /** Tall main photo and a smaller overlapping one. */
  images: [ImageAsset, ImageAsset];
}

export interface AudienceContent {
  index: string;
  heading: string;
  forList: { title: string; items: string[] };
  notForList: { title: string; items: string[] };
  /** Faces from the community, shown beside the heading. */
  faces: ImageAsset[];
}

export interface EcosystemItem {
  name: string;
  text?: string;
  /** Link to the format's section on the Events page; omitted while it is not live. */
  href?: string;
  /** Status tag for formats that are not live yet. */
  status?: string;
  image: ImageAsset;
}

export interface EcosystemContent {
  index: string;
  label: string;
  heading: string;
  items: EcosystemItem[];
}

export interface CalendarContent {
  index: string;
  heading: string;
  /** Luma calendar id, used to read the upcoming events. */
  calendarId: string;
  /** Luma calendar embed (iframe src): shown if the events cannot be loaded. */
  embedUrl: string;
  /** Link to the same calendar on Luma. */
  link: Link;
}

export interface GalleryContent {
  index: string;
  heading: string;
  video: { src: string; poster: ImageAsset; playLabel: string };
  photos: ImageAsset[];
}

export interface Testimonial {
  quote: string;
  name: string;
  company: string;
  /** Optional portrait; a monogram is shown without one. */
  photo?: ImageAsset;
}

export interface TestimonialsContent {
  index: string;
  heading: string;
  items: Testimonial[];
}

export interface PodcastContent {
  label: string;
  heading: string;
  text: string;
  cta: Link;
  image: ImageAsset;
}

export interface PartnerBandContent {
  heading: string;
  cta: Link;
  image: ImageAsset;
}

export interface NewsletterSectionContent {
  label: string;
  heading: string;
  submitLabel: string;
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
  proof: ProofContent;
  why: WhyContent;
  audience: AudienceContent;
  ecosystem: EcosystemContent;
  calendar: CalendarContent;
  gallery: GalleryContent;
  testimonials: TestimonialsContent;
  podcast: PodcastContent;
  partnerBand: PartnerBandContent;
  newsletter: NewsletterSectionContent;
}

// ─── Partners page ────────────────────────────────────────────────────────────
//
// Structure and copy follow the Partners brief (sections 1 to 9, in order). Nothing is
// invented: partner quotes, contacts and results are optional and render as an explicit
// "story in progress" state until they are supplied.

export interface PartnersHeroContent {
  label: string;
  headline: Headline;
  lead: string;
  /** Main editorial photo and a smaller one from Elite's own events. */
  image: ImageAsset;
  inset: ImageAsset;
  insetCaption: string;
  /** Approved numbers, reused from the homepage proof strip. */
  facts: { value: string; label: string }[];
}

export interface PartnersAudienceContent {
  index: string;
  label: string;
  heading: string;
  /** The kinds of people in the room. */
  items: string[];
  /** The closing line, set apart: the founders the room is built around. */
  highlight: string;
  image: ImageAsset;
  caption: string;
}

export interface PartnersWhyContent {
  index: string;
  label: string;
  heading: string;
  /** Short opening lines, filled in word by word on scroll. */
  lines: string[];
  body: string;
  benefits: { title: string; text?: string }[];
  images: [ImageAsset, ImageAsset];
}

export interface PartnersBenefitsContent {
  index: string;
  label: string;
  heading: string;
  items: string[];
}

export interface PartnershipOption {
  title: string;
  image: ImageAsset;
}

export interface PartnersWaysContent {
  index: string;
  label: string;
  heading: string;
  options: PartnershipOption[];
}

export interface FounderContent {
  index: string;
  label: string;
  name: string;
  /** Full name, for the caption and alt text. */
  fullName: string;
  role: string;
  portrait: ImageAsset;
  credentials: { label: string; text: string; logo?: ImageAsset }[];
  links: Link[];
}

export interface PartnerStory {
  partner: string;
  logo: ImageAsset;
  /** Everything below is optional until supplied by the partner. */
  quote?: string;
  person?: { name: string; role: string };
  result?: { value: string; label: string };
}

export interface PartnerStoriesContent {
  index: string;
  label: string;
  heading: string;
  /** Copy for a story that has not been supplied yet. */
  emptyState: { title: string; text: string };
  stories: PartnerStory[];
}

export interface PastPartnersContent {
  index: string;
  label: string;
  heading: string;
  partners: { name: string; logo: ImageAsset }[];
}

export interface InquiryContent {
  index: string;
  label: string;
  heading: string;
  intro: string;
  /** "[X]" stays a marked placeholder until the response time is confirmed. */
  successMessage: string;
  errorMessage: string;
  unavailableMessage: string;
  submitLabel: string;
}

export interface PartnersPageContent {
  seo: SeoContent;
  /** Label of every "Book a call" button. */
  bookCallLabel: string;
  hero: PartnersHeroContent;
  audience: PartnersAudienceContent;
  why: PartnersWhyContent;
  benefits: PartnersBenefitsContent;
  ways: PartnersWaysContent;
  founder: FounderContent;
  stories: PartnerStoriesContent;
  pastPartners: PastPartnersContent;
  inquiry: InquiryContent;
}
