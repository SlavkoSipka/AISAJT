# Phase 2B Report — Six High-Value Routes Migrated

**Status: Complete.** All six routes (`/`, `/izrada-sajta-cena`, `/seo-optimizacija-cena`, `/web-dizajn`, `/izrada-web-shopa`, `/funnel`) now have real Framework Mode route modules with native `meta()` exports, and all six prerender to genuine, complete static HTML with correct per-page `<title>`, meta description, canonical, and body content — zero JS execution required.

---

## Files created/changed

| File | What |
|---|---|
| `src/utils/pageMeta.ts` (new) | Shared `buildPageMeta({title, description, canonical, keywords?, ogImage?})` helper — returns the full `MetaDescriptor[]` array (title, description, OG title/description/type/url/image/site_name/locale, Twitter card/title/description/image, canonical link). Centralizes the boilerplate so each route module's `meta()` is a short, readable call instead of ~15 repeated lines. |
| `src/root.tsx` | Converted the static `<title>`/description/keywords/OG/canonical tags into a root-level `meta()` export (using the same `buildPageMeta` helper, same values as before). Kept genuinely route-invariant tags as static JSX: charset, viewport, favicons, `robots`/`googlebot`/`bingbot`, `author`, `theme-color`, font preconnects, the GA4/Pixel/HubSpot scripts, the JSON-LD schema script. This was necessary, not optional — see "Why root.tsx needed to change" below. |
| `src/home.tsx` | Added `meta()` export with the homepage's exact `SEOHelmet` values. |
| `src/izradaSajtaCena.tsx` (new) | Route module for `/izrada-sajta-cena`, wraps `IzradaSajtaCenaPage`, `meta()` with its exact values. |
| `src/seoOptimizacijaCena.tsx` (new) | Route module for `/seo-optimizacija-cena`, wraps `SEOPage`, `meta()` with its exact values. |
| `src/webDizajn.tsx` (new) | Route module for `/web-dizajn`, wraps `WebDizajnPage`, `meta()` with its exact values. |
| `src/izradaWebShopa.tsx` (new) | Route module for `/izrada-web-shopa`, wraps `WebShopPage`, `meta()` with its exact values. |
| `src/funnel.tsx` (new) | Route module for `/funnel`, wraps `FunnelPage`, `meta()` with its exact values. |
| `src/routes.ts` | Added `index('home.tsx')` plus five `route(path, file)` entries for the above, ahead of the still-present `route('*', 'catchall.tsx')`. |
| `react-router.config.ts` | `prerender` list expanded from `['/']` to all six paths. |

No page component (`HomePage.tsx`, `IzradaSajtaCenaPage.tsx`, `SEOPage.tsx`, `WebDizajnPage.tsx`, `WebShopPage.tsx`, `FunnelPage.tsx`) was modified — each route module is a thin wrapper (`export default function X() { return <PageComponent />; }`) importing the existing, unchanged component. Visible output is identical.

---

## Why `root.tsx` needed to change (not just additive)

I tested the merge behavior empirically before writing all six pages (rather than assume): set `root.tsx`'s `meta()` and `home.tsx`'s `meta()` to different values for the same keys (`title`, `description`, `og:title`, canonical), built, and inspected the output. **React Router deduplicates by key automatically** — the child route's value wins, the parent's is dropped, with zero manual `matches`-merging code required. This confirmed the safe design: each route module's `meta()` can just return its own complete, independent set via `buildPageMeta()`.

But this meant `root.tsx`'s *previous* static, hardcoded `<title>`/`<meta name="description">`/OG tags (written directly as JSX in `Layout`, separate from the `meta()`/`<Meta/>` system) had to be removed — otherwise every migrated route would ship **two** `<title>` tags (one static from `Layout`, one correct one from `<Meta/>` rendering the route's `meta()`), which is exactly the kind of duplicate-tag problem this whole migration is meant to fix, not reintroduce. So `root.tsx` now exports its own root-level `meta()` (used as-is by the remaining catchall-routed pages) instead of hardcoding those tags in `Layout`.

---

## Per-route prerender proof

