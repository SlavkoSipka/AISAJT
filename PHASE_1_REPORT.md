# Phase 1 — Risk Mitigation Report

All Phase 1 tasks complete. 11 files changed, 42 insertions / 515 deletions. `npm run build` and `npx tsc --noEmit -p tsconfig.app.json` both pass with zero new errors. No Supabase/HubSpot/portal functionality was touched.

**Pre-execution note**: dependencies were not installed in this checkout (`node_modules` was absent) — ran `npm install` first (respected the existing `package-lock.json`, no version changes) so the build/type-check could run at all. This is reported for transparency, not a Phase 1 task in itself.

---

## Files changed, and why

| File | Change | Task |
|---|---|---|
| `index.html` | Removed placeholder verification tags, unsubstantiated `aggregateRating`, hidden off-screen `<article>` block; trimmed `<noscript>`; fixed phone in JSON-LD; fixed 150€→299€ (3 spots) | 1.1, 1.2, 1.3, 1.4, 1.5, 1.7 |
| `public/robots.txt` | Added `Disallow: /portal/` | 1.9 |
| `src/components/sections/FAQ.tsx` | 150€→299€ in both the Serbian and English "koliko košta izrada sajta" FAQ answers | 1.5 |
| `src/components/seo/SEOHelmet.tsx` | `LocalBusiness` node: `contact@aisajt.com`→`office@aisajt.com`, `@id` changed to `#localbusiness`; `Organization` node: `contactPoint.email` `contact@aisajt.com`→`office@aisajt.com` (kept `@id` `#organization`) | 1.7, 1.8 |
| `src/components/sections/Hero.tsx` | Phone `+381 61 3091583`→`+381 62 155 2156` | 1.7 |
| `src/components/sections/Contact.tsx` | Phone (`tel:` href + display text) `+381613091583`→`+381621552156` | 1.7 |
| `src/components/layout/Footer.tsx` | Phone (`tel:` href, `aria-label`, display text) `+381613091583`→`+381621552156` | 1.7 |
| `src/components/pages/FunnelPage.tsx` | Removed fake "4.8/5 Trustpilot" reviews section + its now-orphaned `reviewsRef`/`reviewsVisible`/`expandedReviewIndex` state. Verified existing direct-call CTA (`+381621552156`) already matched canonical — no change needed there. | 1.6 |
| `src/components/pages/IzradaSajtaDetaljiPage.tsx` | Same reviews-section removal + orphaned state cleanup + dropped now-unused `Star` import | 1.6 |
| `src/components/pages/SEOOdrzavanjeDetaljiPage.tsx` | Same reviews-section removal + orphaned state cleanup + dropped now-unused `Star` import | 1.6 |
| `src/utils/README_ANALYTICS.md` | Updated stale example phone number in documentation (found during the full-codebase NAP sweep; not live code, but left uncorrected it would get copy-pasted forward) | 1.7 (incidental) |

**Not touched, and why**: `src/components/pages/FAQPage.tsx`, `src/components/pages/PricingPage.tsx` (still-orphaned, unrouted, no user ever sees them — confirmed in Phase 0); `IzradaSajtaCenaPage.tsx`'s "50-150€ godišnje" hosting line (a different line item, not the starting-price claim, not a conflict).

---

## 1.1 — Hidden off-screen `<article>` block

Deleted entirely (`index.html`, previously lines 254-338). `<div id="root">` is now a clean, empty SPA mount point, matching what a non-SEO-augmented Vite scaffold would look like.

## 1.2 — Trimmed `<noscript>` block

Replaced the ~50-line block (duplicate H1/H2 marketing copy + a full re-statement of the three case studies) with a short, accurate fallback: one H1, one description line, a 4-item service list, and contact info. No case-study duplication, no repeated "izrada web sajta" stuffing.

## 1.3 — `AggregateRating` removed

Deleted the `aggregateRating` object from the `ProfessionalService` JSON-LD in `index.html`. Per your Phase 0 answer, there's no real review source to back it — it can be reinstated later with genuine, sourced values once real reviews exist.

## 1.4 — Placeholder verification tags removed

Both `google-site-verification=1` and `yandex-verification=1` removed from `index.html`, each replaced with an HTML comment marking where the real token goes:
```html
<!-- TODO(owner): add real Google Search Console verification meta tag here (property > Settings > Ownership verification > HTML tag). Removed placeholder value that verified nothing. -->
<!-- TODO(owner): add real Yandex Webmaster verification meta tag here if Yandex traffic matters. Removed placeholder value that verified nothing. -->
```

## 1.5 — Pricing 150€ → 299€

