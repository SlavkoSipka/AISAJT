# SEO Discovery Report — aisajt.com

Purpose: factual technical/content/SEO audit for handoff to an SEO optimization planning agent. No files were modified to produce this report. All findings are sourced from the actual codebase at the time of writing (repo root: `/Users/juda/AISAJT`, branch `main`).

---

## 1. PROJECT OVERVIEW

- **What it is**: Confirmed — a Belgrade/Serbia-based web design, development, and SEO agency ("AI Sajt" / "AiSajt"). Marketing copy and structured data (`index.html:71-177`) describe services: website development, web design, SEO optimization, database/backend development, online marketing.
- **Primary purpose**: Lead generation. The site funnels traffic toward a "besplatna konsultacija" (free consultation) via `/funnel` (also aliased at `/contact`), plus secondary lead magnets at `/resources/quiz`, `/resources/audit`, `/resources/guide`, `/resources/checklist`. All lead forms submit to HubSpot (see §3, §7).
- **Target audience / language**: Serbian, Latin script, throughout (no Cyrillic found). Regional targeting is explicit and repeated: Beograd (primary), Novi Sad, Niš, Kragujevac, "cela Srbija" (all of Serbia) — see the hidden-content block in `index.html:213-335` and FAQ copy (`src/components/pages/IzradaSajtaCenaPage.tsx:32`). The site also has an English content variant, but it is **not exposed on separate URLs** — see §4 (Hreflang) and §9.
- **Domain**: `https://aisajt.com` (apex, non-www) is used consistently as the canonical value everywhere in code — `index.html:17,27`, all `canonicalUrl` props in `SEOHelmet` calls, `sitemap.xml`, `robots.txt`. However, **which host is actually live and whether it enforces apex vs. www is UNCERTAIN from code alone** — see §6 for the full explanation (the repo contains both a Vercel config and a legacy Netlify config with conflicting authority).
- **Business-model note**: This is a web-dev/SEO agency selling web-dev/SEO services. Its own site's technical SEO quality is a direct trust signal for prospective clients — every flaw below (placeholder verification tags, keyword stuffing, CSR-only rendering) is a specific, checkable claim a skeptical prospect (or their own future AI research) could use against the agency.

---

## 2. TECH STACK

**What the site actually runs on (from `package.json`, not marketing copy):**

- **Framework**: React 18.3.1 (`react`, `react-dom` ^18.3.1) — plain **client-side React**, not Next.js, not Remix, not Gatsby, not Nuxt/Vue (confirmed: no such packages in `package.json` dependencies or devDependencies).
- **Build tool**: Vite 7.3.1 (`vite.config.ts`), using `@vitejs/plugin-react`.
- **Language**: TypeScript 5.5.3 + TSX. `tsconfig.json` references `tsconfig.app.json` / `tsconfig.node.json`.
- **Routing**: `react-router-dom` ^7.9.6 (React Router v7), used as a client-side `BrowserRouter` (`src/App.tsx:2,202`).
- **CSS**: Tailwind CSS ^3.4.1 confirmed (`tailwind.config.js`, `postcss.config.js`, `content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}']`).
- **Head/meta management**: `react-helmet-async` ^2.0.5 is a dependency and `HelmetProvider` wraps the app (`src/main.tsx:14`), but most marketing pages actually use a **custom hand-rolled component**, `src/components/seo/SEOHelmet.tsx`, which manipulates `document.head` directly inside a `useEffect` (not the declarative `<Helmet>` JSX). Only the blog post schema (`src/components/blog/BlogPostSchema.tsx`) and the FAQ JSON-LD-in-body pattern deviate from this. Both approaches are **client-side-only** — there is no server render step that would let `react-helmet-async`'s SSR string-extraction feature do anything useful here (see §5).
- **Other notable dependencies**: `@supabase/supabase-js` (client portal backend), `@emailjs/browser`, `resend` (transactional email), `gsap` (animation), `chart.js`/`react-chartjs-2` (portal dashboards), `@react-pdf/renderer`/`jspdf`/`html2canvas` (PDF generation, likely for lead magnets/reports), `react-markdown` (used somewhere for markdown rendering — not the blog, which is a hardcoded TS array, see §3).
- **Marketing-copy vs. reality**: The hidden SEO content block in `index.html:329` states: *"Koristimo najsavremeniji technology stack... React, TypeScript, Node.js, Tailwind CSS, Next.js, Vue.js, WordPress, Shopify..."* — this is a description of technologies the agency **offers to clients**, not what this site runs on. This site itself runs on **plain Vite + React + TypeScript + Tailwind only**. Next.js, Vue.js, WordPress, Shopify are NOT used here.

**Rendering mode**: CSR-only SPA. No SSR, SSG, or prerendering. See §5 for full analysis and proof.

**Build scripts** (`package.json`):
```json
"scripts": {
  "dev": "vite",
  "dev:netlify": "netlify dev",
  "build": "vite build",
  "lint": "eslint .",
  "preview": "vite preview",
  "build:prod": "vite build && vite preview",
  "analyze": "vite build --mode analyze",
  "gsc:check": "node scripts/gsc-check.mjs"
}
```
`npm run build` is a plain `vite build` — no prerender/SSG plugin is invoked. `vite.config.ts` contains no SSR/SSG plugin (`vite-plugin-ssr`, `vite-ssg`, `react-snap`, etc. — none present in `package.json` or config).

**Hosting/deployment — CONFLICTING SIGNALS, see §6 for full discussion**:
- `vercel.json` present, with `framework: "vite"`, rewrites, and `functions` config targeting `api/*.ts` — this is the Vercel serverless convention.
- `netlify.toml` + `netlify/functions/*.ts` also present — this is the Netlify convention.
- Git history is decisive for *serverless functions*: commit `2a105d9 "Migriraj serverless funkcije sa Netlify na Vercel"` ("Migrate serverless functions from Netlify to Vercel") shows the API layer was migrated to Vercel. The `.github/workflows/gsc-daily-sync.yml` cron job also calls `https://aisajt.com/api/gsc-auto-sync-all` (Vercel-style path). This strongly suggests **Vercel is the current production host** and `netlify.toml`/`netlify/functions/` is legacy, possibly-unused config left in the repo.
- No `Dockerfile` present.

**CMS/database/backend**:
- **Blog**: fully static, hardcoded in `src/data/blogPosts.ts` (a 682-line TypeScript array), not a CMS or database. Only **2 posts exist** (see §3).
- **Client portal** (`/portal/*`): backed by Supabase (`@supabase/supabase-js`, `supabase-schema.sql`, `supabase/migrations/`) — this is a separate authenticated app for the agency's own clients (project dashboards, messaging, file sharing, an internal "SEO panel" with Google Search Console sync). It is unrelated to the public marketing site's content and **should not be publicly indexable** — see §9 for a real gap found here.
- Everything else (marketing pages, pricing, FAQs) is static JSX/TSX content compiled at build time — no database-driven marketing content.

---

## 3. SITE STRUCTURE

**Full route list**, extracted from `src/App.tsx:113-193` (this is the single source of truth — React Router `<Routes>` inside a `BrowserRouter`):

Marketing / public routes:
- `/` — HomePage
- `/seo-optimizacija-cena` — SEOPage (canonical SEO pricing page)
- `/seo` — SEOPage (**alias**, same component, different URL — duplicate-content risk, see §9)
- `/izrada-sajta-cena` — IzradaSajtaCenaPage
- `/izrada-sajta-detalji` — IzradaSajtaDetaljiPage (routed, but **absent from sitemap.xml** — see §9)
- `/seo-optimizacija-detalji` — SEOOdrzavanjeDetaljiPage (routed, but **absent from sitemap.xml** — see §9)
- `/izrada-web-shopa` — WebShopPage
- `/web-dizajn` — WebDizajnPage
- `/terms` — TermsPage
- `/privacy` — PrivacyPage
- `/contact` — FunnelPage (**alias** of `/funnel`, same component — duplicate-content risk)
- `/funnel` — FunnelPage (primary conversion page)
- `/promet-sistem` — PrometSistemPage (paid-traffic-only landing page for a car-service ad campaign; added most recently per git log: `45065a3 "Dodaj Promet Sistem landing za Meta ads saobraćaj"`)
- `/thank-you` — ThankYouPage
- `/resources` — ResourcesPage
- `/resources/quiz` — QuizPage
- `/resources/audit` — AuditFormPage
- `/resources/guide` — LeadMagnetDownloadPage
- `/resources/checklist` — LeadMagnetDownloadPage (same component as `/resources/guide`, different content prop presumably)
- `/blog` — BlogHubPage
- `/blog/:slug` — BlogPostPage
- `/blog/category/:categorySlug` — BlogCategoryPage

Portal routes (authenticated app, separate concern — see §9 for indexability gap):
- `/portal/izvestaj/:token` — SeoPublicReport (**public**, token-gated, not auth-gated)
- `/portal/login` — PortalLoginPage
- `/portal/dashboard`, `/portal/dashboard/poruke`, `/portal/dashboard/fajlovi` — client dashboard (auth-gated)
- `/portal/admin`, `/portal/admin/poruke`, `/portal/admin/klijenti`, `/portal/admin/klijenti/novi`, `/portal/admin/projekti/novi`, `/portal/admin/projekti/:id` — admin (auth-gated)
- `/portal/seo`, `/portal/admin/seo`, `/portal/admin/seo/novi`, `/portal/admin/seo/:id`, `/portal/admin/seo/:id/preview`, `/portal/admin/seo/:id/report` — internal SEO-panel product (auth-gated)

**Orphan page components — exist in the codebase, imported nowhere, not routed anywhere** (confirmed via grep across `src/App.tsx` and all of `src`): `FAQPage.tsx`, `ONamaPage.tsx` ("About Us"), `PortfolioPage.tsx`, `PortfolioDetailPage.tsx`, `PricingPage.tsx`, `BlogPage.tsx`. These are dead/unfinished code — notably `PortfolioDetailPage.tsx` looks like it was meant to be dedicated case-study pages (see §7) but was never wired into the router.

