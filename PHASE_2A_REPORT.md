# Phase 2A Report — Framework Mode Scaffold

**Status: BLOCKED. Do not proceed to 2B yet — read this in full first.**

Sub-step 2A's structural scaffold is built and `npm run build` exits 0, but the prerendered output for `/` does not contain real page content. I found and fixed five real, unrelated bugs along the way (all necessary regardless of what happens next), but hit a sixth issue I could not resolve after extensive, rigorous empirical testing: **any component that uses `useLocation`, `useNavigate`, or `<Link>` — React Router's most basic, universally-used primitives — causes the prerendered HTML for that route to come out empty**, stuck as an unresolved React Suspense placeholder. This is not specific to the "catchall renders the whole old app" strategy; it reproduces with a bare 3-line component using nothing but `<Link to="/">`. Since `<Link>` is used throughout the existing codebase (Navbar, Footer, every page), this would block prerendering for any route — not just the ones going through the temporary catchall.

I'm stopping here per the task's explicit rule to report rather than keep guessing. Everything below is what I found, what I already fixed, and what I ruled out.

---

## What was built (files created/changed)

| File | What / why |
|---|---|
| `package.json` | Added `@react-router/dev`, `@react-router/node`, `@react-router/serve` (settled at `^7.18.2` after starting at `^7.13.0` — see "Version bump" below). `@react-router/node` had to be a regular `dependency`, not a `devDependency` (see fix #2). Changed `"build"` script from `vite build` to `react-router build` (see fix #3). |
| `vite.config.ts` | Swapped `@vitejs/plugin-react` for `@react-router/dev/vite`'s `reactRouter()` plugin. Removed the custom `manualChunks` function entirely (see fix #4 — it was corrupting Framework Mode's own internal module wiring). |
| `react-router.config.ts` (new) | `appDirectory: 'src'`, `buildDirectory: 'dist'`, `ssr: false`, `prerender: ['/']`. |
| `src/root.tsx` (new) | Replaces `index.html`. Exports `Layout` (the HTML shell — ported the Phase-1-fixed `<head>` content: favicons, viewport, meta description/OG/robots, canonical, font preconnects, the GA4/Meta-Pixel/HubSpot inline scripts with their `hostname !== 'localhost'` guards, the `ProfessionalService` JSON-LD, and the trimmed `<noscript>` fallback — verified nothing Phase 1 removed was reintroduced) and a default `Root` component (wraps `<Outlet/>` in `HelmetProvider` + `LanguageProvider`, so both the prerender pass and client hydration share identical context wrapping). |
| `src/entry.client.tsx` (new) | Replaces `main.tsx`'s mount logic. `hydrateRoot(document, ...)` (hydrates the whole document — there's no `#root` div anymore) wrapped in `StrictMode` + the existing `ErrorBoundary`. |
| `src/catchall.tsx` (new) | Temporary route (`route('*', 'catchall.tsx')` in `routes.ts`) rendering `<AppContent/>` directly — no nested `<Router>` (see design note below). |
| `src/routes.ts` (new) | One entry: the catchall. |
| `src/App.tsx` | Exported `AppContent` (was module-private). Fixed the loading-screen prerender blocker (see fix #1). |
| `src/contexts/LanguageContext.tsx` | Fixed an SSR-unsafe `localStorage` read in a `useState` initializer (see fix #5). |
| `public/index.html` | **Deleted.** This was Known Gap #20 from the original SEO audit — a stray, broken 5-line fragment. It was clobbering the real prerendered output because both it and Framework Mode's build write to the same `dist/client/index.html` path (see fix #6). |
| `.env` (new, gitignored) | Added locally so `npm run build` can run at all — see "Local environment note" below. Not committed. |

---

## Bugs found and fixed (all real, all necessary independent of the blocker below)

### Fix 1 — Loading-screen overlay (the originally-anticipated risk)
`src/App.tsx`'s `AppContent` returned `<LoadingScreen/>` **instead of** real content whenever `isLoading` was true, and `isLoading` starts `true` — meaning the very first synchronous render (what prerendering captures) always hit this branch. Changed it to always render the real `<Routes>` tree, with `LoadingScreen` layered on top as a fixed, opaque, full-viewport overlay (`fixed inset-0 z-[9999] bg-white`, confirmed from `LoadingScreen.tsx`) only when `isLoading` is true. Visually identical for real users (the overlay still fully covers the page for the same ~800ms); the underlying content now exists in the DOM/prerendered HTML from the first render.

### Fix 2 — `@react-router/node` dependency placement
`@react-router/dev`'s entry-resolution step checks `package.json`'s `dependencies` field specifically (not `devDependencies`) to detect the server runtime, even in `ssr:false` mode (it's needed at *build* time for the prerender pass). Build failed with `Could not determine server runtime` until I moved it. Source: `node_modules/@react-router/dev/dist/vite.js:754`.

### Fix 3 — Build command
`react-router.config.ts` + the `reactRouter()` Vite plugin are inert under a plain `vite build` — prerendering never ran, no error, just a normal client-only Vite build (confirmed by testing: no "Prerender" log line ever appeared). The actual orchestrating command is the `react-router` CLI's own `build` subcommand (`bin: { "react-router": "bin.js" }` in `@react-router/dev`'s `package.json`). Changed `package.json`'s `"build"` script accordingly. (`build:prod` and `analyze` still call plain `vite build` directly — not touched this sub-step, flagging for 2D alongside the `vercel.json` update.)

### Fix 4 — `manualChunks` corrupting Framework Mode's internal wiring
The pre-existing `vite.config.ts` had a manual chunking rule: `if (id.includes('react-router')) return 'router-vendor';`. `@react-router/dev` generates its own internal virtual modules whose ids also match that substring — the rule was sweeping them into the same vendor chunk as `root.tsx`/`catchall.tsx`, and this silently broke the framework's own route-component resolution: the build succeeded, but at prerender time React would throw `Element type is invalid: expected a string ... but got: undefined` trying to render the root route component. Removed the whole `manualChunks` function (flagged in the file for revisiting as Phase 7 performance work, once Framework Mode is fully migrated).

### Fix 5 — `LanguageContext.tsx` reading `localStorage` during the initial render
```tsx
// before — throws during SSR (no localStorage in the Node prerender environment)
const [language, setLanguageState] = useState<Language>(() => {
  const saved = localStorage.getItem('language');
  return (saved === 'en' || saved === 'sr') ? saved : 'sr';
});
```
Node 26 does have an experimental global `localStorage`, but it's non-functional without a `--localstorage-file` flag — `localStorage.getItem` threw `TypeError: Cannot read properties of undefined (reading 'getItem')`, crashing the whole prerender. Fixed to always initialize to `'sr'` (matching what every first-time visitor/crawler already saw anyway, since `localStorage` starts empty for them too) and read the saved preference in a `useEffect` (client-only) that syncs it in after mount. Real users who'd previously switched to English now get one extra render frame at 'sr' before their preference kicks in — a standard, accepted hydration tradeoff.

### Fix 6 — Stray `public/index.html` clobbering the real build output
Flagged as Known Gap #20 in the original SEO audit but not fixed in Phase 1 (out of scope then). Under Framework Mode, this became load-bearing: both this file and the real prerendered homepage resolve to `dist/client/index.html`, and Vite's static-asset copy from `public/` was overwriting the prerendered output with this broken 5-line fragment. Deleted it.

### Also fixed along the way (not separately numbered): `HelmetProvider` CJS/ESM interop
`react-helmet-async` ships CJS with no `exports` map. A plain named import (`import { HelmetProvider } from 'react-helmet-async'`) failed to resolve under Node's ESM loader (used for the prerender server bundle) with `Named export 'HelmetProvider' not found`. A namespace import + destructure (`import * as ns from '...'; const { HelmetProvider } = ns;`) *built* successfully but `HelmetProvider` was still `undefined` at runtime — Node's interop for this package only reliably populates the namespace's `.default` (the whole CJS `module.exports`), not the individual named getters directly on the namespace. Fixed with an explicit `.default` fallback in `root.tsx`:
```ts
import * as HelmetAsyncNS from 'react-helmet-async';
const HelmetAsync = (HelmetAsyncNS as any).default ?? HelmetAsyncNS;
const { HelmetProvider } = HelmetAsync;
```

### Design note: catchall renders `AppContent` directly, not `<App/>`
The task suggested the catchall render the existing `<App/>` component unchanged. `App`'s own definition wraps everything in a `<Router>` (`<BrowserRouter>`). Since the catchall route is already rendered inside Framework Mode's own `<HydratedRouter/>` router context, nesting a second `<Router>` inside it is a known React Router anti-pattern (a literal console warning: *"You rendered a `<Router>` inside another `<Router>`"*). I exported `AppContent` (the part of `App` that doesn't include the `<Router>` wrapper) and render that directly instead, so the existing `<Routes>`/`<Route>` tree reuses the ambient router context rather than creating a conflicting second one. This is a deliberate, reasoned deviation from the literal instruction, not an oversight.

### Local environment note (not a code change, flagging for transparency)
`node_modules` and `.env` didn't exist in this checkout. `npm install` was needed before anything could run. Separately, `src/portal/lib/supabase.ts` calls `createClient(url || '', key || '')` at module scope — even with the existing `''` fallback guard, `@supabase/supabase-js` throws `supabaseUrl is required` on an empty string, which crashed the prerender build (the portal code is still reachable through the catchall's full-app import graph in this transitional phase). I created a local `.env` (gitignored, not committed) using the `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` values already present in `.env.example` (a public anon key, safe to use locally) purely so the build could run at all in this environment. Did not touch `supabase.ts` itself (portal code, out of scope).

### Version bump: `react-router` family `7.13.0` → `7.18.2` (still v7, per your Phase 0 decision)
Discovered mid-debugging that `react-router`/`@react-router/dev`/`@react-router/node` have released a v8 line (`latest` dist-tag is `8.3.0`); the v7 line is still published but only under the `version-7` npm dist-tag (`7.18.2`). I bumped the whole family to `7.18.2` (still v7, not v8 — honors your "stay on v7" decision from Phase 0) as a targeted test for the blocker below, since it matched a known *class* of historical React Router prerendering bug. It did not fix the issue (confirmed on both versions), but I left the bump in place since 7.18.2 is strictly more current/patched than 7.13.0 within the same major version, and there's no reason to roll back. Flagging this as a version change you should be aware of, separate from the blocker itself.

---

## The blocker

**Symptom**: `npm run build` exits 0. `dist/client/index.html` is generated, and its `<head>` is exactly correct (Phase-1-fixed title, description, canonical, OG tags, JSON-LD — all present and correct). But the `<body>` contains only the `<noscript>` fallback content — the actual React-rendered page (everything from `<AppContent/>`/`<HomePage/>`) is completely absent, replaced by React's streaming-SSR "pending" placeholder markup (`<!--$?--><template id="B:0"></template><!--/$-->`) that never resolves into real content in the static file.

**Isolation (each step below is a real, separate build I ran and inspected)**:
1. Trivial catchall (`<div>hello</div>`, no imports) → renders correctly, full pipeline works end-to-end.
2. Full `AppContent` tree → empty output.
3. `<HomePage/>` alone (no `AppContent`, no `<Routes>`) → empty output.
4. `<Hero language="sr"/>` alone → empty output.
5. A 4-line component calling only `useNavigate()` + `useLocation()` (no JSX beyond a `<div>`) → empty output.
6. `useLocation()` alone → empty output.
7. `useNavigate()` alone → empty output.
8. **`<Link to="/">home link test</Link>` alone, nothing else** → empty output.

Step 8 is the cleanest reproduction: a single built-in React Router component, no app code involved at all.

**What I ruled out**:
- Not the catchall-nesting strategy specifically — reproduces with `<Link>` as the *entire* content of the route's own component.
- Not the `7.13.0`→`7.18.2` version gap — reproduces identically on both.
- Not `ssr: false` specifically — I tried `ssr: true` (proper SSR semantics at build time, still fully static output since 100% of served routes would be in `prerender`) both with default lazy route discovery and with `routeDiscovery: { mode: 'initial' }` explicitly — same empty result both times, plus `ssr:true`'s default lazy route discovery introduced a *second*, separate problem (the catchall route didn't even appear in the route manifest, since lazy discovery expects a live `/__manifest` endpoint that doesn't exist for a static prerender).
- Not the `manualChunks`/HelmetProvider/LanguageContext issues — all separately confirmed fixed and building cleanly; this is a distinct, later-stage failure.
- Not a build-time error being swallowed — dev-mode builds (unminified, `NODE_ENV=development`) produce zero warnings or errors for this specific case; it's a silent, "successful" build with wrong output.

**Best-supported explanation** (not fully confirmed — I did not get access to a live debugger inside React Router's internals): React Router's official docs note that streaming Framework Mode renders "a shell first, then continues as Suspense boundaries resolve," and that components reading environment-sensitive values during render can cause "hydration mismatches that leave route trees blank." `<Link>` internally needs to know things like the current URL to compute its active/href state — plausibly, during a *static* prerender pass (as opposed to a live per-request SSR render, where the URL comes from the actual incoming HTTP request), that information isn't available the way `<Link>`'s implementation expects, and React's reconciler falls back to a permanently-pending Suspense state rather than erroring. I could not fully verify this inside React Router's source in the time available, and did not want to keep guessing at more config permutations without a clearer signal, per the task's explicit instruction to stop and report rather than continue guessing.

**Why this matters beyond Sub-step 2A**: this is not a "catchall was the wrong transitional strategy" problem. `<Link>` is used throughout the *entire* existing codebase — Navbar, Footer, internal cross-links on nearly every marketing page. If this is really about `<Link>`/`useLocation`/`useNavigate` specifically (not about the catchall pattern), it would affect Sub-steps 2B and 2C too, once pages are migrated into real route modules — since those pages still use `<Link>` for navigation. This needs to be understood and resolved (or a different rendering strategy chosen) before route-by-route migration in 2B can be expected to actually produce working prerendered output.

---

## Type-check note (transparency, not a new-error claim)

`npx tsc --noEmit -p tsconfig.app.json` now reports 141 errors across 34 files, up from Phase 1's baseline of ~60 across ~19 files. I checked this carefully before writing it here:

- **None of the newly-created Framework Mode files** (`root.tsx`, `catchall.tsx`, `entry.client.tsx`, `routes.ts`, `vite.config.ts`, `react-router.config.ts`) appear anywhere in the error list — zero type errors in the actual Sub-step 2A code.
- The additional errors are concentrated in files that reference `src/types/blog.ts`'s `BlogCategory` type (`BlogCategoryPage.tsx`, `BlogHubPage.tsx`, `BlogPostPage.tsx`) plus a scattering of pre-existing unused-import/unused-variable (`TS6133`) warnings in files that were never individually checked in Phase 1's narrower grep.
- `src/types/blog.ts` has a **pre-existing** (confirmed present, unchanged, since before Phase 1) duplicate declaration: `export type BlogCategory = ...` at line 1 and `export interface BlogCategory {...}` at line 42 — a genuine bug in the existing codebase, not something this sub-step introduced. TypeScript's resolution of which declaration "wins" for downstream property-checking is sensitive to compilation/module-graph order, and adding new files to the graph (root.tsx etc.) appears to have shifted that resolution, changing *which* pre-existing errors surface without any of the underlying code changing.
- I have not fixed `src/types/blog.ts`'s duplicate identifier — it's pre-existing, out of Sub-step 2A's scope, and fixing it belongs with whichever phase touches the blog properly (Sub-step 2C, which migrates `/blog/*` routes).

---

## Build/verify commands run

```
npm run build   # exits 0, but see "The blocker" above — prerendered output is incomplete
npx tsc --noEmit -p tsconfig.app.json   # 141 pre-existing-pattern errors, 0 in new files (see above)
```

---

## What I need from you

I don't think I should keep iterating on config permutations without a clearer signal — I've tried the combinations I could reason my way to (ssr true/false, route discovery modes, version bump, isolating to a single primitive) and they all reproduce the same failure. Options as I see them:

1. **Give me more time to dig into React Router's source directly** (I'd want to trace exactly what `<Link>` does differently during prerendering vs. live SSR — this is doable but will take a while and I can't promise a fix, just better understanding).
2. **Check if this is a recognized issue** — worth a look at React Router's GitHub issues for reports matching "prerender" + "blank"/"empty" + "Link" specifically (I searched and found adjacent-but-not-identical historical bugs; there may be something more specific I didn't surface).
3. **Try a fresh, minimal `create-react-router` reference project** to confirm whether this reproduces outside this codebase entirely (isolates "something about this project" vs. "something about this framework version/setup in general") — I can do this if useful.
4. **Reconsider the rendering approach** — this is the option I'm most hesitant to suggest unprompted since Phase 0 already ruled out the alternatives for good reasons (`vite-react-ssg` pinned to RR v6, `react-snap` on dead tooling), but if this blocker turns out to be fundamental to RR v7 Framework Mode's static-prerender mode specifically, it may be worth knowing before investing more time in 2B/2C.

I'd lean toward option 3 first (cheap, decisive signal) unless you already have a hunch. Let me know how you'd like to proceed.
