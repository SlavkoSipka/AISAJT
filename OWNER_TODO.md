# Owner To-Do — consolidated across Phases 0-9

Every deferred item from the 9-phase SEO/performance/GEO project, ranked by what blocks launch first. Nothing here was fixed automatically — each needs a decision, an asset, or a manual step only the owner (or someone with the right access) can do.

---

## 1. Deploy-critical

- [ ] **Real Vercel preview deploy**, checking specifically:
  - Does `/portal`, `/portal/dashboard`, `/portal/anything` actually rewrite to `portal.html` in production (per `vercel.json`'s `rewrites`)? Never verified against a live deploy — only reasoned about from config (Phase 2D).
  - Does Vercel serve `outputDirectory: dist/client` correctly alongside the `api/*.ts` serverless functions (`gsc-sync`, `gsc-query`, `gsc-auto-sync-all`)?
  - Do all 33 prerendered marketing routes actually resolve as static files (not 404s) once deployed?
- [ ] **`/funnel` HubSpot form — live click-through test.** Submit a real test lead through the funnel form in production and confirm it lands in HubSpot. Never tested end-to-end in this project; only the client-side submission code (`src/utils/hubspot.ts`) was reviewed.
- [ ] **Netlify vs. Vercel — pick one, then clean up the other's config.** `vercel.json` is current and correct (has the `/portal/*` rewrite, `outputDirectory: dist/client`). `netlify.toml` is stale:
  - `publish = "dist"` — wrong; the actual build output is `dist/client` (Framework Mode changed this in Phase 2A/2D, `netlify.toml` was never updated).
  - Still carries a blanket `[[redirects]] from = "/*" to = "/index.html" status = 200` SPA-fallback — a pre-Framework-Mode pattern from when this was a client-only SPA. It has no `/portal/*` rewrite at all, so if Netlify is a live deploy target, `/portal/*` doesn't work there today.
  - **If Netlify isn't actually used**, delete `netlify.toml` (and `npm run dev:netlify` from `package.json`) to stop it from misleading the next person. **If it is used**, it needs the same rewrite/output-dir fixes `vercel.json` already got. Either way, this is a decision, not something to guess at.

## 2. Verification tokens (search console ownership)

- [ ] **Google Search Console verification meta tag** — `src/root.tsx` has a `TODO(owner)` comment marking exactly where to add it (a placeholder that verified nothing was removed in Phase 1; nothing has replaced it). Needed to access GSC data (also needed for the post-launch sitemap submission below).
- [ ] **Yandex Webmaster verification meta tag** — same file, same pattern, `TODO(owner)` comment in place. Only worth doing if Yandex traffic/market matters for this business.

## 3. Content & assets

- [ ] **Real 1200×630 branded OG/Twitter share image.** Every route currently falls back to the 512×512 square favicon (`pageMeta.ts`'s `DEFAULT_OG_IMAGE`) — wrong aspect ratio, looks broken when a link is shared on social/messaging apps. Attempted in Phase 6 with the tools available (`sips` only) and rejected as not good enough to ship — needs actual design work (brand gradient, logo placement, tagline). Once a real asset exists, it's a one-line swap in `pageMeta.ts` and every route picks it up automatically (unless the route passes its own `ogImage` — blog posts already do).
- [ ] **Real Facebook business page URL** (or confirm there isn't one). `site-config.ts`'s `SOCIAL_PROFILES` only lists Instagram — Phase 4 found `facebook.com/aisajt` resolves to an unrelated personal profile, not the business, so it was deliberately left out rather than shipping a false `sameAs` claim.
- [ ] **Real client reviews**, if/when available, to enable `Review`/`AggregateRating` schema. Phase 1 removed a fake Trustpilot widget/rating that was on the site — nothing has replaced it. Don't add review schema without real, attributable reviews (fabricated ratings are a Google Rich Results policy violation, not just a nice-to-have gap).

## 4. Cookie consent — legal review

- [ ] **Final wording sign-off.** The consent banner (`src/components/ui/CookieConsentBanner.tsx`) was implemented in Phase 7 and its copy improved in the Phase 7 addendum (named tracker categories, symmetric accept/reject, no-fire-before-consent language) — but this is "closer to standard," not legally certified. Get the Serbian wording reviewed by the owner or counsel before launch, given GDPR exposure for EU visitors plus Zakon o zaštiti podataka o ličnosti.
- [ ] **Confirm which trackers are actually needed.** This project only gated the three already on the site (GA4, Meta Pixel, HubSpot) — didn't add or remove any. Worth asking whether all three are still wanted.
- [ ] **Update `/privacy`** to name GA4/Meta Pixel/HubSpot specifically and describe the new consent mechanism — it currently has only a generic one-line cookie mention that predates the Phase 7 consent banner and doesn't reflect it.
- [ ] **Optional, not built**: a small "kolačići" link in the footer to reopen the banner and change a prior choice. Noted as an option in the Phase 7 addendum, not built since it's more than a copy change.

## 5. English content gap

- [ ] Both money pages' English FAQ arrays are empty (`faqItems = language === 'sr' ? [...] : []` in `IzradaSajtaCenaPage.tsx` and `SEOPage.tsx`) — flagged in Phase 8. This means English-language visitors see an empty FAQ accordion, and the `FAQPage` JSON-LD schema emits zero entries for them. Either translate the existing (good) Serbian FAQ answers, or — if English traffic isn't a real priority — treat English as effectively SEO-unsupported for these two pages and don't worry about it.

## 6. Post-launch checklist

- [ ] **Submit `sitemap.xml` to Google Search Console** (needs the GSC verification above first) **and Bing Webmaster Tools.**
- [ ] **Run these URLs through [Google's Rich Results Test](https://search.google.com/test/rich-results)** once live — the ones carrying the more complex schema (highest value to confirm parses cleanly in Google's own validator, not just `JSON.parse`):
  - `https://aisajt.com/` (`ProfessionalService` + `FAQPage`)
  - `https://aisajt.com/izrada-sajta-cena` (`ProfessionalService` + `BreadcrumbList` + `FAQPage` + `Service`)
  - `https://aisajt.com/seo-optimizacija-cena` (same set)
  - `https://aisajt.com/blog/koji-sajt-mi-treba-za-firmu` (`BlogPosting` + `BreadcrumbList`)
  - `https://aisajt.com/portfolio/kralj-residence` (representative portfolio detail page — currently only `ProfessionalService` + `BreadcrumbList`; see note below)
- [ ] **Monitor Core Web Vitals in the field** (GSC's CWV report, or real-user monitoring) once there's real traffic — everything checked in this project was lab data (build output, prerendered HTML), not field data.

## 7. Minor / known issues (low priority, not launch-blocking)

- [ ] **`/thank-you` is indexed and in the sitemap.** Phase 3 flagged this page as an ideal `noindex` candidate (it's a post-submit redirect target, never reached organically) but there's no per-route robots-meta mechanism yet — `root.tsx` hardcodes `index, follow` site-wide. Building that mechanism was out of scope for every phase so far; still open.
- [ ] **`BlogPostPage.tsx`'s heading-anchor IDs break for headings with inline formatting.** `ReactMarkdown`'s `h2`/`h3` id-generation calls `.toString()` on `children`, which produces garbage ids like `4-object-object` when a heading mixes plain text with bold/italic/links. Breaks in-page table-of-contents jump links for affected headings. Found in Phase 2D, out of scope there, never revisited.
- [ ] **`SEOHelmet.tsx` still gets called with stale/wrong prop names** on `BlogHubPage.tsx`, `BlogCategoryPage.tsx` (pass `image` instead of the real `ogImage` prop), and `BlogPostPage.tsx` (passes a nonexistent `article` prop). Confirmed harmless — `SEOHelmet` is `useEffect`-only and never prerenders anyway, and each route's real `meta()` export already has the correct values — but it's dead/broken code sitting in the tree that could confuse the next person who touches these files. Cosmetic cleanup, not a functional bug.
- [ ] **Portfolio detail pages carry generic schema only** (`ProfessionalService` + `BreadcrumbList`), no case-study-specific type like `CreativeWork`. Not a defect — the schema present is valid and syntactically correct — but a more specific type could be a worthwhile enhancement if portfolio SEO becomes a priority.
- [ ] **GA4 on the portal** — deliberately not wired up when the portal got its own static shell in Phase 2D (Meta Pixel/HubSpot definitely shouldn't fire inside an authenticated tool; GA4 pageview tracking for portal *usage analytics* specifically is a defensible want, just wasn't assumed). One-line addition to `src/entry.portal.tsx` if wanted.

---

*Every item above is cross-referenced to the phase report that first flagged it — see `PHASE_1_REPORT.md` through `PHASE_9_REPORT.md` for full context on any item.*