**Navigation structure**: `src/components/layout/Navbar.tsx` and `src/components/layout/Footer.tsx`. Navbar is a fixed, scroll-reactive header with a "Usluge" (Services) dropdown and a "Vodič" (Guide) dropdown; it is explicitly hidden on `/funnel` (`Navbar.tsx:27-29`, `if (location.pathname === '/funnel') return null;`) — a deliberate no-nav conversion page pattern.

**Blog**: 2 posts total, hardcoded in `src/data/blogPosts.ts`:
- `koji-sajt-mi-treba-za-firmu` (line 17)
- `seo-osnove-za-pocetnike` (line 451)

Both are client-side-rendered like everything else (see §5) but both slugs are present in `sitemap.xml`. Categories are defined in `src/data/blogCategories.ts`. Blog is not a CMS/DB — adding a post requires a code change and redeploy.

**`/funnel`**: Single-page, multi-section conversion flow (not a classic multi-step wizard) — `src/components/pages/FunnelPage.tsx` (900+ lines). Contains an embedded Vimeo video, a portfolio carousel, animated stat counters, and a contact form. Form submission goes through `submitFunnelForm()` in `src/utils/hubspot.ts`, which POSTs directly from the browser to HubSpot's public Forms API (`https://api.hsforms.com/submissions/v3/integration/submit/147390341/{formGuid}`) — no backend involved for this particular form. Analytics: `trackFormSubmitAttempt('funnel_booking', language)` fires on submit (`FunnelPage.tsx:256`), so the funnel *is* instrumented for conversion tracking (see §6/§7).

**`/resources`**: A hub page (`src/components/pages/ResourcesPage.tsx`) linking out to four lead-magnet tools/pages: a quiz (`/resources/quiz`), a free audit form (`/resources/audit`), a downloadable guide (`/resources/guide`), and a downloadable checklist (`/resources/checklist`). PDFs live in `public/downloads/checklist.pdf` and `public/downloads/vodic.pdf`.

**URL structure**: Clean, lowercase, hyphenated, keyword-rich Serbian slugs throughout (`/izrada-sajta-cena`, `/seo-optimizacija-cena`, `/izrada-web-shopa`, `/web-dizajn`) — consistent and well-formed. No trailing slashes, no case inconsistency, no query-string-based routing for content pages. The two intentional aliases (`/seo` ↔ `/seo-optimizacija-cena`, `/contact` ↔ `/funnel`) are the only structural URL issue (see §9).

---

## 4. CURRENT SEO STATE

