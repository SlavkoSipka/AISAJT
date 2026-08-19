# Phase 4 Report — Structured Data (Schema)

**Status: Complete.** All schema now emits as raw prerendered `<script>` tags — confirmed zero `useEffect`-injected JSON-LD remains anywhere. One consolidated, sitewide `ProfessionalService` node replaces the two previously-overlapping business schema blocks. FAQPage schema now prerenders on all five pages that have real FAQ content (home + 4 service pages). New `Service` schema on the 4 service pages, with pricing only where genuinely stated on-page — one page's price claim turned out to be unbacked and was removed rather than kept. `BreadcrumbList` now emits on every non-home route via one reusable component. Blog schema fixed to reference the consolidated business node and centralized constants. **66 JSON-LD blocks across 27 routes, all syntactically valid.** Type errors: **83, unchanged from the Phase 3 baseline, zero new.**

---

## 4.1 — Business schema consolidated, prerendered

**Before**: two overlapping blocks — `root.tsx`'s `ProfessionalService` (prerendered, sitewide, but only had `addressLocality`+`addressCountry`, no street/postal) and `SEOHelmet.tsx`'s `LocalBusiness`+`Organization` pair (full address, tax IDs, `sameAs`, founder — but `useEffect`-injected, confirmed in Phase 2 to never reach prerendered HTML, so invisible to any crawler that doesn't execute JS).

**After**: one node, `src/components/seo/BusinessSchema.tsx`, rendered from `root.tsx`, `@type: "ProfessionalService"`, `@id: "https://aisajt.com/#business"`.

**Why one node instead of `["ProfessionalService","LocalBusiness"]` or two separate nodes**: schema.org's `ProfessionalService` extends `LocalBusiness`, which itself extends `Organization` — so a single `ProfessionalService` node already legitimately carries every property this site needs: `address`/`geo`/`openingHours`/`priceRange`/`sameAs` (LocalBusiness-level) **and** `taxID`/`vatID`/`identifier`/`founder`/`employee` (Organization-level, inherited). Phase 1 had kept `LocalBusiness` and `Organization` as two separate nodes specifically because it assumed those property sets couldn't coexist on one type — that assumption doesn't hold given the actual schema.org inheritance chain. One node also makes Phase 1's original malformation (two nodes sharing one `@id`) structurally impossible now, since there's only one node.

### Real findings caught while consolidating (not just a mechanical merge)

1. **`founder` didn't match visible content.** The old schema said `Strahinja — Arhitekta` and `Bogdan — Osnivač & CEO, Programer ETF`. The actual "Meet the Team" section on `/funnel` (and the orphaned `ONamaPage.tsx`, independently) both say `Bogdan Gradjanin — Suvlasnik, specijalizovani programer` and `Strahinja Zekanovic — Suvlasnik, dizajner i poslovanje` — different titles, and the schema was missing full last names entirely. Fixed to match exactly what's on the page. Also: the page names a third person, **Marko Devedzic — SEO i održavanje sajtova**, explicitly *not* called a co-owner anywhere on the page (`/funnel`'s "Suvlasnik" label applies only to Bogdan and Strahinja) — added him as `employee`, not `founder`, matching what's actually stated rather than either omitting him or fabricating a founder title.
2. **`hasOfferCatalog` listed two services that don't exist on the site.** "Baze podataka" (databases) and "Online marketing" had no matching route or navigable page — grep-confirmed "Baze podataka" only appears inside `QuizPage.tsx` (a quiz option, not a service), and "Online marketing" only in `ONamaPage.tsx`, which is **completely unrouted, orphaned code** (not in `routes.ts`, not imported anywhere — confirmed via grep, zero references). Trimmed the catalog to the four real, routed services, matching the Navbar exactly. Flagging `ONamaPage.tsx`/`PortfolioPage.tsx` as dead files for whoever does cleanup next — out of this phase's scope to remove, but both needed a one-line fix here just to keep `tsc` clean (see §4.1 cleanup below).
3. **`sameAs` — verified by actually fetching both URLs**, not assumed:
   - `instagram.com/aisajt` → **real, active business profile** (309 followers, real posts through Feb 2026, bio matches the business, founders tagged). Kept.
   - `facebook.com/aisajt` → resolves to an unrelated personal profile ("Siti Aisyah"), not the business. **Removed**, with a `TODO(owner)` in `site-config.ts` for the real URL if one exists.

### Cleanup this required
- `SEOHelmet.tsx`: removed `includeBusinessSchema`/`includeFAQSchema`/`faqItems` props and their entire `useEffect` injection block (confirmed dead since Phase 2 — never prerendered).
- Three callers were still passing the now-removed `includeBusinessSchema` prop (a type error once the prop was removed) — `HomePage.tsx` (live, routed) and the two orphaned files `ONamaPage.tsx`/`PortfolioPage.tsx` (found only because `tsc` checks the whole project regardless of routing). Fixed all three by dropping the dead prop.

---

## 4.2 — FAQPage schema on the 4 service pages

New `src/components/seo/FAQSchema.tsx` — reusable, takes the same `faqItems` array each page already renders as visible accordion content, so schema and page content can't drift apart (the *only* input is that one array). Wired into `IzradaSajtaCenaPage.tsx`, `SEOPage.tsx`, `WebDizajnPage.tsx`, `WebShopPage.tsx`, replacing the dead `SEOHelmet` props. Also refactored the homepage's `FAQ.tsx` (which already had its own working raw-script FAQPage schema since before this phase) to use the same component instead of its own copy — one implementation instead of two.

Note: all four service pages' `faqItems` are `language === 'sr' ? [...] : []` — empty for English. `FAQSchema` returns `null` when `items.length === 0`, matching that existing behavior exactly (no FAQ schema shown for the (currently unused) English variant, same as before).

---

## 4.3 — Service schema on the 4 service pages

New `src/components/seo/ServiceSchema.tsx` — `provider: {"@id": BUSINESS_ID}` (references the consolidated business node instead of a disconnected stub), `areaServed` Beograd+Srbija, `serviceType` per page, `offers`/`priceSpecification` **only where the price is genuinely visible on that page's body content** — checked each one directly, not assumed from the meta description:

| Page | Price in schema | Verified how |
|---|---|---|
| `/izrada-sajta-cena` | 299€ (`minPrice`) | Grepped the page body — "od 299€" appears as a real, prominent price display (line 328) plus multiple body mentions. |
| `/seo-optimizacija-cena` | 250€ (`minPrice`) | Body text: "Basic SEO paket od 250€ jednokratno ili 250€ mesečno" — real FAQ answer, visible content. |
| `/izrada-web-shopa` | 499€ (`minPrice`) | Body text: "od 499€" price display (line 272). |
| `/web-dizajn` | **omitted** | **The "350€" figure existed only in the meta description (both SR and EN) — grepped the entire page body for "€", zero matches.** No price is actually stated as visible content anywhere on this page. |

**Found and fixed a real bug, not just a schema omission**: since `webDizajn.tsx`'s meta description was already claiming "350€" *before* this phase (I'd carried it forward unchanged during Phase 3's de-stuffing, which wasn't scoped to checking price accuracy), and Phase 4's parity check surfaced that it was never actually backed by page content, I also removed the unsupported price claim from the meta description itself — not just from the new schema. Leaving a specific, unverifiable price in a live Google-search-visible meta description while fixing the *schema* version of the same problem would have been an inconsistent, incomplete fix. New description: *"Profesionalan web dizajn u Beogradu i Srbiji — moderan, responzivan dizajn prilagođen vašem brendu, uz besplatnu konsultaciju."* I did not add a price to the page body — that would be fabricating content, not fixing a description.

---

## 4.4 — BreadcrumbList, reusable

`src/components/seo/BreadcrumbSchema.tsx` — **one component, rendered once** from `root.tsx`'s `Root`, using React Router's `useMatches()` rather than a copy-pasted schema block per route. Each route module opts in with a one-line `export const handle = { breadcrumb: 'Label' }`:

- 17 static routes got a plain string label (`izradaSajtaCena.tsx` → `'Izrada Sajta Cena'`, etc. — matches Navbar/page-heading wording).
- `blogPost.tsx`/`blogCategory.tsx` needed the dynamic "Blog → [Post/Category]" case the task explicitly calls out. Since these aren't nested under `blogHub.tsx` in `routes.ts` (all routes are flat top-level entries), `useMatches()` alone can't recover an ancestor "Blog" crumb — so each got a small `loader()` (just the same `getPostBySlug`/`getCategoryBySlug` lookup `meta()` already does, exposing `{title}`/`{name}`) and a function-valued `handle.breadcrumb` returning **two** crumbs from that one match: `[{label:'Blog', path:'/blog'}, {label: <resolved title/name>}]`.
- Home (`home.tsx`) has no `handle.breadcrumb` — the component returns `null` whenever fewer than 2 crumbs would result, so `/` correctly has no `BreadcrumbList` at all.
- The `/seo` and `/contact` aliases reuse `seoOptimizacijaCena.tsx`/`funnel.tsx`'s exports automatically (same file, same `handle`), so their breadcrumb correctly shows their own alias path, not the canonical one — verified in the output table below.

Per the task's explicit framing, hierarchy stayed flat everywhere except blog (`Početna → [Page]`, not a 3-level `Početna → Resursi → Kviz` for `/resources/quiz` etc., even though the URL is nested) — matches "Početna → [Page], and Početna → Blog → [Post] for blog posts" literally.

---

## 4.5 — Blog schema check

`BlogPostSchema.tsx` was already migrated to a raw `<script>` in Phase 2C and does prerender — confirmed again this phase, unchanged. Fixed two things:
- Hardcoded `https://aisajt.com` → `SITE_URL`, hardcoded `'AiSajt'`/logo-stub `publisher` → cross-reference `{"@id": BUSINESS_ID}` (the consolidated node), matching the same "reference, don't repeat" pattern used everywhere else this phase.
- `datePublished`/`dateModified`/`author` were already sourced directly from `blogPosts.ts`'s real data (`2025-01-06`, `2025-01-05`, `"AiSajt Tim"`) — verified these are the actual dates in the data file, not fabricated. No changes needed there.

---

## Content-schema parity table

| Schema type | Route(s) | Backed by visible on-page content |
|---|---|---|
| `ProfessionalService` (business) | every route | Footer/Contact/Hero show the same email/phone/address (all from the same `NAP` constant); "Meet the Team" on `/funnel` shows the same founder/employee names+titles |
| `FAQPage` | `/`, 4 service pages | Identical `faqItems` array the page renders as a visible accordion — same object, not a re-typed copy |
| `Service` | 4 service pages | `serviceType`/description match the page's own H1/hero copy; `offers` price included only when grepped-confirmed visible in page body (omitted on `/web-dizajn`, where it wasn't) |
| `BreadcrumbList` | all non-home routes | Labels match the page's own heading/Navbar text; blog post/category labels are the literal post title / category name |
| `BlogPosting` | 2 blog posts | `headline`/`author`/dates read directly from the same `blogPosts.ts` fields `BlogPostPage.tsx` renders |

