/**
 * Static content source for the Elite Entrepreneurs site, typed against ./types.
 *
 * Homepage copy and structure follow the "EE Website: Page-by-Page Brief" (Home) word for
 * word. Text in [brackets] is a placeholder from the brief and renders as a marked slot.
 *
 * Photography: /assets/ee/event, /speakers and /attendees are Elite's own images. /assets/ee/stock
 * holds licence-free stand-ins from Unsplash (see README › Content & assets): replace them with
 * real event photography, keeping file names or updating the paths in `STOCK` below.
 *
 * REPLACEMENT POINTS:
 *  - `LINKS.youtube`: the YouTube channel URL (empty means "not live yet": the button renders
 *    disabled). `LINKS.lumaEmbed` is the public Luma calendar.
 *  - `ROUTES`: the Events, Partners and About pages from the brief.
 *  - `testimonials.items`: quotes, last names and companies are still to come.
 */
import type { ContentProvider } from './provider';
import type { HomePageContent, ImageAsset, PartnersPageContent, SiteSettings } from './types';

const EE = '/assets/ee';

const img = (file: string, alt: string, width: number, height: number, focus?: string): ImageAsset => ({
  src: `${EE}/${file}`,
  alt,
  width,
  height,
  ...(focus ? { focus } : {}),
});

// Nav links to homepage sections use bare anchors (rewritten to "/#…" on other pages by
// lib/site-links.ts). Point Events and About at ROUTES once those pages exist.
const CONTACT_EMAIL = 'pb@mintaveinc.com';
const LUMA = 'https://luma.com/eliteentrepreneur';
const FOUNDER_INSTAGRAM = 'https://www.instagram.com/lifeofsplash/';
const FOUNDER_LINKEDIN = 'https://www.linkedin.com/in/parikchhit-basnet/';

/** Pages from the brief. */
const ROUTES = {
  events: '/events',
  partners: '/partners',
  about: '/about',
} as const;

const LINKS = {
  lumaCalendarId: 'cal-cZXdkI64HNrkwmv',
  lumaEmbed: 'https://luma.com/embed/calendar/cal-cZXdkI64HNrkwmv/events?lt=light',
  /** [link] in the brief: not published yet. */
  youtube: '',
} as const;

/** Social preview image (metadata only; on-page pictures are placeholders). */
const OG_IMAGE = img(
  'event/summit-room.jpg',
  'Attendees seated at round tables in a Toronto ballroom, watching the stage at an Elite Entrepreneurs summit',
  1200,
  450,
);

const stock = (file: string, alt: string, width: number, height: number, focus?: string) =>
  img(`stock/${file}.jpg`, alt, width, height, focus);

/** Stand-in photography (Unsplash). Replace with Elite's own event photos. */
const STOCK = {
  crowd: stock('crowd', 'A large group of guests cheering together at an evening event', 1800, 1096, '50% 40%'),
  toast: stock('toast', 'Guests raising their glasses in a toast', 1800, 1200),
  dinnerTable: stock('dinner-table', 'A long candlelit dinner table set for a private dinner', 1800, 1200),
  dinnerLaughing: stock('dinner-laughing', 'Friends laughing together over dinner', 1800, 1200, '45% 40%'),
  dinnerTalk: stock('dinner-talk', 'Two guests in conversation at a dinner', 1800, 1378),
  dinnerEvent: stock('dinner-event', 'Guests seated at a decorated dinner table', 1800, 1200),
  padel: stock('padel', 'Two players on a padel court', 1800, 2700, '50% 35%'),
  mixer: stock('mixer', 'People mingling at an indoor evening event in warm light', 1800, 1200),
  conversation: stock('conversation', 'A small group talking around a table', 1800, 1200),
  networking: stock('networking', 'People meeting and talking by a window', 1800, 1200),
  greeting: stock('greeting', 'Guests greeting each other at an event', 1800, 1013),
  summitStage: stock('summit-stage', 'A speaker on stage in front of a full audience', 1800, 1200),
  speaker: stock('speaker', 'A speaker addressing a crowd', 1800, 1200),
  podcast: stock('podcast', 'Two people recording a podcast with headphones and microphones', 1800, 1187),
} as const;