### Title tags
Implemented via two mechanisms: (a) the static `<title>` in `index.html` (what any non-JS-executing crawler sees for **every** route, since it's one shell — see §5), and (b) `document.title = title` set client-side inside `SEOHelmet.tsx:33` per page, once JS runs.

- Static shell title (`index.html:33`): `"Izrada Web Sajta | Izrada Sajtova | Izrada Sajta Cena Beograd"` — 61 characters. Repeats the root "sajt-" stem 3 times ("Sajta", "Sajtova", "Sajta") across three pipe-separated fragments. This reads as a keyword list, not a natural title — classic **keyword-stuffing pattern**, and it is literally the ONLY title a JS-less crawler will ever see for the entire site (home, `/blog`, `/funnel`, everything), because there is no per-route static HTML (§5).
- Client-rendered per-page titles (post-JS) are more varied and mostly reasonable in length, e.g.:
  - Home (`HomePage.tsx:198`): `"AI Sajt - Agencija za Izradu Sajta | SEO Optimizacija | Beograd"` (65 chars) — **differs from the static shell title**, meaning the title Google sees in raw HTML vs. after full rendering are two different strings.
  - `/seo-optimizacija-cena` (`SEOPage.tsx:87`): `"SEO Optimizacija Cena | SEO Optimizacija Sajta | Prva Pozicija Google"` (71 chars) — repeats "SEO Optimizacija" twice; borderline stuffed but still human-readable.
  - `/izrada-sajta-cena` (`IzradaSajtaCenaPage.tsx:80`): `"Izrada Sajta Cena | Profesionalna Izrada Sajtova Beograd | Izrada Web Sajta"` (77 chars, over Google's ~60-char display guidance) — repeats "Izrada" three times.
  - `/web-dizajn` (`WebDizajnPage.tsx:45`): `"Web Dizajn Cena | Profesionalan Web Dizajn Beograd | Dizajn Sajta"` — repeats "dizajn" three times.
  - `/privacy`, `/terms`: clean, natural, no stuffing (`"Politika Privatnosti | AiSajt"`, `"Uslovi Korišćenja | AiSajt"`).
- **Assessment**: Titles are unique per route (good), but several read as keyword lists stitched with pipes rather than natural page titles, and the homepage/global-shell title is the most aggressively repetitive. This is a real over-optimization signal, not just a stylistic nitpick — and it's compounded by the mismatch between the pre-JS and post-JS title (§5).

### Meta descriptions
Same dual-mechanism pattern.
- Static shell (`index.html:11`): `"Profesionalna izrada web sajta i izrada sajtova u Beogradu. Izrada sajta cena od 150€. Cena izrade sajta zavisi od projekta. Besplatna konsultacija i transparentna ponuda."` — repeats "izrada"/"sajta" stems 4 times across 4 short sentences; reads as generated/templated rather than written for a human reader.
- Per-page (post-JS) descriptions are more natural but still keyword-forward, e.g. `SEOPage.tsx:91`: `"SEO optimizacija sajta za prvu poziciju na Google u Beogradu i Srbiji. Profesionalna SEO optimizacija - cena od 250€..."`.
- **Pricing inconsistency found**: the static shell description says pricing starts "od 150€", the FAQ (`src/components/sections/FAQ.tsx:20`) also says "od 150€", but the actual pricing page content (`IzradaSajtaCenaPage.tsx:328`) shows real tiered pricing starting **"od 299€"**. This is a factual inconsistency across the site's own SEO surface — flagged in detail in §7 and §9.

### Meta keywords tag
**Present.** Confirmed in the static shell (`index.html:12`):
```html
<meta name="keywords" content="izrada web sajta, izrada sajtova, izrada sajta cena, web sajt izrada, cena izrade sajta, izrada web sajta cena, izrada web sajta novi sad" />
```
Also re-implemented client-side per-page via `SEOHelmet.tsx:44-53` (`keywords` prop, present on nearly every marketing page — e.g. `SEOPage.tsx:94-96`, `WebDizajnPage.tsx:52-54`, `HomePage.tsx:205-207`). This tag has been ignored by Google since ~2009 and by all major search engines; its continued presence across the entire site, combined with visibly repetitive keyword phrasing inside it, is a low-cost signal of over-optimization / SEO-tool-generated content rather than direct harm.

### Canonical tags
- Static shell (`index.html:27`): `<link rel="canonical" href="https://aisajt.com" />` — apex, no trailing slash, no `www`.
- Per-route (post-JS, via `SEOHelmet.tsx:56-62`): self-referencing, apex, matches each route (e.g. `canonicalUrl="https://aisajt.com/seo-optimizacija-cena"`). No hardcoded `www` canonical found anywhere in the codebase.
- **Apex vs. www**: All in-code canonical values point to the non-`www` apex. Whether the *live* site actually serves a consistent canonical host depends entirely on hosting-level domain/redirect configuration that is **not fully determinable from this repo** (see §6). If the live host resolves `www.aisajt.com` without redirecting it to the apex (or vice versa without matching the coded canonical), a real self-referencing-canonical mismatch exists in production even though the code itself is internally consistent.
- The `/seo` and `/contact` route aliases (§3) each render the exact same component as `/seo-optimizacija-cena` and `/funnel` respectively, and — because `SEOHelmet` derives `canonicalUrl` from a hardcoded prop, not `location.pathname`, on those pages — visiting `/seo` or `/contact` directly will still emit the canonical URL of the "real" route. This is actually correct de-duplication behavior *if* those alias paths are reachable and Google crawls them, but confirm no internal links point to the alias paths (a quick grep found none — they appear to be defensive routes only).

### Open Graph / Twitter
- Present, static shell (`index.html:14-20`): `og:title`, `og:description`, `og:type=website`, `og:url`, `og:image`, `og:site_name`, `og:locale=sr_RS`.
- **`og:image` is `/images/favicon/android-chrome-512x512.png`** — confirmed, a 512×512 **square** PNG favicon asset, not a purpose-built 1200×630 social share image. This is used both in the static shell and as the hardcoded default in `SEOHelmet.tsx:20` (`ogImage = 'https://aisajt.com/images/favicon/android-chrome-512x512.png'`), meaning **every single page on the site** shares this same square favicon as its social preview image unless a page explicitly overrides `ogImage` (none do, based on repo-wide grep for `ogImage=` outside the default). Any link to any page shared on Facebook/LinkedIn/Slack/iMessage will show a stretched/cropped favicon instead of a real preview image.
- Twitter Card tags: present, but **only client-side** — `SEOHelmet.tsx:95-100` adds `twitter:card=summary_large_image`, `twitter:title`, `twitter:description`, `twitter:image` via `useEffect`. The **static shell has no Twitter tags at all** (absent from `index.html`). Any crawler/bot that reads raw HTML (many social-preview scrapers do not execute JS) will find no Twitter Card tags on first load.

### Verification meta tags
Both present in `index.html` and **both are placeholder/dummy values, not real verification tokens**:
```html
<meta name="google-site-verification" content="google-site-verification=1" />
<meta name="yandex-verification" content="yandex-verification=1" />
```
A real Google Search Console HTML-tag token is a long random string (typically 43+ characters); `"google-site-verification=1"` is a literal placeholder string that was never replaced. Same for the Yandex tag. **These tags currently do nothing** — they don't verify site ownership in either Search Console or Yandex Webmaster, and their presence (with an obviously-templated value) is a visible sign of an unfinished setup to anyone who views source.

### robots.txt
Present at `public/robots.txt`, full contents:
```
# robots.txt for AiSajt.com
# Main domain: https://aisajt.com (non-www, HTTPS only)

User-agent: *
Allow: /

# Sitemap location (use canonical domain)
Sitemap: https://aisajt.com/sitemap.xml

# Block access to admin/private areas
Disallow: /admin/
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
Issues:
- `Disallow: /admin/` blocks a path that **does not exist** in the app (the real admin area is `/portal/admin/...`). This rule is dead weight.
- **`/portal/` is not disallowed anywhere.** The client portal — login page, and critically the token-gated public SEO report page `/portal/izvestaj/:token` — is fully crawlable per robots.txt. See §9.
- No explicit AI-crawler directives (`GPTBot`, `ClaudeBot`, `PerplexityBot`, `OAI-SearchBot`, `Google-Extended`, `CCBot`) exist anywhere in the file. Because the blanket `User-agent: *` rule is `Allow: /`, these bots **are allowed by default** (nothing blocks them) — which is the *desired* outcome for this business per §8, but it's implicit rather than an intentional, documented decision.
- A secondary `public/netlify-robots.txt` file exists and is wired via `netlify.toml`/`public/_redirects` to be served instead of the main `robots.txt` specifically when the host is `aisajt.netlify.app` — a legacy artifact from when Netlify was live; irrelevant if Vercel is now canonical, but not confirmed dead.

### sitemap.xml
Present at `public/sitemap.xml`, static XML file (not dynamically generated at build or request time — no sitemap-generation script found in `package.json` or `scripts/`). Referenced correctly in `robots.txt` (`Sitemap: https://aisajt.com/sitemap.xml`).

Contains 21 `<url>` entries: `/`, `/seo-optimizacija-cena`, `/izrada-sajta-cena`, `/web-dizajn`, `/izrada-web-shopa`, `/blog`, 4× `/blog/category/*`, 2× blog posts, `/funnel`, `/promet-sistem`, `/resources`, `/thank-you`, `/resources/quiz`, `/resources/audit`, `/resources/guide`, `/resources/checklist`, `/privacy`, `/terms`.

**Missing from sitemap despite being live, routed pages**:
- `/izrada-sajta-detalji` (routed in `App.tsx:117`, has real content including a Reviews section — see §7)
- `/seo-optimizacija-detalji` (routed in `App.tsx:118`)

Correctly **excluded** from the sitemap: `/seo` and `/contact` (the aliases — correct, avoids duplicate submission), and all `/portal/*` routes (correct, portal shouldn't be in the public sitemap — though see robots.txt gap above, sitemap exclusion alone doesn't stop crawling of *discovered* portal links).

`lastmod` dates are manually maintained and span from `2026-01-04` to `2026-08-12` — no evidence of automated freshness.

### Structured data / JSON-LD
Multiple, inconsistent implementations exist:

1. **Static shell** (`index.html:68-178`) — `@type: "ProfessionalService"` (a LocalBusiness subtype), present on every route since it's baked into the one shared HTML shell:
   - `name`, `url`, `logo`, `description`, `image` (the same square favicon), `telephone: "+381613091583"`, `email: "office@aisajt.com"`, `address` (locality "Beograd", country "RS", **no street address**), `areaServed: Serbia`, `priceRange: "$$"`, a full `hasOfferCatalog` with 5 service offers, `founder` (2 named people with job titles), and an **`aggregateRating`**: `{"ratingValue": "5", "reviewCount": "50"}`.
   - The `aggregateRating` block is a real concern: Google's structured-data guidelines require `AggregateRating`/`Review` markup to reflect reviews that are genuinely visible and verifiable on the page (or clearly sourced), and explicitly disallow **self-serving ratings about your own business with no visible corroborating reviews**. No testimonial or review UI exists anywhere on the homepage or in any routed page (confirmed via repo-wide search — no "testimonial" component exists). This is unsubstantiated aggregate-rating markup and is a legitimate structured-data policy risk, not just a content-quality nitpick.

2. **`SEOHelmet.tsx:122-221`** — a *second*, client-side-only `@graph` with `LocalBusiness` + `Organization` nodes, injected only when `includeBusinessSchema={true}` (used on Home, SEO, WebShop, IzradaSajtaCena, WebDizajn pages — confirmed via grep). This schema has **materially different NAP data** than the static shell:
   - `telephone: "+381621552156"` (different from the static shell's `+381613091583`)
   - `email: "contact@aisajt.com"` (different from the static shell's `office@aisajt.com`)
   - A full street address: `"Maraka Oreskovca 42", postalCode "11000", Beograd` — **absent** from the static shell's schema
   - Tax ID, VAT ID, company registration number ("Matični broj"), geo-coordinates — all absent from the static shell's schema
   - `sameAs`: `instagram.com/aisajt`, `facebook.com/aisajt`
   - **Both the `LocalBusiness` and `Organization` nodes share the identical `"@id": "https://aisajt.com/#organization"`** (`SEOHelmet.tsx:127,177`) — technically malformed `@graph` usage; two nodes with the same `@id` and different `@type`s will either merge unpredictably or confuse consumers, this should be two distinct `@id`s (e.g. `#organization` and `#localbusiness`) referencing each other via `@type: ["LocalBusiness","Organization"]` on one node, or kept as separate IDs.
   - **This is a real NAP (Name/Address/Phone) inconsistency across the site's own structured data** — see §9, flagged as high-priority.

3. **FAQ schema** — implemented twice, differently:
   - `src/components/sections/FAQ.tsx:157-174` — a raw `<script type="application/ld+json">` rendered directly in JSX (ends up in `<body>`, not `<head>`; valid per Google's guidelines but unconventional), used on the Home page's embedded FAQ section.
   - `SEOHelmet.tsx:224-247` — a second FAQ schema mechanism, gated by `includeFAQSchema={true}` + a `faqItems` prop, used on SEOPage, WebShopPage, IzradaSajtaCenaPage, WebDizajnPage.
   - Both are legitimate `FAQPage` schema with real Q&A content — this is one of the site's genuine structured-data strengths (see §8).

4. **BlogPosting schema** — `src/components/blog/BlogPostSchema.tsx`, per-post `@type: "BlogPosting"` via `react-helmet-async`'s `<Helmet>`, with `headline`, `description`, `image`, `datePublished`, `dateModified`, `author` (Organization, not Person), `publisher`, `mainEntityOfPage`. Reasonably complete.

5. **No `BreadcrumbList` schema anywhere** (confirmed, repo-wide search).
6. **No dedicated `Service` schema per service page** — services only appear nested inside the static shell's `hasOfferCatalog`, not as standalone `Service`/`Offer` entities on `/web-dizajn`, `/izrada-web-shopa`, etc.
7. **No `Review`/`CreativeWork` schema for the case studies** (Kralj Residence, BN Autofolije, IN-STAN) anywhere — these exist only as portfolio-carousel content, never as schema.

All of items 2–4 are injected via `useEffect`/React render, meaning **none of them exist in the raw pre-JS HTML** except item 1 (the static shell's `ProfessionalService` block, which is the only JSON-LD guaranteed to reach a non-JS-executing crawler).

### Hreflang
**Not present anywhere** (confirmed, repo-wide search for `hreflang`). The site is nominally Serbian-only in URL structure — a single `sr` `lang` attribute is set on `<html>` in the static shell (`index.html:2`, `<html lang="sr">`) and dynamically updated by `LanguageContext.tsx:24` (`document.documentElement.lang = language`).

However, this is **not actually a Serbian-only site** — it has full English string translations for nearly every page (`src/types/language.ts` and per-page `language === 'sr' ? ... : ...` ternaries throughout). The English variant is toggled via a `LanguageContext` that persists the choice to `localStorage` (`LanguageContext.tsx:16-19`) and **never changes the URL** — there is no `/en/` path or `?lang=en` query param. This means: (a) hreflang is correctly *not needed* in the strict sense since there's only one crawlable URL set, but (b) the English content is functionally invisible to search engines and to any first-time visitor/crawler (default state is always `'sr'`, and a crawler has no `localStorage` and never toggles the UI) — so English is dead weight from an SEO perspective, not a legitimate international-SEO strategy. If English-market SEO is ever a goal, this content needs real `/en/*` URLs and hreflang; as implemented it earns nothing and adds bundle weight.

### H1 structure
Nearly every page component has **exactly one** `<h1>` (verified via `grep -c "<h1"` across all files in `src/components/pages/`). Two exceptions found:
- `PortfolioDetailPage.tsx` — 2 H1s (moot: this component is unrouted/dead code, §3)
- `QuizPage.tsx` — 2 H1s (this **is** routed at `/resources/quiz` — a real duplicate-H1 issue worth fixing)

Whether the H1 is present in pre-JS raw HTML: **no**, for any marketing page's *visible* H1 — see §5. The static shell does contain an H1 (`index.html:257`, inside the visually-hidden `<article>` block, and a second, different H1 inside `<noscript>` at `index.html:205`) but these are not the same text as the H1 each React page actually renders once hydrated. Three different H1-equivalent strings exist for the homepage alone:
1. Hidden pre-hydration article H1 (`index.html:257`): `"AI Izrada Sajtova Beograd - Profesionalna Izrada Web Sajtova"`
2. `<noscript>` H1 (`index.html:205`): `"Izrada Web Sajta - Profesionalne Usluge Beograd"`
3. The actual rendered `<Hero>` component's H1 (client-side, post-hydration) — a third, different string.

### Image handling
- **Formats**: `public/images/` contains 46 PNG, 11 JPG, 10 WebP, 1 ICO. The overwhelming majority of content images (portfolio screenshots, case-study visuals) are **PNG**, not WebP/AVIF. Total `public/images/` size: **64 MB**.
- **Individual file sizes are severe**: `prestige.png` 4.9 MB, `panic.png` 3.6 MB, `instan.png` 3.6 MB, `kralj.png` 3.5 MB, a dizajn screenshot 3.5 MB, `bnautofolije.png` 3.5 MB, `komotraks.png` 3.4 MB, `bn.png` 3.4 MB, `loki.png` 3.2 MB, `"kompletan poslovni web sajt.png"` 3.2 MB, and several more multi-MB PNGs — these are raw, uncompressed-looking screenshots used directly as `<img src>` (e.g. `kralj.png`/`bn.png`/`instan.png` are the exact filenames referenced by the homepage case-study carousel). This is a severe, easily-fixed Core Web Vitals (LCP) risk.
- **`loading="lazy"`**: only **16 of 75** `<img>` tags in `src/` use `loading="lazy"` explicitly (confirmed via grep). No `loading="eager"`/priority strategy is consistently applied to above-the-fold hero images either — one Hero image is explicitly `loading="eager"` (`Hero.tsx:148`, correct for LCP) but this is inconsistent across pages.
- **No explicit `width`/`height` attributes** found on the sampled `<img>` tags (Hero, PortfolioCard, Navbar logo) — this is a CLS (layout shift) risk since the browser can't reserve space before the image loads. Sizing is done via Tailwind CSS classes (`h-72`, `h-12 md:h-14`), which doesn't provide the same reflow protection as native `width`/`height` or `aspect-ratio`.
- **Alt text**: mostly present, in Serbian, and mostly relevant — but some instances are **keyword-stuffed relative to what the image actually is**. Example: `Hero.tsx:147`, an image alt reads `"AI izrada sajtova - Profesionalna izrada veb sajta sa veštačkom inteligencijom"` ("AI website development - Professional website development with artificial intelligence") for what is effectively a nav/hero graphic — a full marketing sentence as alt text, not a description of image content. Several purely decorative images correctly use `alt=""` (e.g. `FunnelPage.tsx:384,838`), which is good practice.
- No next-gen `<picture>`/`srcset` responsive-image usage found anywhere in the sampled components — images are single-source `<img src>` tags.

### Internal linking
Present between service pages — e.g. `IzradaSajtaCenaPage.tsx:785,794` links to `/seo-optimizacija-cena` with descriptive Serbian anchor text inside body copy, not just nav/footer boilerplate. The Navbar's "Usluge" dropdown and Footer also link across all core service pages. Anchor text is generally keyword-relevant Serbian phrases, not generic "click here" — a genuine strength.

### noindex/nofollow
No accidental `noindex` found. The only `noindex` logic in the codebase is the intentional, opt-in `noindex` prop on `SEOHelmet` (defaults to `false` everywhere it's used — confirmed no page passes `noindex={true}`). **However**, no page under `/portal/*` uses `SEOHelmet` or any meta-tag mechanism at all (confirmed, no `SEOHelmet`/`Helmet` import anywhere in `src/portal/`) — meaning portal pages, including the publicly-reachable `/portal/izvestaj/:token` and `/portal/login`, inherit **whatever the static shell's default robots meta is** (`index.html:21-23`: `index, follow`), i.e., they are **not noindexed** either in-page or via robots.txt. See §9.

---

## 5. RENDERING & INDEXABILITY (highest-impact finding)

**Definitive answer: this is a 100% client-side-rendered (CSR) single-page application. There is no SSR, no SSG, and no prerendering step anywhere in the build or deploy pipeline.**

Evidence:
1. `package.json` contains no SSR/SSG framework (no Next.js, no Remix, no Astro) and no prerender tooling (no `react-snap`, `vite-plugin-ssr`, `vite-ssg`, `puppeteer`-based prerender script). `vite build` (the only build script, `package.json:9`) produces a static asset bundle plus a single processed `index.html` — nothing more.
2. `vercel.json:5-8` rewrites confirm a pure SPA-fallback pattern:
   ```json
   "rewrites": [
     { "source": "/.netlify/functions/:path*", "destination": "/api/:path*" },
     { "source": "/((?!api/)(?!seo-panel\\.html).*)", "destination": "/index.html" }
   ]
   ```
   Every request that isn't `/api/*` or the one static `seo-panel.html` mockup is rewritten to the **same** `/index.html`. There is no per-route HTML file being served.
3. `netlify.toml:69-73` (the legacy config) has the identical pattern: `[[redirects]] from = "/*" to = "/index.html" status = 200` — "SPA fallback - handle client-side routing (MUST BE LAST)" per its own comment.
4. `App.tsx` mounts a `<BrowserRouter>` (`src/App.tsx:2,202`) — routing is resolved entirely in the browser after JS executes; there is no `StaticRouter`/server entry file anywhere in the repo.

**Does each route have its own static HTML file?** No. **Every single route — `/`, `/blog/koji-sajt-mi-treba-za-firmu`, `/funnel`, `/seo-optimizacija-cena`, all 20+ routes — serves the byte-identical `index.html` shell.** The only thing that differs per request is the URL itself; all content, meta tags, and structured data beyond what's hardcoded in the shell are injected by JavaScript after the browser downloads and executes the React bundle.

**What's in the raw, pre-JS HTML response** (this is the literal, single `index.html` served for every route):
- A real `<title>` and real meta description/keywords/OG/canonical/robots tags — but they are the **same for every route** (the homepage's values — see §4). A crawler that does not execute JavaScript sees identical `<title>`/meta on `/`, `/funnel`, `/blog/seo-osnove-za-pocetnike`, etc.
- One JSON-LD block (`ProfessionalService`) — again, identical on every route.
- A `<noscript>` block (`index.html:202-252`) with real, human-readable H1/H2/paragraph content about the agency, its services, and its 3 case studies — this is a genuine fallback for JS-disabled browsers, but it is **identical on every route** and only rendered by browsers that literally have JavaScript disabled (essentially no real users, and most modern crawlers — including Googlebot — do execute JS, so this content is largely moot for SEO purposes, though harmless).
- A visually-hidden (`position: absolute; left: -9999px`) `<article>` block (`index.html:256-337`) containing a full second copy of H1/H2/nav-links/service descriptions/case studies — present in the DOM even with JS enabled, permanently off-screen. **This is a legitimate finding to flag as a risk**: intentionally hiding a large block of keyword-rich text off-screen for crawlers, while showing different content to visual users, is the textbook pattern search engines' hidden-text/cloaking heuristics are built to catch. It's not designed maliciously here — it reads as an SEO-consultant "fallback content for crawlers" pattern — but it is the same *shape* as a spam technique, sits alongside a JS-rendered page whose actual visible H1 is a *third*, different string, and is worth flagging explicitly for removal or conversion into genuinely visible content.
- `<div id="root">` — empty of real app content until JS executes.

**After JavaScript executes**, for any given route: React Router resolves the path, the matching lazy-loaded page component mounts, `SEOHelmet` (or `Helmet`) overwrites `document.title`, meta description, canonical, OG/Twitter tags, and injects page-specific JSON-LD — all via direct DOM mutation in a `useEffect`. The visible page content (real H1, body copy, images) also only exists in the DOM from this point.

**Practical implication**: Googlebot itself generally can execute JS (with a queued render delay), so Google likely does eventually see the fully-rendered, per-route content and meta. But:
- Any crawler/bot that does not execute JavaScript (many SEO auditing tools, some AI-answer-engine crawlers, social-media unfurlers, and — critically for §8 — **not all AI-assistant web-fetch tools execute JavaScript**) will see only the single, identical, homepage-flavored shell for every URL on the site.
- The **render-then-index queue delay** Google applies to JS sites means new/updated content on this site is indexed slower than an equivalent static/SSR site.
- The mismatch between what's in raw HTML (generic shell copy, one title/description for all routes) and what's rendered (per-route accurate title/description) creates the exact "different content to bots vs. renderers" ambiguity search engines' quality systems are designed to be suspicious of — even though the underlying intent here is ordinary SPA-SEO patching, not deception.

**Per-route meta tag mechanism, identified**: `src/components/seo/SEOHelmet.tsx` — a custom component, not `react-helmet-async`'s own `<Helmet>` JSX (that library IS installed and used in exactly two places: `src/main.tsx` for `HelmetProvider`, and `src/components/blog/BlogPostSchema.tsx` for blog-post JSON-LD). `SEOHelmet` does NOT prerender — it runs entirely in the browser via `useEffect`, querying and mutating `document.head` nodes directly. This confirms: the different-meta-per-route behavior visible from a browser is 100% client-side, with zero build-time or server-time generation.

**Conclusion**: This is the dominant technical SEO issue on the site. The fix path (not to be executed now, per task scope) would be introducing a prerendering or SSR step (e.g., Vite SSG plugin, a prerender-on-build script, or migrating the marketing shell to a framework with static export) so that each of the ~20 public routes ships its own fully-formed HTML with correct title/description/canonical/H1/JSON-LD baked in.

---

## 6. PERFORMANCE & TECHNICAL

**Font loading**: Google Fonts via `<link>`, not self-hosted, not `next/font` (there is no Next.js). `index.html:28-30`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400;600;700;900&family=Playfair+Display:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" media="print" onload="this.media='all'" />
```
Uses the `media="print" onload="this.media='all'"` trick to defer font CSS as non-render-blocking — a legitimate, correctly-applied performance pattern. `preconnect` hints are present and correct.

**Third-party scripts** — all loaded from the static shell (`index.html:35-195`), each gated behind a `hostname !== 'localhost'` check so they don't fire in local dev:
1. **Google tag (gtag.js / GA4)** — `G-6C046QS9HG` (`index.html:39,46`). Injected dynamically via `document.createElement('script')` with `async = true` — non-blocking.
2. **Meta (Facebook) Pixel** — id `1206162938252666` (`index.html:61`, confirmed). Loaded via the standard Meta boilerplate snippet, async. A `<noscript>` pixel `<img>` fallback is also present (`index.html:200`).
3. **HubSpot** — portal ID `147390341`, EU region (`index.html:180-195`). Two scripts: `hs-script-loader` (async+defer) and a forms-embed script (defer). Also used directly for form submission (`src/utils/hubspot.ts`, bypasses the loaded HubSpot JS entirely via a raw `fetch()` POST to `api.hsforms.com`).
4. **No Google Ads/Google Tag Manager container** found separately from the gtag.js snippet above (no `GTM-XXXXXXX` container ID anywhere).
5. **No Hotjar, Clarity, or other session-recording tool** found.
6. **Google Ads conversion tracking is wired up but non-functional**: `src/utils/analytics.ts:56-68`, `trackGoogleAdsConversion()` sends to `'send_to': 'AW-XXXXXXXXXX/${conversionLabel}'` — **`AW-XXXXXXXXXX` is a literal, un-replaced placeholder Google Ads account ID**, not a real one. Notably, this function is **never called anywhere** in the codebase (confirmed via grep) — it's dead code with a placeholder value, consistent with the pattern of half-finished tracking/verification setup seen elsewhere (§4's fake verification tags).
7. **No visible cookie-consent/GDPR banner** anywhere in `src/` (confirmed, no "cookie consent"/"GDPR banner" component exists) despite GA4, Meta Pixel, and HubSpot all loading and setting tracking cookies unconditionally on every non-localhost page load, for every visitor, before any consent is gathered. See §9.

**Render-blocking / bundle**: `vite.config.ts:26-71` defines manual chunk-splitting (react-vendor, router-vendor, ui-icons, ui-toast, email-vendor, markdown-vendor, helmet-vendor, gsap-vendor, supabase-vendor, portal) and Terser minification with `drop_console`/`drop_debugger` — reasonable production hygiene. Marketing pages are lazy-loaded via `React.lazy()` (`App.tsx:9-26`), so the initial JS payload for any given route is scoped to that route's chunk plus vendor chunks — a legitimate mitigation given the CSR architecture, though it doesn't address the core rendering/indexability issue in §5.

**Core Web Vitals risks**:
- **LCP**: the 64MB, multi-megabyte-PNG image library (§4) is the single biggest risk — if any of those images render above the fold (portfolio/case-study visuals do, on `/` and `/funnel`), LCP will be poor on real-world connections.
- **CLS**: no explicit image `width`/`height` and no skeleton/placeholder sizing seen in sampled components — layout shift risk as images load in.
- **INP/TBT**: `AppContent` in `App.tsx:76-101` imposes artificial `setTimeout` delays (800ms initial load, 600ms on every route change) before rendering the actual page (`LoadingScreen` shown in the interim) — this is a deliberate UX choice (a branded loading screen) but it also means **every route navigation has a guaranteed minimum ~600ms of nothing-but-spinner**, which is both a UX and a perceived-performance cost, and pushes real content (and its meta) further from first paint.

**HTTPS / security headers**: Both hosting configs set the same header set for all routes:
```
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```
(`vercel.json:29-37`, `netlify.toml:29-36`, identical). **No `Strict-Transport-Security` (HSTS) header and no `Content-Security-Policy` (CSP) header in either config** (confirmed, grep for both terms across both files returns nothing). HTTPS itself is enforced via redirects in the legacy `netlify.toml`/`public/_redirects` (`http://` → `https://`), but there is **no equivalent explicit HTTP→HTTPS redirect rule in `vercel.json`** — if Vercel is indeed the live host (per §2), HTTPS enforcement is likely handled by Vercel's platform-level automatic behavior rather than by anything in this repo, which is common and generally fine, but not independently verifiable from code.

**Apex vs. www redirect — UNCERTAIN, explained**: `netlify.toml:39-67` and `public/_redirects:1-12` both contain explicit, consistent redirect rules forcing `www.aisajt.com` → `https://aisajt.com` (apex) in all HTTP/HTTPS combinations, plus `aisajt.netlify.app` → `aisajt.com`. This matches the canonical URLs used throughout the code (§4). **However**, per §2's evidence that the API layer was migrated to Vercel, it's unclear whether Netlify is still the active DNS/hosting target at all — `vercel.json` contains **no equivalent apex/www redirect rule**, meaning if Vercel now owns the domain, that redirect logic would need to exist in Vercel's dashboard-level domain settings (not visible in this repo) or it doesn't exist at all in production, regardless of what the code implies. **This cannot be resolved by reading the codebase alone** — it requires checking live DNS/hosting dashboard configuration, which is out of scope for a code audit.

**Mobile responsiveness**: Tailwind confirmed as the styling system; sampled components consistently use responsive utility classes (`md:`, `lg:` breakpoints throughout `Navbar.tsx`, `HomePage.tsx`, etc.) and a correct `viewport` meta tag is present (`index.html:10`). No obvious mobile-breaking patterns found in the sampled files, though a full device-matrix visual check was out of scope for this static-code audit.

**Caching headers**: `vercel.json:14-28` and `netlify.toml:15-27` both explicitly set `Cache-Control: public, max-age=3600` for `/sitemap.xml` and `/robots.txt` specifically. **No explicit caching rules for static assets** (JS/CSS bundles, images) in either config — Vite's default hashed-filename output (`[name].[hash].js`) makes aggressive caching safe, but no explicit long-`max-age`/`immutable` cache-control header was found being set for `/assets/*` in either hosting config; this likely falls back to each platform's default static-asset caching behavior.

---

## 7. CONTENT & CONVERSION

**Content quality / over-optimization**: The homepage and each service page mix genuinely substantive, specific content (real pricing tiers, real case-study metrics, detailed FAQ answers) with visibly repetitive keyword phrasing. Concretely:
- The visually-hidden `<article>` block alone (`index.html:256-337`, not counting the `<noscript>` duplicate) repeats "izrada" (build/development) or "izrada sajta/web sajta" variants roughly 25+ times across ~1,100 words of copy — multiple headings are near-duplicates of each other ("Kompletna Usluga Izrade Web Sajtova", "Naše Usluge Web Dizajna i Razvoja", "Zašto Izabrati AiSajt za Izradu Vašeg Web Sajta?"). This reads as written to satisfy a keyword-density target rather than for a human reader, and because it's hidden off-screen, it can't even be justified as "verbose but genuinely useful" copy — nobody sees it.
- The `<noscript>` fallback (`index.html:202-252`) repeats the same pattern independently.
- Actual on-page (rendered) service-page copy is generally better — e.g. `IzradaSajtaCenaPage.tsx`'s FAQ answers and pricing breakdown read as normal, useful prose, not keyword-stuffed. The stuffing risk concentrates specifically in the **static shell's SEO-fallback text and meta tags**, not uniformly across all rendered content.
- **Assessment**: this crosses from "SEO-conscious copywriting" into "quality risk" territory specifically in the invisible/near-invisible blocks (hidden article, noscript, static meta) — precisely the parts of the site most exposed to non-JS-executing crawlers and least exposed to human review, which is an unfortunate combination.

**Substantial vs. thin**: Mixed. The two blog posts are long-form and substantive (682 lines of content data for 2 posts — average ~340 lines/post of structured content). Service pages (`IzradaSajtaCenaPage`, `SEOPage`, `WebDizajnPage`, `WebShopPage`) each contain multiple content sections: pricing breakdowns, FAQs, process explanations — genuinely useful, not filler-only. The weakest content is concentrated in the invisible/duplicate blocks noted above, and in the fact that only 2 blog posts exist total despite `/blog` being marked `priority: 0.85` and `changefreq: daily` in the sitemap (§4) — a stale, thin content hub relative to its own stated priority/freq signals.

**Case studies (Kralj Residence, BN Autofolije, IN-STAN)**: Homepage-only, via a portfolio carousel (`src/components/sections/PortfolioCarousel.tsx:21,28,63`) with brief descriptions and external links to the live client sites (one of which points to `aislike.rs`, a different domain — likely another agency-owned property or a staging host, worth clarifying). **No dedicated internal case-study pages exist** — `PortfolioDetailPage.tsx` exists in the codebase and looks purpose-built for exactly this (detailed project writeups), but it is **not routed anywhere** (§3). This represents a concrete, low-effort content opportunity being left on the table: dedicated case-study URLs would be indexable, linkable, citable assets (relevant to §8) that currently don't exist.

**Trust signals**: The `aggregateRating` (5.0, 50 reviews) structured data claim exists (§4) but **no visible testimonial, review, or client-quote UI exists anywhere in the routed pages** (confirmed via repo-wide search) — this is an unsubstantiated claim in schema with zero on-page backing, which is both an SEO/structured-data policy risk and a missed conversion-rate opportunity (real testimonials are commonly persuasive content that's absent here). "50+ zadovoljnih klijenata" ("50+ satisfied clients") is stated as plain text in multiple places (`HomePage.tsx:998`, `:784`) but never sourced/verified on-page.

**CTAs / `/funnel` flow**: Single scrolling page, not a multi-step wizard — video, stats, portfolio, then a name/email/phone form. Navbar is intentionally removed on this page to reduce navigation-away friction (`Navbar.tsx:27-29`) — a deliberate, reasonable conversion-optimization choice. Submission goes directly client-side to HubSpot's public API (no backend validation/spam-filtering visible beyond whatever HubSpot itself provides) — functional but has no visible reCAPTCHA/honeypot spam protection in the sampled code.

**Pricing transparency**: Real, specific tiered pricing IS shown on `/izrada-sajta-cena` (299€ / 499€ / 699€ / "od 1899€" tiers, `IzradaSajtaCenaPage.tsx:328,386,448,520`) and on `/seo-optimizacija-cena` ("cena od 250€", `SEOPage.tsx:91`) and `/web-dizajn` ("od 350€", `WebDizajnPage.tsx:49`) — this is a genuine strength for both conversion and AI-citability (§8), since it goes beyond a bare "contact us for pricing" tease into real numbers with what each tier includes. **However**, as flagged in §4/§9, the "starting price" figure is **inconsistent across the site**: the static shell, the homepage meta description, and the FAQ component all say pricing starts "od 150€", while the actual dedicated pricing page says "od 299€". This is a real, fixable factual inconsistency on a site whose main value prop is "transparent pricing."

**NAP consistency**: **Not consistent** — this is one of the report's clearer, higher-priority findings. Two different phone numbers and two different emails are both live in code simultaneously:
| Field | Static shell (`index.html`) | Client-side schema (`SEOHelmet.tsx`) |
|---|---|---|
| Phone | `+381613091583` | `+381621552156` |
| Email | `office@aisajt.com` | `contact@aisajt.com` |
| Address | Beograd, RS (locality only) | "Maraka Oreskovca 42", 11000 Beograd, RS (full street address) |

The user-visible contact info elsewhere on the site (e.g. `index.html:228,334` noscript/hidden blocks, and presumably the Footer component) uses `office@aisajt.com` / `+381 61 3091583` — matching the static shell, **not** the `SEOHelmet` schema numbers. This means the JSON-LD structured data that Google actually associates with the business entity (via `SEOHelmet`, present on Home/SEO/WebShop/IzradaSajtaCena/WebDizajn — i.e., most of the site) **does not match** the phone/email a human visitor actually sees and dials/emails. This directly undermines Google Business Profile / local-pack NAP-matching, which depends on exact consistency.

A full street address (`"Maraka Oreskovca 42"`) does exist in the `SEOHelmet` schema, meaning this is not a purely-remote/no-address business for schema purposes — but that address never appears in visible page copy anywhere sampled, only inside client-injected JSON-LD, so a `LocalBusiness` schema strategy needs to decide (a) whether to expose the address as separate visible content and (b) which phone/email pair is authoritative before further schema work.

**Analytics for conversion tracking**: Yes — funnel submission is tracked via `trackFormSubmitAttempt('funnel_booking', language)` (`FunnelPage.tsx:256`, `src/utils/analytics.ts`), which fires a GA4 event (subject to GA4 actually being configured correctly server-side, not verifiable from code) and presumably a corresponding Meta Pixel custom event (pattern seen in `analytics.ts`'s `trackFBEvent` helper, used elsewhere in the file for lead events). The dead/placeholder Google Ads conversion function (`trackGoogleAdsConversion`, §6) is the one exception — wired up but non-functional and unused.

---

## 8. GEO / AEO READINESS

This section evaluates the site's readiness to be directly cited/quoted by AI answer engines (ChatGPT, Perplexity, Google AI Overviews) for queries like "koliko košta izrada sajta" or "agencija za izradu sajta Beograd."

- **Direct question-answering content**: Yes, genuinely present. `src/components/sections/FAQ.tsx:19-20` directly answers "Koliko košta izrada sajta? Koja je cena izrade web sajta?" with a specific, extractable answer (price ranges, what drives the range, an offer of free consultation). Additional FAQs cover timeline, maintenance, mobile responsiveness, SEO inclusion, and custom integrations (`FAQ.tsx`, full component) — all phrased as real user questions with direct answers, a strong pattern for AI-engine extraction.
- **FAQPage schema**: Present, twice (§4) — both the `FAQ.tsx` section (used on Home) and the `SEOHelmet`-driven version (used on SEO/WebShop/IzradaSajtaCena/WebDizajn pages) emit valid `FAQPage` JSON-LD with real question/answer pairs. This is one of the site's genuine AEO strengths on paper.
- **BUT — critical caveat tying back to §5**: all of the above (the FAQ section's visible text, and *every* JSON-LD FAQ block) is injected client-side only. An AI crawler/fetcher that does not execute JavaScript will see **none of this** — only the generic static shell content. Since not all AI-assistant web-fetch tools render JS (behavior varies by product and changes over time), this is a direct, concrete risk to the exact use case this section is evaluating: the FAQ content this business most wants cited may not be visible to the citing engine's crawler at all.
- **Pricing stated clearly enough to be cited**: Yes, largely — see §7. Real €-denominated tiers exist and are specific enough to quote. The one problem is the **150€ vs. 299€ inconsistency** (§4/§7/§9) — if an AI engine or human fact-checks the "starting from 150€" claim against the live pricing page, it will find a different number, which damages exactly the citability/trust this section is meant to protect.
- **`llms.txt`**: **NOT PRESENT** (confirmed, no such file anywhere in `public/` or elsewhere in the repo).
- **AI crawler access in robots.txt**: No explicit rules for `GPTBot`, `ClaudeBot`, `PerplexityBot`, `OAI-SearchBot`, `Google-Extended`, or `CCBot` (confirmed, §4). Because the blanket `User-agent: *` block is `Allow: /`, these crawlers are **allowed by default** — functionally correct for this business's stated interest in AI citations, but implicit/unintentional rather than a deliberate, documented policy. Nothing here needs urgent fixing, but nothing here was deliberately decided either.
- **Entity/author signals**: Partial. The static shell's schema names two real people as `founder` with job titles ("Strahinja", Arhitekta; "Bogdan", Osnivač & CEO, Programer ETF) — a reasonable entity signal. `sameAs` links to Instagram/Facebook exist, but **only in the client-side-only `SEOHelmet` schema**, not in the static shell's schema (so, again, invisible to non-JS crawlers). No LinkedIn, no Google Business Profile link found anywhere. NAP inconsistency (§7) directly undermines entity-consistency signals that both traditional SEO and AI-engine entity-recognition rely on.

**Net assessment for §8**: the raw ingredients for strong GEO/AEO performance exist (real FAQs, real pricing, named founders, a clear service catalog) — but nearly all of it is only reachable by a JS-executing crawler, and the parts that are visible without JS (the static shell) are the least specific, least citable, and contain the one factual inconsistency (150€) most likely to be caught and used against the site's credibility.

---

## 9. KNOWN GAPS / RED FLAGS

Ranked roughly by likely SEO/business impact:

1. **CSR-only rendering, no prerendering/SSR/SSG — confirmed, highest-impact issue.** Every route serves the identical `index.html` shell; all per-route title/description/canonical/OG/JSON-LD/H1/body content is injected client-side only. See §5 for full evidence.
2. **NAP inconsistency across the site's own structured data**: two different phone numbers (`+381613091583` vs `+381621552156`), two different emails (`office@aisajt.com` vs `contact@aisajt.com`), and an address that exists only in one of two competing JSON-LD blocks. See §7.
3. **Unsubstantiated `AggregateRating` schema** (5.0 stars, 50 reviews) with zero visible testimonial/review content anywhere on the site — a structured-data policy risk, not just a trust-signal gap. See §4, §7.
4. **Pricing inconsistency**: "od 150€" (static shell, FAQ) vs. "od 299€" (actual pricing page) — undermines the "transparent pricing" value proposition this business is built on. See §4, §7, §9.
5. **`og:image` is a 512×512 square favicon** (`/images/favicon/android-chrome-512x512.png`), used site-wide as the default social-share image for every page, with no page overriding it to a real 1200×630 image. Confirmed in both the static shell (`index.html:18`) and `SEOHelmet.tsx:20`'s hardcoded default.
6. **Placeholder/dummy verification and tracking values, left un-replaced**:
   - `google-site-verification=1` (`index.html:13`)
   - `yandex-verification=1` (`index.html:24`)
   - `AW-XXXXXXXXXX` Google Ads conversion ID (`analytics.ts:63`) — also dead code, never called.
   These do nothing functionally but are visible to anyone who views source, signaling an unfinished setup.
7. **Meta keywords tag present sitewide** (static shell + per-page via `SEOHelmet`) — ignored by all major search engines, and visibly repetitive in content, reinforcing an over-optimization impression.
8. **Keyword stuffing concentrated in the least human-visible content**: the visually-hidden off-screen `<article>` block and the `<noscript>` fallback both independently repeat "izrada (web) sajta" phrasing dozens of times; the homepage's static `<title>`/description are also stuffed. This is the exact content shape (invisible-to-users, keyword-dense, crawler-facing) that hidden-text/cloaking heuristics target — not flagged here as intentional deception, but as a real risk pattern regardless of intent.
9. **`/portal/` is fully crawlable per `robots.txt`** — the `Disallow: /admin/` rule blocks a path that doesn't exist (`/portal/admin/*` is the real path), and `/portal/` itself has no `Disallow` rule and no in-app `noindex` mechanism (confirmed: zero `SEOHelmet`/`Helmet` usage anywhere in `src/portal/`). The publicly-reachable (non-auth-gated) `/portal/izvestaj/:token` report page and `/portal/login` are both technically indexable today.
10. **Apex vs. www / HTTP→HTTPS enforcement is UNCERTAIN in the currently-live host.** The apex/www redirect logic that exists in code lives only in the legacy `netlify.toml`/`public/_redirects`, while git history and the `api/` structure indicate the site has migrated to Vercel, whose `vercel.json` contains no equivalent redirect rules. This cannot be resolved from source alone — it depends on live DNS/hosting-dashboard configuration not present in this repo. Flagged as a real risk because if unresolved, it could produce exactly the "canonical says apex, site resolves at www" mismatch the original brief suspected.
11. **Missing schema types**: no `BreadcrumbList` anywhere; no dedicated `Service` schema per service page (only nested inside one `hasOfferCatalog`); no `Review`/`CreativeWork` schema for the three named case studies.
12. **Facebook Pixel, GA4, and HubSpot all load unconditionally with no visible consent mechanism** — no cookie-consent banner or GDPR-consent-mode logic found anywhere in `src/`. Serbia's Personal Data Protection Law (based on GDPR) has consent requirements for non-essential tracking cookies; this is worth flagging as a legal/compliance consideration alongside the SEO audit, even though it's outside pure SEO scope.
13. **Two routed pages missing from `sitemap.xml`**: `/izrada-sajta-detalji` and `/seo-optimizacija-detalji` — both are live, routed, and have real content (the former even has a Reviews UI section, `IzradaSajtaDetaljiPage.tsx:406`, itself lacking Review schema).
14. **Duplicate-content-shaped URL aliases**: `/seo` mirrors `/seo-optimizacija-cena`; `/contact` mirrors `/funnel` — both render identical components. Canonical tags on these aliases correctly point to the "real" URL (mitigating risk), but the aliases exist with no clear purpose found in the codebase (no internal links point to them).
15. **64MB of largely unoptimized PNG images**, several 3-5MB individual files used directly as case-study visuals on high-traffic pages (home, funnel) — a severe, concrete Core Web Vitals/LCP risk. Only 10 of 67 raster images are WebP.
16. **Only 16 of 75 `<img>` tags use `loading="lazy"`**; no explicit `width`/`height` attributes found on sampled images — CLS risk.
17. **English-language content exists but is functionally unreachable by crawlers** — no `/en/` URLs, language toggle is `localStorage`-only and defaults to Serbian for every fresh visit/crawl. Not a bug, but dead SEO weight if any English-market intent exists.
18. **Six orphaned page components** (`FAQPage.tsx`, `ONamaPage.tsx`, `PortfolioPage.tsx`, `PortfolioDetailPage.tsx`, `PricingPage.tsx`, `BlogPage.tsx`) exist in the codebase but are not routed anywhere — dead code, and in `PortfolioDetailPage.tsx`'s case, a plausible half-built case-study-page feature that was never finished/wired in.
19. **Duplicate `<h1>` on the routed `/resources/quiz` page** (`QuizPage.tsx`).
20. **A stray, malformed `public/index.html`** exists alongside the real root `index.html` — it contains only a fragment of `<head>` content (no `<html>`, `<body>`, or `<title>` tag) with a *third* distinct meta description not used anywhere else in the codebase (`"AiSajt - Izrada sajtova po najpovoljnijim cenama... za samo 24h..."` — yet another differing claim). Because Vite copies everything in `public/` verbatim into the build output directory alongside the real generated `index.html`, this file is either silently ignored, causes a build warning, or risks colliding with the real build output depending on Vite's exact public-dir collision handling — worth a build-time check, flagged here as an anomaly rather than a confirmed active bug.
21. **`vercel.json`'s SPA rewrite excludes `seo-panel.html`** (`"(?!seo-panel\\.html)"`) — a standalone internal SEO-panel mockup file (`public/seo-panel.html`) is deliberately served outside the SPA. This is an internal tool, not a marketing page, but it is publicly reachable at `https://aisajt.com/seo-panel.html` with no `robots.txt` exclusion — likely low-risk but unreviewed here since it's outside the marketing-site scope.

---

## 10. RAW REFERENCE DATA

### package.json (full)
```json
{
  "name": "vite-react-typescript-starter",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "dev:netlify": "netlify dev",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "build:prod": "vite build && vite preview",
    "analyze": "vite build --mode analyze",
    "gsc:check": "node scripts/gsc-check.mjs"
  },
  "dependencies": {
    "@emailjs/browser": "^4.1.0",
    "@netlify/functions": "^5.1.5",
    "@react-pdf/renderer": "^4.4.1",
    "@supabase/supabase-js": "^2.103.0",
    "chart.js": "^4.5.1",
    "gsap": "^3.14.2",
    "html2canvas": "^1.4.1",
    "jspdf": "^4.2.1",
    "lucide-react": "^0.344.0",
    "react": "^18.3.1",
    "react-chartjs-2": "^5.3.1",
    "react-dom": "^18.3.1",
    "react-helmet-async": "^2.0.5",
    "react-hot-toast": "^2.4.1",
    "react-markdown": "^10.1.0",
    "react-router-dom": "^7.9.6",
    "resend": "^6.1.3"
  },
  "devDependencies": {
    "@eslint/js": "^9.9.1",
    "@types/node": "^25.8.0",
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@vercel/node": "^5.8.2",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.18",
    "cssnano": "^7.1.2",
    "eslint": "^9.9.1",
    "eslint-plugin-react-hooks": "^5.1.0-rc.0",
    "eslint-plugin-react-refresh": "^0.4.11",
    "globals": "^15.9.0",
    "netlify-cli": "^23.14.0",
    "postcss": "^8.4.35",
    "postcss-discard-comments": "^7.0.5",
    "tailwindcss": "^3.4.1",
    "terser": "^5.29.1",
    "typescript": "^5.5.3",
    "typescript-eslint": "^8.3.0",
    "vite": "^7.3.1"
  }
}
```

### robots.txt (full, `public/robots.txt`)
```
# robots.txt for AiSajt.com
# Main domain: https://aisajt.com (non-www, HTTPS only)

User-agent: *
Allow: /

# Sitemap location (use canonical domain)
Sitemap: https://aisajt.com/sitemap.xml

# Block access to admin/private areas
Disallow: /admin/
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

### sitemap.xml — URL list only (21 entries; full file at `public/sitemap.xml`)
- `/` (priority 1.0)
- `/seo-optimizacija-cena` (0.95)
- `/izrada-sajta-cena` (0.92)
- `/web-dizajn` (0.90)
- `/izrada-web-shopa` (0.88)
- `/blog` (0.85, daily)
- `/blog/category/seo` (0.80)
- `/blog/category/izrada-sajtova` (0.80)
- `/blog/category/web-dizajn` (0.80)
- `/blog/category/e-commerce` (0.80)
- `/blog/category/case-studies` (0.75)
- `/blog/koji-sajt-mi-treba-za-firmu` (0.80)
- `/blog/seo-osnove-za-pocetnike` (0.75)
- `/funnel` (0.95)
- `/promet-sistem` (0.9)
- `/resources` (0.7)
- `/thank-you` (0.5)
- `/resources/quiz` (0.6)
- `/resources/audit` (0.6)
- `/resources/guide` (0.55)
- `/resources/checklist` (0.55)
- `/privacy` (0.3)
- `/terms` (0.3)

### vercel.json (full)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/.netlify/functions/:path*", "destination": "/api/:path*" },
    { "source": "/((?!api/)(?!seo-panel\\.html).*)", "destination": "/index.html" }
  ],
  "functions": {
    "api/gsc-sync.ts": { "maxDuration": 60 },
    "api/gsc-query.ts": { "maxDuration": 60 },
    "api/gsc-auto-sync-all.ts": { "maxDuration": 60 }
  },
  "headers": [
    {
      "source": "/sitemap.xml",
      "headers": [
        { "key": "Content-Type", "value": "application/xml; charset=utf-8" },
        { "key": "Cache-Control", "value": "public, max-age=3600" }
      ]
    },
    {
      "source": "/robots.txt",
      "headers": [
        { "key": "Content-Type", "value": "text/plain; charset=utf-8" },
        { "key": "Cache-Control", "value": "public, max-age=3600" }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "SAMEORIGIN" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```

### netlify.toml (full — legacy config, likely superseded by Vercel, see §2/§6/§9)
```toml
[build]
  publish = "dist"
  command = "npm run build"
  functions = "netlify/functions"

[dev]
  framework = "vite"
  command = "npm run dev"
  port = 8889
  targetPort = 5173
  publish = "dist"

[[headers]]
  for = "/sitemap.xml"
  [headers.values]
    Content-Type = "application/xml; charset=utf-8"
    Cache-Control = "public, max-age=3600"

[[headers]]
  for = "/robots.txt"
  [headers.values]
    Content-Type = "text/plain; charset=utf-8"
    Cache-Control = "public, max-age=3600"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[redirects]]
  from = "http://www.aisajt.com/*"
  to = "https://aisajt.com/:splat"
  status = 301
  force = true

[[redirects]]
  from = "http://aisajt.com/*"
  to = "https://aisajt.com/:splat"
  status = 301
  force = true

[[redirects]]
  from = "https://www.aisajt.com/*"
  to = "https://aisajt.com/:splat"
  status = 301
  force = true

[[redirects]]
  from = "https://aisajt.netlify.app/*"
  to = "https://aisajt.com/:splat"
  status = 301
  force = true

[[redirects]]
  from = "http://aisajt.netlify.app/*"
  to = "https://aisajt.com/:splat"
  status = 301
  force = true

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### public/_redirects (full — legacy Netlify config, same caveat)
```
# Redirect HTTP www to HTTPS non-www (highest priority)
http://www.aisajt.com/* https://aisajt.com/:splat 301!

# Redirect HTTPS www to HTTPS non-www
https://www.aisajt.com/* https://aisajt.com/:splat 301!

# Redirect HTTP non-www to HTTPS non-www
http://aisajt.com/* https://aisajt.com/:splat 301!

# Redirect Netlify subdomain to primary domain
https://aisajt.netlify.app/* https://aisajt.com/:splat 301!
http://aisajt.netlify.app/* https://aisajt.com/:splat 301!

# Serve custom robots.txt for Netlify subdomain
/robots.txt /netlify-robots.txt 200  Host=aisajt.netlify.app

# Serve SEO panel mockup directly
/seo-panel.html /seo-panel.html 200

# Handle client-side routing (SPA fallback) - MUST BE LAST
/* /index.html 200
```

### Root index.html — full `<head>` (this is what ships for every route; body/noscript/hidden-article content described narratively in §5, full text in the source file `index.html:198-338`)
```html
<!doctype html>
<html lang="sr">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" type="image/x-icon" />
    <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="512x512" href="/images/favicon/android-chrome-512x512.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/images/favicon/apple-touch-icon.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Profesionalna izrada web sajta i izrada sajtova u Beogradu. Izrada sajta cena od 150€. Cena izrade sajta zavisi od projekta. Besplatna konsultacija i transparentna ponuda." />
    <meta name="keywords" content="izrada web sajta, izrada sajtova, izrada sajta cena, web sajt izrada, cena izrade sajta, izrada web sajta cena, izrada web sajta novi sad" />
    <meta name="google-site-verification" content="google-site-verification=1" />
    <meta property="og:title" content="Izrada Web Sajta | Izrada Sajtova | Izrada Sajta Cena Beograd" />
    <meta property="og:description" content="Profesionalna izrada web sajta i izrada sajtova u Beogradu. Izrada sajta cena od 150€. Cena izrade sajta zavisi od projekta. Besplatna konsultacija." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://aisajt.com" />
    <meta property="og:image" content="/images/favicon/android-chrome-512x512.png" />
    <meta property="og:site_name" content="AI Sajt" />
    <meta property="og:locale" content="sr_RS" />
    <meta name="robots" content="index, follow" />
    <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
    <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
    <meta name="yandex-verification" content="yandex-verification=1" />
    <meta name="author" content="AiSajt" />
    <meta name="theme-color" content="#1F2937" />
    <link rel="canonical" href="https://aisajt.com" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400;600;700;900&family=Playfair+Display:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" media="print" onload="this.media='all'" />
    <link rel="dns-prefetch" href="https://www.youtube.com" />
    <link rel="dns-prefetch" href="https://res.cloudinary.com" />
    <title>Izrada Web Sajta | Izrada Sajtova | Izrada Sajta Cena Beograd</title>

    <!-- GA4 gtag.js (async, injected via JS, skipped on localhost) -->
    <!-- Meta Pixel (async, injected via JS, skipped on localhost), id 1206162938252666 -->

    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "AI Sajt",
      "alternateName": "AiSajt.com",
      "url": "https://aisajt.com",
      "logo": "https://aisajt.com/images/providna2.png",
      "description": "Profesionalna izrada web sajta za firme u Beogradu i Srbiji. Tražite pouzdanu agenciju za izradu web sajta? Cena od 150€, transparentna ponuda.",
      "image": "https://aisajt.com/images/favicon/android-chrome-512x512.png",
      "telephone": "+381613091583",
      "email": "office@aisajt.com",
      "address": { "@type": "PostalAddress", "addressLocality": "Beograd", "addressCountry": "RS" },
      "areaServed": { "@type": "Country", "name": "Serbia" },
      "priceRange": "$$",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Usluge izrade web sajta",
        "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Izrada web sajta", "description": "Profesionalna izrada web sajta za firme. Tražite pouzdanu agenciju za izradu web sajta? Cena od 150€.", "provider": { "@type": "Organization", "name": "AiSajt" }, "areaServed": { "@type": "City", "name": "Beograd" } } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Web dizajn", "description": "Moderan i responzivan web dizajn prilagođen svim uređajima", "provider": { "@type": "Organization", "name": "AiSajt" } } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "SEO optimizacija", "description": "Tehnički SEO i optimizacija web sajta za Google pretraživače", "provider": { "@type": "Organization", "name": "AiSajt" } } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Baze podataka", "description": "Upravljanje bazama podataka i backend razvoj", "provider": { "@type": "Organization", "name": "AiSajt" } } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Online marketing", "description": "Digitalni marketing i promocija web sajtova", "provider": { "@type": "Organization", "name": "AiSajt" } } }
        ]
      },
      "founder": [
        { "@type": "Person", "name": "Strahinja", "jobTitle": "Arhitekta" },
        { "@type": "Person", "name": "Bogdan", "jobTitle": "Osnivač & CEO, Programer ETF" }
      ],
      "aggregateRating": { "@type": "AggregateRating", "ratingValue": "5", "reviewCount": "50" }
    }
    </script>

    <!-- HubSpot loader scripts (async/defer, injected via JS, skipped on localhost), portal 147390341 -->
  </head>
  <body>
    <!-- Meta Pixel noscript fallback -->
    <!-- Full <noscript> block: real agency copy, services list, case studies (index.html:202-252) -->
    <div id="root" style="background: white; min-height: 100vh;">
      <!-- Visually-hidden <article> block (position: absolute; left: -9999px) with a second full copy of
           H1/H2/service descriptions/case studies (index.html:256-337) -->
    </div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### Client-side-only JSON-LD injected by SEOHelmet.tsx (present on Home, SEO, WebShop, IzradaSajtaCena, WebDizajn — never in raw HTML)
```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": "https://aisajt.com/#organization",
      "name": "AI Sajt - Agencija za Izradu Sajta",
      "alternateName": "AiSajt",
      "url": "https://aisajt.com",
      "telephone": "+381621552156",
      "email": "contact@aisajt.com",
      "address": { "@type": "PostalAddress", "streetAddress": "Maraka Oreskovca 42", "addressLocality": "Beograd", "postalCode": "11000", "addressCountry": "RS" },
      "geo": { "@type": "GeoCoordinates", "latitude": "44.7866", "longitude": "20.4489" },
      "taxID": "115455769",
      "vatID": "RS115455769",
      "identifier": { "@type": "PropertyValue", "propertyID": "Matični broj", "value": "68380103" },
      "priceRange": "€€",
      "openingHours": "Mo-Fr 09:00-18:00",
      "areaServed": { "@type": "Place", "name": "Srbija", "address": { "@type": "PostalAddress", "addressCountry": "RS" } },
      "sameAs": ["https://www.instagram.com/aisajt", "https://www.facebook.com/aisajt"],
      "image": "https://aisajt.com/images/favicon/android-chrome-512x512.png",
      "logo": { "@type": "ImageObject", "url": "https://aisajt.com/images/favicon/android-chrome-512x512.png", "width": "512", "height": "512" },
      "description": "Profesionalna agencija za izradu sajtova i SEO optimizaciju u Beogradu. Specijalizovani za izradu web sajtova, online prodavnica i SEO usluge."
    },
    {
      "@type": "Organization",
      "@id": "https://aisajt.com/#organization",
      "name": "AI Sajt",
      "legalName": "AI Sajt - Agencija za Izradu Sajta",
      "url": "https://aisajt.com",
      "taxID": "115455769",
      "vatID": "RS115455769",
      "identifier": [
        { "@type": "PropertyValue", "propertyID": "PIB", "value": "115455769" },
        { "@type": "PropertyValue", "propertyID": "Matični broj", "value": "68380103" }
      ],
      "logo": { "@type": "ImageObject", "url": "https://aisajt.com/images/favicon/android-chrome-512x512.png", "width": "512", "height": "512" },
      "contactPoint": { "@type": "ContactPoint", "telephone": "+381621552156", "contactType": "customer service", "email": "contact@aisajt.com", "areaServed": "RS", "availableLanguage": ["sr", "en"] },
      "address": { "@type": "PostalAddress", "streetAddress": "Maraka Oreskovca 42", "addressLocality": "Beograd", "postalCode": "11000", "addressCountry": "RS" }
    }
  ]
}
```
Note the `@id` collision between the two nodes, flagged in §4/§9.

### FAQPage JSON-LD pattern (from `src/components/sections/FAQ.tsx:157-174`, structurally identical pattern used by `SEOHelmet.tsx:224-247`)
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "...", "acceptedAnswer": { "@type": "Answer", "text": "..." } }
  ]
}
```

### BlogPosting JSON-LD pattern (from `src/components/blog/BlogPostSchema.tsx`)
```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "...",
  "description": "...",
  "image": "https://aisajt.com{coverImage}",
  "datePublished": "...",
  "dateModified": "...",
  "author": { "@type": "Organization", "name": "...", "logo": { "@type": "ImageObject", "url": "..." } },
  "publisher": { "@type": "Organization", "name": "AiSajt", "logo": { "@type": "ImageObject", "url": "https://aisajt.com/images/providna2.png" } },
  "mainEntityOfPage": { "@type": "WebPage", "@id": "https://aisajt.com/blog/{slug}" },
  "articleSection": "...",
  "keywords": "...",
  "inLanguage": "sr-RS"
}
```

### Complete route list (flat, from `src/App.tsx`)
Marketing/public:
- `/`
- `/seo-optimizacija-cena`
- `/seo` (alias)
- `/izrada-sajta-cena`
- `/izrada-sajta-detalji`
- `/seo-optimizacija-detalji`
- `/izrada-web-shopa`
- `/web-dizajn`
- `/terms`
- `/privacy`
- `/contact` (alias)
- `/funnel`
- `/promet-sistem`
- `/thank-you`
- `/resources`
- `/resources/quiz`
- `/resources/audit`
- `/resources/guide`
- `/resources/checklist`
- `/blog`
- `/blog/:slug`
- `/blog/category/:categorySlug`

Portal (authenticated app, separate from marketing site):
- `/portal/izvestaj/:token` (public, token-gated)
- `/portal/login`
- `/portal/dashboard`
- `/portal/dashboard/poruke`
- `/portal/dashboard/fajlovi`
- `/portal/admin`
- `/portal/admin/poruke`
- `/portal/admin/klijenti`
- `/portal/admin/klijenti/novi`
- `/portal/admin/projekti/novi`
- `/portal/admin/projekti/:id`
- `/portal/seo`
- `/portal/admin/seo`
- `/portal/admin/seo/novi`
- `/portal/admin/seo/:id`
- `/portal/admin/seo/:id/preview`
- `/portal/admin/seo/:id/report`

Orphan components (not routed anywhere — dead code):
- `FAQPage.tsx`
- `ONamaPage.tsx`
- `PortfolioPage.tsx`
- `PortfolioDetailPage.tsx`
- `PricingPage.tsx`
- `BlogPage.tsx`

### The `<head>` shipped for every route — homepage and a service page
Because this is a CSR-only SPA with a single shared `index.html` shell (§5), **the raw pre-JS `<head>` is byte-identical for the homepage and every service page** — it is exactly the block reproduced in full above under "Root index.html — full `<head>`". There is no separate built `<head>` per route to show, because none exists; this fact is itself the section's answer.

Post-hydration (client-rendered, via `SEOHelmet`), the `<head>` differs per route. Example diffs vs. the static shell, for `/seo-optimizacija-cena` once JS has run:
- `<title>` changes to: `SEO Optimizacija Cena | SEO Optimizacija Sajta | Prva Pozicija Google`
- `<meta name="description">` changes to: `SEO optimizacija sajta za prvu poziciju na Google u Beogradu i Srbiji. Profesionalna SEO optimizacija - cena od 250€. Besplatna analiza sajta. Dovedite svoj web sajt na prvu stranicu Google pretrage.`
- `<meta name="keywords">` changes to: `seo optimizacija cena, seo optimizacija sajta, cena seo optimizacije, seo optimizacija beograd, prva pozicija google, seo cena beograd`
- `<link rel="canonical">` changes to: `https://aisajt.com/seo-optimizacija-cena`
- `og:title`/`og:description`/`og:url` update to match; `og:image` stays the same square favicon (no override supplied)
- `<meta name="twitter:*">` tags appear for the first time (absent from the static shell entirely)
- A second `<script type="application/ld+json" data-schema="business">` and a third `data-schema="faq">` are appended to `<head>` (the original static-shell `ProfessionalService` script remains untouched, so **two different LocalBusiness-shaped schema blocks with conflicting NAP data coexist in the DOM simultaneously** once JS runs on this page — see §7).

---

*End of report. No project files were modified in the course of this investigation, other than the creation of this report file itself.*
