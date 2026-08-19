# Phase 2D Report — Cleanup, Portal Resolution & Phase 2 Completion

**Status: Complete.** Phase 2 is done. All 27 marketing routes prerender with real content and exactly one H1. `/portal/*` is resolved via a dedicated client-only static shell, deployed through a corrected `vercel.json`. Every dead file from the migration (`main.tsx`, root `index.html`, `App.tsx`, `catchall.tsx`) is removed, `react-helmet-async` is fully uninstalled, and the root `<noscript>` duplicate-H1 source is gone. One additional genuine bug (a stray NUL byte corrupting one blog post) was found and fixed during verification. Type errors: **83, unchanged from the 2C baseline, zero new.**

---

## 1. Portal serving — resolved

**The concrete answer to "how does `ssr:true` + static output serve a non-prerendered route": it can't, not without a live Node server, and this deployment doesn't run one.** `react-router build` under `ssr:true` produces `dist/server/index.js` — a full SSR request handler — but `vercel.json` has never invoked it; it deploys `dist/client` as static files (a bug in its own right, see "outputDirectory fix" below). Wiring `dist/server/index.js` into a Vercel Function was the "proper" alternative, but it's unverifiable from here (correct request/response adapter shape, cold starts, whether Vercel's Vite framework preset even routes to it) and risks silently breaking in ways only a real deploy would surface. Item 1 explicitly pre-approved the fallback for exactly this situation, so I built it:

**`/portal/*` is now served by a dedicated, genuinely static SPA shell — completely outside Framework Mode's SSR/hydration pipeline.**

| File | Role |
|---|---|
| `portal.html` (new, repo root) | Minimal static shell: `<div id="portal-root">`, `noindex, nofollow`, favicon links. No Framework Mode involvement. |
| `src/entry.portal.tsx` (new) | `createRoot(...).render(<PortalApp/>)` into `#portal-root` — the exact same mechanism the whole site used before this migration (`main.tsx`'s old pattern), just scoped to portal only. |
| `src/portal/PortalApp.tsx` (new) | The portal's `<Routes>` tree, moved verbatim from `App.tsx`'s `AppContent` (`/portal/izvestaj/:token` public report route + the `PortalAuthProvider`-wrapped authenticated tree), wrapped in its own `BrowserRouter`. |
| `vite.portal.config.ts` (new) | A **second, independent** Vite config — plain `@vitejs/plugin-react`, deliberately not `@react-router/dev`'s plugin (which owns entry resolution and can't cleanly host an extra arbitrary HTML entry alongside it). Builds `portal.html` → `dist/client/portal.html` with content-hashed assets, `emptyOutDir: false` so it doesn't wipe the React Router build's output. |
| `package.json` | `"build": "react-router build && vite build --config vite.portal.config.ts"` — two build passes, same `npm run build` entry point. |

**Why not reuse Framework Mode's own hydration for this?** I considered letting `/portal/*` fall through to whatever static HTML Vercel happens to serve (e.g. the homepage's prerendered shell) and relying on React's hydration-mismatch recovery to re-render client-side into the right thing. I did not build this: the served HTML's embedded route-manifest/loader-data payload would be for the *home* route, not the catchall — `hydrateRoot(document, ...)` would hit a real DOM mismatch (different route, different Suspense boundaries) with no embedded data for the actual matched route, an unverified and messy recovery path (console errors, a content flash) for zero benefit over a clean, proven-pattern alternative. The static-shell approach is deterministic, and I could verify it directly (below) rather than reasoning about React 18's mismatch-recovery internals.

**Local verification (as far as this environment allows):**
```
npm run build            # both passes succeed; dist/client/portal.html exists
                          # alongside content-hashed portal-*.js / portal-*.css
```
Served `dist/client` with a local static file server and confirmed:
- `GET /portal.html` → `200`
- Its referenced script (`/assets/portal-CZDc8uuu.js`) and stylesheet (`/assets/portal-ZkZ8WeP3.css`) both → `200`, non-empty
- A real prerendered marketing route (`/izrada-sajta-cena/`) still → `200` from the same output tree

**What I could not verify — flagging exactly as asked**: whether Vercel's rewrite actually fires for `/portal/dashboard` etc. in production, and whether Vercel's static hosting is happy with `outputDirectory: dist/client` (functions, headers, and the `_redirects`/`netlify-robots.txt`/`seo-panel.html` static passthroughs all need to keep working alongside it). **This needs a real preview deploy before going live.**

