# Phase 7 Report — Performance & cleanup

**Status: Complete**, with three orphaned pages flagged for owner decision rather than deleted (see 7.2). Type errors: **80** (down from the Phase 6 baseline of 83 — three fewer, from deleting genuinely dead files; **zero new**).

**Housekeeping note**: the working tree had Phase 6's finished-but-uncommitted work (image optimization, 121 files) sitting staged from a prior session. Committed that first (`17adb6d`) before starting Phase 7, per the "git commit before starting" rule — it was already-completed Phase 6 output, not something this phase redid.

---

## 7.1 — The ~600ms artificial navigation delay

**Finding: already dead, killed by the Phase 2D Framework Mode migration — not by a change made in this phase.**

- `App.tsx` and `main.tsx` (the old entry point that rendered `LoadingScreen`) are both already deleted, confirmed via `PHASE_2D_REPORT.md`'s trail and a comment left in `src/portal/PortalApp.tsx`:
  > "isLoading/ExitIntentPopup/LoadingScreen from the old AppContent never activated for /portal/* paths ... nothing behavioral is lost by not carrying them over."
- The current entry point, `src/entry.client.tsx`, hydrates `<HydratedRouter>` directly with no loading gate. `src/root.tsx`'s `Layout`/`Root` render `<Outlet />` immediately — no `setTimeout`, no gating state.
- `grep`'d the whole tree: `LoadingScreen` had exactly one non-self reference anywhere — the comment above explaining why it was *never* wired into the new router. Zero actual imports/renders.
- **Action taken**: removed the now-fully-dead `src/components/ui/LoadingScreen.tsx` (`git rm`). Its 800ms `setTimeout` + 400ms fade-out never fires today; nothing else referenced it.

No delay fires on real navigation, before or after this phase's change — Phase 2D already eliminated it. This phase just removed the corpse.

---

## 7.2 — Dead code cleanup

Cross-checked every file in `src/components/pages/`, `src/components/ui/`, `src/components/sections/`, `src/components/layout/`, and `src/components/seo/` against `routes.ts` → route module → component import chains, plus a full-tree grep per file (catching comment-only "references" like the `FAQPage` JSON-LD `@type` string, which is unrelated to the `FAQPage.tsx` component).

### Removed (git rm) — confirmed zero real references
| File | Why dead |
|---|---|
| `src/components/pages/BlogPage.tsx` | Superseded by the *working*, routed blog (`BlogHubPage`/`BlogCategoryPage`/`BlogPostPage`, all wired via `routes.ts`). References broken `blog-1.jpg`…`blog-5.jpg` files that don't exist. Confirms the Phase 6 finding. |
| `src/components/ui/LoadingScreen.tsx` | Per 7.1 — dead since the Phase 2D router migration. |
| `src/components/ui/ExitIntentPopup.tsx` | Also named in the same PortalApp.tsx comment as never-carried-over from the old `AppContent`; zero imports anywhere. Not explicitly named in the task list but surfaced by the full sweep. |
| `src/components/ui/LanguageSwitcher.tsx` | Zero references. The site's actual language toggle lives inline in `Navbar.tsx`, not via this component. |
| `src/components/sections/CTAButtons.tsx` | Zero references. |

### Confirmed live — no action
- **`PortfolioPage.tsx`**: this *is* what Phase 5's `/portfolio` route uses (`src/portfolio.tsx` imports it directly). There is no separate "old" version — the task's premise that it might be redundant doesn't hold here; it's the live implementation, not dead weight.

