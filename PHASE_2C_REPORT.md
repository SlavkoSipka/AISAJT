# Phase 2C Report — Remaining Marketing Routes Migrated

**Status: Complete.** Every marketing route (20 static + 2 blog posts + 5 blog categories = 27 total) now has a real Framework Mode route module and prerenders to genuine static HTML. `/portal/*` remains correctly excluded. Fixed one genuine SSR-crash bug (`LeadMagnetDownloadPage`), one genuine duplicate-H1 bug (blog post markdown), migrated `BlogPostSchema` off `react-helmet-async`, and fixed the pre-existing `BlogCategory` duplicate-identifier bug (141 → 83 type errors).

---

## Files created/changed

**New route modules** (14 files, thin wrappers matching the 2B pattern): `izradaSajtaDetalji.tsx`, `seoOptimizacijaDetalji.tsx`, `resources.tsx`, `resourcesQuiz.tsx`, `resourcesAudit.tsx`, `resourcesGuide.tsx`, `resourcesChecklist.tsx`, `blogHub.tsx`, `blogPost.tsx`, `blogCategory.tsx`, `privacy.tsx`, `terms.tsx`, `thankYou.tsx`, `prometSistem.tsx`. Aliases (`/seo`, `/contact`) reuse the existing `seoOptimizacijaCena.tsx`/`funnel.tsx` files — no new files needed for those, just extra `route()` entries in `routes.ts`.

**Other changes**:

| File | What / why |
|---|---|
| `src/routes.ts` | All 21 `route()`/`index()` entries now registered (up from 6). Alias routes (`seo`, `contact`) needed an explicit `{ id: '...' }` since RR auto-derives route ids from the file path, and two routes pointing at the same file collided (build failed with `Unable to define routes with duplicate route id` until I added `id: 'seoAlias'` / `id: 'contactAlias'`). |
| `react-router.config.ts` | `prerender` changed from a hardcoded array to the dynamic-function form: `async ({ getStaticPaths }) => [...getStaticPaths(), ...blogPostPaths, ...blogCategoryPaths]`. `getStaticPaths()` auto-covers every static `route()` entry (so 2B's six routes didn't need to be re-listed by hand), and blog paths are computed directly from `blogPosts`/`blogCategories` — a new post or category prerenders automatically with zero config edits. |
| `src/components/pages/LeadMagnetDownloadPage.tsx` | **Fixed a real SSR crash.** Was reading `window.location.pathname` at the top of the component body (render time, not an effect) to decide guide-vs-checklist content. Added an optional `magnetType` prop; the two new route modules (`resourcesGuide.tsx`/`resourcesChecklist.tsx`) each pass it explicitly, eliminating the `window` read entirely for the migrated path. Kept the old `window.location`-based detection as a guarded (`typeof window !== 'undefined'`) fallback for safety, not removed. |
| `src/components/pages/BlogPostPage.tsx` | **Fixed a real duplicate-H1 bug**, found during verification (see below) — `ReactMarkdown`'s `components` prop now maps `h1: () => null`. |
| `src/components/blog/BlogPostSchema.tsx` | Migrated off `react-helmet-async`'s `<Helmet>` to a raw JSX `<script>` tag (same pattern `FAQ.tsx` already used) — per the task's explicit instruction, since `<Helmet>`'s output was never reaching the prerendered response anyway. |
| `src/root.tsx` | Removed the now-unused `HelmetProvider` wrapping and its CJS-interop shim (dead weight in the live module graph — see "react-helmet-async decision" below). |
| `src/types/blog.ts` | Fixed the pre-existing duplicate `BlogCategory` declaration (see below). |
| `src/data/blogCategories.ts` | Updated to import/use the renamed `BlogCategoryInfo` type; fixed `getCategoryById`'s signature accordingly. |

---

## Blog dynamic routes

