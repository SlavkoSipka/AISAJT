# Phase 0 — Verification, File Map & Rendering Research

Read-only phase. No files were modified except this report. Scope: verify `SEO_DISCOVERY_FOR_PLANNING.md` against current code, map exactly what Phase 1 will touch, and research prerendering options for the locked Phase 2.

---

## TASK A — Audit Verification

All eight high-stakes claims were re-checked directly against source. Seven are **confirmed accurate**. One area has a **material drift** the original audit missed — it's more serious than what's currently documented, and it changes what Phase 1 needs to cover.

### 1. Hidden off-screen `<article>` block — CONFIRMED
`index.html:256`:
```html
<article style="position: absolute; left: -9999px; width: 1px; height: 1px; overflow: hidden;">
  <h1>AI Izrada Sajtova Beograd - Profesionalna Izrada Web Sajtova</h1>
  ...
```
Runs through `index.html:337`. Inline `position: absolute; left: -9999px` — exactly the classic off-screen-hiding pattern. Contains a second H1, a duplicate nav, and duplicate service/case-study copy that repeats "izrada (web) sajta" phrasing densely (confirmed keyword-stuffed, per original audit's density read).

### 2. `<noscript>` duplicate block — CONFIRMED
`index.html:202-252`. Separate from the hidden `<article>` — a third independent copy of H1/H2/service copy/case studies, wrapped in `<noscript>`. Ends with an explicit `"JavaScript je potreban..."` message (`index.html:249`). Genuinely only shown to JS-disabled clients, but still an independent third variant of near-identical marketing copy.

### 3. `AggregateRating` in static shell — CONFIRMED, with an important addition (see drift below)
`index.html:172-176`:
```json
"aggregateRating": { "@type": "AggregateRating", "ratingValue": "5", "reviewCount": "50" }
```
Located inside the `ProfessionalService` JSON-LD block (`index.html:68-178`).

### 4. NAP inconsistency — CONFIRMED, and worse than documented
Two phone/email pairs exist, exactly as the audit says, but a **third data point** changes the picture:

| Source | Phone | Email |
|---|---|---|
| `index.html:78-79` (static shell schema) | `+381613091583` | `office@aisajt.com` |
| `index.html:228,334` (noscript/hidden-article visible copy) | `+381 61 3091583` | `office@aisajt.com` |
| `src/components/sections/Hero.tsx:170-171` | — | `office@aisajt.com` / `+381 61 3091583` |
| `src/components/sections/Contact.tsx:157-167` | `+381613091583` (as `tel:` href) | `office@aisajt.com` |
| `src/components/layout/Footer.tsx:60-74` | `+381613091583` | `office@aisajt.com` |
| `src/components/pages/PrivacyPage.tsx:79` | — | `office@aisajt.com` |
| **`src/components/seo/SEOHelmet.tsx:131-132,203-205`** (client-injected schema) | `+381621552156` | `contact@aisajt.com` |
| **`src/components/pages/FunnelPage.tsx:682-683`** (live clickable `tel:` link on the primary conversion page) | `+381621552156` | — |

So this isn't just a schema-only inconsistency: `/funnel` — the page every CTA on the site points to — has a **real, clickable phone CTA card** (`FunnelPage.tsx:680-693`) using `+381621552156`, attributed in the UI to a named person ("Strahinja Zekanovic", via the adjacent image alt text, `FunnelPage.tsx:687`). Every other visible instance of the phone number across the rest of the site (Hero, Contact section, Footer, static shell) uses `+381613091583` / `office@aisajt.com`. This reads like it may be an intentional "call this specific person directly" conversion pattern rather than a pure error — but the `SEOHelmet.tsx` LocalBusiness/Organization schema (used on 5 of the top pages) uses the *personal* number/email pair as the **business's** primary contact point, which is the part that's actually wrong for structured-data purposes: it should match whatever the business considers its canonical NAP, and right now it matches neither the Footer/Contact-section number consistently across all schema instances.
**Flagging for Phase 1 decision, not assuming the fix**: is `+381621552156` a legitimate secondary "direct line" that should stay on `/funnel` as a UI element (fine) while `SEOHelmet`'s schema is corrected to the office number, or is `+381621552156`/`contact@aisajt.com` actually the *current* real number and `office@aisajt.com`/`+381613091583` is the stale one? This needs an owner answer, not a guess (Rule 7).

### 5. `/portal/` crawlability — CONFIRMED
`public/robots.txt:11` disallows `/admin/` — a path that does not exist in the app (real admin routes are nested at `/portal/admin/*`, confirmed via `src/App.tsx:152-191`, e.g. `<Route path="admin" element={...}>` under the `/portal` parent). `robots.txt` has no rule for `/portal/` at all. `grep -rl "noindex\|SEOHelmet\|Helmet" src/portal` returns nothing — zero files under `src/portal/` import any head-management mechanism. Confirmed: `/portal/izvestaj/:token` (public, token-gated, not auth-gated) and `/portal/login` are both live, unauthenticated, and fully crawlable/indexable today.

### 6. Pricing 150€ vs 299€ — CONFIRMED, full occurrence list
"150€" appears as a **starting price claim** in:
- `index.html:11` (meta description), `:15` (og:description), `:76` (schema description), `:99` (schema Offer description), `:206`, `:213`, `:216`, `:225` (noscript/hidden-article body copy)
- `src/components/sections/FAQ.tsx:18` (the routed, visible "Koliko košta izrada sajta?" FAQ answer — this is the highest-visibility instance, since it's rendered on the homepage and is the exact AEO-target answer)
- `src/components/pages/FAQPage.tsx:115,224` — **irrelevant to live output**, this file is one of the six orphaned/unrouted components (§ audit report §3)
- `src/components/pages/PricingPage.tsx:150,242` — also orphaned/unrouted

"299€" appears as the real starting tier on the actual live pricing page:
- `src/components/pages/IzradaSajtaCenaPage.tsx:20` (FAQ answer on that page), `:84` (meta description), `:195` (body copy), `:328` (pricing card, "od 299€"), `:1056` (repeated FAQ answer further down the page)

Two other real prices exist that are consistent and not in conflict: `IzradaSajtaCenaPage.tsx:24,1084` — "50-150€ godišnje" for hosting/domain (a different line item, not the site's starting price — not a conflict). `WebShopPage.tsx:363` — "od 2999€" for web shop tier (different service, not a conflict).
**Net: exactly one live, user-facing inconsistency** — `FAQ.tsx:18` (homepage) says "od 150€" while `IzradaSajtaCenaPage.tsx` (the dedicated pricing page one click away) says "od 299€". The static shell's 150€ mentions are additional instances of the same stale figure, all in content Phase 1 is already touching for other reasons (hidden article/noscript).

### 7. Placeholder verification tags — CONFIRMED
`index.html:13`: `<meta name="google-site-verification" content="google-site-verification=1" />`
`index.html:24`: `<meta name="yandex-verification" content="yandex-verification=1" />`
Both literal placeholder strings, not real tokens.

### 8. `@id` collision in `SEOHelmet.tsx` — CONFIRMED
`SEOHelmet.tsx:127` (`LocalBusiness` node) and `SEOHelmet.tsx:177` (`Organization` node) both use `"@id": "https://aisajt.com/#organization"`.

---

### ⚠️ DRIFT FOUND — more severe than what's in the audit, escalating before Phase 1

The original audit states (§7, §9): *"no testimonial or review UI exists anywhere on the homepage or in any routed page"* and treats the `AggregateRating` schema as unsubstantiated-but-otherwise-inert. **This is incomplete.** A full "Reviews / Recenzije" UI section exists and is live on three routed pages — it was missed because the original audit's grep for review content used the English terms `review`/`Review`/`testimonial`, and this section's visible strings are in Serbian ("Odlično", star icons, "Trustpilot"), while its only English-matching trace is a JSX comment.

**Locations** (identical pattern, localized copy, three separate files):
- `src/components/pages/FunnelPage.tsx:991-1093` (the primary conversion page)
- `src/components/pages/IzradaSajtaDetaljiPage.tsx:406-526`
- `src/components/pages/SEOOdrzavanjeDetaljiPage.tsx:354-474`

**What it actually does**: renders a "Excellent / Odlično" heading, 5 green filled stars, and the text *"Ocenjeno **4.8 / 5** na osnovu recenzija na Trustpilot"* ("Rated 4.8/5 based on reviews on Trustpilot") with a small star icon next to the word "Trustpilot" — styled to visually resemble a Trustpilot rating badge. Below that, a grid of 7 review cards, each with a first-name + last-initial (e.g. "Marko P.", "Nebojša M.", "Nikola K."), a relative date ("pre 3 nedelje" / "3 weeks ago"), a star rating (mostly 5, one 4), a title, and a multi-sentence testimonial body — several of which name a specific person, "Bogdan" (matching the founder named in the site's own `ProfessionalService`/`Organization` schema, `index.html:169`).

**Why this matters more than the original finding**:
1. **"Trustpilot" appears only as plain styled text — confirmed no `<a href>` to any trustpilot.com URL anywhere near it** (checked all three files). It is not a Trustpilot embed/widget, not fetched from any API, not a real link a user or crawler can follow to verify. It's a hardcoded array of review objects (`.map((review, i) => ...)` over a literal array defined inline in the component) styled to *look like* it's sourced from Trustpilot.
2. There is no way, from the code, to determine whether these seven reviews are real (e.g., manually transcribed from an actual Trustpilot profile the agency owns) or fabricated. **This report does not conclude either way** — that determination requires the owner, per Rule 7 ("Do not fabricate business data... no fake reviews... where real data is missing, leave a TODO(owner) — never guess").
3. The displayed rating (**4.8/5**) does not match the static shell's structured-data rating (**5.0/5, "reviewCount": 50**, `index.html:174-175`) — a second, independent rating inconsistency on top of the schema-vs-visible-content gap the original audit flagged.
4. If these reviews are not sourced from a real, verifiable Trustpilot account, displaying them with a Trustpilot-style badge is materially different from — and more serious than — an unsubstantiated schema field. An unbacked `AggregateRating` is a structured-data policy risk; a fabricated-looking review UI visually attributed to a specific named third-party review platform is a consumer-trust and potential misrepresentation risk, on the site's highest-traffic conversion page.

**Recommendation for Phase 1 scope (pending owner confirmation)**: This needs a direct owner answer before any code changes: *(a)* Is there a real Trustpilot (or other platform) account for AiSajt with these or similar reviews? If yes — Phase 1 should add a genuine outbound link/citation to it and correct the rating figure to match. If no — this content needs to come down or be re-labeled as unverified, and the `AggregateRating` schema removal (already planned in Phase 1) should extend to removing/rewriting this UI block too, not just the JSON-LD. I have **not removed or altered anything** — flagging only, per Phase 0's read-only scope. **I recommend asking this before starting Phase 1**, since it changes Phase 1's file list and the ordering of the "remove AggregateRating" task.

---

## TASK B — Phase 1 File Map

Exact files/line-ranges Phase 1 will need to touch, based on Task A's verification. This list intentionally does not include a fix for the reviews-UI drift above until the owner confirms scope.

### 1. Hidden `<article>` + `<noscript>` blocks
- `index.html:202-252` — `<noscript>` block (candidate: keep a trimmed, non-duplicated, accurate version for genuinely JS-disabled visitors; remove duplication of case studies/services already covered elsewhere in the same file, and fix its embedded "150€" instances at `:206,213,216`)
- `index.html:256-337` — hidden off-screen `<article>` (candidate: delete outright, since it's invisible to real users and shaped like the exact pattern search engines' hidden-text heuristics target — no legitimate reason to keep off-screen-positioned duplicate content once rendering is fixed in Phase 2)

### 2. `AggregateRating`
- `index.html:172-176` — the `aggregateRating` object inside the `ProfessionalService` schema (`index.html:68-178`). Candidate: remove the `aggregateRating` key entirely, pending the reviews-UI decision above (if real reviews get a genuine citation, `AggregateRating` could be reinstated later with an accurate, sourced value — not in Phase 1's default scope).

### 3. NAP unification
Needs an owner decision (see drift note) on which phone/email pair is canonical before editing. Files in play once decided:
- `index.html:78-79` (static shell schema)
- `src/components/seo/SEOHelmet.tsx:131-132,203-205` (client schema — also fix the `@id` collision here, `:127` vs `:177`, while touching this file)
- `src/components/pages/FunnelPage.tsx:682-683` (only if the owner says this should NOT be a distinct personal direct-line — otherwise leave as intentional UI, exclude from NAP-unification edits)
- Reference-only, already-consistent, no edit needed: `src/components/sections/Hero.tsx:170-171`, `src/components/sections/Contact.tsx:157-167`, `src/components/layout/Footer.tsx:60-74`, `src/components/pages/PrivacyPage.tsx:79`, `index.html:228,334`

### 4. `/portal/` robots/noindex
- `public/robots.txt:11` — replace/augment `Disallow: /admin/` with `Disallow: /portal/` (keep or drop the dead `/admin/` rule — harmless either way, but should note it targets nothing real)
- **Route-level noindex is not straightforwardly possible today**: no `/portal/*` page imports `SEOHelmet` or `Helmet` (confirmed zero results, `src/portal/`), and because rendering is fully client-side (Phase 2 not yet done), there is no way to guarantee a `noindex` **meta tag** reaches a non-JS-executing crawler for `/portal/*` routes in Phase 1 — robots.txt `Disallow` is the only reliable mechanism available *before* Phase 2. A page-level `<meta name="robots" content="noindex">` could still be added client-side (e.g., reusing `SEOHelmet`'s existing `noindex` prop, or a minimal standalone version for portal pages) as defense-in-depth for JS-executing crawlers, but `robots.txt` is what actually prevents crawling (vs. de-indexing after the fact) and should be treated as the primary fix.

### 5. Pricing "150€" → "299€"
- `src/components/sections/FAQ.tsx:18` — the one live, user-visible inconsistency (homepage FAQ)
- `index.html:11,15,76,99,206,213,216,225` — all already in scope via item 1 above (hidden article/noscript/meta), no separate pass needed
- Excluded (orphaned, not routed, no user ever sees them): `src/components/pages/FAQPage.tsx:115,224`, `src/components/pages/PricingPage.tsx:150,242` — Phase 1 should not spend effort here unless Phase 5 revives these components; flagging only.

### 6. Placeholder verification tags
- `index.html:13` — `google-site-verification` placeholder
- `index.html:24` — `yandex-verification` placeholder
- Candidate: remove both outright (a dummy tag that does nothing is worse than no tag — it's a visible unfinished-setup signal). Re-adding real tokens is a `TODO(owner)` — Search Console/Yandex Webmaster verification requires access the owner has, not something to fabricate.

**Total distinct files touched by Phase 1, as currently scoped**: `index.html`, `src/components/sections/FAQ.tsx`, `src/components/seo/SEOHelmet.tsx`, `public/robots.txt`, plus conditionally `src/components/pages/FunnelPage.tsx` pending the NAP decision, plus conditionally the three reviews-UI files pending the Trustpilot-content decision. **5-8 files depending on those two owner decisions** — above the "commit before touching >5 files" threshold in the non-negotiable rules either way, so a pre-Phase-1 commit checkpoint applies regardless of how the open questions resolve.

---

## TASK C — Rendering Research & Recommendation

### Current state, confirmed from the lockfile and source
- `react-router-dom` / `react-router`: resolved version **7.13.0** (package.json range `^7.9.6`; current npm-published latest is 7.18.2 — the project is a few minor versions behind but solidly on the v7 line, not v6, not a v8 that doesn't exist yet)
- `vite`: resolved version **7.3.2**
- `react` / `react-dom`: **18.3.1**
- Mode: **Declarative Mode** — confirmed by `src/App.tsx:2` (`import { BrowserRouter as Router, Routes, Route, ... } from 'react-router-dom'`) and by the complete absence of any `react-router.config.ts`, `@react-router/dev` dependency, or `createBrowserRouter`/`RouterProvider` usage anywhere in the repo. This is the simplest of React Router v7's three modes (declarative / data / framework) — no data-loading abstraction, no build-time route config, routes are just JSX.

### Option 1 — React Router v7 native prerendering (Framework Mode)

React Router v7 ships three modes: **Declarative** (what this app uses today — `<BrowserRouter>`/`<Routes>`/`<Route>`, client-only, no build integration), **Data** (`createBrowserRouter` + `RouterProvider`, adds loaders/actions but still no build-time rendering), and **Framework** (wraps Data Mode with React Router's own Vite plugin, adding typed route modules, code splitting, and SPA/SSR/**static-prerendering** strategies). **Build-time prerendering is a Framework Mode-only capability** — Declarative Mode has no path to static output on its own; there is no "just add a prerender flag" option within the mode this app currently uses.

**What adopting Framework Mode requires** (per React Router's own migration guide):
- One-time setup: install `@react-router/dev` (+ `@react-router/node`), swap the Vite plugin from bare `@vitejs/plugin-react` to `[react(), reactRouter()]` (additive, not a replacement — low risk to the existing Tailwind/PostCSS pipeline), add a `react-router.config.ts`, and — the biggest structural change — **`index.html` is replaced by `src/root.tsx`** (a component containing `<Layout>`, `<Meta>`, `<Links>`, `<Scripts>`), and `src/main.tsx` is replaced by `src/entry.client.tsx` rendering `<HydratedRouter/>` instead of `<BrowserRouter>`.
- **Direct consequence for sequencing**: every fix Phase 1 makes to `index.html` (removing the hidden article, fixing meta/schema, removing placeholder tags) will need to be **re-applied inside `root.tsx`** during Phase 2's setup step, not copy-pasted verbatim, since the file itself goes away. This is exactly why doing Phase 1 first is correct — fix the content once, port the *fixed* version forward, rather than fixing `index.html` and then fixing it again in `root.tsx`.
- Route migration is **officially incremental**: a temporary catchall route (`route("*?", "catchall.tsx")`) can render the existing `<App/>` component unchanged while individual routes are migrated one at a time into typed route modules (`export default function Component({ loaderData }) {...}`). Only routes that have actually been migrated into a route module are prerenderable — the catchall-rendered legacy routes are not. Since this site's whole point is fixing indexability for essentially all ~20 marketing routes, incrementality helps de-risk the *rollout* (ship with a few high-value routes prerendered first, expand from there) but does not reduce the total migration surface if the end goal is "every marketing route ships real HTML" — most page components will eventually need to become route modules.
- Vite version requirement: `@react-router/dev` now requires **Vite 7+** — this project is already on Vite 7.3.2, so **no Vite up/downgrade is needed**, which is a genuine point in this option's favor versus the other two.
- `SEOHelmet`'s `useEffect`-based `document.head` mutation would need to be **replaced**, not kept: Framework Mode route modules have a native `meta()` (and `links()`) export per route that both SSR and the prerender pass use directly — this is the intended, supported mechanism, and it's a strictly better fit than porting the current DOM-mutation hack forward. This is real rewrite work across every page component's meta-setting code, but it replaces a hand-rolled, non-standard pattern with the framework-native one.
- **Effort**: high — this is adopting a different (if closely related) meta-framework, not a config flag. **Risk**: moderate — the toolchain match (Vite 7 required, Vite 7 already in use; official incremental-adoption path exists) reduces integration risk, but the surface area (root.tsx replacing index.html, entry.client.tsx replacing main.tsx, every route becoming a route module, every `SEOHelmet` call being rewritten as `meta()`) is large and will need its own multi-step plan when Phase 2 starts. **Maintenance**: best of the three — this is the actively-developed, officially-recommended path for a React Router v7 app specifically (confirmed: React Router's own team steers v7 users toward native SSG over third-party tools).

### Option 2 — `vite-react-ssg`

Checked directly against the npm registry (authoritative source, not blog summaries — see note below): latest published version is **0.9.2**, with peer dependencies:
```
"vite": "^6.4.0 || ^7.3.0 || ^8.0.0"
"react": "^17.0.2 || ^18.0.0 || ^19.0.0"
"react-dom": "^17.0.2 || ^18.0.0 || ^19.0.0"
"react-router-dom": "^6.14.1"   ← blocking issue
```
Vite (7.3.x) and React (18.x) both match this project cleanly. **`react-router-dom` does not** — `vite-react-ssg` 0.9.2 is pinned to React Router **v6**, not v7. A general web search initially suggested vague "remains compatible with React Router v7" language, but that does not match what the package's own published `peerDependencies` actually declare, and the registry is the authoritative source here — trust the manifest over the summary. Also worth noting: `vite-react-ssg` depends on `react-helmet-async@^1.3.0` internally, while this project already uses `react-helmet-async@^2.0.5` — a second, secondary version mismatch on top of the router issue.

Adopting this option would require **downgrading `react-router-dom` from 7.13.0 to a 6.x line** — a real backward migration (different route-matching internals, different relative-path/splat semantics, hooks that changed between v6 and v7) with its own regression risk, undertaken specifically to adopt a third-party tool, while moving the app's core router *backward* a major version at the same time a competing, forward-compatible, officially-supported option (Option 1) exists for the exact version already installed. This is a bad trade on its face.

If `vite-react-ssg`'s head-management approach were used, it does rely on `react-helmet-async`'s SSR-collection pattern (`<Helmet>` JSX + `helmetContext`, not `useEffect`/DOM mutation) — meaning `SEOHelmet.tsx` would need the same kind of rewrite as Option 1 (away from direct DOM mutation), just targeting `<Helmet>` instead of a `meta()` export.

**Effort**: high, and partly wasted (a v7→v6 router downgrade is not reusable work). **Risk**: high — downgrading a core dependency that's already a major version ahead, for a smaller, single-maintainer package, is a worse risk profile than moving forward with the framework the app already depends on. **Not recommended given the current peer-dependency reality.**

### Option 3 — `react-snap`

Checked directly against the npm registry: latest published version is **1.23.0**, with a dependency on **`puppeteer: ^1.8.0`**. Puppeteer 1.x targeted Chrome as it existed around 2018-2019; the current Puppeteer major version is in the low-20s as of 2026. A tool whose core headless-Chrome dependency is pinned 20+ majors behind current is a strong, concrete signal of an effectively unmaintained package — not just "older," but frozen at a point that predates most of the last several years of Chromium/Node ecosystem changes. No deprecation notice is set on the npm package itself, but the dependency staleness speaks for itself.

Being framework-agnostic (it crawls the *built output* with a real browser, rather than integrating with the router or Vite at all) is a genuine advantage: it doesn't care that this app is React Router v7 in Declarative Mode, and there's no router-version compatibility question at all — the lowest integration risk of the three options in that specific narrow sense.

However: the README documents no built-in mechanism for waiting out this app's artificial rendering delay (`App.tsx:76-101`'s `setTimeout`-gated `LoadingScreen`, ~600-800ms before real content mounts) — its async-handling guidance is about code-splitting/lazy-loaded *components*, not about waiting past a fixed timer before snapshotting. Puppeteer *would* execute the app's `useEffect` hooks (including `SEOHelmet`'s current DOM-mutation approach) since it's a real browser, unlike Options 1/2 which perform actual server-side/build-time React rendering that never runs browser-only effects — so, notably, **`SEOHelmet` would keep working essentially as-is under `react-snap`**, the one option of the three where no head-management rewrite is strictly required. That's a real point in its favor on integration effort, offset by needing custom wait-logic (patching around the fixed setTimeout, or configuring Puppeteer's own wait conditions) to avoid snapshotting the loading screen instead of real content, which isn't a documented, supported feature of the tool — it would be a workaround built on top of unmaintained software.

**Effort**: low-to-moderate for initial integration (no router migration, `SEOHelmet` mostly works unchanged), but with real hidden cost in getting the render-delay handling right, and ongoing risk from depending on frozen tooling (an old Puppeteer pin can mean broken installs on newer Node versions, no security patches, no one to file issues with). **Risk**: the lowest *integration* risk, but the highest *tooling-longevity* risk of the three — adopting essentially-abandoned software as a permanent part of the build pipeline for a business-critical site.

### Recommendation

**React Router v7 Framework Mode (Option 1)** is the right target, despite being the most invasive:
- It's the only option that doesn't fight the app's actual, current dependency (`react-router-dom@7.13.0`) — Option 2 requires a backward migration to v6 that's a bad trade against a viable forward-compatible alternative; Option 3 requires depending on tooling pinned to a 7-year-old Puppeteer.
- It's the officially maintained, forward path for a React Router v7 app specifically — not a third-party project bridging an old router version, not a stale headless-Chrome wrapper.
- The Vite-version alignment (both already on Vite 7) removes what would otherwise be a real integration cost.
- React Router's own incremental-migration path (catchall route + one-route-at-a-time route-module conversion) means Phase 2 doesn't have to be one atomic all-or-nothing rewrite — it can be sequenced as its own set of sub-steps (initial scaffold → migrate highest-value routes first: `/`, `/izrada-sajta-cena`, `/seo-optimizacija-cena`, `/web-dizajn`, `/izrada-web-shopa`, `/funnel` → then the rest → then blog → then decide what, if anything, happens to `/portal/*`, which should almost certainly stay client-only/unprerendered given Phase 1's `robots.txt` exclusion).

The honest tradeoff to flag: this is genuinely more work than the other two options, and it touches nearly every routing-related file in the app (root.tsx, entry.client.tsx, routes.ts, every page component's meta-setting code). Given the phase plan already treats "Phase 2 — Prerendering" as its own phase, I'd expect Phase 2 itself to need internal sub-steps/checkpoints rather than landing as a single pass — worth deciding explicitly when Phase 2 starts, not assumed now.

**This is a recommendation, not a decision — per the task instructions, the final call is the owner's.**

Sources consulted: [React Router — Picking a Mode](https://reactrouter.com/start/modes), [React Router — Migrating to Framework Mode guidance](https://reactrouter.com/upgrading/component-routes), npm registry manifests for `vite-react-ssg@0.9.2` and `react-snap@1.23.0` (fetched directly from `registry.npmjs.org`), npm registry `dist-tags` for `react-router-dom` (confirms latest is 7.18.2, v7 line, no v8 exists).

---

## Plan for Phase 1 (pending "proceed to Phase 1")

Phase 1 will fix, in `index.html`: delete the hidden off-screen `<article>` block outright and trim the `<noscript>` block to a single accurate, non-duplicated fallback (correcting its "150€" mentions in the process); remove the unsubstantiated `aggregateRating` from the static-shell JSON-LD; remove both placeholder verification `<meta>` tags; and correct `FAQ.tsx:18`'s "150€" to "299€" to match the live pricing page. It will add `Disallow: /portal/` to `robots.txt` as the primary (pre-Phase-2) defense against portal crawlability. **Two items are blocked on owner input before Phase 1 starts**: (1) which phone/email pair is the business's actual canonical contact info, so `SEOHelmet.tsx`'s schema (and its `@id` collision) can be corrected without guessing, and whether `FunnelPage.tsx`'s distinct direct-line number is intentional and should be left alone; and (2) whether the "4.8/5 on Trustpilot" reviews section on `FunnelPage.tsx`, `IzradaSajtaDetaljiPage.tsx`, and `SEOOdrzavanjeDetaljiPage.tsx` is backed by a real, linkable review source — if not, it needs to be taken down or clearly re-labeled as part of Phase 1, not left in place while only its schema counterpart gets removed. I'd like answers to both before starting Phase 1, since they change its file list. Once resolved, I'll ask for a pre-Phase-1 commit checkpoint (per the non-negotiable rules, since the file count will be 5+ either way) and then proceed.
