# Elite homepage (Next.js)

The Elite homepage on **Next.js 16 (App Router)**, React 19 Server Components, strict
TypeScript and Tailwind CSS v4. It was migrated from the approved React + Vite build
(git tag `react-approved-v1`) without visual changes; Playwright compares the two
pixel by pixel at 14 viewports.

> **Launch checklist — read before deploying publicly.** The copy, photos, partner logos
> and fonts are still those of techto.org, from which the design was recreated. They belong
> to TechTO and the named companies, and Feature Display / PP Mondwest are commercial fonts
> that need their own licence. The site therefore ships with `noindex` and a disallow-all
> `robots.txt` until `SITE_INDEXABLE=true` is set. Replace the content in
> `src/services/content/static-content.ts` (or in Sanity) and the assets in
> `public/assets/images` first.

## Commands

```bash
npm install
npm run dev                  # http://localhost:3000
npm run build && npm start   # production build
npm run typecheck            # tsc --noEmit (strict)
npm run lint                 # ESLint (next/core-web-vitals + typescript)
npm run format               # Prettier (+ Tailwind class sorting)
npm run test:e2e             # Playwright: navigation, interactions, SEO, axe, overflow (14 viewports)
npm run test:visual          # Playwright: pixel comparison with the React reference (14 viewports)
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
  app/                      routing only: layout, page, robots.ts, sitemap.ts, not-found, fonts, globals.css
  config/site.ts            validated environment + site constants
  services/content/         content layer (Sanity-ready)
    types.ts                  typed content models
    provider.ts               ContentProvider interface
    static-content.ts         current implementation (static data)
    index.ts                  provider selection + request-deduplicated accessors (server-only)
  features/
    home/sections/          one Server Component per homepage section
    home/components/        section parts; city-events and testimonial-tabs are the only client parts
    newsletter/             NewsletterForm (client, React Hook Form + Zod) and its schema
  components/
    layout/                 SiteHeader (client), MorePanel, SiteFooter
    ui/                     shadcn/ui (Label) and small shared primitives (AccentHeading)
    media/                  PlainImage (SVG/GIF/logos), WipeImage
    icons/                  inline SVG icons
  lib/
    motion/                 GSAP port of the Webflow IX2 interactions + MotionRoot (client)
    seo/                    metadata builder, JSON-LD
  styles/
    legacy/                 approved Webflow stylesheet, embeds, runtime states (unchanged)
    theme.css               brown & cream colour theme (single source of truth for colour)
    tokens.css              Tailwind @theme tokens that point at theme.css variables
    base.css                resets for elements made semantic during the migration
  sanity/                   reserved for the CMS (README, empty queries/ and schemas/)
tests/
  e2e/                      behaviour, SEO, accessibility, overflow
  visual/                   pixel parity with the React reference
scripts/serve-reference.mjs serves the frozen React build for comparison
```

### Key decisions

**Server Components by default.** Every section renders on the server; the page is fully
static (`force-static`) and all content is in the initial HTML. Client code is limited to:
the header (menu, dropdown, scroll-linked pill), the city filter, the testimonial tabs, the
newsletter form, and `MotionRoot`, which starts the scroll reveals. Client components receive
server-rendered content as props (`morePanel`, `rows`, `tabs`) instead of becoming the
section themselves.

**Layered CSS: the approved stylesheet stays byte-for-byte.** The design depends on the
original Webflow stylesheet (13.6k lines, grid cells placed by element id). Rewriting it
as Tailwind classes would risk the visual sign-off at 14 viewports, so it is loaded unchanged
into a `legacy` cascade layer, with explicit layer order in `src/app/globals.css`:
`theme < base < legacy < components < utilities`. Tailwind's Preflight is not loaded (Webflow
ships its own normalize). Tailwind utilities use the **`tw:` prefix** because Webflow class
names such as `outline`, `container` and `grid` are also Tailwind utilities and would
otherwise generate rules that change the design. New styling uses Tailwind and the tokens
in `tokens.css`; legacy sections can be converted one at a time, gated by the visual tests.

**Content is separated from layout.** Content models never contain Webflow ids or class
variants; components map list positions to the layout slots the stylesheet expects.
`ContentProvider` is the only seam a Sanity implementation needs (see `src/sanity/README.md`).

**Motion.** Timings are the original IX2 values. Elements are server-rendered in their
pre-animation state (no flash), revealed by `lib/motion`. With `prefers-reduced-motion`
everything is shown in its final state and the decorative loops (scramble, bounce) are
skipped. Without JavaScript a `<noscript>` style shows all content.

**Images.** Raster photos and illustrations use `next/image` (AVIF/WebP, responsive `srcset`,
intrinsic dimensions from the content model to prevent layout shift; hero images load
eagerly). SVG logos/icons and animated GIFs use a plain `<img>` through `PlainImage`, since
next/image cannot optimise them. Fonts are self-hosted and preloaded with `next/font/local`.

## Visual comparison workflow

The React reference build lives in `.reference/` (git-ignored):

```bash
git worktree add .reference/react-src react-approved-v1
(cd .reference/react-src && npm ci && npm run build)
cp -R .reference/react-src/dist .reference/react-dist
npm run test:visual:baseline   # screenshots of the React build → tests/visual/__baseline__
npm run build && npm run test:visual
```

Screenshots are deterministic: the tests install a paused fake clock, scroll the page to fire
every reveal, then advance time by fixed amounts so GSAP tweens and the infinite image bounce
always end in the same state.