`routes.ts`:
```ts
route('blog/category/:categorySlug', 'blogCategory.tsx'),
route('blog/:slug', 'blogPost.tsx'),
```
(category route listed first — not load-bearing given RR's specificity-based matching, but avoids any ambiguity about a category slug being mistaken for a post slug.)

`react-router.config.ts`'s `prerender` function computes the actual paths from the live data:
```ts
prerender: async ({ getStaticPaths }) => {
  const blogPostPaths = blogPosts.map((post) => `/blog/${post.slug}`);
  const blogCategoryPaths = blogCategories.map((category) => `/blog/category/${category.slug}`);
  return [...getStaticPaths(), ...blogPostPaths, ...blogCategoryPaths];
},
```
Confirmed working — the build log shows all 2 posts and 5 categories prerendered by slug, generated from the same arrays the pages themselves read (`src/data/blogPosts.ts`, `src/data/blogCategories.ts`), so adding a new post/category to those files is sufficient for it to prerender on the next build with no other change required.

Each dynamic route's `meta()` reads the matched `params` to look up the specific post/category and build accurate per-page title/description/canonical/OG (with a generic blog-hub-level fallback if a param somehow doesn't resolve, matching `BlogPostPage`'s own `<Navigate to="/blog" />` fallback behavior for unknown slugs). Blog post `meta()` additionally sets `ogImage` to the post's real cover image (`post.coverImage`) instead of the site default — the per-post `SEOHelmet` call already intended this via an `image` prop, but that prop doesn't exist on `SEOHelmetProps` (a pre-existing, separate bug — see "Observations" below), so this is the first time it's actually taken effect.

---

## `src/types/blog.ts` — duplicate `BlogCategory` fixed (141 → 83 errors)

This was the actual root cause of the majority of the pre-existing type-error set flagged in every report since 2A. Two conflicting declarations shared one name:
```ts
export type BlogCategory = 'seo' | 'izrada-sajtova' | 'web-dizajn' | 'web-shop' | 'case-studies'; // line 1 — a string union (category IDs)
export interface BlogCategory { id: BlogCategory; name: string; ... }                              // line 42 — a full category object shape
```
`blogCategories.ts` uses the *object* meaning (`blogCategories: BlogCategory[]` — an array of full `{id, name, nameEn, slug, icon, ...}` objects), while `BlogPost.category: BlogCategory` uses the *string* meaning. TypeScript's resolution of which declaration wins for a given reference is sensitive to compilation order — which is exactly why the error surface shifted between reports without the underlying code changing (confirmed in 2A/2B).

**Fix**: renamed the object-shape interface to `BlogCategoryInfo`, updated `blogCategories.ts`'s import and array typing (`blogCategories: BlogCategoryInfo[]`), and fixed `getCategoryById`'s signature (was `(id: BlogCategory['id'])` — nonsensical after the rename since a string union has no `['id']` — now correctly just `(id: BlogCategory)`). No consuming file (`BlogCategoryPage.tsx`, `BlogHubPage.tsx`, `BlogPostPage.tsx`) needed changes — none of them explicitly imported/annotated with `BlogCategory`; they all use inferred types from `getCategoryBySlug()`/`getCategoryById()`/the `blogCategories` array, which resolve correctly once the name collision is gone.

**Verified**: `npx tsc --noEmit -p tsconfig.app.json` went from 141 to 83 errors immediately after this fix, before any of the rest of this sub-step's work. The remaining 83 are unrelated pre-existing issues (mostly `src/portal/*` Supabase query typing, plus scattered unused-import warnings) — confirmed unchanged by everything else done in this sub-step (see "Type-check" below).

---

## `react-helmet-async` decision

**Removed the `HelmetProvider` wrapping from `root.tsx` now; left the npm package installed.**

After migrating `BlogPostSchema.tsx` (the only remaining real consumer) to a raw `<script>` tag, I checked: `grep -rl "react-helmet-async" src` returns only `main.tsx`, `root.tsx`, and `BlogPostSchema.tsx`. `main.tsx` is dead code — not part of the live build (nothing imports it; `entry.client.tsx` replaced it back in Sub-step 2A), scheduled for deletion in Sub-step 2D per the original phase plan. In the **live** module graph (everything actually reachable from `entry.client.tsx` → `root.tsx` → routes → pages), nothing uses `<Helmet>` anymore once `BlogPostSchema.tsx` was migrated — so `HelmetProvider` in `root.tsx` was provisioning a context with zero consumers. That's genuinely dead weight in a file that's part of the active build, so I removed it now (low-risk, one file, immediately verifiable by the build).

I did **not** uninstall the `react-helmet-async` npm package itself — `main.tsx` still imports it, and even though that file is unused at runtime, it's still part of the TypeScript compile graph (`tsc --noEmit -p tsconfig.app.json` would fail to resolve the import if the package were gone). Full removal (delete `main.tsx`, then uninstall the package) is Sub-step 2D's job, where `main.tsx`'s removal was already planned.

---

## SSR-safety guards

**One real fix needed**: `LeadMagnetDownloadPage.tsx`'s `window.location.pathname` read at render time (detailed above) — this would have crashed the build exactly like `LanguageContext.tsx` did in Sub-step 2A, for the same reason (no `window` in the Node prerender environment). Caught by testing rather than a line-by-line audit first; fixed by passing `magnetType` as an explicit prop from each route module instead of URL-sniffing.

**Swept the rest of this batch's page components** (`QuizPage`, `AuditFormPage`, `PrometSistemPage`, `ResourcesPage`, `BlogHubPage`, `BlogCategoryPage`, `BlogPostPage`, `IzradaSajtaDetaljiPage`, `SEOOdrzavanjeDetaljiPage`, `PrivacyPage`, `TermsPage`, `ThankYouPage`) for `window`/`document`/`localStorage`/`sessionStorage` access — every other occurrence is inside a `useEffect` or an event-listener callback (mousemove/scroll handlers, the `ThankYouPage` PDF-auto-download logic), matching the established safe pattern from `Hero.tsx`/`YouTubeVideo.tsx` in earlier sub-steps. None needed changes.

**Signal for future phases**: two sub-steps in, exactly one genuine SSR-unsafe render-time browser-API read has turned up (`LeadMagnetDownloadPage`), always the same shape (URL/storage state read directly into a `useState`/variable at the top of a component instead of via a prop or a guarded effect). Worth keeping in mind if any later phase adds new page components.

---

## Duplicate-H1 finding — a real per-page bug, not the known noscript issue

Every route shows exactly 2 H1s (the expected `root.tsx` noscript-fallback duplicate, flagged as a known 2D cleanup item since the 2A retry) — **except** `/blog/koji-sajt-mi-treba-za-firmu`, which showed **3**. Investigated per your explicit instruction to fix genuine per-page duplicates rather than wave them through:

Both of the site's two blog posts' markdown `content` fields open with a `# Title` line that exactly duplicates `post.title` — which `BlogPostPage.tsx` *also* renders explicitly as a real `<h1>` immediately above the article body. `ReactMarkdown`'s `components` override handles `h2`/`h3`/`h4`/`p` specially but had no `h1` entry, so the markdown's leading `# ...` rendered as a second, fully redundant `<h1>` with identical text to the first. Fixed with `h1: () => null` in the override — verified both posts now show exactly 2 H1s (the same expected noscript duplicate as every other route, nothing more). No content was lost — the suppressed heading was a mechanical restatement of the title already shown.

---

## Observation (not fixed, flagging per scope discipline)

Confirmed the same `SEOHelmet` prop-name bugs already known from type-check output continue to exist, unrelated to this sub-step's work: `BlogHubPage.tsx` and `BlogCategoryPage.tsx` pass `image="..."` (not the real `ogImage` prop `SEOHelmetProps` actually declares), and `BlogPostPage.tsx` additionally passes a nonexistent `article={{...}}` prop. These have never worked and don't regress anything here — `SEOHelmet` is `useEffect`-only and doesn't prerender regardless, and the new `meta()` exports for these three routes use the *correct* field name (`ogImage`) independently, so the migrated routes' OG images are actually correct in the prerendered output despite `SEOHelmet` itself still carrying the old broken props. Leaving `SEOHelmet`'s calls as-is (out of scope; it's harmless dead weight now that its title/description/canonical/OG output is superseded by `meta()`, and its FAQ/business-schema injection on other pages is still real and still client-side-only, unaffected either way).

