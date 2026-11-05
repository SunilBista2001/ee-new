/**
 * Static content source: the approved homepage copy, typed against ./types.
 * This is the reference implementation of `ContentProvider`; the Sanity provider will
 * return the same shapes. Copy is kept verbatim from the approved React build.
 */
import type { ContentProvider } from './provider';
import type { EventDetails, HomePageContent, ImageAsset, SiteSettings } from './types';

const IMG = '/assets/images';

const img = (file: string, alt: string, width: number, height: number): ImageAsset => ({
  src: `${IMG}/${file}`,
  alt,
  width,
  height,
});

const TERMS: SiteSettings['footer']['legal'][number] = {
  label: 'Terms',
  href: 'https://docs.google.com/document/d/e/2PACX-1vQd_C_Nt9pwEy5bLQ075wA0QfHpXD922eHMN659rUTw32wK-IckCGhFisWCMI0W2a-Pq8gSd8YxEw4N/pub',
};

// ─── Site settings ───────────────────────────────────────────────────────────

const siteSettings: SiteSettings = {
  brand: {
    name: 'Elite',
    poweredBy: { label: 'aixoraweb', href: 'https://www.aixoraweb.com/', external: true },
  },
  navigation: {
    primary: [
      { label: 'Events', href: '/events' },
      { label: 'Peerscale', href: 'https://www.peerscale.com/', external: true },
      { label: 'Community', href: '/community' },
    ],
    cta: { label: 'Become a Member', href: '/memberships' },
    more: {
      label: 'More',
      newsletterHeading: 'Get the Best Emails',
      podcastsHeading: 'Podcasts',
      podcasts: [
        {
          title: 'Founder Journey',
          description: 'Real Stories of Canadian Startup Success',
          href: 'https://open.spotify.com/show/5ztGmApbvduFqczYRD8IQm',
          image: img('podcast1-1.png', '', 261, 261),
        },
        {
          title: 'Quick Takes',
          description: 'Breaking Down Canadian Tech News and Trends',
          href: 'https://open.spotify.com/show/5GsOadiqu1MhFbMAVUxVJZ',
          image: img('podcast2-1.png', '', 261, 261),
        },
      ],
      contactHeading: 'Interested in becoming a speaker, sponsor, or volunteer?',
      contactCta: { label: 'Contact Us', href: '/contact' },
    },
  },
  footer: {
    newsletterHeading: 'Stay up to date on the latest features and releases by joining our newsletter',
    columns: [
      {
        title: 'Content',
        variant: 'links',
        links: [
          { label: 'Events', href: '/events' },
          { label: 'Baseball', href: '/baseball' },
          { label: 'Community', href: '/community' },
          { label: 'Sponsors', href: '/sponsors' },
          { label: 'Peerscale', href: 'https://www.peerscale.com/', external: true },
          { label: 'Job Board', href: 'https://jobs.techto.org/', external: true },
          { label: 'Contact', href: '/contact' },
        ],
      },
      {
        title: 'Media',
        variant: 'links',
        links: [
          { label: 'Newsletter', href: 'https://blog.techto.org/?_gl=1*1uhtu6h*_gcl_au*MTQ1NDExNjc1OC4xNzI5NjQyNTk1' },
          {
            label: 'Founder Journey Podcast',
            href: 'https://open.spotify.com/show/5ztGmApbvduFqczYRD8IQm',
            external: true,
          },
          {
            label: 'Quick Takes Podcast',
            href: 'https://open.spotify.com/show/5GsOadiqu1MhFbMAVUxVJZ?si=4c67d84525624c88',
            external: true,
          },
          { label: 'Videos', href: 'https://www.youtube.com/c/TechTorontoOrg' },
        ],
      },
      {
        title: 'Follow',
        variant: 'social',
        links: [
          { label: 'X', href: 'https://x.com/techto' },
          { label: 'Facebook', href: 'https://www.facebook.com/techtorontoorg/' },
          { label: 'Youtube', href: 'https://www.youtube.com/user/TechTorontoOrg' },
          { label: 'LinkedIn', href: 'https://www.linkedin.com/company/techtorontoorg/' },
          { label: 'Instagram', href: 'https://www.instagram.com/techtoorg/' },
        ],
      },
    ],
    legal: [
      {
        label: 'Privacy',
        href: 'https://docs.google.com/document/u/1/d/e/2PACX-1vRLxvFbVG32LWOeOWcJvbWMA7DjPSkjurBdqX7Bj9PWy-Gq6FcoRFugNws7x1pc381lrYbWXPbKr6KT/pub',
      },
      TERMS,
      { label: 'Cookies', href: '#' },
    ],
    copyright: '© 2026 Elite. All rights reserved.',
  },
  newsletter: {
    placeholder: 'Enter Your Email _',
    submitLabel: 'Subscribe',
    successMessage: 'Thank You for subscribing!',
    errorMessage: 'Oops! Something went wrong while submitting the form.',
    invalidEmailMessage: 'Please enter a valid email address.',
  },
};