All six built via `npm run build` → exit 0:
```
Prerender (html): / -> dist/client/index.html
Prerender (html): /izrada-sajta-cena -> dist/client/izrada-sajta-cena/index.html
Prerender (html): /seo-optimizacija-cena -> dist/client/seo-optimizacija-cena/index.html
Prerender (html): /web-dizajn -> dist/client/web-dizajn/index.html
Prerender (html): /izrada-web-shopa -> dist/client/izrada-web-shopa/index.html
Prerender (html): /funnel -> dist/client/funnel/index.html
```

| Route | Prerendered `<title>` | Canonical | File size |
|---|---|---|---|
| `/` | `AI Sajt - Agencija za Izradu Sajta \| SEO Optimizacija \| Beograd` | `https://aisajt.com/` | 164 KB |
| `/izrada-sajta-cena` | `Izrada Sajta Cena \| Profesionalna Izrada Sajtova Beograd \| Izrada Web Sajta` | `https://aisajt.com/izrada-sajta-cena` | 131 KB |
| `/seo-optimizacija-cena` | `SEO Optimizacija Cena \| SEO Optimizacija Sajta \| Prva Pozicija Google` | `https://aisajt.com/seo-optimizacija-cena` | 149 KB |
| `/web-dizajn` | `Web Dizajn Cena \| Profesionalan Web Dizajn Beograd \| Dizajn Sajta` | `https://aisajt.com/web-dizajn` | 100 KB |
| `/izrada-web-shopa` | `Izrada Web Shopa \| Online Prodavnica Beograd, Novi Sad, Srbija` | `https://aisajt.com/izrada-web-shopa` | 124 KB |
| `/funnel` | `Izrada Sajta Beograd \| Besplatna Ponuda i Konsultacija \| AiSajt` | `https://aisajt.com/funnel` | 226 KB |

Each `<meta name="description">` matches its page's exact `SEOHelmet` value (verified individually, e.g. `/seo-optimizacija-cena`: *"SEO optimizacija sajta za prvu poziciju na Google u Beogradu i Srbiji. Profesionalna SEO optimizacija - cena od 250€..."*). Zero `Application Error` boundary output on any of the six. Zero unresolved Suspense placeholders in the body content (the one that remains — `<!--$?--><template id="B:0">...` — appears only *after* `</body></html>`, as loader-data streaming boilerplate; confirmed harmless in the 2A retry).

**Raw body-text excerpt, `/izrada-sajta-cena` (script/tag-stripped, real content, zero JS)**:
```
AiSajt — Izrada Web Sajtova i SEO Optimizacija, Beograd [...noscript fallback...]
Pređi na glavni sadržaj [...Navbar...] Izrada Sajta Cena [...real H1 and page body follow...]
```

