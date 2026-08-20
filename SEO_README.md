# SEO / SSR maintenance guide

For whoever touches this codebase next. Explains the architecture the last 9 phases built, why it's shaped the way it is, and how to extend it without quietly breaking SEO. Read this before touching `root.tsx`, `routes.ts`, `react-router.config.ts`, or anything under `src/components/seo/`.

---

## 1. The prerendering architecture

This site is React Router v7 **Framework Mode** with `ssr: true` and full prerendering (`react-router.config.ts`). Every marketing route is a static HTML file at build time — there's no live Node server rendering pages on demand in production. The pieces:

| File | Role |
|---|---|
| `src/root.tsx` | The shared HTML shell (`Layout`) — `<head>` tags, tracker scripts, `BusinessSchema`, `BreadcrumbSchema` — plus the `Root` default export that wraps every route's `<Outlet />` in `LanguageProvider` and renders `CookieConsentBanner`. |
| `src/entry.client.tsx` | Client hydration entry — `hydrateRoot(document, ...)` on the whole document (no `#root` div; `root.tsx`'s `Layout` produces the entire `<html>`). |
| `src/routes.ts` | The route table (`@react-router/dev/routes`' `route()`/`index()`), mapping URL paths to route modules in `src/`. |
| `react-router.config.ts` | `ssr: true`, `routeDiscovery: { mode: 'initial' }`, and the `prerender` callback that tells the build which URLs to statically generate. |
| Route modules (`src/home.tsx`, `src/funnel.tsx`, etc.) | One per route in `routes.ts`. Each exports a `meta()` function (via `buildPageMeta()`), an optional `handle: { breadcrumb }`, and a default component that renders the real page component from `src/components/pages/`. |

**Why `ssr: true` and not `ssr: false`.** RR v7's `ssr: false` static-prerender path was tried first (Phase 2A) and produced silently empty output for any component using `<Link>`/`useLocation`/`useNavigate` — a known, still-unresolved RR v7 issue at the time. `ssr: true` routes every prerender through the mature SSR codepath at build time; since every served route is listed in `prerender`, the deployed output is still 100% static files — same end architecture (no live server in production), just a more reliable build codepath. **Do not switch this back to `ssr: false`** without first confirming upstream React Router has actually fixed that class of bug — it will silently break, not loudly fail.

**The `LoadingScreen`-blocking-prerender lesson.** An early version of this site's entry point (`main.tsx`/`App.tsx`, both deleted in Phase 2D) gated the entire app behind an ~800ms `setTimeout` splash screen (`LoadingScreen.tsx`, deleted Phase 7) before rendering real content. That component never got carried into the Framework Mode entry point specifically because gating content behind a client-side timer defeats the entire point of prerendering — a crawler or an AI answer engine fetching the raw HTML would see nothing useful until JS ran and the timer expired. **Any new full-page loading gate, splash screen, or "wait for X then render" pattern placed above route content is the same mistake.** If you need a loading state, scope it to a specific async widget, not the page shell — non-blocking, with the actual content already server-rendered around it (that's exactly how `CookieConsentBanner` works: it's an overlay that mounts after hydration, never a gate on `{children}`).

**Schema must be raw `<script>`, never `SEOHelmet`'s `useEffect`.** `src/components/seo/SEOHelmet.tsx` is a legacy, client-only component (`useEffect`-based DOM manipulation) that predates Framework Mode. Anything it sets — including its FAQ/business schema injection on a few older pages — **never appears in prerendered HTML**, only after hydration. It's still called on some pages for backward compatibility but is inert for anything that matters to a crawler. Every schema component that actually needs to be crawlable (`BusinessSchema`, `BreadcrumbSchema`, `FAQSchema`, `ServiceSchema`, `BlogPostSchema`) renders a real JSX `<script type="application/ld+json" dangerouslySetInnerHTML={...}>` tag directly in the component tree, which **does** prerender. If you add new structured data, follow that pattern — a raw script tag rendered from the component, not a `SEOHelmet` prop or a `useEffect`.

---

## 2. Where SEO logic lives

- **`src/lib/site-config.ts`** — the single source of truth for Name/Address/Phone (`NAP`), plus `SITE_URL` and `SOCIAL_PROFILES`. Every consumer (schema components, footer, contact forms, `llms.txt`) should import from here. **Never hardcode the phone number, address, or email in a new component** — import `NAP`.
- **`src/utils/pageMeta.ts`** — `buildPageMeta({ title, description, canonical, keywords?, ogImage? })` returns the full `MetaDescriptor[]` array (title, description, OG, Twitter, canonical) that every route's `meta()` export should return. `DEFAULT_OG_IMAGE` here is the site-wide OG image fallback — currently still the square favicon, see `OWNER_TODO.md` §3.
- **Schema components** (`src/components/seo/`):
  - `BusinessSchema.tsx` — one `ProfessionalService` JSON-LD node, rendered once from `root.tsx`, on every page. Carries NAP, founders/employees, and the service offer catalog.
  - `BreadcrumbSchema.tsx` — also rendered once from `root.tsx`; builds `BreadcrumbList` JSON-LD from every matched route's `handle.breadcrumb` (see below). Renders nothing on routes with no breadcrumb (e.g. home).
  - `FAQSchema.tsx` — takes an `items` prop, renders `FAQPage` JSON-LD. Used per-page, wherever a page has a real FAQ section.
  - `ServiceSchema.tsx` — per-page `Service` JSON-LD with a starting price.
  - `BlogPostSchema.tsx` — per-post `BlogPosting` JSON-LD (`datePublished`/`dateModified` from `blogPosts.ts`'s real dates).
- **`handle: { breadcrumb }` pattern** — a route module opts into breadcrumb schema by exporting `handle: { breadcrumb: 'Some Label' }` (static) or `handle: { breadcrumb: (data) => ... }` (dynamic, e.g. blog post titles from loader data). No `handle` export = no breadcrumb for that route. See `BreadcrumbSchema.tsx`'s own doc comment for the full contract (single string vs. array-of-crumbs for two-level breadcrumbs like blog posts).

---

## 3. Adding a new marketing page without breaking SEO

1. Add the route to `src/routes.ts`: `route('new-path', 'newPage.tsx')`.
2. Create `src/newPage.tsx` — the route module:
   ```ts
   import type { MetaFunction } from 'react-router';
   import { NewPageComponent } from './components/pages/NewPageComponent';
   import { buildPageMeta } from './utils/pageMeta';

   export const meta: MetaFunction = () => buildPageMeta({
     title: '...',
     description: '...',
     canonical: 'https://aisajt.com/new-path',
     keywords: '...', // optional
   });

   export const handle = { breadcrumb: 'New Page' }; // omit if it shouldn't appear in breadcrumbs

   export default function NewPageRoute() {
     return <NewPageComponent />;
   }
   ```
3. Build the actual page component under `src/components/pages/`. If it has an FAQ section, add `<FAQSchema items={...} />` directly in its JSX (not via `SEOHelmet`). If it's a service page with a starting price, add `<ServiceSchema ... />`.
4. **Static routes prerender automatically** — `getStaticPaths()` in `react-router.config.ts` covers every non-dynamic `route()` entry in `routes.ts` with zero extra config.
5. Add the URL to `public/sitemap.xml` (there's no automated sync between `routes.ts` and the sitemap — this is a real, manual step; Phase 9 found two routes that had been missing since Phase 5 for exactly this reason).
6. Run `npm run build` and check the new route's `dist/client/<path>/index.html` has: one `<title>`, one meta description, one canonical (self-referencing, matching what you put in `sitemap.xml`), one `<h1>`, complete OG/Twitter tags, and valid JSON-LD. (See `PHASE_9_REPORT.md`'s audit grid for the pattern every existing route already follows.)

---

## 4. Adding a blog post or portfolio project

Both are **data-driven, not manual routes** — add an entry to the data array and it prerenders automatically, no `routes.ts` or `react-router.config.ts` edit needed:

- **Blog post**: add an entry to `src/data/blogPosts.ts` with a real `slug`, and **real** `publishedAt`/`updatedAt` dates (never fabricate these — `AuthorBox.tsx` and `BlogPostSchema.tsx`'s `datePublished`/`dateModified` both read them directly, and a fake "updated" date is a real trust/E-E-A-T problem for AI answer engines and Google alike). `react-router.config.ts`'s `prerender` callback maps every `blogPosts` entry to `/blog/${post.slug}` automatically.
- **Blog category**: same pattern via `src/data/blogCategories.ts` → `/blog/category/${category.slug}`.
- **Portfolio project**: same pattern via `src/data/portfolioProjects.ts` → `/portfolio/${project.slug}`.

After adding any of these, **update `public/sitemap.xml` manually** (see §3 step 5 — this is the one step that isn't automatic) and re-run `npm run build` to confirm it prerendered (check the build log for a `Prerender (html): /blog/your-new-slug -> ...` line) and that `dist/client/blog/your-new-slug/index.html` looks right.

---

## 5. The portal's separate build — and why it's isolated

`/portal/*` is **not** part of `routes.ts` and never goes through Framework Mode's SSR/prerender pipeline at all. It's a fully separate client-only SPA:

- **`vite.portal.config.ts`** — a second, plain-Vite build (no `@react-router/dev` plugin) targeting `portal.html` as its entry, output to the same `dist/client` directory (`emptyOutDir: false` so it doesn't clobber the marketing build that ran first). `npm run build` runs both builds in sequence (`react-router build && vite build --config vite.portal.config.ts`).
- **`vercel.json`** rewrites `/portal` and `/portal/:path*` to `portal.html`, which then runs a plain client-side `<Router>` (`src/portal/PortalApp.tsx`) with its own auth guards and lazy-loaded admin/client pages.
- **Why isolated, not merged into the main route tree**: the portal is auth-gated, never SEO-relevant (disallowed in `robots.txt`), and pulls in Supabase + a much larger admin/client UI (~2.4–2.9MB of JS, confirmed in Phase 7's bundle audit) that has no business being in the public marketing bundle. Keeping it a separate build with a separate entry means a marketing visitor's browser never downloads a single byte of portal or Supabase code — verified in Phase 7 by grepping every marketing-build JS chunk for `supabase` (zero matches) and confirming `dist/client/index.html` never references a portal-prefixed chunk.
- **Don't merge these builds** to "simplify" the setup — the isolation is the entire reason the marketing bundle stays small and portal code never touches SEO-relevant pages.

---

## 6. Two rules that keep this from rotting

**The NAP single-source rule.** Name/address/phone/email/hours live in exactly one place: `src/lib/site-config.ts`'s `NAP` object. Every schema block, footer, contact form, and `llms.txt` should import from there. If you ever find yourself typing a phone number or address as a literal string in a new file, stop — import `NAP` instead. This is what made Phase 3's centralization possible in the first place, and what keeps `BusinessSchema.tsx`'s `ProfessionalService` schema from silently drifting out of sync with what's shown on the page.

**The content-schema parity rule.** Schema/meta claims must match what's actually rendered on the page — not just be individually plausible. This project found two real instances where they didn't: `ONamaPage.tsx`'s team bios conflicted with the canonical team facts on `/funnel` (different names/titles), and an orphaned `PricingPage.tsx` advertised "od 800€" while the live pricing page said €299. Both were unrouted dead pages (deleted in Phase 7/addendum) precisely because nobody could tell if they were still true. **Before wiring up any previously-orphaned page, or copying pricing/team/service facts into a new schema block, cross-check it against the current live pages first** — `IzradaSajtaCenaPage.tsx`/`SEOPage.tsx`/etc. for pricing, `/funnel` for team facts, `site-config.ts` for contact info. Don't trust a number just because it's already written down somewhere in the codebase.

---

*Companion docs: `OWNER_TODO.md` (deferred owner decisions), `PHASE_9_REPORT.md` (final audit + project recap), and `PHASE_1_REPORT.md` through `PHASE_8_REPORT.md` for the full history behind any specific decision referenced above.*