/** Elite's own photography. */
const EVENT = {
  backdropTalk: img(
    'event/moment-backdrop-talk.jpg',
    'Two attendees in conversation in front of the Elite Entrepreneurs backdrop',
    540,
    395,
    '50% 45%',
  ),
  networking: img(
    'event/moment-networking.jpg',
    'Attendees talking during a networking break at an Elite Entrepreneurs summit',
    540,
    420,
    '55% 70%',
  ),
} as const;

const face = (slug: string): ImageAsset => img(`attendees/${slug}.jpg`, '', 400, 400);
const sponsor = (file: string, name: string, width: number, height: number) => ({
  name,
  logo: img(`sponsors/${file}.png`, name, width, height),
});

/** Summit partner logos (white on transparent; tinted with CSS). */
const SPONSORS = {
  amex: sponsor('american-express', 'American Express', 520, 168),
  omnisend: sponsor('omnisend', 'Omnisend', 520, 70),
  highlevel: sponsor('highlevel', 'HighLevel', 511, 115),
  commas: sponsor('commas', 'Commas', 520, 108),
  creo: sponsor('creo', 'Creo Social', 282, 79),
  arcady: sponsor('arcady', 'Arcady Media', 520, 150),
  mintAve: sponsor('mint-ave', 'Mint Ave', 520, 103),
  scalingWebinars: sponsor('scaling-webinars', 'Scaling With Webinars', 446, 152),
} as const;

// ─── Site settings ───────────────────────────────────────────────────────────

const siteSettings: SiteSettings = {
  brand: {
    name: 'Elite Entrepreneurs',
    shortName: 'Elite',
    tagline: 'Good people. Meaningful conversations. Better business.',
    mark: img('brand/logo-white.png', 'Elite Entrepreneurs', 484, 515),
  },
  navigation: {
    primary: [
      { label: 'Events', href: '#events' },
      { label: 'Partners', href: ROUTES.partners },
      { label: 'About', href: '#about' },
      { label: 'Podcast', href: '#podcast' },
    ],
    cta: { label: 'See what’s coming up', href: '#events' },
  },
  contact: {
    email: CONTACT_EMAIL,
    location: 'Toronto, Ontario, Canada',
  },
  footer: {
    description:
      'Summits, roundtables and private dinners that bring founders, operators and business owners into the same room. Based in Toronto.',
    columns: [
      {
        title: 'Explore',
        links: [
          { label: 'Events', href: '#events' },
          { label: 'About', href: '#about' },
          { label: 'Speakers', href: '#speakers' },
          { label: 'Community', href: '#community' },
          { label: 'Newsletter', href: '#newsletter' },
        ],
      },
      {
        title: 'Follow',
        links: [
          { label: 'Events on Luma', href: LUMA, external: true },
          { label: 'Founder on Instagram', href: FOUNDER_INSTAGRAM, external: true },
          { label: 'Founder on LinkedIn', href: FOUNDER_LINKEDIN, external: true },
        ],
      },
      {
        title: 'Get involved',
        links: [
          { label: 'Apply to speak', href: `mailto:${CONTACT_EMAIL}?subject=Speaking%20at%20Elite%20Entrepreneurs` },
          {
            label: 'Partner with us',
            href: `mailto:${CONTACT_EMAIL}?subject=Partnering%20with%20Elite%20Entrepreneurs`,
          },
          { label: 'General enquiries', href: `mailto:${CONTACT_EMAIL}` },
        ],
      },
    ],
    copyright: `© ${new Date().getFullYear()} Elite Entrepreneurs. All rights reserved.`,
    credit: { label: 'Site by Aixora Web', href: 'https://www.aixoraweb.com/', external: true },
  },
  newsletter: {
    placeholder: 'you@company.com',
    submitLabel: 'Subscribe',
    successMessage: 'You’re on the list. We’ll be in touch.',
    errorMessage: 'Something went wrong. Please try again.',
    invalidEmailMessage: 'Please enter a valid email address.',
  },
};

