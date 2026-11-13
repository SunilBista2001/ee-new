# Elite Entrepreneurs — homepage (Next.js)

The Elite Entrepreneurs homepage: a cinematic, editorial event site on **Next.js 16 (App Router)**,
React 19 Server Components, strict TypeScript, GSAP (ScrollTrigger + SplitText) and Lenis.

> **Launch checklist — read before deploying publicly.**
>
> - Indexing is off (`noindex`, disallow-all `robots.txt`) until `SITE_INDEXABLE=true` is set.
> - **Event photography** — the original site publishes only a few photos of the room. The crops in
>   `public/assets/ee/event/moment-*.jpg` come from 540px-wide interview stills; replace them with
>   full-resolution photography (see _Content & assets_).
> - **Upcoming guests** — the five portraits come from the speaker roster, not a confirmed lineup.
>   Replace them in `guests.guests` (`static-content.ts`) when the next edition's guests are public.
> - **Newsletter** — the form validates but is not connected to an email provider yet.
> - **Partners inquiry** — refuses submissions (HTTP 503, with an email fallback on the page) until
>   `PARTNER_CRM_WEBHOOK_URL` and/or `SLACK_PARTNER_WEBHOOK_URL` are set. Set
>   `NEXT_PUBLIC_PARTNER_BOOKING_URL` so "Book a call" opens the scheduler instead of the form, and
>   replace `[X]` in `partnersPage.inquiry.successMessage` with the confirmed response time.
> - **Podcast launch list** — `/podcast` refuses sign-ups (HTTP 503, "sign-ups are not open just
>   yet") until `PODCAST_NOTIFY_WEBHOOK_URL` is set. Show details (description, hosts, launch date,
>   artwork, Spotify / Apple / YouTube links) and episodes are empty in `PODCAST_SHOW` /
>   `PODCAST_EPISODES` (`static-content.ts`) and stay off the page until filled in.

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

| Variable                          | Default                 | Purpose                                                                                                                |
| --------------------------------- | ----------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`            | `http://localhost:3000` | Canonical URLs, sitemap, Open Graph                                                                                    |
| `SITE_INDEXABLE`                  | `false`                 | `true` allows indexing (robots + meta robots)                                                                          |
| `NEXT_PUBLIC_PARTNER_BOOKING_URL` | unset                   | Scheduler behind every "Book a call" on `/partners` (build time). Unset: buttons go to the inquiry form                |
| `PARTNER_CRM_WEBHOOK_URL`         | unset                   | Server only. Receives each partnership inquiry as flat JSON (HubSpot/GoHighLevel workflow webhook, Zapier, Make, n8n…) |
| `PARTNER_CRM_WEBHOOK_TOKEN`       | unset                   | Server only, optional. Sent as `Authorization: Bearer <token>` to the CRM webhook                                      |
| `SLACK_PARTNER_WEBHOOK_URL`       | unset                   | Server only. Slack incoming webhook notified of each inquiry                                                           |
| `PODCAST_NOTIFY_WEBHOOK_URL`      | unset                   | Server only. Receives each podcast launch-list sign-up as flat JSON (email tool automation, CRM webhook, Zapier…)      |
| `PODCAST_NOTIFY_WEBHOOK_TOKEN`    | unset                   | Server only, optional. Sent as `Authorization: Bearer <token>` to the podcast webhook                                  |

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
  styles/ee/                tokens, reset, primitives, chrome (nav/footer), home (homepage sections), motion
```

### Homepage sections

Structure and copy follow the content brief (“EE Website: Page-by-Page Brief”, Home), in its
order: 1 Hero · 2 Proof strip + logo strip · 3 Why we exist (`#about`) · 4 Who you’ll meet
(`#community`) · 5 The ecosystem (`#ecosystem`) · 6 Coming up, Luma embed (`#events`) · 7 What it
feels like (`#gallery`) · 8 What people say (`#speakers`) · 9 Podcast (`#podcast`) · 10 Partner
band · 11 Newsletter (`#newsletter`). Nav and footer are unchanged.

Text in `[brackets]` renders as a marked placeholder (`SlotText`). Buttons point at the
brief’s pages (`/events`, `/partners`, `/about`); a link with an empty `href` (YouTube) renders
disabled. Interactive pieces are small client components in `features/home/components`
(`EcosystemIndex`, `TestimonialStage`, `RecapVideo`); everything else is server-rendered.

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

## Partners page (`/partners`)

`src/app/partners/page.tsx` renders the nine sections of the Partners brief in order, one Server
Component each in `src/features/partners/sections`: Hero · Who's in the room · Why brands partner
· What partners get · Ways to work together · Who's behind it · Partner stories · Past partners ·
Partnership inquiry. Copy lives in `partnersPage` (`static-content.ts`); the nav and footer are the
shared ones, with homepage anchors rewritten to `/#…` (`lib/site-links.ts`). Styles:
`styles/ee/partners.css`. Motion uses the same `PageMotion` hooks as the homepage.

