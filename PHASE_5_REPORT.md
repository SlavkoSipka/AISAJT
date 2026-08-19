# Phase 5 Report — Case-study pages

**Status: Complete.** No new pages had to be designed from scratch — `PortfolioPage.tsx` and `PortfolioDetailPage.tsx` were already fully built, polished components with real client data behind them; they just weren't wired into `routes.ts`. This phase routed them, converted their meta/schema to the site's prerendering pattern, and connected the homepage carousel and nav/footer to the new pages instead of leaving them orphaned. Type errors: **83, unchanged from the Phase 4 baseline, zero new.**

---

## 5.1 — Audit (before building)

**Real data already existed.** `src/data/portfolioProjects.ts` — 7 real client projects (Kralj Residence, BN Autofolije, Prestige Gradnja, Custom RC Parts, White Club, Pokloni Portret, IN-STAN), same array-of-objects pattern as `blogPosts.ts`. Each entry has: live client URL, bilingual short/long description, tags, tech stack, industry, year, and a bullet list of features — all specific to that client, no lorem ipsum.

**The pages were already built, not stubs:**
- `PortfolioPage.tsx` — full listing with category filters (`web-sajt` / `e-commerce` / `all`), matches the site's visual language, links each card to `/portfolio/:slug`.
- `PortfolioDetailPage.tsx` — full detail template: hero with live "Visit Website" CTA, features grid, tech stack, related-projects section, closing CTA. Already read `useParams().slug` via `getProjectBySlug()` and already called `trackPortfolioClick`.

Grepped confirmed **zero references** to either component anywhere outside `routes.ts`-adjacent code — genuinely orphaned, not partially wired.

**What needed fixing, not building:**
1. Both pages used `SEOHelmet` for title/description/canonical — confirmed dead per Phase 4 (`useEffect`-only, never reaches prerendered HTML).
2. Neither had raw `<script>` schema.
3. `PortfolioCarousel.tsx` (rendered on the homepage) hardcoded its own **duplicate copy** of the same 7 projects instead of importing `portfolioProjects.ts`, and its cards linked straight to the external client site — bypassing the new internal pages entirely.

**Not case-study material:** `ONamaPage.tsx` (also orphaned) is a separate About page with team bios, not portfolio content — and its bios conflict with the canonical team facts Phase 4 established from `/funnel`. Flagged only, out of scope here.

---

## 5.2 — What was built

### Routes
- `route('portfolio', 'portfolio.tsx')` → `/portfolio` (index/listing)
- `route('portfolio/:slug', 'portfolioDetail.tsx')` → `/portfolio/:slug` (7 real projects)

New thin route wrappers `src/portfolio.tsx` / `src/portfolioDetail.tsx`, same shape as `blogHub.tsx` / `blogPost.tsx`:
- `meta()` via `buildPageMeta()` — prerendered `<title>`, description, OG/Twitter, canonical.
- `handle.breadcrumb` — static string for the index, a `loader()` + function-valued breadcrumb for the dynamic detail page (same pattern as `blogPost.tsx`'s "Blog → [Post]", here "Portfolio → [Project]"), feeding the existing sitewide `BreadcrumbSchema` component with no changes needed there.
- `react-router.config.ts`'s `prerender()` now also maps `portfolioProjects` → `/portfolio/:slug` paths, alongside the existing blog post/category mapping.

### Content-schema parity
| Route | Schema | Backed by |
|---|---|---|
| `/portfolio` | `ProfessionalService` + `BreadcrumbList` | Sitewide business node; breadcrumb label matches nav/heading text |
| `/portfolio/:slug` | `ProfessionalService` + `BreadcrumbList` | Breadcrumb's project-title crumb is the literal `project.title` from `portfolioProjects.ts` — same field the page renders as its H1 |

Verified in the built `dist/client/portfolio/**/index.html` files directly (not via browser render) — confirmed prerendered, not hydration-only.

### Cleanup required to keep the pattern consistent
- Removed `SEOHelmet` usage from both page components (dead client-only meta, per Phase 4 precedent).
- `PortfolioCard.tsx` gained an optional `to` prop for internal `<Link>` navigation (falls back to the existing external `<a target="_blank">` behavior when only `link` is given, so nothing else calling it breaks) — corner icon and CTA copy adapt to whichever mode is active.
- `PortfolioCarousel.tsx` now imports `portfolioProjects` directly instead of a hand-duplicated array, and its cards pass `to={`/portfolio/${project.slug}`}` — removes the drift risk between the homepage's copy and the real data.
- `Navbar.tsx` (desktop, mobile, and vertical-scroll variants) and `Footer.tsx`: the "Portfolio" nav item previously anchor-scrolled to the homepage carousel section (`/#portfolio`) on every page; now routes to `/portfolio`, matching how `/blog` is already handled elsewhere in the same nav. This was a judgment call — confirmed with the owner before making it, since it changes existing site navigation, not just adds a new page.
- `public/sitemap.xml`: added `/portfolio` and all 7 `/portfolio/:slug` URLs (`lastmod` today, priority 0.6–0.75) — case studies are proof-of-work content, worth Google indexing them directly.

### Explicitly not touched
- `portfolioProjects.ts` data itself — no metrics/testimonials were invented. All 7 entries ship with exactly the real copy that already existed.
- `ONamaPage.tsx` — flagged, not wired up; out of this phase's scope and its content has an unrelated accuracy issue (team bios) that isn't a case-study concern.
- Pre-existing sitemap gaps (e.g. `/izrada-sajta-detalji`, `/seo-optimizacija-detalji` were already missing before this phase) — not introduced by Phase 5, left alone.

---

## Build / type-check

```
npm run build                              # exit 0 — 35 routes prerender (27 prior + /portfolio + 7 detail pages) + portal.html builds
npx tsc --noEmit -p tsconfig.app.json      # 83 errors — identical to the Phase 4 baseline, zero new
```

Spot-checked prerendered output directly:
```
dist/client/portfolio/index.html                  <title>Portfolio | Naši Projekti i Radovi | AiSajt</title>
dist/client/portfolio/kralj-residence/index.html   <title>Kralj Residence | Portfolio | AiSajt</title>
                                                    BreadcrumbList: Početna → Portfolio → Kralj Residence
dist/client/index.html                             carousel cards link to /portfolio/{slug}; nav + footer "Portfolio" → /portfolio
```

---

Phase 5 complete.