// ─── Homepage ─────────────────────────────────────────────────────────────────

const homePage: HomePageContent = {
  seo: {
    title: 'Elite Entrepreneurs | Relationships drive business.',
    description: 'We curate the rooms where the right people meet and real relationships get built. Business follows.',
    path: '/',
    ogImage: OG_IMAGE,
  },

  hero: {
    headline: { text: 'Relationships drive', accent: 'business.' },
    lead: 'We curate the rooms where the right people meet and real relationships get built. Business follows.',
    primaryCta: { label: 'See what’s coming up', href: ROUTES.events },
    secondaryCta: { label: 'Partner with us', href: ROUTES.partners },
    image: STOCK.crowd,
    inset: STOCK.toast,
  },

  proof: {
    label: 'Elite Entrepreneurs in numbers',
    stats: [
      { value: '10+', label: 'Events' },
      { value: '1,000+', label: 'Attendees' },
      { value: '300+', label: 'At our last summit' },
    ],
    logosLabel: 'Partners',
    logos: [
      SPONSORS.amex,
      SPONSORS.omnisend,
      SPONSORS.highlevel,
      SPONSORS.commas,
      SPONSORS.creo,
      SPONSORS.arcady,
      SPONSORS.mintAve,
      SPONSORS.scalingWebinars,
    ],
  },

  why: {
    index: '01',
    label: 'Why we exist',
    heading: 'Business got loud.',
    lines: ['Everything is online.', 'Everything is an ad.', 'It’s hard to know who to trust.'],
    emphasis: 'So people work with people they know.',
    body: 'We’re bringing that back. The right people, in the right rooms, doing fun things together.',
    closing: 'Building a business can be lonely. It doesn’t have to be.',
    cta: { label: 'Our story', href: ROUTES.about },
    images: [STOCK.dinnerLaughing, STOCK.conversation],
  },

  audience: {
    index: '02',
    heading: 'Who you’ll meet.',
    forList: {
      title: 'For',
      items: [
        'People serious about growing, who don’t take themselves too seriously.',
        'People who believe in relationships and community.',
        'People who want to meet other great people.',
      ],
    },
    notForList: {
      title: 'Not for',
      items: ['Pretentious people.', 'Anyone only there to pitch.'],
    },
    faces: ['steven', 'tarun', 'dylan', 'aidan', 'jordan', 'umar'].map(face),
  },

  ecosystem: {
    index: '03',
    label: 'The ecosystem',
    heading: 'One idea. A lot of rooms.',
    items: [
      {
        name: 'The Fifteen',
        text: 'One table, fifteen people, one long dinner.',
        href: `${ROUTES.events}#the-fifteen`,
        image: STOCK.dinnerTable,
      },
      {
        name: 'Sidequests',
        text: 'Something different every month. Padel, workshops, the stuff no one else plans.',
        href: `${ROUTES.events}#sidequests`,
        image: STOCK.padel,
      },
      {
        name: '[Mixer name: AI] and [Mixer name: Commerce]',
        text: 'Open nights for people building in AI and e-commerce.',
        href: `${ROUTES.events}#mixers`,
        image: STOCK.mixer,
      },
      {
        name: 'The Summit',
        text: 'Our flagship. 300+ last time.',
        href: `${ROUTES.events}#summit`,
        image: STOCK.summitStage,
      },
      {
        name: 'Keeping It Real',
        text: 'The podcast.',
        status: 'Coming soon',
        image: STOCK.podcast,
      },
      {
        name: 'The Community',
        status: 'Coming soon',
        image: STOCK.greeting,
      },
    ],
  },

  calendar: {
    index: '04',
    heading: 'Coming up.',
    calendarId: LINKS.lumaCalendarId,
    embedUrl: LINKS.lumaEmbed,
    link: { label: 'View on Luma', href: LUMA, external: true },
  },

  gallery: {
    index: '05',
    heading: 'What it feels like.',
    video: { src: `${EE}/video/hero.mp4`, poster: STOCK.speaker, playLabel: 'Play the recap video' },
    photos: [
      STOCK.dinnerEvent,
      EVENT.backdropTalk,
      STOCK.networking,
      STOCK.toast,
      STOCK.dinnerTalk,
      STOCK.mixer,
      EVENT.networking,
      STOCK.dinnerTable,
    ],
  },

  testimonials: {
    index: '06',
    heading: 'What people say.',
    items: [
      { quote: '[Quote coming]', name: 'Eddie Malouf', company: '[Company]' },
      {
        quote: '[Quote coming]',
        name: 'Brandon Carter',
        company: '[Company]',
        photo: img('speakers/brandon-carter.jpg', 'Portrait of Brandon Carter', 1080, 1350, '50% 30%'),
      },
      {
        quote: '[Quote coming]',
        name: 'Max [last name]',
        company: '[Company]',
        photo: img('speakers/max-sturtevant.jpg', 'Portrait of Max', 1080, 1350, '50% 30%'),
      },
      {
        quote: '[Quote coming]',
        name: 'Tarun [last name]',
        company: '[Company]',
        photo: img('speakers/tarun-kamath.jpg', 'Portrait of Tarun', 1080, 1350, '50% 30%'),
      },
      { quote: '[Quote coming]', name: '[Name]', company: '[Company]' },
    ],
  },

  podcast: {
    label: 'Podcast',
    heading: 'Keeping It Real.',
    text: 'Conversations with entrepreneurs. New episodes soon on YouTube.',
    cta: { label: 'Subscribe on YouTube', href: LINKS.youtube, external: true },
    image: STOCK.podcast,
  },

  partnerBand: {
    heading: 'Put your brand in the rooms where business actually happens.',
    cta: { label: 'Partner with us', href: ROUTES.partners },
    image: STOCK.dinnerEvent,
  },

  newsletter: {
    label: 'Newsletter',
    heading: '[Headline TBD]',
    submitLabel: 'Join the list',
  },
};

