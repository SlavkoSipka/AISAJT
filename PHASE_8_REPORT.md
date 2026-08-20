# Phase 8 Report — GEO / AEO optimization

**Status: Complete.** Type errors: **79**, unchanged from the Phase 7 addendum baseline, zero new.

---

## 8.1 — `llms.txt`

Created `public/llms.txt`, following the emerging `llms.txt` Markdown convention (H1 title, blockquote summary, H2 sections with `[link](url): description` entries).

All figures pulled directly from live, routed pages — none invented:
- Izrada sajta: from 299€ (`IzradaSajtaCenaPage.tsx`)
- SEO optimizacija: from 250€ (`SEOPage.tsx`)
- Web dizajn: from 350€ (`WebDizajnPage.tsx`)
- Izrada web shopa: from 499€ (`WebShopPage.tsx`)
- Promet Sistem (Meta/Instagram ads): 1.000€–10.000€ (`PrometSistemPage.tsx`)
- Contact/address/hours: verbatim from `src/lib/site-config.ts`'s `NAP` object (single source of truth already established in Phase 1)

Links to `/izrada-sajta-cena`, `/seo-optimizacija-cena`, `/web-dizajn`, `/izrada-web-shopa`, `/promet-sistem`, `/portfolio`, `/funnel`, `/blog`, `/privacy`. Verified it ships: `dist/client/llms.txt` exists post-build (2078 bytes).

---

## 8.2 — Direct-answer optimization on the money pages

Both `/izrada-sajta-cena` and `/seo-optimizacija-cena` already had the right *answer* somewhere on the page (a "Deo 2" section further down, and FAQ items with schema) — the problem was placement: the hero only had generic marketing copy, and the actual number was one or two scroll-lengths down. Fixed by **adding**, not rewriting:

- **`IzradaSajtaCenaPage.tsx`**: added a bordered callout directly under the hero's intro paragraph (before the CTA button, so it's in the first screenful) stating the real figures already used elsewhere on the same page: starts at 299€ (simple site), from 499€ (web shop/complex), can exceed 2000€ (custom platforms) — sourced from the page's own pricing cards, not invented.
- **`SEOPage.tsx`**: same pattern — a callout stating SEO starts from 250€ (basic package) and advanced packages from 500€/month, matching the page's existing "Deo 2" and FAQ figures exactly.
- Both callouts are plain server-rendered JSX (no client gating), so they're in the prerendered HTML immediately — verified via `grep` on `dist/client/izrada-sajta-cena/index.html` and `dist/client/seo-optimizacija-cena/index.html`.
- **Also fixed while in the same section**: `IzradaSajtaCenaPage.tsx`'s H2 said "Koliko Košta Izrada Sajta u **2025**. Godini?" / "...Cost in **2025**?" — stale relative to the current date (2026-08-20). Bumped both (sr/en) to 2026 since I was already restructuring this exact block and a wrong year actively undermines AEO citation accuracy. Did not touch year references anywhere else in the codebase — out of scope, this was a two-line fix adjacent to work already being done here.
- **Existing FAQ content reviewed, not rewritten**: both pages' FAQ answers (7 items on `IzradaSajtaCenaPage`, 8 on `SEOPage`) were already direct, specific, and quotable (e.g. "Basic SEO paket od 250€ jednokratno ili 250€ mesečno za kontinuirani rad") — no changes needed there.

### Gap found, not fixed: English FAQ items are empty
Both pages define `faqItems` as `language === 'sr' ? [...] : []` — the Serbian branch has real, good FAQ content; the English branch is a hard-coded empty array. This means `<FAQSchema items={faqItems} />` emits **zero** `FAQPage` JSON-LD entries for English-language visitors, and the visible FAQ accordion is empty in English too. This predates Phase 8 and wasn't introduced by it. Not fixed here because writing 7-8 new English FAQ answers is authoring new content, not "restructuring existing real content" per this phase's scope — flagging for a follow-up pass (translation of the existing Serbian FAQ answers, reviewed for accuracy, not fabricated from scratch).

---

## 8.3 — AEO-readiness verification

