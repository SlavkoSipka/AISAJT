# Phase 3 Report — Metadata Polish & NAP Centralization

**Status: Complete.** NAP (name/address/phone) is centralized into a single `src/lib/site-config.ts`, with every real consumer refactored to import from it. Seven keyword-stuffed titles/descriptions across the 27 routes are rewritten to read naturally. A genuinely live bug was found and fixed: `/thank-you` had no `meta()` export and was silently inheriting root's old *stuffed* fallback title — exactly the pattern this phase exists to remove. OG image stays the current default with an owner TODO (no quality branded asset could be produced here — see §3.3). Type errors: **83, unchanged from the Phase 2 baseline, zero new.**

---

## 3.1 — NAP centralized into `src/lib/site-config.ts`

```ts
export const SITE_URL = 'https://aisajt.com';

export const NAP = {
  name: 'AI Sajt',
  legalName: 'AI Sajt - Agencija za Izradu Sajta',
  email: 'office@aisajt.com',
  phone: {
    tel: '+381621552156',        // E.164 — tel: hrefs, JSON-LD, analytics params
    display: '+381 62 155 2156', // formatted for UI copy
    local: '062 155 2156',       // no-country-code, for one casual UI spot
  },
  address: {
    streetAddress: 'Maraka Oreskovca 42',
    addressLocality: 'Beograd',
    postalCode: '11000',
    addressCountry: 'RS',
    display: 'Beograd, Srbija',
    displayEn: 'Belgrade, Serbia',
  },
  hours: 'Mo-Fr 09:00-18:00',
} as const;
```

**Why three phone formats instead of one**: the pre-existing code already used three different textual formats for the *same* number (E.164 for `tel:` hrefs, `+381 62 155 2156` for display copy, and one casual `062 155 2156` team-member contact card on `/funnel`). Centralizing behind a single format would have either broken `tel:` links or changed visible UI copy nobody asked to change. All three now derive from one source, so a real number change only happens once — the drift risk (three different actual numbers appearing somewhere) is closed even though the formatting variety is kept.

### Files refactored (all consumer files named in the task, plus what grep surfaced)

| File | What changed |
|---|---|
| `src/utils/pageMeta.ts` | `DEFAULT_OG_IMAGE` and `og:site_name` now derive from `SITE_URL`/`NAP.name`. |
| `src/root.tsx` | `PROFESSIONAL_SERVICE_SCHEMA`'s `url`/`logo`/`image`/`telephone`/`email`/`address` now reference `SITE_URL`/`NAP`. **Also enriched**: the address here previously only had `addressLocality`+`addressCountry` (no street/postal), while `SEOHelmet.tsx`'s schema block had the full address — two different partial representations of the same business address is itself a NAP-drift problem. Both now use the identical full `NAP.address`. |
| `src/components/seo/SEOHelmet.tsx` | `baseUrl` replaced by `SITE_URL`; `og:site_name`; the `LocalBusiness`/`Organization` JSON-LD's `telephone`/`email`/`address`/`openingHours`/URLs all reference `NAP`/`SITE_URL`. |
| `src/components/sections/Hero.tsx` | The mock "Contact" card's email/phone now read from `NAP`. |
| `src/components/sections/Contact.tsx` | Location/email/phone block + `mailto:`/`tel:` hrefs now read from `NAP`. |
| `src/components/layout/Footer.tsx` | Email/phone/location block + hrefs + `aria-label`s now read from `NAP`. |
| `src/components/pages/FunnelPage.tsx` | `tel:` href, `trackPhoneClick` call, and the "Strahinja · 062 155 2156" contact card now read from `NAP.phone.tel`/`NAP.phone.local`. |
| `src/components/pages/PrivacyPage.tsx` | The email mention in the contact section now reads from `NAP.email`. |
| `src/components/pages/PrometSistemPage.tsx` | `EMAIL` now reads from `NAP.email`. `PHONE_DISPLAY`/`PHONE_TEL` deliberately **not** centralized — see below. |

### Deliberate exceptions (not centralized, and why)

