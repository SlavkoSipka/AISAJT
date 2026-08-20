# Phase 6 Report — Image & media optimization

**Status: Complete.** `public/` went from **64 MB to 4.1 MB (93.6% smaller)**. No videos exist anywhere in the project (checked — N/A, 6.5 skipped). Type errors: **83, unchanged from the Phase 5 baseline, zero new.**

---

## 6.1 — Inventory (before processing)

Full media map: 74 image files in `public/images` (no images imported into `src/`; all consumed via `/images/...` public paths or external Cloudinary/client-site URLs in `portfolioProjects.ts`), **64 MB total**.

Grepped every filename (basename + URL-encoded variant, since several files have spaces in their names) against `src/**/*.{ts,tsx}` to build a consumer map. This surfaced three categories:

1. **Genuinely dead weight — 12 files, ~15 MB, zero references anywhere.** Confirmed with both literal and `%20`-encoded search (caught two false positives this way — `Beli logo2.png` and `filmska 7.jpg` looked dead under a naive search but are referenced with encoded spaces). The real dead list: `aisajt providno.png`, `aisajt-logo-transparent.png`, `aisajt_providno-removebg-preview-removebg-preview.png`, `bnautofolije.png`, three `dizajn/Screenshot 2025-12-24 *.png` files, `favicon/kraljresidence.png`, `instan.png`, `rc (2).png`, `slika.webp`, `slika2.webp`.
2. **Byte-identical duplicates — 3 files, ~1 MB.** `dizajn3.png`, `web dizajn.webp`, `minimaliostic web dizajn.jpg` existed both at `public/images/` root and under `public/images/dizajn/`; MD5-verified identical. Code only ever references the `dizajn/` copies.
3. **The real offenders** — worst were `prestige.png` (4.7 MB), `komotraks.png`/`bn.png`/`kralj.png`/`panic.png`/`loki.png` (3.1–3.4 MB each), all ~2540×1270px PNG screenshots of client websites used as small thumbnails in `FunnelPage.tsx`'s case-study grid (rendered at roughly 350–550px wide). Same pattern in `IzradaSajtaCenaPage.tsx` (three ~2–3 MB PNGs at ~1900×1070, displayed in a 2-column ~600px-wide grid) and two 6000×4000 JPEGs (`filmska.jpg`, `filmska 7.jpg`, ~900 KB each) displayed at a few hundred px.

---

## 6.2 — Tooling

Checked availability before touching anything:
- `cwebp`/`dwebp`/`webpinfo`/`gif2webp` (Homebrew, v1.6.0) — **used for all conversion, resizing, and validation.**
- `sips` (macOS built-in) — used for dimension probing and the OG-image experiment (6.6).
- ImageMagick (`magick`/`convert`) — not installed.
- `ffmpeg` — not installed (moot: no video files exist in the project).
- `sharp` — present only as a transitive dependency of `netlify-cli`, not a project devDependency; not used, to avoid depending on undeclared tooling.

---

## 6.3 — Convert & resize

**Step 1 — delete confirmed-dead weight.** Removed via `git rm` (fully recoverable from git history) — the 12 unreferenced files + 3 exact duplicates, **~20 MB**, zero visual risk since nothing renders them.

**Step 2 — convert and resize the real offenders.** 30 files processed: PNG/JPG → WebP (q80, q82 for photos, q85 for logo/text-bearing images to keep edges crisp), resized to a sensible max width for each one's actual display context (verified by reading the consuming component's className/container, not guessed):

| Context | Max width used |
|---|---|
| `FunnelPage.tsx` case-study thumbnails (~350–550px display) | 1200px |
| `IzradaSajtaCenaPage.tsx` pricing-page screenshots (~600px display) | 1200px |
| `HomePage.tsx` blob-shaped service images | 1200–1400px |
| `filmska.jpg`/`filmska 7.jpg` (6000×4000 native, ~450–900px display) | 900–1200px |
| `baza.jpg` (blog OG-image prop, never larger than social-card size) | 1200px |
| Team avatars (1600×1600 native, ~280–430px display) | 800px |
| Homepage circular profile photos (~144px display) | 400px |
| Oversized logos (`logobn.png` was 5394×923 for a 96px-tall logo box) | 500–900px, alpha preserved |