- **Prerendered content**: confirmed FAQ schema (`FAQPage` JSON-LD), business schema (`ProfessionalService` JSON-LD), and the new direct-answer callouts are all present in raw `dist/client/*/index.html` output — nothing regressed from Phase 7's deletions (`BusinessSchema`/`FAQSchema` components were untouched by that phase).
- **`ProfessionalService` schema facts checked against source data** (`src/components/seo/BusinessSchema.tsx`): name, address, phone, email, tax/VAT IDs, geo coordinates, opening hours all pull from `NAP` (`site-config.ts`) or are independently documented as verified in prior-phase comments (e.g. the Instagram-vs-Facebook `sameAs` decision from Phase 4). Founders (Bogdan Gradjanin, Strahinja Zekanovic) and employee (Marko Devedzic) match `/funnel`'s team section exactly, per the code comment. Service offer catalog (four services, each with its real starting price) matches the live pricing pages. Nothing inaccurate found — no changes needed.
- **Headings**: both money pages already phrase H2s as direct questions where natural — "Koliko Košta Izrada Sajta...", "Zašto cena izrade sajta nije fiksna?", "Šta Podrazumeva Profesionalna SEO Optimizacija?", "Koliko Košta SEO Optimizacija u Beogradu i Srbiji?" — this was already good AEO practice from earlier phases; no restructuring needed beyond the direct-answer callouts added in 8.2.

---

## 8.4 — Freshness signals

**Already implemented for blog posts — verified, not touched.** `blogPosts.ts` carries real `publishedAt`/`updatedAt` dates per post; `AuthorBox.tsx` displays both (only showing "updated" when it actually differs from "published"), and `BlogPostSchema.tsx` already emits `datePublished`/`dateModified` in JSON-LD — confirmed present in the prerendered blog post HTML (`dist/client/blog/*/index.html`).

**Skipped for the money pages** (`/izrada-sajta-cena`, `/seo-optimizacija-cena`, etc.) — there's no honest "last updated" data source for these (they're hand-written marketing pages, not CMS-tracked content with real timestamps). Fabricating one would violate the phase's "never fabricate" rule, so left as-is.

---

## AI crawler access (robots.txt)

`public/robots.txt`'s default `User-agent: *` block already `Allow: /`'d everything except `/admin/`, `/portal/`, `/api/`, and `/*.json$` — meaning GPTBot/ClaudeBot/PerplexityBot/OAI-SearchBot etc. were **not actually blocked** before this phase (no wildcard disallow catches them, and the default rule already permits them). Added **explicit** `Allow: /` blocks for `GPTBot`, `OAI-SearchBot`, `ChatGPT-User`, `ClaudeBot`, `PerplexityBot`, `Perplexity-User`, and `Google-Extended` anyway — not because they were blocked, but because many sites now default-block these via security plugins/CDN rules, and an explicit allow removes any ambiguity about intent (matches the existing pattern already used for `Googlebot`/`Bingbot`/`Slurp`).

---

## Final checks

```
npx tsc --noEmit -p tsconfig.app.json      # 79 errors — unchanged from Phase 7 addendum, zero new
npm run build                              # exit 0 — both configs build clean
```

- `dist/client/llms.txt` exists (2078 bytes), served alongside the static build.
- `dist/client/robots.txt` contains all four originally-required AI crawler names (`GPTBot`, `ClaudeBot`, `PerplexityBot`, `OAI-SearchBot`), each explicitly allowed.
- Direct-answer text confirmed present in raw prerendered HTML via `grep` on both money pages (not just source — the actual built output).
- `ProfessionalService` and `FAQPage` JSON-LD confirmed present and unregressed in prerendered HTML.

**Flagged, not fixed (out of this phase's scope)**: English-language FAQ items are empty on both money pages (`faqItems = language === 'sr' ? [...] : []`), so `FAQPage` schema and the visible FAQ accordion are both empty for English visitors. Needs a translation pass of the existing Serbian answers, reviewed for accuracy before publishing — not something to author from scratch inline.

---

Phase 8 complete.