// ─── Partners ─────────────────────────────────────────────────────────────────
//
// Copy follows the Partners brief word for word. Partner quotes, contacts and results are not
// supplied yet: add `quote`, `person` and `result` to a story in `stories.stories` and it
// renders in full; until then the story shows its "in progress" state.

const partnersPage: PartnersPageContent = {
  seo: {
    title: 'Partner with Elite Entrepreneurs',
    description:
      'Years of showing up built real trust with founders, operators and decision makers. Partners get the rooms, the content, the podcast and the relationships.',
    path: '/partners',
    ogImage: OG_IMAGE,
  },

  bookCallLabel: 'Book a call',

  hero: {
    label: 'Partnerships',
    headline: { text: 'Partner with the network', accent: 'founders trust.' },
    lead: 'Years of showing up built real trust with founders, operators and decision makers. Partners get the rooms, the content, the podcast and the relationships.',
    image: STOCK.conversation,
    inset: img(
      'event/moment-conversation.jpg',
      'Two attendees filmed in conversation in front of the Elite Entrepreneurs backdrop',
      540,
      400,
      '40% 50%',
    ),
    insetCaption: 'Filmed on site at an Elite Entrepreneurs summit',
    facts: homePage.proof.stats,
  },

  audience: {
    index: '01',
    label: 'Who’s in the room',
    heading: 'Who’s in the room.',
    items: ['E-commerce founders', 'Agency owners', 'Marketers', 'Investors', 'Content creators'],
    highlight: 'Founders running 7 to 9 figure businesses.',
    image: OG_IMAGE,
    caption: 'An Elite Entrepreneurs summit, Toronto',
  },

  why: {
    index: '02',
    label: 'Why brands partner with EE',
    heading: 'Business moves faster when people trust each other.',
    lines: ['There’s so much noise out there.', 'Everything feels forced.'],
    body: 'The real way to grow is through relationships. We curate the rooms where those relationships happen, and put your brand inside them.',
    benefits: [
      { title: 'Your online brand shows up in person.' },
      { title: 'We make the content.', text: 'Photos and video from every activation.' },
      { title: 'We play long term.', text: 'We only take on partners where it’s a win for both sides.' },
    ],
    images: [STOCK.dinnerTalk, EVENT.backdropTalk],
  },

  benefits: {
    index: '03',
    label: 'What partners get',
    heading: 'What partners get.',
    items: ['Branding', 'Exclusivity', 'Access to customers', 'Video', 'Photos', 'A seat in the ecosystem'],
  },

  ways: {
    index: '04',
    label: 'Ways to work together',
    heading: 'Ways to work together.',
    options: [
      { title: 'Year-round partner', image: STOCK.greeting },
      { title: 'One-time partner on a single event', image: STOCK.summitStage },
      { title: 'Co-host an event with us', image: STOCK.dinnerTable },
      {
        title: 'Hire us to host your event',
        image: img(
          'event/venue-ballroom-crop.jpg',
          'The ballroom of the Omni King Edward hotel in Toronto, an Elite Entrepreneurs venue',
          1400,
          941,
        ),
      },
    ],
  },

  founder: {
    index: '05',
    label: 'Who’s behind it',
    name: 'Splash',
    fullName: 'Parikchhit “Splash” Basnet',
    role: 'Founder, Elite Entrepreneurs',
    portrait: img(
      'speakers/parikchhit-basnet.jpg',
      'Portrait of Parikchhit “Splash” Basnet, founder of Elite Entrepreneurs',
      1080,
      1350,
      '50% 40%',
    ),
    credentials: [
      { label: 'Founded', text: 'Mint Ave, an email marketing agency.', logo: SPONSORS.mintAve.logo },
      {
        label: 'Built',
        text: 'Growth Writer, an email marketing community with 1,000+ students that produced some of the top agencies in the space.',
      },
      { label: 'Has spoken', text: 'In Dubai, Mexico and at Ecom North.' },
    ],
    links: [
      { label: 'Instagram', href: FOUNDER_INSTAGRAM, external: true },
      { label: 'LinkedIn', href: FOUNDER_LINKEDIN, external: true },
    ],
  },

  stories: {
    index: '06',
    label: 'Partner stories',
    heading: 'Partner stories.',
    emptyState: {
      title: 'Story in progress.',
      text: 'The quote, contact and result will appear here once confirmed with the partner.',
    },
    stories: [
      { partner: 'Omnisend', logo: SPONSORS.omnisend.logo },
      { partner: 'American Express', logo: SPONSORS.amex.logo },
      { partner: 'Commas', logo: SPONSORS.commas.logo },
      { partner: 'GoHighLevel', logo: { ...SPONSORS.highlevel.logo, alt: 'GoHighLevel' } },
      { partner: 'CreoSocial', logo: { ...SPONSORS.creo.logo, alt: 'CreoSocial' } },
    ],
  },

  pastPartners: {
    index: '07',
    label: 'Past partners',
    heading: 'Past partners.',
    partners: [
      SPONSORS.amex,
      SPONSORS.omnisend,
      SPONSORS.highlevel,
      SPONSORS.commas,
      SPONSORS.creo,
      SPONSORS.arcady,
      SPONSORS.mintAve,
      SPONSORS.scalingWebinars,
    ],
  },

  inquiry: {
    index: '08',
    label: 'Partnership inquiry',
    heading: 'Start the conversation.',
    intro: 'Tell us what you want to achieve. A few details help us come to the first call prepared.',
    successMessage: 'Thanks. We’ll be in touch within [X] days.',
    errorMessage: 'Your inquiry could not be sent. Please try again, or email us directly.',
    unavailableMessage: 'The inquiry form is not accepting submissions right now. Please email us directly.',
    submitLabel: 'Send inquiry',
  },
};

export const staticContentProvider: ContentProvider = {
  getSiteSettings: () => Promise.resolve(siteSettings),
  getHomePage: () => Promise.resolve(homePage),
  getPartnersPage: () => Promise.resolve(partnersPage),
};