---

## Verification — representative sample

`npm run build` → exit 0 → 27 `Prerender (html):` lines, including all 2 blog posts and 5 blog categories.

| Route | `<title>` | Canonical | H1 count |
|---|---|---|---|
| `/izrada-sajta-detalji` | `Izrada Sajta Beograd, Srbija \| Šta ti donosi dobar sajt? \| AiSajt` | `.../izrada-sajta-detalji` | 2 |
| `/resources` | `Resursi za Web Development \| Vodič, Kviz, Audit \| AISajt` | `.../resources` | 2 |
| `/resources/audit` (has a form) | `Besplatan Audit Sajta \| Analiza Performansi i SEO \| AISajt` | `.../resources/audit` | 2 |
| `/resources/guide` (has a form) | `Besplatan Vodič za Izradu Sajta \| AISajt` | `.../resources/guide` | 2 |
| `/blog` | `Blog \| SEO, Web Dizajn i Izrada Sajtova Saveti \| AiSajt` | `.../blog` | 2 |
| `/blog/koji-sajt-mi-treba-za-firmu` | `Koji Sajt Mi Treba za Firmu? Kompletan Vodič za Izbor Pravog Web Sajta \| AiSajt` | `.../blog/koji-sajt-mi-treba-za-firmu` | **2** (was 3 pre-fix) |
| `/blog/category/seo` | `SEO Blog \| Strategije i Saveti za Optimizaciju \| AiSajt` | `.../blog/category/seo` | 2 |
| `/privacy` | `Politika Privatnosti \| AiSajt` | `.../privacy` | 2 |
| `/seo` (alias) | `SEO Optimizacija Cena \| ...` | **`.../seo-optimizacija-cena`** (not self-referencing — correct) | 2 |
| `/contact` (alias) | `Izrada Sajta Beograd \| Besplatna Ponuda i Konsultacija \| AiSajt` | **`.../funnel`** (not self-referencing — correct) | 2 |
| `/thank-you` | inherits root default (no own `meta()` — matches pre-migration behavior, it never had `SEOHelmet` either) | `https://aisajt.com` (root default) | 2 |