Fixed in `FAQ.tsx` (both `sr` and `en` variants — the `en` instance wasn't in the original Phase 0 file map, found during execution) and in `index.html`'s meta description, og:description, and JSON-LD description/offer-description (all already in scope via 1.1/1.2/1.4 edits). Verified no live/routed file still says "150€" as a starting price (see grep results below).

## 1.6 — Fake Trustpilot reviews removed

Removed from all three files: `FunnelPage.tsx`, `IzradaSajtaDetaljiPage.tsx`, `SEOOdrzavanjeDetaljiPage.tsx`. Each removal was a clean cut between the preceding section's `</section>` and the following section's opening comment — no dangling wrapper divs, no broken spacing. Also removed, per file, whatever became unused as a direct result:
- `Star` import from `lucide-react` — dropped in `IzradaSajtaDetaljiPage.tsx` and `SEOOdrzavanjeDetaljiPage.tsx` (confirmed via grep that every `<Star>` usage in those two files was inside the removed section; `FunnelPage.tsx` keeps its `Star` import because it's used elsewhere on the page, lines 759 and 973, outside the removed section)
- `reviewsRef`/`reviewsVisible` (`useReveal()` call) and `expandedReviewIndex`/`setExpandedReviewIndex` (`useState`) — removed in all three files, confirmed via grep to have no other usages
- Verified `npx tsc --noEmit` reports no new errors in any of the three files (no dangling references left behind)

**Flag for the owner**: this removes all visible social proof from `/funnel` (the primary conversion page) and from the two "detalji" pages. That's the correct call given the content wasn't real, but it's a real gap now — the case-study clients (Kralj Residence, BN Autofolije, IN-STAN) and the actual client testimonials mentioned by name in the removed content ("Bogdan" helped several of them) are the obvious source for real reviews. Worth prioritizing collecting a handful of genuine, attributable testimonials so honest social proof can go back on `/funnel` — either as plain quotes with real names/companies, or, if a real Trustpilot/Google Business Profile account gets set up, with a genuine outbound link and matching `Review`/`AggregateRating` schema (Phase 4 territory, not now).

## 1.7 — NAP unified to `office@aisajt.com` / `+381621552156`

Full sweep, before → after:

| File | Before | After |
|---|---|---|
| `index.html` (JSON-LD `telephone`) | `+381613091583` | `+381621552156` |
| `index.html` (noscript contact line) | `+381 61 3091583` (`tel:+381613091583`) | `+381 62 155 2156` (`tel:+381621552156`) |
| `index.html` (hidden article contact line) | `+381 61 3091583` | *(removed with the block in 1.1)* |
| `SEOHelmet.tsx` LocalBusiness `email` | `contact@aisajt.com` | `office@aisajt.com` |
| `SEOHelmet.tsx` LocalBusiness `telephone` | `+381621552156` | *(unchanged — already correct)* |
| `SEOHelmet.tsx` Organization `contactPoint.email` | `contact@aisajt.com` | `office@aisajt.com` |
| `SEOHelmet.tsx` Organization `contactPoint.telephone` | `+381621552156` | *(unchanged — already correct)* |
| `Hero.tsx` contact-card mockup | `+381 61 3091583` | `+381 62 155 2156` |
| `Contact.tsx` phone link | `+381613091583` (`tel:`) / `+381 61 309 1583` (display) | `+381621552156` (`tel:`) / `+381 62 155 2156` (display) |
| `Footer.tsx` phone link | `+381613091583` (`tel:` + `aria-label`) / `+381 61 3091583` (display) | `+381621552156` (`tel:` + `aria-label`) / `+381 62 155 2156` (display) |
| `FunnelPage.tsx` direct-call CTA | `+381621552156` | *(unchanged — already correct, verified)* |
| `README_ANALYTICS.md` example snippet | `+381613091583` / `+381 61 3091583` | `+381621552156` / `+381 62 155 2156` |

Every visible/schema email in the codebase is now `office@aisajt.com`; every phone number is now `+381621552156` (display `+381 62 155 2156`).

**On centralizing NAP into a constants module**: I did not do this in Phase 1. Reasoning: it would mean touching every one of the files above a second time to import from a shared source, which pushes this phase past its stated scope (and the >5-file threshold was already crossed on the direct fixes alone). I'd flag it as a genuinely good idea for a **Phase 3 (metadata/head)** follow-up, since that phase is already touching most of these same files for other reasons — bundling "extract to `src/lib/site-config.ts`" into that pass avoids a third touch on files like `Footer.tsx`/`Hero.tsx`/`SEOHelmet.tsx`.

**Verification — zero remaining stale references**:
```
$ grep -rn "381613091583" src/ index.html
(no output)

$ grep -rn "contact@aisajt.com" src/ index.html
(no output)
```

## 1.8 — `@id` collision fixed

`SEOHelmet.tsx`'s `LocalBusiness` node now uses `"@id": "https://aisajt.com/#localbusiness"`; the `Organization` node keeps `"@id": "https://aisajt.com/#organization"`. Chose distinct IDs over merging into one `"@type": ["LocalBusiness", "Organization"]` node because the two nodes carry meaningfully different property sets (LocalBusiness has `geo`/`openingHours`/`sameAs`/`priceRange`; Organization has `taxID`/`vatID`/company-registration `identifier`s) — merging would force either duplicating those fields onto one node or losing the type-appropriate separation schema.org expects. Distinct IDs is the smaller, lower-risk fix and resolves the actual malformation (two different `@type`s silently colliding on one `@id`) without restructuring the graph. Didn't add explicit cross-references (e.g. `subOrganization`/`parentOrganization`) between the two nodes — they represent the same real-world business from two schema.org angles and Google's structured-data parser handles co-present `LocalBusiness`/`Organization` entries in one `@graph` without requiring an explicit link between them; adding one would be scope creep for a Phase 1 fix.

## 1.9 — `/portal/` blocked in `robots.txt`

Added `Disallow: /portal/`. Kept the pre-existing `Disallow: /admin/` rule as-is (targets nothing real, but removing it wasn't asked for and it's harmless). Final `robots.txt`:
```
# robots.txt for AiSajt.com
# Main domain: https://aisajt.com (non-www, HTTPS only)

User-agent: *
Allow: /

# Sitemap location (use canonical domain)
Sitemap: https://aisajt.com/sitemap.xml

# Block access to admin/private areas
Disallow: /admin/
Disallow: /portal/
Disallow: /api/
Disallow: /*.json$

# Allow specific search engines
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /

# Crawl delay (helps with server load)
Crawl-delay: 1
```
No client-side `noindex` was added to `/portal/*` pages this phase — per the task scope, `robots.txt` `Disallow` is the primary, sufficient mechanism pre-Phase-2, and portal pages still have zero head-management code (`SEOHelmet`/`Helmet`), consistent with "portal work here is robots.txt only."

---

## Build & type-check results

**`npm run build`**: ✅ succeeds, 15.57s, 2209 modules transformed. One pre-existing warning (the `portal-*.js` chunk is 2.4MB, over Vite's 1000kB default warning threshold) — this is the Supabase-backed client portal bundle, unrelated to anything touched in Phase 1, and out of scope (Phase 7 territory if it's addressed at all, since the portal is auth-gated and not part of the public-SEO surface).

**`npx tsc --noEmit -p tsconfig.app.json`**: the root `tsconfig.json` is a solution-style config with `"files": []` and project references — running bare `tsc --noEmit` against it type-checks nothing silently (exits 0 having done no work), so I ran it against `tsconfig.app.json` directly to get a real result. **~60 pre-existing type errors exist in the codebase** (mostly `src/portal/*` Supabase query typing — the generated Supabase types resolve to `never` for several table inserts/updates — plus a handful of unused-import/unused-variable warnings scattered across marketing components). **Zero of these are new.** Confirmed two ways:
1. Grepped the full error output for each of the 8 `.tsx` files Phase 1 touched — only `Contact.tsx` and `FAQ.tsx` appear.
2. `git diff` on those two files shows my edits are single-line string replacements (a phone number, a price figure) nowhere near the flagged lines (`Contact.tsx:28`'s unused `setShowSuccess`, `FAQ.tsx:1`'s unused `React` import) — both pre-date this phase.

I did not fix these pre-existing errors — they're outside Phase 1's scope and touching them would mean editing files (and lines) beyond what this phase's tasks called for.

---

## Confirmation checklist

- ✅ Hidden `<article>` block gone (`index.html`)
- ✅ `<noscript>` trimmed to accurate, non-duplicated fallback
- ✅ `aggregateRating` removed from static-shell JSON-LD
- ✅ Both placeholder verification meta tags removed, `TODO(owner)` comments left in their place
- ✅ 150€ → 299€ fixed everywhere it was a live starting-price claim (FAQ.tsx sr+en, index.html ×3)
- ✅ All three fake Trustpilot review sections removed, no dangling imports/state/broken layout
- ✅ NAP unified to `office@aisajt.com` / `+381621552156` everywhere (zero remaining old-value hits, grep-verified)
- ✅ `SEOHelmet.tsx` `@id` collision fixed
- ✅ `/portal/` blocked in `robots.txt`
- ✅ `npm run build` passes
- ✅ `npx tsc --noEmit` shows zero new errors (pre-existing ~60 errors unchanged, none in Phase-1-touched code)
- ✅ No Supabase/HubSpot/portal functionality modified

Stopping here per phase-plan rules. Say **"proceed to Phase 2"** to begin the React Router v7 Framework Mode prerendering work.
