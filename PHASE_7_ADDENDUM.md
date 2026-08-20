# Phase 7 Addendum — owner decisions on flagged items

Two decisions came back from the owner on items Phase 7 flagged rather than resolving unilaterally. Both applied.

---

## Decision 1: Delete the three orphaned legacy pages

Re-confirmed via grep immediately before deleting — same result as Phase 7's original sweep, nothing changed in between:
- `ONamaPage.tsx`: only hit was the historical comment in `BusinessSchema.tsx` explaining a past schema trim, not an import.
- `PricingPage.tsx`: zero references anywhere.
- `FAQPage.tsx`: only hits were the unrelated `'@type': 'FAQPage'` JSON-LD string in `FAQSchema.tsx` (a schema.org type name, not the component).

None were real imports. Deleted all three via `git rm`:
- `src/components/pages/ONamaPage.tsx`
- `src/components/pages/PricingPage.tsx`
- `src/components/pages/FAQPage.tsx`

No dead imports or broken references resulted — `tsc` confirms (see below). The `BusinessSchema.tsx` comment mentioning `ONamaPage.tsx` by name was left as-is: it's explaining a historical decision (why "Online marketing" was trimmed from the schema's service list), still accurate as history even though the file it names no longer exists — same pattern as other historical comments already in this codebase (e.g. the Phase 6/Phase 2D notes).

**Type errors: 79** — down one from Phase 7's closing count of 80 (one of the three deleted files carried a pre-existing type error). Zero new errors.

---

## Decision 2: Improve cookie-consent banner copy toward legal standard

Rewrote `src/components/ui/CookieConsentBanner.tsx`'s copy and button styling. The gating logic from Phase 7 (`root.tsx`'s `window.__aisajtLoadX()` loaders, the `localStorage` consent check, default-deny) is untouched — only the presentation layer changed.

**What changed:**
- **Named categories in plain language**: the body text now explicitly names the three tracker categories the visitor is consenting to — *analitiku (Google Analytics)*, *marketing (Meta Pixel)*, *funkcionalnost obrazaca (HubSpot)* — instead of a blanket "analytics and marketing" phrase. Makes consent specific/informed rather than bundled.
- **Symmetric buttons**: previously "Prihvati" was a bold gradient pill and "Odbij" was a plain outline button — a mild dark-pattern shape (one visually louder than the other). Both are now solid filled buttons, same size/padding/weight/radius — "Odbij" is solid dark gray, "Prihvati" is the brand gradient. Equal visual prominence, differentiated by color only.
- **Explicit "doesn't fire until consent" statement**: "...ne aktiviramo dok se ne saglasite — birate da li ih prihvatate ili odbijate."
- **Honest "change your choice" language**: rather than claiming a UI feature that doesn't exist ("promenite izbor u svakom trenutku" implying a settings panel), the copy says the choice can be changed by clearing the site's cookies/data in browser settings — true today, doesn't overclaim.
- **`/privacy` link**: kept, now bolded/`font-medium` for visibility within the body text.
- **Not built**: a footer link / UI control to reopen the banner and revisit consent later. That's more than a copy change (new persistent UI element + reopen state logic), so per the ask it's noted as an option here rather than built unprompted:
  - **Option**: a small "Kolačići" link in `Footer.tsx` that resets the stored consent value and re-shows the banner. Low effort (~15-20 lines: a footer link + a small state/event hook for the banner to re-check on demand) if the owner wants it in a follow-up pass.

**Still flagged**: this copy is closer to standard practice (named categories, symmetric choice, no-fire-before-consent statement) but is not a substitute for legal review. Recommend the owner or counsel sign off on the exact Serbian wording before launch, particularly given GDPR exposure for EU visitors alongside Zakon o zaštiti podataka o ličnosti.

---

## Final checks

```
npx tsc --noEmit -p tsconfig.app.json      # 79 errors — down from Phase 7's 80, zero new
npm run build                              # exit 0, both configs build clean
```

- Confirmed the revised banner copy ("Kolačići na ovom sajtu", "Meta Pixel", etc.) is present in the built `root-*.js` chunk that ships on every marketing page.
- Confirmed the three deletions via `git status` — no other file changes needed to keep the build/type-check clean.

---

Addendum complete. Proceeding to Phase 8.