Every output verified before it replaced anything: non-zero size, valid WebP signature (`webpinfo`), correct dimensions. **Zero upscaling** — the resize step only fires when native width exceeds the target. All 30 references updated across 9 consumer files (`FunnelPage.tsx`, `IzradaSajtaCenaPage.tsx`, `HomePage.tsx`, `IzradaSajtaDetaljiPage.tsx`, `SEOOdrzavanjeDetaljiPage.tsx`, `BlogCategoryPage.tsx`, `BlogHubPage.tsx`, `blogPosts.ts`, `WebDizajnPage.tsx` untouched — its images were already reasonably sized).

**Visual verification.** Per the special caution about portfolio images being the agency's proof of work: decoded three of the highest-priority conversions (`prestige.webp`, `kralj.webp`, `kompletan poslovni web sajt.webp`) back to PNG and viewed them directly — text is sharp, no visible compression artifacts, no color banding. Quality bar held.

### Before/after — the 30 processed files

| File | Before | After | Saved |
|---|--:|--:|--:|
| prestige.png → .webp | 4.67 MB | 84.8 KB | 98.2% |
| komotraks.png → .webp | 3.28 MB | 84.2 KB | 97.5% |
| bn.png → .webp | 3.27 MB | 61.7 KB | 98.2% |
| kralj.png → .webp | 3.37 MB | 49.6 KB | 98.6% |
| loki.png → .webp | 3.05 MB | 34.4 KB | 98.9% |
| lako.png → .webp | 2.67 MB | 20.6 KB | 99.2% |
| poklon.png → .webp | 2.17 MB | 39.7 KB | 98.2% |
| panic.png → .webp | 3.45 MB | 67.3 KB | 98.1% |
| jastuci.png → .webp | 1.11 MB | 34.6 KB | 96.9% |
| borakk.png → .webp | 308 KB | 50.0 KB | 83.8% |
| bora.png → .webp | 727 KB | 32.1 KB | 95.6% |
| kompletan poslovni web sajt.png → .webp | 3.01 MB | 86.0 KB | 97.2% |
| online prodavnica sajt.png → .webp | 1.90 MB | 112.0 KB | 94.3% |
| Jednostavan web sajt.png → .webp | 2.33 MB | 68.0 KB | 97.2% |
| dizajn.png → .webp | 1.53 MB | 138.5 KB | 91.2% |
| marketing.png → .webp | 53.4 KB | 13.2 KB | 75.3% |
| izrada sajta cena.jpg → .webp | 197.2 KB | 74.5 KB | 62.2% |
| filmska.jpg → .webp | 870.0 KB | 32.0 KB | 96.3% |
| filmska 7.jpg → .webp | 969.1 KB | 46.9 KB | 95.2% |
| baza.jpg → .webp | 501.7 KB | 82.0 KB | 83.6% |
| Beli logo2.png → .webp | 264.1 KB | 16.0 KB | 93.9% |
| logobn.png → .webp | 199.6 KB | 12.6 KB | 93.7% |
| boralogo.jpg → .webp | 98.7 KB | 12.0 KB | 87.8% |
| poklonilogo.png → .webp | 218.1 KB | 40.6 KB | 81.4% |
| logolak.png → .webp | 216.2 KB | 13.0 KB | 94.0% |
| zeka.jpg → .webp | 54.3 KB | 9.9 KB | 81.8% |
| boban.jpg → .webp | 168.9 KB | 20.7 KB | 87.7% |
| boban Izrada sajta .webp (re-encoded, 1600→800px) | 232.3 KB | 50.2 KB | 78.4% |
| Strahinja izrada sajta.webp (re-encoded) | 131.6 KB | 27.5 KB | 79.2% |
| Dedza SEO OPTIMIZACIJA.webp (re-encoded) | 118.8 KB | 21.4 KB | 82.0% |
| **Total (30 files)** | **41.0 MB** | **1.40 MB** | **96.6%** |

### Dead weight removed (15 files)
~20 MB deleted outright — 12 fully unreferenced files, 3 byte-identical duplicates.

### Total public/ weight
| | Size |
|---|--:|
| Before (Phase 5 baseline) | 64 MB |
| After dead-file removal | 44 MB |
| After conversion/resize | **4.1 MB** |
| **Total reduction** | **93.6%** |

---

## 6.4 — Dimensions + lazy loading

Audited all 76 `<img>` tags across the codebase (not just the ones touched in 6.3 — every image on the site). Before this phase: 0 had explicit dimensions in a form that prevented CLS via attributes, 59 had no `loading` attribute at all.