- **Partner stories** — each story takes `quote`, `person` (`name`, `role`) and `result`
  (`value`, `label`). Until a quote is supplied the card shows an explicit "Story in progress"
  state; nothing is presented as a testimonial before it is one.
- **Inquiry pipeline** — `InquiryForm` (client, React Hook Form + the shared Zod schema in
  `features/partners/schema.ts`) posts to `POST /api/partner-inquiry`, which validates again,
  checks the origin, a honeypot and a per-instance rate limit, then calls
  `services/partners/inquiry.ts`:
  - CRM configured → the CRM must accept it; Slack is then notified. If the CRM fails but Slack
    accepts, the visitor still gets the confirmation and the Slack message is flagged
    "CRM sync failed, add manually".
  - Only Slack configured → Slack must accept it. Nothing configured → 503, never a fake success.
  - Every form session sends one `submissionId` (also in the CRM payload for de-duplication);
    repeats with the same id are delivered once. The button is disabled while sending.
- **Photography** — the hero main image and the "ways" thumbnails are the Unsplash stand-ins
  (`stock/`); the room, the on-camera still, the venue and Splash's portrait are Elite's own.
- **Logos** — the supplied logos are white-only, so they are tinted to ink with CSS. Drop in
  full-colour files to show brand colours (and remove the `filter` in `.pt-wall__logo`).

## Podcast page (`/podcast`)

Pre-launch announcement: Hero ("Coming Soooon" / "Stay tuned.") · Behind the scenes · (Episodes) ·
Stay tuned sign-up. Sections live in `src/features/podcast/sections`, copy and show data in
`podcastPage` (`static-content.ts`), styles in `styles/ee/podcast.css`.

- **Show data** — `PODCAST_SHOW` holds the title (from the homepage: "Keeping It Real"),
  description, hosts, launch date, artwork and platform URLs. Empty fields render nothing: no
  placeholder hosts, no countdown, no empty "Listen on" row.
- **Episodes** — add entries to `PODCAST_EPISODES` (newest first, `PodcastEpisode` in
  `services/content/types.ts`) and the Episodes section appears with a featured episode
  (`episodesSection.featured` slug, else the newest) and the archive.
- **Launch list** — `NotifyForm` posts to `POST /api/podcast-notify` (origin check, honeypot,
  rate limit, one `submissionId` per form session), which forwards `{ submissionId, source,
email, submittedAt, pageUrl }` to `PODCAST_NOTIFY_WEBHOOK_URL`. Success is shown only after
  the webhook accepts it; unset → 503 and an honest "not open yet" message.
- **Motion** — `PodcastMotion` (letter reveal and O echo, "Stay tuned" tuning in, frame reveals,
  pointer depth, scroll-tuned dial) on top of `PageMotion`. `Waveform` is a canvas that only runs
  on screen and draws one still frame with reduced motion. Nothing implies audio is playing.
- **Follow along** — only the profiles already verified in the footer (Luma, founder Instagram,
  founder LinkedIn).
- **Photography** — `stock/podcast-mic`, `podcast-studio`, `podcast-condenser`,
  `podcast-headphones` are Unsplash stand-ins with no people in frame.

## Content & assets

Content lives in `src/services/content/static-content.ts`, typed by `types.ts`. Sources: the
original site (eliteentrepreneurs.ca — speakers, testimonials, partners, event format and the
August 2026 summit) and public listings for the September 2025 Toronto summit. Nothing is
invented; unknown facts render as “To be announced”.

| Asset                                | Source / note                                                    |
| ------------------------------------ | ---------------------------------------------------------------- |
| `public/assets/ee/stock/*`           | Stand-in photography from Unsplash (free licence) — **replace**  |
| `public/assets/ee/video/hero.mp4`    | Original site hero footage (+ poster)                            |
| `public/assets/ee/speakers/*`        | Original site speaker portraits (1080×1350)                      |
| `public/assets/ee/attendees/*`       | Original site testimonial portraits                              |
| `public/assets/ee/sponsors/*`        | 2026 summit partner logos (white)                                |
| `public/assets/ee/event/summit-room` | Crop of the original OG photo (title band removed) — **replace** |
| `public/assets/ee/event/moment-*`    | Crops of interview stills (captions removed) — **replace**       |
| `public/assets/ee/event/venue-*`     | Omni King Edward ballroom (original site)                        |
| `public/assets/ee/event/the-seat`    | Original site “reserve your seat” image                          |

**To fill the homepage placeholders:** edit `homePage` in `static-content.ts` (testimonial
quotes, mixer names, newsletter headline, `LINKS.youtube`).