Forms confirmed present in raw prerendered HTML (`grep -c "<form"` → 1) on both `/resources/audit` and `/resources/guide`. `BlogPosting` JSON-LD confirmed present and correct in the blog post's raw HTML (alongside the root `ProfessionalService` schema) — direct confirmation the `react-helmet-async` → raw-`<script>` migration worked. Zero `Application Error` boundary output across all 27 routes. File sizes are consistent and non-trivial across the board (16 KB–224 KB); `/seo` and `/seo-optimizacija-cena` are byte-identical in size, as are `/contact` and `/funnel`, confirming the aliases render the exact same content as their canonical targets.

`/portal/*`: confirmed zero portal HTML files exist under `dist/client` — correctly excluded, exactly as intended (it was never given a `route()` entry in `routes.ts` at all, so `getStaticPaths()` can't include it even implicitly).

---

## Build / type-check

```
npm run build                              # exit 0, 27/27 routes prerender correctly
npx tsc --noEmit -p tsconfig.app.json      # 83 errors (down from 141 — the BlogCategory fix), 0 new
```
Confirmed the two errors that do appear in files this sub-step touched (`BlogPostPage.tsx`, lines 77 and 274) are both pre-existing — present at the same locations (line 268, an 6-line shift from my `h1: () => null` insertion) in the type-check run taken immediately after the `BlogCategory` fix, before any route-module work began. Zero errors in any of the 14 new route module files, `routes.ts`, `react-router.config.ts`, or `root.tsx`.

---

Stopping here per the sub-step boundary. Sub-step 2D remains: remove the catchall (now only needed for `/portal/*`), delete dead `main.tsx`, decide `App.tsx`'s fate, fully remove `react-helmet-async`, clean up the root `<noscript>` duplicate-H1 source now that every route ships real content, and resolve the `vercel.json` / `/portal/*`-serving question flagged since the 2A retry. Say **"proceed to 2D"** when ready.