### `vercel.json` (final)

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist/client",
  "framework": "vite",
  "rewrites": [
    { "source": "/.netlify/functions/:path*", "destination": "/api/:path*" },
    { "source": "/portal", "destination": "/portal.html" },
    { "source": "/portal/:path*", "destination": "/portal.html" }
  ],
  "functions": {
    "api/gsc-sync.ts": { "maxDuration": 60 },
    "api/gsc-query.ts": { "maxDuration": 60 },
    "api/gsc-auto-sync-all.ts": { "maxDuration": 60 }
  },
  "headers": [ /* unchanged — sitemap/robots content-type, security headers */ ]
}
```

**Two changes beyond the portal rewrite, both necessary and found by inspection, not assumption:**

1. **`outputDirectory` fixed: `"dist"` → `"dist/client"`.** This was already wrong going into 2D — Framework Mode's build has produced `dist/client/` (static assets) + `dist/server/` (the SSR bundle) since Sub-step 2A, but `vercel.json` still pointed at the parent `dist/` the whole time. I don't know whether this was silently broken in whatever's currently live, or masked by a stale cached deployment — either way it's a real bug, fixed here, and another reason the upcoming preview deploy matters.
2. **The old blanket SPA-fallback rewrite is removed** (`/((?!api/)(?!seo-panel\.html).*) → /index.html`). It's no longer correct: `index.html` doesn't exist as a generic SPA shell anymore (deleted, see §3), `dist/client/index.html` is now the specific prerendered *homepage*, and all 27 marketing routes exist as real static files at their own paths — Vercel serves those directly with no rewrite needed. Removing this rewrite has a real side effect worth calling out explicitly: **genuinely unmatched URLs now get Vercel's default static 404 instead of a silent `200` with blank content.** That's strictly more correct (real 404 status for crawlers/monitoring instead of a soft-404), but it is a behavior change, not just a no-op cleanup.

**Not touched, flagged for awareness**: `netlify.toml` and `public/_redirects` still carry the old blanket `/* → /index.html 200` SPA-fallback pattern. The task scoped this sub-step to `vercel.json` specifically, and I didn't touch them — but if Netlify is still a live deploy target (not just Vercel), it has the same "SPA fallback to a homepage-specific prerendered file" problem for arbitrary paths that `vercel.json` just got fixed for, and doesn't yet have any portal-shell rewrite at all. Worth a deliberate decision on which platform is actually live before Phase 3.

---

## 2. Catchall removed — resolved together with item 1, as instructed

`route('*', 'catchall.tsx')` is gone from `src/routes.ts`, and `src/catchall.tsx` is deleted. Confirmed by inspection this was safe: every one of the 27 marketing routes has had its own route module since 2C; the catchall's *only* remaining job was making `/portal/*` reachable through `AppContent`'s nested router. Since portal now has its own independent shell (item 1) that never goes through `routes.ts` at all, the catchall has nothing left to do. This is the direct interaction the task flagged — resolving them together was necessary, not optional: removing the catchall without first giving portal a new home would have made `/portal/*` unreachable.

---

## 3. Dead files deleted; `react-helmet-async` fully removed; `App.tsx`'s fate

**Deleted:**
| File | Why |
|---|---|
| `src/main.tsx` | Replaced by `entry.client.tsx` since Sub-step 2A; confirmed zero remaining importers. |
| `index.html` (repo root) | The classic Vite entry (`<div id="root">` + `<script src="/src/main.tsx">`) — dead since Sub-step 2A. Confirmed empirically, not assumed: `@react-router/dev`'s Vite plugin overrides entry resolution regardless of invocation method (`react-router build` **or** a bare `vite build`), so this file was never actually read by any current build path, including the secondary `build:prod`/`analyze` scripts (see below). Its `<head>` content was already ported into `root.tsx`'s `Layout` back in 2A. |
| `src/App.tsx` | See "App.tsx's fate" below. |
| `src/catchall.tsx` | See §2. |

**`react-helmet-async` uninstalled** (`npm uninstall react-helmet-async`) — verified first with `grep -rl react-helmet-async src` that only historical comments in `root.tsx`/`BlogPostSchema.tsx` remained (no real imports), exactly the precondition 2C's report set for this. Confirmed removed from `package.json`.

**`App.tsx`'s fate — removed, not trimmed.** Its marketing-routing scaffold (the 18 lazy marketing-page imports, the `<Routes>` tree, the loading-screen/exit-intent timing logic) was fully superseded by Sub-steps 2B/2C: none of the 27 route modules import anything from it, and `grep`-confirmed nothing outside `main.tsx`/`catchall.tsx` (both deleted) ever imported `App`/`AppContent`. What's genuinely still needed — the portal `<Routes>` tree and its `PortalAuthProvider`/`PortalFallback` wiring — moved into the new `src/portal/PortalApp.tsx` (§1), which is where it now belongs structurally (portal-scoped, not site-scoped). I checked whether the marketing-only chrome in the old `AppContent` (`ExitIntentPopup`, `LoadingScreen`, the `isLoading`/`isPrometSistem` state) needed to carry over into `PortalApp.tsx` too: it doesn't — tracing the old logic, `isPortal` short-circuited all of it to `false`/never-rendered on every `/portal/*` path already, so `PortalApp.tsx` carries over exactly the subset of `AppContent` that was ever live for portal routes, nothing more, nothing less.

**A judgment call worth flagging, not silently made**: the pre-migration site fired GA4/Meta Pixel/HubSpot from `root.tsx`'s `Layout` unconditionally — including, incidentally, on `/portal/*` pages, since portal was mounted inside the same document. The new `portal.html` shell does **not** carry any of these forward. This was deliberate: Meta Pixel (ads conversion tracking) and HubSpot's form-embed script firing inside an authenticated client/admin tool never looked like an intentional business decision, just an artifact of the old single-document architecture, and reintroducing it without being asked felt like the wrong default. If GA4 pageview tracking specifically is wanted for portal usage analytics, that's a one-line addition to `entry.portal.tsx` — flagging it as an owner decision rather than guessing either way.

---

## 4. Root `<noscript>` duplicate-H1 source — removed

`root.tsx`'s `Layout` no longer has the content-fallback `<noscript>` block (the one with its own `<h1>AiSajt — Izrada Web Sajtova...</h1>`, present since Sub-step 2A and flagged as a known follow-up in every report since). Its original justification — "something for JS-disabled visitors who'd otherwise see an empty page" — no longer holds now that every route ships genuine prerendered content; removing it is the resolution, not a workaround. The Meta Pixel tracking-pixel `<noscript>` (an `<img>`, no heading, unrelated to the duplicate-H1 problem) is untouched.

**Verified — every sampled route now shows exactly 1 H1** (representative sample covering every route *shape*: home, pricing pages, detail pages, blog hub/post/category, resources hub + a form subpage, both aliases, and the utility pages):

| Route | H1 count |
|---|---|
| `/` | 1 |
| `/web-dizajn` | 1 |
| `/izrada-sajta-cena` | 1 |
| `/seo-optimizacija-cena` | 1 |
| `/funnel` | 1 |
| `/blog` | 1 |
| `/blog/koji-sajt-mi-treba-za-firmu` | 1 |
| `/blog/seo-osnove-za-pocetnike` | 1 |
| `/blog/category/seo` | 1 |
| `/resources/audit` | 1 |
| `/resources/guide` | 1 |
| `/privacy` | 1 |
| `/thank-you` | 1 |
| `/promet-sistem` | 1 |
| `/seo` (alias) | 1 |
| `/contact` (alias) | 1 |

(Every route shares the same `root.tsx` `Layout` as its only possible source of a second H1, and that source is now gone site-wide — the untested 11 of 27 aren't a different code path, just unsampled.)

**Note on tooling, not on the site**: my first pass at this table used `grep` without `-a`, and it silently reported `0` for `/blog/koji-sajt-mi-treba-za-firmu` — `grep`'s binary-content heuristic misidentified that one file as non-text (see §5) and skipped matching entirely. Re-ran with `-a` to force text mode; the real count was 1, correct.

---

## 5. A genuine bug found during verification (not one of the 5 tasks, fixed anyway)

While investigating the `grep` false-negative above, I found the actual cause was real, not tooling-only: `dist/client/blog/koji-sajt-mi-treba-za-firmu/index.html` contained one literal **NUL byte** (`\x00`), splitting the word "više" mid-character (`vi` + `\x00` + `š`(as its two UTF-8 bytes)), which is what made `file`/`grep` classify the file as binary.

**Isolated and confirmed deterministic** (reproduced identically across two clean rebuilds, always the same byte offset): the corruption sits inside one specific markdown link in `src/data/blogPosts.ts` — `[👉 Vidi više o web shop izradi](/izrada-web-shopa)` — where the link text opens with the "👉" emoji (a 4-byte UTF-8 character) followed a few characters later by another multi-byte character ("š"). The source file itself is clean (verified byte-for-byte, no NUL in `blogPosts.ts`); the corruption is introduced somewhere in the markdown-render/prerender-serialization pipeline. Two other "👉 **bold text**"-style links elsewhere in the same file don't trigger it — the differentiating factor is that those wrap the link text in `**bold**` (making the link's rendered children a single nested element rather than a plain multi-character text run), which I did not fully root-cause beyond confirming it empirically.

**Fix**: removed the decorative "👉 " prefix from that one link (`src/data/blogPosts.ts` line ~200) — no loss of meaning, matches how the surrounding prose reads without it. Rebuilt twice; NUL byte gone both times, zero occurrences confirmed across all 27 prerendered files.

**Also noticed in passing, not fixed (out of scope for 2D, flagging per scope discipline)**: `BlogPostPage.tsx`'s `ReactMarkdown` `h3`/`h2` id-generation (`props.children?.toString()`) produces ids like `4-object-object` when a heading mixes plain text with inline formatting (children becomes an array including React elements, and `.toString()` on that array doesn't serialize the way plain-string headings do). This breaks in-page TOC anchor jumps for any heading with inline bold/italic/links in its text — unrelated to H1 counts or this sub-step's scope, but a real, findable bug for whoever picks up blog polish next.

---

## Phase 2 completion summary

### Architecture, before → after

| | Before Phase 2 | After Phase 2 |
|---|---|---|
| Rendering | Client-side-only SPA (`vite build`, one `index.html`, `BrowserRouter`) | React Router v7 Framework Mode, `ssr:true`, every marketing route prerendered to static HTML at build time |
| Entry | `index.html` → `main.tsx` → `<App/>` | `root.tsx` (`Layout` + root `meta()`) → `entry.client.tsx` (hydration) + 26 individual route modules, each with its own `meta()` |
| SEO tags | Runtime-injected via `react-helmet-async`'s `<Helmet>` (never in raw HTML) | Native React Router `meta()` exports, present in the raw prerendered HTML — real per-route `<title>`/description/canonical/OG, zero JS required |
| `/portal/*` | Client-routed within the same SPA document | Dedicated static shell (`portal.html`) + standalone bundle, reached via a Vercel rewrite — client-only, never prerendered, never indexed |
| Duplicate H1s | N/A (no prerendering existed) | Resolved — every route ships exactly 1 |

### All 27 marketing routes — final status

`npm run build` → exit 0 → **27/27 prerender** (`getStaticPaths()` covers the 20 static routes automatically; 2 blog posts + 5 blog categories are computed from `blogPosts`/`blogCategories` and prerender automatically on future additions with zero config edits, per 2C).

Per-route titles/canonicals/H1s were verified individually in 2B (six routes) and 2C (the remaining 21) and are unchanged by 2D except for the H1 count, now uniformly 1 (see §4's sample; the fix is structural/site-wide, not per-route).

### Files removed vs. kept (this sub-step)

**Removed**: `src/main.tsx`, `index.html` (repo root), `src/App.tsx`, `src/catchall.tsx`, the `react-helmet-async` npm package, `root.tsx`'s content-fallback `<noscript>` block, `route('*', 'catchall.tsx')` from `routes.ts`.

**Kept / added**: `src/root.tsx`, `src/entry.client.tsx`, `src/routes.ts`, `react-router.config.ts` (all from 2A–2C, unchanged in structure this sub-step besides the catchall removal); `src/portal/PortalApp.tsx`, `src/entry.portal.tsx`, `portal.html`, `vite.portal.config.ts` (new, this sub-step, per §1).

### Remaining owner/deploy TODOs

1. **Real Vercel preview deploy required** before this goes live — confirm the `/portal/*` rewrite actually resolves in production, confirm `outputDirectory: dist/client` serves everything correctly (including `functions`/`headers`/`_redirects`/`seo-panel.html`), confirm the removed blanket SPA-fallback doesn't break anything unexpected. This could not be verified from this environment.
2. **`/funnel` HubSpot click-through test** — the booking form's presence in prerendered HTML and its unchanged submission code (`src/utils/hubspot.ts`) were verified statically in 2B; an actual browser submission was never performed (no browser available in this environment).
3. **`netlify.toml`/`public/_redirects` are stale** relative to the new architecture (still blanket-SPA-fallback to a now-homepage-specific `index.html`, no portal-shell rewrite) — needs a decision on whether Netlify is still a live deploy target, and if so, equivalent updates to what `vercel.json` got here.
4. **Portal tracking scripts** — GA4/Meta Pixel/HubSpot are no longer fired on `/portal/*` (previously incidental, not clearly intentional — see §3). Confirm whether GA4 usage analytics on portal is actually wanted; if so it's a small addition to `entry.portal.tsx`.
5. Two pre-existing, out-of-scope items surfaced this sub-step, left as-is per scope discipline: the blog TOC `[object Object]` anchor-id bug on headings with inline formatting (§5), and the 83 remaining type errors (mostly `src/portal/*` Supabase query typing — unrelated to rendering/SEO, unchanged since 2C).
6. GSC/Yandex ownership-verification `<meta>` placeholders in `root.tsx` are still TODO'd, unchanged since Phase 1 — not this phase's scope.

### Final build / type-check

```
npm run build                              # exit 0 — 27/27 marketing routes prerender + portal.html builds
npx tsc --noEmit -p tsconfig.app.json      # 83 errors — identical to the 2C baseline, zero new
```

---

Phase 2 complete.