---

## Every JSON-LD block, parsed for validity

Parsed all `<script type="application/ld+json">` blocks in every one of the 27 prerendered `index.html` files (`json.loads()` on each — not eyeballed):

```
/blog/category/case-studies    ['ProfessionalService', 'BreadcrumbList']
/blog/category/e-commerce      ['ProfessionalService', 'BreadcrumbList']
/blog/category/izrada-sajtova  ['ProfessionalService', 'BreadcrumbList']
/blog/category/seo             ['ProfessionalService', 'BreadcrumbList']
/blog/category/web-dizajn      ['ProfessionalService', 'BreadcrumbList']
/blog                          ['ProfessionalService', 'BreadcrumbList']
/blog/koji-sajt-mi-treba-za-firmu  ['ProfessionalService', 'BreadcrumbList', 'BlogPosting']
/blog/seo-osnove-za-pocetnike      ['ProfessionalService', 'BreadcrumbList', 'BlogPosting']
/contact                       ['ProfessionalService', 'BreadcrumbList']
/funnel                        ['ProfessionalService', 'BreadcrumbList']
/                              ['ProfessionalService', 'FAQPage']
/izrada-sajta-cena             ['ProfessionalService', 'BreadcrumbList', 'FAQPage', 'Service']
/izrada-sajta-detalji          ['ProfessionalService', 'BreadcrumbList']
/izrada-web-shopa              ['ProfessionalService', 'BreadcrumbList', 'FAQPage', 'Service']
/privacy                       ['ProfessionalService', 'BreadcrumbList']
/promet-sistem                 ['ProfessionalService', 'BreadcrumbList']
/resources/audit               ['ProfessionalService', 'BreadcrumbList']
/resources/checklist           ['ProfessionalService', 'BreadcrumbList']
/resources/guide               ['ProfessionalService', 'BreadcrumbList']
/resources                     ['ProfessionalService', 'BreadcrumbList']
/resources/quiz                ['ProfessionalService', 'BreadcrumbList']
/seo-optimizacija-cena         ['ProfessionalService', 'BreadcrumbList', 'FAQPage', 'Service']
/seo-optimizacija-detalji      ['ProfessionalService', 'BreadcrumbList']
/seo                           ['ProfessionalService', 'BreadcrumbList', 'FAQPage', 'Service']
/terms                         ['ProfessionalService', 'BreadcrumbList']
/thank-you                     ['ProfessionalService', 'BreadcrumbList']
/web-dizajn                    ['ProfessionalService', 'BreadcrumbList', 'FAQPage', 'Service']
```