// ─── Homepage ─────────────────────────────────────────────────────────────────

const futureOfEducation: EventDetails = {
  slug: 'future-of-education-nov-10-2026',
  title: 'Future of Education: Impact of AI on Learning',
  city: 'Toronto',
  startsAt: '2026-11-10T18:00:00-05:00',
  endsAt: '2026-11-10T21:00:00-05:00',
  display: {
    year: '2026',
    day: '10',
    month: 'Nov',
    longDate: 'November 10, 2026',
    shortDate: 'Nov 10',
    featuredTime: '6: 00 - 9:00 pm ET',
    start: '6:00 pm',
    end: '9:00 pm',
  },
  venue: 'Convivium Dining Community',
  price: '$30 General Admission | Free for Members',
  soldOut: false,
  image: img('gev_music_tech_-ar_43_-profile_7329xxt_-v_7_c97.png', '', 1232, 928),
  href: '/event/future-of-education-nov-10-2026',
};

const homePage: HomePageContent = {
  seo: {
    title: 'Elite | Canada’s Most Connected Tech Community',
    description:
      'Meet leaders, share ideas, and connect with people who can open new doors. Events, newsletter and membership for Canada’s tech community.',
    path: '/',
  },
  hero: {
    heading: { before: 'Canada’s Most ', accent: 'Connected', after: ' Tech Community' },
    lead: 'Meet leaders, share ideas, and connect with people who can open new doors.',
    cta: { label: 'See Upcoming Events', href: '#events' },
    images: [
      img('arc.png', '', 216, 284),
      img('cells.png', '', 188, 188),
      img('home_pill-man-in-crow.png', 'Man working on a laptop', 376, 193),
      img('home_female-speaker.png', 'Woman speaking at an event', 238, 159),
    ],
  },
  trustedCompanies: {
    heading: 'Trusted by Members who Built',
    logos: [
      { src: `${IMG}/shopify.svg`, alt: 'Shopify' },
      { src: `${IMG}/wealthsimple.svg`, alt: 'Wealthsimple' },
      { src: `${IMG}/voiceflow.svg`, alt: 'Voiceflow' },
      { src: `${IMG}/loblaw-dig.svg`, alt: 'Loblaw Digital' },
      { src: `${IMG}/super.com.svg`, alt: 'super.com' },
    ],
  },
  events: {
    heading: { before: 'Events that', accent: 'Different', after: 'Hit ' },
    headingImage: img('event-mic-1.png', 'Microphone', 363, 197),
    intro:
      "Our events are designed to provide you with actionable insights and meaningful connections. Check out what's coming up next.",
    featured: futureOfEducation,
    cities: ['Toronto', 'Montreal', 'Vancouver'],
    events: [futureOfEducation],
    selectCityLabel: 'Select City',
    emptyState: { before: 'Check Back ', accent: 'Soon' },
    detailsLabel: 'Event Details',
  },
  communityBenefits: {
    learn: {
      heading: { before: 'Learn from ', accent: 'the Best', breakBeforeAccent: true },
      text: 'Engage with leaders who are shaping the future of technology.',
      cta: { label: 'Explore Events', href: '/events' },
      images: {
        main: img('large2-1.png', '', 815, 815),
        overlay: img('home_learn-from-the-best_woman.png', 'Presentation on large screen', 382, 382),
      },
    },
    network: {
      heading: { before: 'Expand Your ', accent: 'Network', breakBeforeAccent: true },
      text: 'Meet like-minded founders, professionals and investors.',
      cta: { label: 'Join the Community', href: '/community' },
    },
    stayAhead: {
      heading: { before: 'Stay ', accent: 'Ahead' },
      text: 'Access the latest trends and opportunities in the Canadian tech scene.',
      cta: { label: 'Discover the Newsletter', href: 'https://blog.techto.org/' },
      images: {
        main: img('placeholder-image-1-1.png', '', 815, 815),
        overlay: img('home_stay-ahead_crowd.png', 'Woman in crowd at event', 483, 483),
      },
    },
  },
  impactStories: {
    tagline: 'Impact Stories',
    marqueeText: 'Real Success →',
    testimonials: [
      {
        company: 'Voiceflow',
        quote:
          "If you're building a product—start with a community. People will want you to win and overlook early issues because they feel part of something.",
        author: 'Braden Ream',
        role: 'CEO, Voiceflow',
        photo: img('img_braden-1.png', 'Braden Ream', 575, 816),
        logo: { src: `${IMG}/logo-voiceflow-1.png`, alt: 'Voiceflow' },
      },
      {
        company: 'Wealthsimple',
        quote:
          "You are nothing but the people you surround yourself with—that's what turns a cool idea into something that can change the world.",
        author: 'Mike Katchen',
        role: 'CEO, Wealthsimple',
        photo: img('img_mike-1.png', 'Mike Katchen', 575, 816),
        logo: { src: `${IMG}/logo-wealthsimple-1.png`, alt: 'Wealthsimple' },
      },
      {
        company: 'Shopify',
        quote:
          'You don’t need your product to scale for millions—just solve what the first 10 or 100 people need to be successful.',
        author: 'Satish Kanwar',
        role: 'Former VP Product, Shopify',
        photo: img('img_satish-1.png', 'Satish Kanwar', 575, 816),
        logo: { src: `${IMG}/logo-shopify-1.png`, alt: 'Shopify' },
      },
    ],
  },
  membershipBenefits: {
    heading: 'Other Ways Members Benefit',
    cta: { label: 'Become a Member', href: '/memberships' },
    benefits: [
      {
        icon: 'maple-leaf',
        animation: `${IMG}/scene.gif`,
        tag: 'New to Canadian Tech',
        title: 'Break Into the Scene',
        text: 'Join the community, get insider insights, and uncover opportunities to kickstart your career in Canadian tech.',
      },
      {
        icon: 'handshake',
        animation: `${IMG}/build.gif`,
        tag: 'Looking to Raise',
        title: 'Build Investor Relationships',
        text: 'Connect with investors and mentors to refine your pitch and secure the funding you need.',
      },
      {
        icon: 'rocket',
        animation: `${IMG}/accelerate.gif`,
        tag: 'Seed to Series A+',
        title: 'Accelerate Growth',
        text: 'Gain mentorship, tools, and guidance to scale your team and grow your product as you secure your next round.',
      },
    ],
  },
  newsletter: {
    image: img('cta-img-1.png', 'Envelope', 743, 632),
    headlineImage: img('headline-outline-2-2.png', 'Subscribe', 912, 177),
    heading: 'Join 70,000+',
    text: 'Get the latest trends, startup profiles and expert advice from Elite. Stay informed and connected—straight to your inbox, at no cost.',
    consent: {
      before: "By clicking Sign Up you're confirming that you agree with our ",
      link: { ...TERMS, label: 'Terms and Conditions', external: true },
      after: '.',
    },
  },
  sponsorship: {
    tagline: 'Showcase Your Brand',
    heading: 'Exclusive Sponsorships',
    perks: [
      { title: 'Boost Your Brand', text: 'Be seen alongside top tech companies.' },
      { title: 'Grow Faster', text: 'Build relationships that can help your business succeed.' },
      { title: 'Find New Customers', text: 'Meet tech professionalsready to work with you.' },
      {
        title: 'Peerscale Roundtables',
        text: 'Connect with high-growth CEOs, CTOs & COOs with $2M+ in revenue or funding.',
      },
      { title: 'Hire the Best', text: 'Direct access to talented tech professionals.' },
    ],
    thankYou: { before: 'Thank ', accent: 'You' },
    sponsorRows: [
      {
        direction: 'left',
        logos: [
          { src: `${IMG}/logo_aws.png`, alt: 'AWS' },
          { src: `${IMG}/logo-shopify.png`, alt: 'Shopify' },
          { src: `${IMG}/logo-23.png`, alt: 'Ritual' },
        ],
      },
      {
        direction: 'right',
        logos: [
          { src: `${IMG}/logo-28.png`, alt: 'Opencare' },
          { src: `${IMG}/logo-21.png`, alt: 'Wealthsimple' },
          { src: `${IMG}/logo-26.png`, alt: 'Voiceflow' },
          { src: `${IMG}/logo-22.png`, alt: 'Koho' },
        ],
      },
      {
        direction: 'left',
        logos: [
          { src: `${IMG}/logo-24.png`, alt: 'Clio' },
          { src: `${IMG}/logo_rbc.png`, alt: 'RBC' },
          { src: `${IMG}/logo-16.png`, alt: 'Citi' },
          { src: `${IMG}/logo_intuit.png`, alt: 'Intuit' },
        ],
      },
    ],
    cta: { label: 'Become a Sponsor', href: '/sponsors' },
  },
};

export const staticContentProvider: ContentProvider = {
  getSiteSettings: () => Promise.resolve(siteSettings),
  getHomePage: () => Promise.resolve(homePage),
};
