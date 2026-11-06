# Elite Entrepreneurs — homepage (Next.js)

The Elite Entrepreneurs homepage: a cinematic, editorial event site on **Next.js 16 (App Router)**,
React 19 Server Components, strict TypeScript, GSAP (ScrollTrigger + SplitText) and Lenis.

> **Launch checklist — read before deploying publicly.**
>
> - Indexing is off (`noindex`, disallow-all `robots.txt`) until `SITE_INDEXABLE=true` is set.
> - **Event photography** — the original site publishes only a few photos of the room. The crops in
>   `public/assets/ee/event/moment-*.jpg` come from 540px-wide interview stills; replace them with
>   full-resolution photography (see _Content & assets_).
> - **Next event** — the upcoming slot shows an honest “announcement soon” state. Fill it in when the
>   date, city and lineup are public.
> - **Newsletter** — the form validates but is not connected to an email provider yet.

## Commands

```bash
npm install
npm run dev                  # http://localhost:3000
npm run build && npm start   # production build
npm run typecheck            # tsc --noEmit (strict)
npm run lint                 # ESLint (next/core-web-vitals + typescript)
npm run format               # Prettier (+ Tailwind class sorting)
npm run test:e2e             # Playwright at 14 viewports: navigation, interactions, SEO, axe, overflow
npm run verify               # everything above, in order
```

Environment (see `src/config/site.ts`, validated with Zod at startup):

| Variable               | Default                 | Purpose                                       |
| ---------------------- | ----------------------- | --------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | Canonical URLs, sitemap, Open Graph           |
| `SITE_INDEXABLE`       | `false`                 | `true` allows indexing (robots + meta robots) |

## Architecture

```
src/
  app/                      routing only: layout, page, robots, sitemap, not-found, fonts, globals.css
  config/site.ts            validated environment + site constants
  services/content/         content layer (Sanity-ready): types, provider interface, static content
  components/ee/            design-system primitives (Display, Eyebrow, ArrowLink, MediaFrame, Grain),
                            SiteNav (client), SiteFooter
  features/home/sections/   one Server Component per homepage section
  features/home/components/ IntroLoader, TestimonialCarousel (client)
  features/newsletter/      NewsletterForm (client, React Hook Form + Zod)
  lib/motion/               gsap.ts (plugin registration), SmoothScroll (Lenis), PageMotion, Cursor
  styles/ee/                tokens, reset, primitives, chrome (nav/footer/loader), sections, motion
```

### Homepage sections

01 Navigation · 02 Cinematic hero · 03 Brand statement (`#about`) · 04 The experience · 05 Events
(upcoming + archive + gallery + partners) · 06 Speakers · 07 Community (sticky storytelling) ·
08 Testimonials · 09 Final CTA · 10 Footer (`#contact`, `#newsletter`). All navigation targets
are in-page anchors, so no link points at a route that does not exist.

### Design system

- **Colour** (`styles/ee/tokens.css`): near-black stage (`--ee-ink`), warm bone paper for contrast
  sections (`.theme-light`), and one accent — signal amber `--ee-signal`, taken from the brand's
  own hero footage. Use it sparingly.
- **Type**: Archivo (variable width axis — condensed 800/900 for display, normal width for body),
  Instrument Serif italic for single accent words, JetBrains Mono for labels and metadata. All via
  `next/font/google`, self-hosted at build time.
- Tailwind v4 is available with the `tw:` prefix and maps to the same tokens (`tw:bg-ink`,
  `tw:text-signal`, `tw:font-mono`).

### Motion

All motion is attached by `PageMotion` through `data-*` hooks (documented at the top of
`lib/motion/page-motion.tsx`) and created inside `gsap.context` / `gsap.matchMedia`, so every
tween and ScrollTrigger is reverted on unmount.

- Pre-animation states live in CSS under `html.has-motion`, a class set before first paint only
  when JS runs and motion is allowed. Without JS or with `prefers-reduced-motion` everything is
  simply visible; a 4s failsafe (`motion-fallback`) shows everything if motion never starts.
- Lenis eases wheel scrolling only (native on touch). Nothing is pinned and no scroll is hijacked;
  the community section uses CSS `position: sticky`.
- The intro loader plays once per session. Background videos pause off-screen and never play
  with reduced motion. The custom cursor and magnetic buttons only exist for fine pointers.

## Content & assets

Content lives in `src/services/content/static-content.ts`, typed by `types.ts`. Sources: the
original site (eliteentrepreneurs.ca — speakers, testimonials, partners, event format and the
August 2026 summit) and public listings for the September 2025 Toronto summit. Nothing is
invented; unknown facts render as “To be announced”.

| Asset                                | Source / note                                                    |
| ------------------------------------ | ---------------------------------------------------------------- |
| `public/assets/ee/video/hero.mp4`    | Original site hero footage (+ poster)                            |
| `public/assets/ee/speakers/*`        | Original site speaker portraits (1080×1350)                      |
| `public/assets/ee/attendees/*`       | Original site testimonial portraits                              |
| `public/assets/ee/sponsors/*`        | 2026 summit partner logos (white)                                |
| `public/assets/ee/event/summit-room` | Crop of the original OG photo (title band removed) — **replace** |
| `public/assets/ee/event/moment-*`    | Crops of interview stills (captions removed) — **replace**       |
| `public/assets/ee/event/venue-*`     | Omni King Edward ballroom (original site)                        |
| `public/assets/ee/event/the-seat`    | Original site “reserve your seat” image                          |

**To announce the next event:** in `static-content.ts`, set `events.upcoming.state` to
`'announced'`, fill `details` (date, venue, city) and point `primaryCta` at the ticket page.