**Total: 66 JSON-LD blocks across 27 routes. 0 invalid.**

Full example blocks (from `/izrada-sajta-cena` and `/`):

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Izrada web sajta",
  "description": "Profesionalna izrada web sajta za firme u Beogradu, Novom Sadu i širom Srbije.",
  "url": "https://aisajt.com/izrada-sajta-cena",
  "provider": { "@id": "https://aisajt.com/#business" },
  "areaServed": [{ "@type": "City", "name": "Beograd" }, { "@type": "Country", "name": "Srbija" }],
  "offers": {
    "@type": "Offer",
    "priceCurrency": "EUR",
    "priceSpecification": { "@type": "UnitPriceSpecification", "priceCurrency": "EUR", "minPrice": 299 }
  }
}
```
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Početna", "item": "https://aisajt.com/" },
    { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://aisajt.com/blog" },
    { "@type": "ListItem", "position": 3, "name": "Koji Sajt Mi Treba za Firmu? Kompletan Vodič za Izbor Pravog Web Sajta", "item": "https://aisajt.com/blog/koji-sajt-mi-treba-za-firmu" }
  ]
}
```

(Full `ProfessionalService` node and `BlogPosting` example were spot-checked in raw HTML during this phase — omitted here for length, both valid and match §above.)

---

