# Sanity (not connected yet)

This folder is reserved for the Sanity integration. Nothing here is imported by the app,
and no Sanity packages are installed.

When the CMS is connected:

1. `schemas/` — document schemas mirroring the models in `src/services/content/types.ts`
   (`siteSettings`, `homePage`, `event`, `testimonial`, `sponsor`, …). Layout-only data
   (Webflow grid ids, animation ids) stays in the components and never becomes a field.
2. `queries/` — GROQ queries whose projections return exactly those TypeScript shapes
   (images projected to `{ src, alt, width, height }` from asset metadata).
3. `src/services/content/sanity-provider.ts` — implements `ContentProvider` with the queries.
4. Select it in `src/services/content/index.ts` and switch the page from `force-static`
   to tag-based revalidation (`revalidateTag` from a Sanity webhook).

No page or section component needs to change.
