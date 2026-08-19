# Phase 2A Retry Report — `ssr:true` + Real Route Module

**Verdict: PATH FOUND.** `ssr:true` + a real route module for `/` + `routeDiscovery: { mode: 'initial' }` produces genuine, complete prerendered HTML — real H1, real body content, real head/meta, and even a bonus win (FAQPage JSON-LD now server-rendered). The `ssr:false` static-prerender path is confirmed dead for this codebase; this is the way forward for 2B/2C.

---

## What changed from the `ssr:false` attempt

| File | Change |
|---|---|
| `react-router.config.ts` | `ssr: false` → `ssr: true`. Added `routeDiscovery: { mode: 'initial' }` (disables lazy route discovery, which expects a live `/__manifest` endpoint that doesn't exist for a static site). `prerender: ['/']` unchanged. |
| `src/home.tsx` (new) | A real Framework Mode route module for `/` — `export default function Home() { return <HomePage />; }`. This is the intended end-state pattern (what 2B/2C will do for every other route), not the transitional catchall. |
| `src/routes.ts` | Added `index('home.tsx')` alongside the existing `route('*', 'catchall.tsx')` — `/` now resolves through the real route module; everything else still falls through to the catchall unchanged, exactly as before. |

No SSR-safety audit of `HomePage`'s import tree was needed beyond what Sub-step 2A had already fixed (the `LanguageContext` `localStorage` guard, the `LoadingScreen` overlay change) — it built and rendered correctly on the first `ssr:true` attempt with no further guarding required. I did not preemptively audit `Hero`/`Navbar`/`Footer`/`FAQ`/etc. for additional browser-only access since the build succeeded with real content on the first try; if 2B/2C surface a similar issue on a different page, the fix pattern is now established (move browser API reads into `useEffect`, or guard with `typeof window !== 'undefined'`).

All six fixes from the original Sub-step 2A report are unchanged and still in place (`@react-router/node` dependency placement, build command, `manualChunks` removal, `HelmetProvider` CJS interop, the stray `public/index.html` deletion, the `react-router` family version bump to `7.18.2`). None of that work was wasted.

---

## Verification — prerendered `/` HTML

`npm run build` → exit 0 → `Prerender (html): / -> dist/client/index.html`.

**`<title>`**: `Izrada Web Sajta | Izrada Sajtova | Izrada Sajta Cena Beograd` — correct (Phase 1's fixed value, root-level default since no `meta()` export exists yet — that's 2B's work).

**`<link rel="canonical">`**: `https://aisajt.com` — correct.

**`<meta name="description">`**: Phase-1-fixed 299€ copy — correct.

**JSON-LD — two blocks, both real and server-rendered**:
1. `ProfessionalService` (from `root.tsx`, expected).
2. `FAQPage` with real question/answer content (from `FAQ.tsx`'s in-body `<script>` tag) — **this is new** and wasn't confirmed working in the original Sub-step 2A attempt (which never got this far). It's a genuine, unplanned SEO/AEO win: the homepage's FAQ schema is now actually crawlable in raw HTML, not just present after JS execution.

**Body content** — real, substantial text extracted from the raw HTML (script/tag-stripped):
```
AiSajt — Izrada Web Sajtova i SEO Optimizacija, Beograd Profesionalna izrada web sajta i SEO
optimizacija za firme u Beogradu i širom Srbije. Cena izrade sajta počinje od 299€. [...noscript...]
Pređi na glavni sadržaj Portfolio Portfolio O nama O nama BLOG USLUGE SEO Optimizacija Izrada Sajta
Web Dizajn Web Prodavnica POČNI OVDE Sve što vam treba za početak Izrada Sajta Detalji SEO
Optimizacija Detalji PRIJAVA Kontakt SR EN Usluge [...full Navbar/Hero content follows...]
```
This is the real Navbar + Hero + service links — genuine `HomePage` content, present in the static file with zero JS execution required.

**H1 count: 2** (see "Known follow-up" below — not a regression, a newly-exposed pre-existing overlap).

---

## Known follow-up (not fixed now — flagging per "don't fix unrelated things")

**Duplicate H1 / redundant `<noscript>` content.** Now that `/` genuinely prerenders real content, `root.tsx`'s `<noscript>` fallback block (ported from Phase 1's trimmed `index.html`) is redundant for this route — it contributes its own H1 ("AiSajt — Izrada Web Sajtova i SEO Optimizacija, Beograd") in addition to `HomePage`'s real one ("Agencija za Izradu Sajta"), producing 2 H1s in the raw HTML. This wasn't a problem in the `ssr:false` attempt only because there was no *second* H1 to collide with — real content was never present. Once every route is migrated (Sub-step 2D) and ships genuine prerendered content unconditionally, the `<noscript>` block's entire justification (a fallback for JS-disabled browsers, who'd otherwise see nothing) goes away too, since prerendered HTML *is* what JS-disabled browsers already receive. Recommend removing or substantially shrinking the root-level `<noscript>` block once migration is complete, rather than now while routes are still mid-migration and some still depend on the old catchall path having *something* for JS-disabled visitors.

**No SPA-fallback file generated.** The `ssr:false` attempt logged `Prerender (html): SPA Fallback -> dist/client/__spa-fallback.html` in addition to prerendering `/`; this `ssr:true` build does not produce that file at all. This is expected — a build-time static fallback file is specifically an `ssr:false`-mode concept. Under `ssr:true`, any route *not* in the `prerender` list would, by default, need a live server at request time. Since `/portal/*` is deliberately never going into the `prerender` list (auth-gated, client-only), **Sub-step 2D needs to resolve how `/portal/*` gets served in a purely-static Vercel deployment under `ssr:true`** — likely by keeping/reintroducing an explicit client-only SPA shell for that specific path prefix (Vercel rewrite pointing `/portal/*` at a static shell HTML that mounts the app entirely client-side, bypassing the RR server-render path for that prefix), rather than relying on RR's own automatic fallback generation. Flagging this now so it's on the radar for 2D's `vercel.json` work — not blocking 2B/2C, since marketing routes are all going into `prerender` regardless.

---

## Build / type-check

```
npm run build   # exit 0, / prerenders with real content (verified above)
npx tsc --noEmit -p tsconfig.app.json   # 141 errors, identical count/set to the ssr:false attempt,
                                          # zero in home.tsx/root.tsx/catchall.tsx/entry.client.tsx/routes.ts
```
Same pre-existing `BlogCategory` duplicate-identifier-driven error set as before, unchanged by this retry — confirms this config change didn't touch that surface at all.

---

## Recommendation for 2B

Proceed with `ssr:true` as the permanent target (update the "Essential context" for 2B/2C accordingly — it's no longer `ssr:false`). The pattern for each subsequent route is now established: create a route module (like `home.tsx`), register it in `routes.ts` alongside the shrinking catchall, add it to `prerender`. The bigger remaining piece of real work for 2B is the `SEOHelmet` → native `meta()` export migration (per-page title/description/canonical/OG), which is unaffected by the `ssr:true` vs `ssr:false` decision either way.

Stopping here per the retry's scope. Let me know if you want to proceed to 2B with this as the confirmed base, or want anything else checked first.
