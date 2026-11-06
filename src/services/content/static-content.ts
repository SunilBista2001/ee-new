/**
 * Static content source for the Elite Entrepreneurs homepage, typed against ./types.
 *
 * Sources: eliteentrepreneurs.ca (speakers, testimonials, partners, event format, 2026 summit
 * details and attendee mix) and the Elite Entrepreneurs Luma page (September 2025 Toronto
 * summit). Nothing here is invented. As of November 2026 no next event has been published, so
 * the events section shows an announcement state with no date, city or price.
 *
 * REPLACEMENT POINTS (see README › Content & assets):
 *  - `events.announcement`: when the next event is public, add it as a card in `events.past`'s
 *    place (or a new `upcoming` list) with its real date, venue and ticket link.
 *  - Event photography: the original site only publishes a few photos of the room. The crops in
 *    /assets/ee/event come from interview stills (540px wide). Swap them for full-resolution
 *    photography from the photographer when available; keep file names or update paths here.
 */
import type { ContentProvider } from './provider';
import type { HomePageContent, ImageAsset, SiteSettings } from './types';

const EE = '/assets/ee';

const img = (file: string, alt: string, width: number, height: number, focus?: string): ImageAsset => ({
  src: `${EE}/${file}`,
  alt,
  width,
  height,
  ...(focus ? { focus } : {}),
});

const portrait = (slug: string, name: string): ImageAsset =>
  img(`speakers/${slug}.jpg`, `Portrait of ${name}`, 1080, 1350, '50% 62%');

const attendee = (slug: string, name: string): ImageAsset =>
  img(`attendees/${slug}.jpg`, `Portrait of ${name}`, 400, 400);

const CONTACT_EMAIL = 'pb@mintaveinc.com';
const LUMA = 'https://luma.com/eliteentrepreneur';