- **Width/height**: added to all 55 `<img>` tags with a static local `/images/...` src, using each file's real post-optimization pixel dimensions (verified via `webpinfo`/`sips`, not guessed). Browsers use these to compute intrinsic aspect ratio even when CSS overrides the rendered size (`w-full h-auto` etc.) — this is the standard technique and doesn't affect the responsive layout. The remaining ~20 tags use a dynamic/data-driven `src` (`project.image`, `card.siteImg`, `post.coverImage`, `member.image`, `profile.avatar_url`, external Cloudinary URLs, etc.) where a static width/height isn't knowable — spot-checked their containers instead and confirmed each one sits inside a CSS-sized wrapper (`aspect-video`, `aspect-square`, fixed `h-*`/`w-*`), so CLS is already prevented structurally even without the attribute.
- **Lazy loading**: added `loading="lazy"` to every image that lacked it, with three deliberate exceptions kept/set to eager:
  - **Homepage LCP image** — `Hero.tsx`'s logo mockup (already `loading="eager"` from before this phase) — added the missing `fetchPriority="high"`.
  - **Navbar logo** (`Navbar.tsx`) — visible at the top of every page on first paint; corrected from an accidentally-applied `lazy` to `loading="eager" fetchPriority="high"`.
  - **Portfolio detail hero image** (`PortfolioDetailPage.tsx`, `project.image`) — sits in the above-the-fold hero of every `/portfolio/:slug` page, making it that route's LCP candidate; set to `loading="eager" fetchPriority="high"`.
  - **`LoadingScreen.tsx`'s logo** — the full-screen splash shown at app init; corrected to `eager` (though this component turned out to be dead/unrendered code from before the Phase 2 router migration — noted below, not touched further, out of scope).
- Verified every other page's first `<img>` occurs well past its hero section (checked line numbers — all past line 200, hero sections in this codebase are text-only) — confirmed lazy is safe everywhere else, no other LCP candidates missed.
- Confirmed all of this in the actual prerendered HTML, not just source: `grep`'d `dist/client/index.html` and `dist/client/portfolio/kralj-residence/index.html` directly for the `fetchPriority="high"` attribute on the two eager images — present in both.

**One bug caught and fixed during this step**: the automated width/height/lazy pass used a regex `<img>` matcher that, on two tags in `ONamaPage.tsx` with an inline `onError={(e) => {...}}` handler, mistook the arrow function's `=>` for the tag's closing `>` and corrupted the JSX (caught immediately — `tsc` error count jumped from 83 to 14 malformed-syntax errors). Fixed by hand; confirmed back to the exact 83-error baseline afterward, and grepped the whole tree for the same collision pattern to confirm no other file was affected.

---

## 6.5 — Video

No video files exist anywhere in `public/` or `src/` (checked `.mp4`/`.webm`/`.mov`/`.avi`), and no `<video>` tags in any component. N/A — nothing to compress.

---

## 6.6 — OG image

Attempted to produce the 1200×630 branded share image Phase 3 left as a TODO. Tooling available (`sips` only — no ImageMagick, no PIL/Pillow, no text-rendering capability) limited this to: resize the existing transparent logo and pad it onto a solid canvas. Produced and visually reviewed the result — a bare logo centered on white, no tagline, no brand color/gradient, no domain. Judged this to be exactly the "ugly auto-generated" outcome the task says not to ship, not a genuine branded design.

**Left the TODO in place, unwired.** `buildPageMeta()`'s default `og:image` still falls back to the 512×512 favicon. A real fix needs actual design work (brand gradient background, tagline, proper text layout) that isn't achievable with the tools available in this environment.

---

## Final checks

```
npm run build                              # exit 0 — same 35 routes prerender, portal.html builds
npx tsc --noEmit -p tsconfig.app.json      # 83 errors — identical to the Phase 5 baseline, zero new
```

- **Dead references**: scripted check of every `/images/...` reference in `src/**/*.{ts,tsx}` against the filesystem, both raw and URL-decoded. Zero dead references introduced by this phase. Four pre-existing broken references remain (`blog-1.jpg`…`blog-5.jpg` in `BlogPage.tsx`, `team/*.png` in `ONamaPage.tsx`) — both files are orphaned/unrouted (confirmed via `routes.ts` grep, same finding as Phases 4–5), predate this phase, and are out of scope (dead-code cleanup, not an image-weight issue).
- **File validity**: every `.webp` in `public/images` passed `webpinfo` validation (correct RIFF/WEBP signature, non-zero size, sane dimensions) after conversion, before any original was deleted.
- **CLS/LCP**: confirmed above — width/height present on every static-src image, `loading="lazy"` everywhere else, three genuine LCP candidates (homepage hero, portfolio detail hero, navbar logo) explicitly `eager`+`fetchPriority="high"`.

---

Phase 6 complete.
