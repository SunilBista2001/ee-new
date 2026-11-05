/**
 * Scroll-reveal table: which element (by its Webflow `data-w-id`) animates, how, when.
 * Values come from the published IX2 config. Section components render matching ids from
 * `MOTION_IDS` so the two can never drift.
 */
export type RevealType = 'fadeIn' | 'fadeSlide' | 'highlight' | 'eventsTitle' | 'logoStack' | 'sponsors';

export interface Reveal {
  id: string;
  type: RevealType;
  /** Trigger when the element's top is this % above the viewport bottom. */
  offset: number;
  /** Delay in ms after the trigger. */
  delay: number;
}

/** Every animated element id, grouped by section. Components import these. */
export const MOTION_IDS = {
  hero: {
    heading: '89cb5670-34e8-0c6e-446c-3cf8042ad807',
    lead: 'bc15710d-80b4-a115-6608-2920df532de2',
    images: [
      '695ce6e7-caf8-f750-6ff6-9c2d94243da1',
      'f07441b9-7b41-922f-6d72-bb9d0a411d9d',
      '10f99069-2465-6554-3e5c-040ecb29225f',
      '5b0ea01c-209d-3867-1ddb-7211d66f72f3',
    ],
  },
  trusted: { grid: '21ef2c0d-5db0-00af-aa33-d53cf610cad7' },
  events: {
    section: 'c03be895-ccf2-0912-70ed-27083bde1a79',
    title: 'e86f0303-d10b-5543-9b2a-0cbe41e23f40',
    featured: '541dd206-23bf-a984-673b-84a7b91ca994',
    featuredDescription: '541dd206-23bf-a984-673b-84a7b91ca99e',
    citySection: 'f173d2d7-b62e-4bf6-04e0-5ffa16ca05b9',
    row: 'f173d2d7-b62e-4bf6-04e0-5ffa16ca05d6',
    emptyState: 'b01b4fa8-d019-f8bc-f357-74137982041c',
  },
  learn: {
    section: '9928ca7b-955a-2e3c-edaa-c2b220ce90e4',
    overlay: '9928ca7b-955a-2e3c-edaa-c2b220ce90f5',
    text: '9928ca7b-955a-2e3c-edaa-c2b220ce90fa',
  },
  network: { section: 'd00b4efb-2092-3ead-b0f8-a86feaedc090', text: '4b12c222-8028-4274-5105-e2b52b12ae83' },
  stayAhead: {
    section: 'a520830d-fc92-00a8-add6-55ecb6f8574f',
    overlay: 'f7f38999-15d8-a1fb-5a89-e6c4be7d940b',
    text: 'd3d1d825-197c-c390-2869-7b537fb1388e',
  },
  membership: {
    section: '4f0978ae-6696-e7f7-e7bc-315a1819265d',
    tags: [
      '603abce1-4a7c-059e-d8e5-54ad2ae1bd6b',
      '70089f71-ac41-4178-4531-6391544536c1',
      'c654fdc3-737c-602b-7b00-6c923f8ec9c5',
    ],
  },
  newsletter: { card: 'aa6c8ccb-b4a2-2e73-5e27-53a6c6137579' },
  sponsorship: { section: 'bf418e48-711c-d77e-849f-3945261b7091', grid: '06b22815-caf7-f09c-b229-a0b60d155446' },
} as const;

export const LOGO_STACK_IDS = [
  '21ef2c0d-5db0-00af-aa33-d53cf610cad8',
  '7da3bbf3-8f8b-ea8a-1996-5c45993bac63',
  '94f97c73-c136-463a-f2a1-49a1e9daf043',
  'a3e6dfbc-797e-d371-107f-46b7ded3b2ce',
  '28aa4f18-fd77-c968-096e-38f1bd407fa4',
] as const;

export const SPONSOR_IDS = [
  'e3611ba3-b5ff-81ba-fc40-81bf59eda3bd',
  '9894c9c2-ea55-1f5a-9418-3c9af54a0dfc',
  'd20460ee-5380-6ad2-179d-07898cc2b8b0',
  'd20460ee-5380-6ad2-179d-07898cc2b8b7',
  '30ca1f7f-8f9b-ee63-aeca-9895aa4b3179',
] as const;

const { hero, trusted, events, learn, network, stayAhead, membership, newsletter, sponsorship } = MOTION_IDS;

const reveal = (id: string, type: RevealType, offset = 0, delay = 0): Reveal => ({ id, type, offset, delay });

export const REVEALS: readonly Reveal[] = [
  reveal(hero.heading, 'fadeSlide'),
  reveal(hero.lead, 'fadeIn', 0, 600),
  ...hero.images.map((id) => reveal(id, 'highlight')),
  reveal(trusted.grid, 'logoStack'),
  reveal(events.section, 'fadeIn', 20),
  reveal(events.title, 'eventsTitle'),
  reveal(events.featured, 'fadeSlide'),
  reveal(events.featuredDescription, 'fadeIn', 0, 400),
  reveal(events.citySection, 'fadeIn', 20),
  reveal(events.row, 'fadeIn'),
  reveal(events.emptyState, 'fadeSlide'),
  reveal(learn.section, 'fadeIn', 20),
  reveal(learn.overlay, 'highlight'),
  reveal(learn.text, 'fadeIn', 0, 400),
  reveal(network.section, 'fadeIn', 20),
  reveal(network.text, 'fadeIn', 0, 400),
  reveal(stayAhead.section, 'fadeIn', 20),
  reveal(stayAhead.overlay, 'highlight'),
  reveal(stayAhead.text, 'fadeIn', 0, 400),
  reveal(membership.section, 'fadeIn', 20),
  reveal(membership.tags[0], 'fadeSlide', 10),
  reveal(membership.tags[1], 'fadeSlide'),
  reveal(membership.tags[2], 'fadeSlide', 10),
  reveal(newsletter.card, 'fadeSlide', 20),
  reveal(sponsorship.section, 'fadeIn', 20),
  reveal(sponsorship.grid, 'sponsors', 25),
];

/** Inline pre-animation styles, rendered on the server so there is no flash before hydration. */
export const INITIAL_STYLE = {
  hidden: { opacity: 0 },
  slideUp: { opacity: 0, transform: 'translate3d(0, 25%, 0)' },
  slideUpSmall: { opacity: 0, transform: 'translate3d(0, 20%, 0)' },
  rise: { opacity: 0, transform: 'translate3d(0, 2rem, 0)' },
} as const;