1. **`PrometSistemPage.tsx`'s phone number (`061 203 9768` / `+381612039768`) is genuinely different from the canonical NAP number.** This is a dedicated Meta-ads landing page (`git log`: "Dodaj Promet Sistem landing za Meta ads saobraćaj") using a separate call-tracking number to attribute inbound calls to that specific ad campaign — a deliberate business decision, not a data-entry drift bug. I left it as a local constant with a comment explaining why, rather than forcing it onto the shared NAP and breaking call attribution.
2. **`src/data/blogPosts.ts`'s one `mailto:office@aisajt.com` markdown link** (line ~420, inside a blog post's prose content) stays a literal. It's article content, not a component — threading a JS import into a markdown template-literal string for one link would be inconsistent with how the rest of that content file works (plain prose, no interpolation anywhere else) for very little drift-protection benefit.
3. **JSON-LD blocks** (§ above) now derive from the constant, but the *shape* of the two schema blocks (`root.tsx`'s `ProfessionalService` and `SEOHelmet.tsx`'s `LocalBusiness`+`Organization`) was left untouched — merging or restructuring them is schema-architecture work explicitly deferred to Phase 4 (per `pageMeta.ts`'s own comment). Only the literal NAP values inside each were centralized.
4. **`SITE_URL` was not threaded through all 27 individual route modules' own `canonical`/`ogImage` literals.** The task named specific consumer files (`pageMeta.ts`, `root.tsx`, `SEOHelmet.tsx`, etc.) — I refactored those. Rewriting all 27 route modules' hardcoded canonical strings to `` `${SITE_URL}/path` `` would be a much larger, separate mechanical refactor not on that list, touching files whose canonical values are route-specific data (already correct), not NAP data. Flagging this as a deliberate scope boundary, not an oversight.

### Grep proof — no orphan hardcoded values remain

```
$ grep -rn "office@aisajt.com" src --include="*.tsx" --include="*.ts"
src/data/blogPosts.ts:420   ← the one documented content-literal exception (§ above)
src/lib/site-config.ts:13   ← the source of truth

$ grep -rn "062 155 2156\|62 155 2156\|+381621552156\|381621552156" src --include="*.tsx" --include="*.ts"
src/lib/site-config.ts:16,18,20   ← the source of truth (all three formats)
                                     (PrometSistemPage's 061 203 9768 number doesn't match this
                                      pattern at all — confirming it's genuinely a different number)

$ grep -rn "Maraka Oreskovca" src --include="*.tsx" --include="*.ts"
src/lib/site-config.ts:23   ← the source of truth
```

---

## 3.2 — De-stuffed titles and descriptions

Reviewed all 27 routes' `meta()` values (including the 7 data-driven blog post/category ones). Most already read naturally and were left untouched. Six needed real fixes, plus one file (`thankYou.tsx`) that had **no `meta()` at all**.

### A live bug found during the review, not just a style pass

`src/thankYou.tsx` had no `meta()` export, meaning `/thank-you` was silently inheriting `root.tsx`'s site-wide fallback — which still had the *exact* stuffed title the task uses as its bad-pattern example (`'Izrada Web Sajta | Izrada Sajtova | Izrada Sajta Cena Beograd'`). This wasn't a hypothetical: `/thank-you` genuinely shipped that title in its prerendered HTML before this fix. Gave it a proper, natural `meta()`; also de-stuffed the now-otherwise-dead root fallback itself (§ below) rather than leave it wrong.

### Before / after

| Route | Field | Before | After |
|---|---|---|---|
| `/izrada-sajta-cena` | title | `Izrada Sajta Cena \| Profesionalna Izrada Sajtova Beograd \| Izrada Web Sajta` (78 ch, "izrada" ×3) | `Izrada Sajta Cena u Beogradu \| Transparentne Cene \| AiSajt` (58 ch) |
| | description | *(195 ch, "izrada" ×3)* | `Izrada sajta po ceni od 299€ u Beogradu, Novom Sadu i širom Srbije. Transparentne cene, responzivan dizajn i SEO optimizacija uključeni. Besplatna konsultacija.` (160 ch) |
| `/seo-optimizacija-cena` | title | `SEO Optimizacija Cena \| SEO Optimizacija Sajta \| Prva Pozicija Google` (72 ch, "SEO Optimizacija" ×2) | `SEO Optimizacija Cena u Beogradu \| Prva Pozicija na Google` (58 ch) |
| | description | *(205 ch, "SEO optimizacija" ×2, "prvu poziciju/stranicu" redundant)* | `SEO optimizacija sajta za bolju poziciju na Google, cena od 250€. Radimo u Beogradu i širom Srbije, uz besplatnu analizu i transparentnu ponudu.` (144 ch) |
| `/web-dizajn` | title | `Web Dizajn Cena \| Profesionalan Web Dizajn Beograd \| Dizajn Sajta` (67 ch, "dizajn" ×3) | `Web Dizajn Cena u Beogradu \| Moderan, Responzivan Dizajn` (56 ch) |
| | description | *(198 ch, "web dizajn" ×3)* | `Profesionalan web dizajn u Beogradu i Srbiji, cena od 350€. Moderan, responzivan dizajn prilagođen vašem brendu, uz besplatnu konsultaciju.` (139 ch) |
| `/izrada-web-shopa` | description | *(180 ch — same idea restated 3 ways: "izrada web shopa" / "izrada sajta za online prodaju" / "cena izrade web prodavnice")* | `Profesionalna izrada web shopa u Beogradu, Novom Sadu i Srbiji — WooCommerce ili Shopify, cena od 499€. Besplatna konsultacija za vašu online prodavnicu.` (153 ch) — title was already natural, left as-is |
| `/seo-optimizacija-detalji` | title | `...Šta ti donosi **redovno SEO održavanje**?...` (exact 2-word phrase "SEO Održavanje" repeated verbatim) | `...Šta ti donosi **redovna optimizacija**?...` — one mention, minimal targeted fix, kept consistent with its sister page's (`izrada-sajta-detalji`) established title pattern |
| | description | *("SEO održavanje" ×2)* | Reworded to one mention, 149 ch |
| `/resources/quiz` | title | `Kviz - Pronađite Ideal website rešenje \| AISajt` (grammar: "Ideal" not "Idealno"; anglicism "website" inconsistent with the rest of the site's Serbian copy) | `Kviz — Pronađite Idealno Web Rešenje \| AISajt` — not a stuffing fix, a naturalness/grammar fix, in the same spirit |
| `/thank-you` | title/description | *(none — inherited root's stuffed fallback)* | `Hvala Vam \| AiSajt` / `Hvala što ste nas kontaktirali. Javićemo vam se u najkraćem mogućem roku.` |
| root fallback (`root.tsx`) | title | `Izrada Web Sajta \| Izrada Sajtova \| Izrada Sajta Cena Beograd` — the task's own bad-pattern example | `Izrada Sajta i SEO Optimizacija \| AiSajt Beograd` — fixed even though no route uses it live anymore (every route now has its own `meta()`), rather than leave it wrong |

**Left unchanged (already natural)**: `/` (explicitly approved by the task), `/izrada-sajta-detalji`, `/funnel`, `/promet-sistem`, `/resources`, `/resources/audit`, `/resources/guide`, `/resources/checklist`, `/blog`, `/privacy`, `/terms`, both blog posts' and all five blog categories' data-driven `metaTitle`/`metaDescription` in `blogPosts.ts`/`blogCategories.ts` — reviewed individually, no repeated-phrase pattern in any of them.

---

## 3.3 — OG share image: not shipped this phase

The `og:image`/`twitter:image` default is still the 512×512 square favicon (`/images/favicon/android-chrome-512x512.png`) — wrong aspect ratio for a social-share card. I did not generate a replacement: producing a genuinely branded 1200×630 image (correct logo placement, brand colors, typography matching the site) isn't something I could do to a quality bar I'd trust without either the real brand asset files composited properly or a way to visually verify the result here, and the task is explicit that shipping a mediocre auto-generated one is worse than not shipping one at all. Left a `TODO(owner)` directly above `DEFAULT_OG_IMAGE` in `pageMeta.ts` pointing at this. Once a real 1200×630 asset exists, swapping the one constant updates every route's OG/Twitter image automatically (each route's `buildPageMeta()` call falls back to this default unless it passes its own `ogImage` — blog posts already do, using their own cover image).

---

## 3.4 — OG/Twitter completeness — verified in raw prerendered HTML

Checked five routes' raw `<head>` (a homepage, two of the just-de-stuffed pages, and the newly-fixed `/thank-you`) directly in the built output — not assumed from `buildPageMeta()`'s code:

| Route | title | og:title matches | og:url matches route | og:site_name | og:locale | twitter:card | twitter:image |
|---|---|---|---|---|---|---|---|
| `/` | ✅ de-stuffed n/a (already good) | ✅ | ✅ `.../` | ✅ AI Sajt | ✅ sr_RS | ✅ summary_large_image | ✅ |
| `/izrada-sajta-cena` | ✅ new title | ✅ | ✅ `.../izrada-sajta-cena` | ✅ | ✅ | ✅ | ✅ |
| `/seo-optimizacija-cena` | ✅ new title | ✅ | ✅ `.../seo-optimizacija-cena` | ✅ | ✅ | ✅ | ✅ |
| `/web-dizajn` | ✅ new title | ✅ | ✅ `.../web-dizajn` | ✅ | ✅ | ✅ | ✅ |
| `/thank-you` | ✅ `Hvala Vam \| AiSajt` | ✅ | ✅ `.../thank-you` | ✅ | ✅ | ✅ | ✅ |

Every field is present and route-specific — no route showed root's default title/url leaking through (confirmed each `og:url` matches its own path, not `https://aisajt.com/`). The `PROFESSIONAL_SERVICE_SCHEMA` JSON-LD on `/` was also spot-checked post-refactor: valid JSON, full enriched address, correct phone/email — confirms the template-literal/constant substitutions in `root.tsx` and `SEOHelmet.tsx` didn't break serialization.

Also confirmed in raw HTML that the NAP refactor didn't change any visible output: `/` shows `office@aisajt.com` ×5 and `+381 62 155 2156` ×3 (Hero mock card + Contact section + Footer, matching pre-refactor occurrence count), `/funnel` shows `062 155 2156` ×1 (the Strahinja contact card, unchanged format).

---

## Build / type-check

```
npm run build                              # exit 0 — 27/27 routes prerender, portal.html builds
npx tsc --noEmit -p tsconfig.app.json      # 83 errors — identical to the Phase 2 baseline, zero new
```

No new files or edits from this phase appear in the type-check output except the two lines that were already pre-existing (`PrivacyPage.tsx`'s unused `React` import, `Contact.tsx`'s unused `setShowSuccess` — both present before this phase's edits, unrelated to the NAP/meta changes made here, confirmed by the error count staying exactly 83).

---

Phase 3 complete.