**`/funnel` specifics** (verified per the task's explicit ask):
- No Navbar rendered — grepped for the Navbar's `aria-label="AI Sajt - Početna stranica"`, zero matches. `Navbar.tsx`'s `if (location.pathname === '/funnel') return null;` check correctly evaluates against the real server-side request path under `ssr:true` (this exact mechanism — `useLocation()` returning correct data during prerendering — is what Sub-step 2A's retry fixed).
- The booking form is present in the raw prerendered HTML: `<form class="space-y-4">` — confirmed via grep, not just present after hydration.
- `FunnelPage.tsx` and `src/utils/hubspot.ts` (the actual submission logic, `submitFunnelForm`) are completely unchanged code — only wrapped by the new thin route module. I did not do a live-browser interactive submission test (no browser available in this environment); the static verification confirms the form mounts correctly in the prerendered output, and since the component/submission code is byte-identical to before migration, there's no code-level reason submission behavior would differ. Flagging that a real browser click-through wasn't performed, if you want that verified separately.

**Route-module confirmation** (not served via catchall): each prerendered page's embedded route manifest names the route by its real id, not `catchall` — e.g. `/funnel`'s output contains `window.__reactRouterRouteModules = {"root":route0,"funnel":route1}`.

---

## H1 audit

Every one of the six routes shows **2 H1s** in raw HTML — this is not a new per-page defect. In every case, H1 #1 is the same string across all six (`"AiSajt — Izrada Web Sajtova i SEO Optimizacija, Beograd"`, from `root.tsx`'s `<noscript>` fallback block), and H1 #2 is each page's own distinct, correct heading (`"Izrada Sajta Cena"`, `"SEO Optimizacija Cena"`, `"Web Dizajn"`, `"Izrada Web Shopa"`, and on `/funnel` a longer real heading — `"Kontaktiraj Nas Da Biste Privukli Nove Klijente Online"`). This is exactly the noscript-driven duplicate flagged as a known follow-up in the 2A retry report, now confirmed to reproduce identically on all six routes (not worsening, not a new distinct issue). Per your instruction, I did not fix it now — it's slated for 2D cleanup once every route is migrated and the `<noscript>` fallback's original justification (something for JS-disabled visitors, who'd otherwise see nothing) no longer applies. I checked each page's *own* rendered heading individually and confirmed none of the six page components themselves contain two real H1s — the duplication is 100% attributable to the shared root noscript block, consistently, across all six.

---

## Observation (not fixed, flagging per scope discipline)

Four of the six pages (`/izrada-sajta-cena`, `/seo-optimizacija-cena`, `/web-dizajn`, `/izrada-web-shopa`) pass `includeFAQSchema={true}` + `faqItems={...}` to their `<SEOHelmet>` call. `SEOHelmet`'s FAQ-schema injection is `useEffect`-based (client-side only) — confirmed it does **not** appear in these four routes' prerendered HTML (each shows exactly 1 JSON-LD block — the root `ProfessionalService` schema only). This is different from the homepage, where `FAQ.tsx`'s own FAQ schema uses a raw in-JSX `<script>` tag (not `SEOHelmet`) and *does* prerender correctly (confirmed in the 2A retry). The task scoped this sub-step to title/description/canonical/OG/Twitter only, not schema, so I left this as-is — flagging it as a concrete, ready-made target for whichever phase handles schema (Phase 4 per the original plan): these four pages' FAQ content is real, already written, and just needs the same "raw JSX script tag instead of `SEOHelmet`'s `useEffect`" treatment `FAQ.tsx` already uses to become prerendered/crawlable.

---

## SSR-safety guards needed this sub-step

**None.** All six pages (including `FunnelPage`, `WebShopPage`, `IzradaSajtaCenaPage`, `SEOPage`, `WebDizajnPage` — all pulling in different sections/components than the homepage did) built and rendered correctly on the first attempt, with no empty-output or hang symptoms. The two guards already in place from Sub-step 2A (`LanguageContext`'s `localStorage` deferral, the `LoadingScreen` overlay change) were sufficient. Worth noting for predicting 2C: none of these six needed additional guarding, which is a reasonably good signal, though 2C's remaining pages (blog, resources, quiz, audit forms) haven't been checked yet and may use different patterns.

---

## Build / type-check

```
npm run build                              # exit 0, all six routes prerender (verified above)
npx tsc --noEmit -p tsconfig.app.json      # 141 errors — identical count/set to the 2A retry baseline
```
Zero errors in any of the eight files this sub-step touched or created (`root.tsx`, `home.tsx`, `izradaSajtaCena.tsx`, `seoOptimizacijaCena.tsx`, `webDizajn.tsx`, `izradaWebShopa.tsx`, `funnel.tsx`, `utils/pageMeta.ts`, `routes.ts`). The pre-existing `BlogCategory` duplicate-identifier-driven error set (141 errors, unrelated to this work) is untouched — confirmed by exact count match against the 2A retry's baseline, meaning this sub-step's changes had zero effect on that surface either way.

---

Stopping here per the sub-step boundary. Say **"proceed to 2C"** to migrate the remaining marketing routes (`/izrada-sajta-detalji`, `/seo-optimizacija-detalji`, `/resources` + its four sub-pages, `/blog` + dynamic post/category routes, `/privacy`, `/terms`, `/thank-you`, `/promet-sistem`, and the `/seo`/`/contact` aliases).