### Flagged for owner input — NOT deleted
Three orphaned legacy pages, all pre-dating the funnel-based site restructure, all built in the same older style (`react-router-dom`'s `useNavigate`, no `SEOHelmet` integration with the current meta system). They represent an earlier "traditional multi-page site" structure (Home/About/Pricing/FAQ) that was apparently abandoned in favor of the current funnel-based structure (`FunnelPage`, `IzradaSajtaCenaPage`, etc.) — but none were ever deleted, just left unrouted:

| File | Orphan status | Content conflict with canonical/live pages |
|---|---|---|
| `ONamaPage.tsx` (About) | Unrouted, only a comment-reference in `BusinessSchema.tsx` | Team bios conflict with the canonical team facts Phase 4 established from `/funnel` (different names/titles — flagged originally in Phase 4/6). |
| `PricingPage.tsx` | Unrouted, zero references | **Starting price says "od 800€"**, but the live, routed `IzradaSajtaCenaPage.tsx` (the actual pricing page today) says starting price is **€299**. A real, material factual conflict — same shape as the ONamaPage bio issue. |
| `FAQPage.tsx` | Unrouted, zero real references (its only grep hits are an unrelated `'@type': 'FAQPage'` JSON-LD string in `FAQSchema.tsx`) | Not checked line-by-line for conflicts, but same vintage/pattern as the other two — plausibly stale FAQ content sitting next to the live FAQ content embedded in `IzradaSajtaCenaPage.tsx` and elsewhere. |

**Why flagged instead of deleted**: each of these is a full, plausible standalone page an agency site might legitimately want (About / Pricing / FAQ), not an accidental fragment. Deleting outright forecloses that possibility unilaterally; but leaving them silently unrouted with wrong prices/bios is also wrong if anyone ever does wire them up. Decision needed from the owner for each:
1. **Delete** — no near-term intent for dedicated About/Pricing/FAQ pages, fold into cleanup.
2. **Wire up with corrected content** — for `ONamaPage`, sync bios to `/funnel`'s canonical team facts; for `PricingPage`, sync to the live €299 starting price; for `FAQPage`, verify against current answers before publishing.

No action taken on these three pending that decision.

---

## 7.3 — Bundle / code-splitting

**Assessed, no code-splitting reintroduced — the portal-isolation from Phase 2D already solves this.**

Built both configs (`react-router build` for marketing, `vite build --config vite.portal.config.ts` for portal) and inspected the actual output:

- **Marketing build**: **zero** chunk-size warnings. Largest single chunk is `entry.client` at 137.9 kB raw / 44.9 kB gzip. Verified `dist/client/index.html` (homepage) only references its own ~415 kB raw JS payload (home page code + shared root chunk + icons + hubspot form helper) — confirmed via grep that **no** portal/Supabase/admin/Seo-prefixed chunk names appear in any marketing page's HTML.
- **Portal build**: triggers Vite's 500 kB chunk warning — `SeoReportPage` (1.3 MB), `SeoAdminProject` (621 kB), `portal` entry (411 kB). This is the ~2.4 MB the original audit flagged.
- **Isolation confirmed**: `dist/client/portal.html` references exactly one script (`portal-*.js`, the entry) — everything else (`SeoAdminProject`, `AdminOverview`, etc.) is already `React.lazy()`-loaded per-route inside `PortalApp.tsx`, not eagerly bundled. A marketing visitor's browser never requests any portal code — grepped for `supabase` across every marketing-build JS file: zero matches.

**Judgment call**: the portal's 2.4 MB is real, but it's served exclusively to authenticated users on `/portal/*` via a separate static entry (`portal.html`) that marketing visitors never load — and even within the portal, it's already route-split via `React.lazy`. Reintroducing `manualChunks` would only matter if the *marketing* bundle were bloated, and it isn't (no warning, ~400 kB raw for the heaviest page, no portal/Supabase code present). Adding chunking complexity back would be solving a problem the existing isolation already solved. No change made.

---

## 7.4 — Cookie consent (GDPR / Serbia data protection)

**Implemented — conservative, default-deny, lightweight custom banner. Flagged for owner review below.**

### What changed
- **`src/utils/consent.ts`** (new): reads/writes a single `localStorage` key (`aisajt_cookie_consent`, values `'accepted'` / `'rejected'`), wrapped in try/catch for storage-blocked environments (private browsing, etc.) — a storage failure degrades to "never persists a yes," which still defaults to no tracking.
- **`src/components/ui/CookieConsentBanner.tsx`** (new): a plain custom component, no CMP SDK. Fixed-bottom overlay, Serbian copy, "Prihvati" (Accept) / "Odbij" (Reject) buttons, links to the existing `/privacy` page. Only renders once mounted client-side and only if no consent choice is stored yet (`useState(false)` + a `useEffect` that flips it) — so it doesn't exist at all in the prerendered HTML (verified: zero occurrences of "Prihvati"/"Odbij" in `dist/client/index.html`) and never blocks or delays the already-fully-rendered prerendered content underneath it.
- **`src/root.tsx`**: each of the three inline tracker scripts (GA4, Meta Pixel, HubSpot) was restructured from "fire unconditionally past the hostname guard" into "define an idempotent `window.__aisajtLoadX()` loader, and only auto-invoke it if the hostname guard passes **and** `localStorage['aisajt_cookie_consent'] === 'accepted'`." The banner's Accept handler calls the same three `window.__aisajtLoadX()` functions directly — so accepting fires trackers immediately in the current session (no reload needed), and the stored choice makes them auto-fire on every future page load without the banner reappearing.
- **Removed the unconditional `<noscript>` Meta Pixel `<img>` fallback.** It fired regardless of consent and there is no way to consent-gate a `<noscript>` tag (no JS = no localStorage check = no banner). Given the task's "default to NOT firing trackers before consent" instruction, and that this only affects the rare no-JS-browser case (which also could never see or answer the banner either way), removing it was the conservative choice.
- **Untouched, as scoped**: HubSpot *form submission* logic (`src/utils/hubspot.ts`) — that's the lead-capture API integration, separate from the HubSpot analytics/chat-widget loader script this task targeted. Supabase auth and Stripe are unrelated to this task and weren't touched.

### Verification
- `tsc`: 0 new errors. `npm run build`: both configs build clean.
- Prerendered HTML: confirmed hero content (`<h1>...Agencija za Izradu Sajta`) is present and complete in `dist/client/index.html` regardless of the banner — the banner is purely a post-hydration client addition, not a render gate.
- **Tracker-gating logic**: no browser or Playwright/jsdom was available in this environment to click through it live, so I extracted the exact three inline `<script>` bodies as shipped in `dist/client/index.html` and executed them in a Node `vm` context (a real global-object sandbox, not a reimplementation) under four scenarios:
  1. Fresh visitor, no stored consent → **0 tracker requests fired**, loaders defined and ready.
  2. Stored consent `rejected` → **0 tracker requests fired**.
  3. Stored consent `accepted` → **all 4 requests fired** (GA4 script tag, Meta Pixel init + `fbevents.js`, HubSpot loader script, HubSpot forms script), `dataLayer` correctly populated with `gtag('js', ...)` / `gtag('config', ...)`.
  4. Stored consent `accepted` but `hostname === 'localhost'` → **0 fired** (dev guard still holds).
  - Also simulated the banner's Accept click directly (calling `window.__aisajtLoadGA4/__aisajtLoadPixel/__aisajtLoadHubspot()` with no prior consent stored, exactly what `handleAccept()` does): **0 fired before the call, all 4 fired immediately after**, with no reload — confirming accept-without-reload works.
  - This validates the exact shipped gating logic end-to-end. What it does *not* cover: the live React click handling, button rendering, and visual layout in an actual browser viewport — that would need a real browser, which wasn't available here. Flagging this gap explicitly rather than claiming full UI verification.

### Owner review needed (legal implications — flagged, not decided unilaterally)
- **Wording**: banner copy is a reasonable-effort Serbian default, not legal copy — the owner (or counsel) should review it, especially given Zakon o zaštiti podataka o ličnosti + GDPR exposure for EU visitors.
- **Granularity**: currently binary (accept-all / reject-all) for the three non-essential trackers as a group, not per-tracker toggles. Task explicitly allowed this ("optionally granular") — flagging that a per-tracker breakdown is a possible upgrade if the owner wants it.
- **`/privacy` page**: still only has a generic one-line cookie mention (pre-existing, unrelated to this phase) — doesn't name GA4/Pixel/HubSpot specifically or explain the new consent mechanism. Worth a follow-up pass, out of scope here.
- **Confirm which trackers are actually needed** — this phase gated exactly the three the audit named (GA4, Meta Pixel, HubSpot); didn't add or remove any tracker, only gated existing ones.

---

## Final checks

```
npx tsc --noEmit -p tsconfig.app.json      # 80 errors — down from 83 (Phase 6 baseline), zero new
npm run build                              # exit 0 — marketing build clean, portal build's pre-existing
                                            # 500kB chunk warning unchanged (expected, isolated, see 7.3)
```

- **Bundle sizes**: marketing ~415 kB raw JS for the heaviest page (home), no chunk-size warnings, zero portal/Supabase code present. Portal ~2.4–2.9 MB total but fully isolated behind its own static entry and already `React.lazy`-split per admin/client route — auth-gated, not shipped to public visitors.
- **Dead code removed**: 5 files (`BlogPage.tsx`, `LoadingScreen.tsx`, `ExitIntentPopup.tsx`, `LanguageSwitcher.tsx`, `CTAButtons.tsx`).
- **Delay status**: confirmed already dead (killed by Phase 2D), not by this phase — the dead component housing it is now removed too.
- **Consent implementation**: default-deny, gates GA4/Pixel/HubSpot on stored consent, overlay banner doesn't block prerendered content, reject genuinely prevents all three trackers from ever firing (verified via direct execution of the shipped script logic).
- **Flagged for owner, not decided unilaterally**: `ONamaPage.tsx`/`PricingPage.tsx`/`FAQPage.tsx` disposition (delete vs. wire up with corrected content), and the consent banner's wording/granularity/`/privacy` follow-up.

---

Phase 7 complete.
