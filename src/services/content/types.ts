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

export interface HeroHighlight {
  title: string;
  meta: string;
  icon: 'learn' | 'connect' | 'share';
}

export interface HeroContent {
  /** Small mono line next to the status (location). */
  meta: string;
  status: { label: string; value: string };
  /** Headline in two controlled lines; the second closes with the italic serif accent. */
  headlineStart: string;
  headlineEnd: Headline;
  lead: string;
  primaryCta: Link;
  secondaryCta: Link;
  /** Curved wall of event photos under the headline: one focal image and four side panels. */
  stage: { main: ImageAsset; panels: [ImageAsset, ImageAsset, ImageAsset, ImageAsset] };
  /** Event formats pinned on the photo wall. */
  highlights: HeroHighlight[];
  /** A verified attendee figure. */
  stat: { value: string; label: string; note: string };
  /** Card that links to the speakers section. */
  speakers: { title: string; text: string; avatars: ImageAsset[]; link: Link };
  /** Social proof under the left column. */
  proof: { text: string; avatars: ImageAsset[] };
  /** Text set around the rotating seal. */
  seal: string;
  /** Short closing note in the right column, one line per entry. */
  note: string[];
}

export interface PartnersContent {
  label: string;
  partners: { name: string; logo: ImageAsset }[];
}

export interface IntroContent {
  index: string;
  label: string;
  heading: string;
  /** Large statement revealed word by word on scroll. */
  statement: string;
  detail: string;
  cta: Link;
  images: [ImageAsset, ImageAsset];
  facts: { label: string; value: string }[];
  factsNote: string;
}

export interface GuestsContent {
  /** Small bracketed label above the heading. */
  eyebrow: string;
  /** Two-line heading; `accent` is the second line, set in the italic serif. */
  heading: Headline;
  description: string;
  /** Five portraits, left to right; the middle one is featured. */
  guests: [ImageAsset, ImageAsset, ImageAsset, ImageAsset, ImageAsset];
  /** Oversized word set faintly behind the portraits. */
  backdropWord: string;
}

export interface ExperienceContent {
  index: string;
  label: string;
  heading: string;
  intro: string;
  pillars: { title: string; text: string; meta: string; image: ImageAsset }[];
}

export interface Speaker {
  name: string;
  company: string;
  credential: string;
  photo: ImageAsset;
  href?: string;
}

export interface SpeakersContent {
  index: string;
  label: string;
  heading: string;
  intro: string;
  speakers: Speaker[];
  invite: { title: string; text: string; cta: Link };
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  photo: ImageAsset;
}

export interface StoriesContent {
  index: string;
  label: string;
  heading: string;
  intro: string;
  /** Phrases for the scrolling outline-text band. */
  marquee: string[];
  testimonials: Testimonial[];
}

export interface GalleryContent {
  index: string;
  label: string;
  heading: string;
  intro: string;
  feature: { image: ImageAsset; caption: string };
  moments: { image: ImageAsset; caption: string }[];
  formats: string[];
}

export interface CommunityCtaContent {
  label: string;
  /** Heading in two parts; the faces sit between them. */
  headingStart: string;
  headingEnd: Headline;
  text: string;
  cta: Link;
  faces: ImageAsset[];
  facesCaption: string;
}

export interface NewsletterSectionContent {
  label: string;
  heading: string;
  text: string;
  note: string;
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
  partners: PartnersContent;
  intro: IntroContent;
  guests: GuestsContent;
  experience: ExperienceContent;
  speakers: SpeakersContent;
  stories: StoriesContent;
  gallery: GalleryContent;
  communityCta: CommunityCtaContent;
  newsletter: NewsletterSectionContent;
}