// Photography shared by several sections.
const PHOTO = {
  crowd: img(
    'event/summit-room.jpg',
    'Attendees seated at round tables in a Toronto ballroom, watching the stage at an Elite Entrepreneurs summit',
    1200,
    450,
    '50% 55%',
  ),
  ballroom: img(
    'event/venue-ballroom-crop.jpg',
    'A white and gold ballroom with starburst chandeliers at the Omni King Edward Hotel',
    1400,
    941,
  ),
  backdropTalk: img(
    'event/moment-backdrop-talk.jpg',
    'Two attendees in conversation in front of the Elite Entrepreneurs backdrop',
    540,
    395,
    '50% 45%',
  ),
  conversation: img(
    'event/moment-conversation.jpg',
    'An attendee interviewed in front of the Elite Entrepreneurs backdrop',
    540,
    400,
    '50% 70%',
  ),
  hallway: img('event/moment-hallway.jpg', 'An attendee sharing his experience at the summit', 540, 480, '50% 55%'),
  networking: img(
    'event/moment-networking.jpg',
    'Attendees talking during a networking break at an Elite Entrepreneurs summit',
    540,
    420,
    '55% 70%',
  ),
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
      { label: 'Community', href: '#community' },
      { label: 'Speakers', href: '#speakers' },
      { label: 'About', href: '#about' },
      { label: 'Contact', href: '#contact' },
    ],
    cta: { label: 'Explore Events', href: '#events' },
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
          { label: 'Founder on Instagram', href: 'https://www.instagram.com/lifeofsplash/', external: true },
          { label: 'Founder on LinkedIn', href: 'https://www.linkedin.com/in/parikchhit-basnet/', external: true },
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
    title: 'Elite Entrepreneurs | Where Entrepreneurs Come Together to Grow',
    description:
      'Summits, founder networking, roundtables and private dinners in Toronto. Elite Entrepreneurs brings founders, operators and business owners into the same room.',
    path: '/',
    ogImage: PHOTO.crowd,
  },

  hero: {
    meta: '43.65° N, 79.38° W · Toronto',
    headlineStart: 'Where entrepreneurs',
    headlineEnd: { text: 'come together', accent: 'to grow.' },
    inlineImage: PHOTO.crowd,
    lead: 'Connect with ambitious founders, exchange ideas, learn from experienced operators, and build relationships that move your business forward.',
    primaryCta: { label: 'Explore Upcoming Events', href: '#events' },
    secondaryCta: { label: 'Discover the Community', href: '#community' },
    floaters: [
      portrait('parikchhit-basnet', 'Parikchhit Basnet, founder of Elite Entrepreneurs'),
      PHOTO.networking,
      PHOTO.backdropTalk,
      portrait('max-sturtevant', 'Max Sturtevant, speaker'),
    ],
    status: { label: 'Next edition', value: 'Announcing soon' },
  },

  partners: {
    label: 'Partners of the 2026 summit',
    partners: [
      { name: 'American Express', logo: img('sponsors/american-express.png', 'American Express', 520, 168) },
      { name: 'Omnisend', logo: img('sponsors/omnisend.png', 'Omnisend', 520, 70) },
      { name: 'HighLevel', logo: img('sponsors/highlevel.png', 'HighLevel', 511, 115) },
      { name: 'Commas', logo: img('sponsors/commas.png', 'Commas', 520, 108) },
      { name: 'Creo Social', logo: img('sponsors/creo.png', 'Creo Social', 282, 79) },
      { name: 'Arcady Media', logo: img('sponsors/arcady.png', 'Arcady Media', 520, 150) },
      { name: 'Mint Ave', logo: img('sponsors/mint-ave.png', 'Mint Ave', 520, 103) },
      { name: 'Scaling With Webinars', logo: img('sponsors/scaling-webinars.png', 'Scaling With Webinars', 446, 152) },
    ],
  },

  intro: {
    index: '01',
    label: 'About Elite',
    heading: 'Business grows better together.',
    statement:
      'Elite Entrepreneurs brings founders and business owners into the same room to share experience, learn from people doing the work, and build relationships beyond the event.',
    detail:
      'You don’t need to be the biggest business in the room. You do need to be building one: agency owners, e-commerce operators, consultants, creators and founders, side by side.',
    cta: { label: 'See what happens at Elite', href: '#experience' },
    images: [PHOTO.ballroom, PHOTO.conversation],
    facts: [
      { label: 'Attendees who are founders', value: '79%' },
      { label: 'Attendees who are decision-makers', value: '88%' },
      { label: 'Edition', value: '4th year running' },
      { label: 'First three summits', value: 'Sold out' },
      { label: 'Home', value: 'Toronto, Canada' },
    ],
    factsNote: 'Attendee figures from the 2026 summit.',
  },

  events: {
    index: '02',
    label: 'Events',
    headingStart: 'Find your',
    headingEnd: 'next room.',
    headingImage: PHOTO.backdropTalk,
    intro:
      'From founder gatherings to full-scale summits, find experiences designed to bring ambitious people together.',
    announcement: {
      label: 'Next edition',
      title: 'The next room is being curated.',
      text: 'Date, city and lineup will be announced soon. Join the list to hear first. The first three summits sold out.',
      primaryCta: { label: 'Get notified', href: '#newsletter' },
      secondaryCta: { label: 'Contact the team', href: `mailto:${CONTACT_EMAIL}` },
    },
    pastHeading: 'Recent events',
    past: [
      {
        status: 'Past event',
        category: 'Summit · 3 days',
        title: 'Elite Entrepreneurs Summit 2026',
        badge: { year: '2026', day: '26–28', month: 'Aug' },
        date: 'August 26–28, 2026',
        location: 'Omni King Edward Hotel, Toronto',
        description:
          'A welcome mixer, a full summit day of talks, a founders panel and roundtables, then a VIP day that ended on the water.',
        cta: { label: 'Event details', href: 'https://www.eliteentrepreneurs.ca/', external: true },
      },
      {
        status: 'Past event',
        category: 'Summit',
        title: 'Elite Entrepreneurs Toronto Summit',
        badge: { year: '2025', day: '19', month: 'Sep' },
        date: 'September 19, 2025',
        location: 'Toronto',
        description:
          'A summit for brand owners and founders, with a pre-event mixer and VIP mastermind sessions on Lake Ontario.',
        cta: { label: 'Event details', href: LUMA, external: true },
      },
    ],
    allEventsCta: { label: 'View all events', href: LUMA, external: true },
  },

  experience: {
    index: '03',
    label: 'What happens at Elite',
    heading: 'A day built around people, not slides.',
    intro: 'Every format is designed so the people in the room actually talk to each other.',
    pillars: [
      {
        title: 'Learn',
        text: 'Practical insights from entrepreneurs who run the businesses they talk about.',
        meta: '9 talks in 2026',
        image: PHOTO.crowd,
      },
      {
        title: 'Connect',
        text: 'Meet founders and operators who understand the challenges of building a business.',
        meta: '6 unscheduled hours',
        image: PHOTO.networking,
      },
      {
        title: 'Share',
        text: 'Roundtables on acquisition, hiring, retention, content and operations.',
        meta: '2 hours of roundtables',
        image: PHOTO.backdropTalk,
      },
      {
        title: 'Grow',
        text: 'Relationships, partners and opportunities that last beyond the event.',
        meta: 'VIP day with the speakers',
        image: PHOTO.ballroom,
      },
    ],
  },

  speakers: {
    index: '04',
    label: 'Speakers & founders',
    heading: 'Learn from people who build.',
    intro: 'Every speaker on an Elite stage runs the business they came to talk about.',
    speakers: [
      {
        name: 'Parikchhit Basnet',
        company: 'Elite Entrepreneurs',
        credential: 'Founder of Elite Entrepreneurs.',
        photo: portrait('parikchhit-basnet', 'Parikchhit Basnet'),
        href: 'https://www.linkedin.com/in/parikchhit-basnet/',
      },
      {
        name: 'Brandon Carter',
        company: 'HTT',
        credential: 'Grew to millions of followers, generated 8 figures in revenue.',
        photo: portrait('brandon-carter', 'Brandon Carter'),
        href: 'https://www.linkedin.com/in/kingketo/',
      },
      {
        name: 'Max Sturtevant',
        company: 'WellCopy',
        credential: 'Scaled to 90+ team members and 150+ clients.',
        photo: portrait('max-sturtevant', 'Max Sturtevant'),
        href: 'https://www.linkedin.com/in/maxsturtevant/',
      },
      {
        name: 'Tarun Kamath',
        company: 'Arcady Media',
        credential: '#1 email agency in Canada.',
        photo: portrait('tarun-kamath', 'Tarun Kamath'),
        href: 'https://www.linkedin.com/in/tarun-kamath-367600200/',
      },
      {
        name: 'Rohan Sheth',
        company: 'GrowRev',
        credential: '$300M+ in ad spend across 50+ industries.',
        photo: portrait('rohan-sheth', 'Rohan Sheth'),
        href: 'https://www.linkedin.com/in/therohansheth/',
      },
      {
        name: 'Manik Kundra',
        company: 'Icy',
        credential: 'Dorm room to a 4,000 sq ft Toronto warehouse in three years.',
        photo: portrait('manik-kundra', 'Manik Kundra'),
        href: 'https://www.linkedin.com/in/icymanik/',
      },
      {
        name: 'Steven Baterina',
        company: 'Creo Social',
        credential: '$4M+ generated for clients from YouTube.',
        photo: portrait('steven-baterina', 'Steven Baterina'),
        href: 'https://www.linkedin.com/in/steven-baterina',
      },
      {
        name: 'Omar Sandhu',
        company: 'Creo Social',
        credential: 'Co-founder helping brands use YouTube as a growth channel.',
        photo: portrait('omar-sandhu', 'Omar Sandhu'),
        href: 'https://www.linkedin.com/in/omarsandhu/',
      },
      {
        name: 'Benny Billz',
        company: 'Glitchy',
        credential: '160,000 affiliates trained, $100M+ paid out.',
        photo: portrait('benny-billz', 'Benny Billz'),
        href: 'https://www.instagram.com/bennybillz/',
      },
      {
        name: 'Rene Lacad',
        company: 'Lacad Consulting',
        credential: 'Social strategy for operators, not influencers.',
        photo: portrait('rene-lacad', 'Rene Lacad'),
        href: 'https://www.instagram.com/renelacad/',
      },
      {
        name: 'Mark Baratto',
        company: 'HighLevel',
        credential: 'Senior Growth Marketer; previously co-founded and exited a broker-dealer.',
        photo: { ...portrait('mark-baratto', 'Mark Baratto'), width: 1200, height: 1500 },
        href: 'https://www.linkedin.com/in/mark-baratto/',
      },
    ],
    invite: {
      title: 'Your seat on stage',
      text: 'Running something worth learning from? Tell us about it.',
      cta: { label: 'Apply to speak', href: `mailto:${CONTACT_EMAIL}?subject=Speaking%20at%20Elite%20Entrepreneurs` },
    },
  },

  stories: {
    index: '05',
    label: 'Community stories',
    heading: 'Every connection has a story.',
    intro: 'In their own words: founders who have been in the room as attendees, speakers and sponsors.',
    marquee: ['Good people', 'Meaningful conversations', 'Better business'],
    testimonials: [
      {
        quote:
          'One of my favourite events I’ve attended. I closed one client, got five strong leads, and I was only there for half the day. On top of that, I met some incredible entrepreneurs.',
        name: 'Steven',
        role: 'Founder, Creo Social',
        photo: attendee('steven', 'Steven'),
      },
      {
        quote:
          'This room is always filled with great entrepreneurs. It’s one of the few events where the audience is actually present and engaged. I’ve met partners and hired people I connected with in the room.',
        name: 'Tarun',
        role: 'Founder, Arcady Media',
        photo: attendee('tarun', 'Tarun'),
      },
      {
        quote:
          'I’ve been a speaker, sponsor, and attendee — and at every level, it’s been valuable for me and my company. I’m always impressed by Splash and the room he brings together.',
        name: 'Dylan Blyuss',
        role: 'Founder, Publish Experts',
        photo: attendee('dylan', 'Dylan Blyuss'),
      },
      {
        quote:
          'The quality of speakers is genuinely shocking in the best way. I’ve attended every event and each time I’m blown away by how generously everyone shares. You always leave with something valuable.',
        name: 'Aidan',
        role: 'Founder, Tactly Media',
        photo: attendee('aidan', 'Aidan'),
      },
      {
        quote:
          'I’ve been part of a lot of masterminds and events, but for the price, Splash brings unmatched value. You get direct access to top industry leaders, and the room they curate is always on point.',
        name: 'Jordan Bazouzi',
        role: 'Founder, Nu Reach Media',
        photo: attendee('jordan', 'Jordan Bazouzi'),
      },
      {
        quote:
          'I’ve been to every Elite Entrepreneurs event so far, and each one has delivered — both in topics and the quality of people in the room.',
        name: 'Umar',
        role: 'Founder, Nest Marketing',
        photo: attendee('umar', 'Umar'),
      },
    ],
  },

  gallery: {
    index: '06',
    label: 'The Elite experience',
    heading: 'Inside the room.',
    intro: 'Stage sessions in the morning. Roundtables after lunch. Conversations that run long after.',
    feature: { image: PHOTO.crowd, caption: 'Summit day, Toronto' },
    moments: [
      { image: PHOTO.networking, caption: 'Founder networking' },
      { image: PHOTO.backdropTalk, caption: 'Business conversations' },
      { image: PHOTO.hallway, caption: 'Between sessions' },
      { image: PHOTO.ballroom, caption: 'Omni King Edward Hotel' },
      { image: PHOTO.conversation, caption: 'Attendee interviews' },
    ],
    formats: [
      'Founder conversations',
      'Networking mixers',
      'Stage sessions',
      'Roundtables',
      'Private dinners',
      'VIP days',
    ],
  },

  communityCta: {
    label: 'Join the community',
    headingStart: 'Your next',
    headingEnd: { text: 'connection', accent: 'starts here.' },
    text: 'Join a community of entrepreneurs who value meaningful conversations, shared experience, and opportunities to grow.',
    cta: { label: 'Explore Elite', href: '#events' },
    faces: [
      attendee('steven', 'Steven'),
      attendee('tarun', 'Tarun'),
      attendee('dylan', 'Dylan Blyuss'),
      attendee('aidan', 'Aidan'),
      attendee('jordan', 'Jordan Bazouzi'),
    ],
    facesCaption: 'Founders who keep coming back',
  },

  newsletter: {
    label: 'Newsletter',
    heading: 'Stay connected.',
    text: 'Get updates on upcoming events, founder stories, and opportunities to connect.',
    note: 'Occasional emails. Unsubscribe any time.',
  },
};

export const staticContentProvider: ContentProvider = {
  getSiteSettings: () => Promise.resolve(siteSettings),
  getHomePage: () => Promise.resolve(homePage),
};