## Confirmed: raw prerendered HTML, not `useEffect`-injected

```
$ grep -n "data-schema\|LocalBusiness\|@graph" src/components/seo/SEOHelmet.tsx
(no output — the useEffect injection code is gone, not just disabled)

$ grep -rn "includeBusinessSchema\|includeFAQSchema" src --include="*.tsx" --include="*.ts"
(no output except a code comment explaining the removal)
```

Every schema block confirmed present via `cat`/direct file read on the **built `dist/client/*/index.html` files**, not via rendering the app in a browser — meaning it's genuinely in the static response a non-JS crawler receives, not something that only appears after hydration.

---

## URLs for the owner to run through Google's Rich Results Test

Can't hit Google from this environment — these are the ones worth checking manually, in priority order:

1. `https://aisajt.com/` — `ProfessionalService` + `FAQPage`
2. `https://aisajt.com/izrada-sajta-cena` — `ProfessionalService` + `BreadcrumbList` + `FAQPage` + `Service` (all four types on one page — the densest one)
3. `https://aisajt.com/blog/koji-sajt-mi-treba-za-firmu` — `BlogPosting` + `BreadcrumbList`
4. `https://aisajt.com/web-dizajn` — confirm the *absence* of a price in `Service` doesn't trigger a Google warning (it shouldn't — `offers` is optional — but worth eyeballing since it's the one page deliberately different from its three siblings)
5. One of `/seo` or `/contact` (the aliases) — confirm Google's tool resolves the breadcrumb to the alias path, not the canonical one

---

## Build / type-check

```
npm run build                              # exit 0 — 27/27 routes prerender + portal.html builds
npx tsc --noEmit -p tsconfig.app.json      # 83 errors — identical to the Phase 3 baseline, zero new
```

---

Phase 4 complete.
