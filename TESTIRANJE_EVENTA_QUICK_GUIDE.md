# 🧪 BRZO TESTIRANJE META PIXEL & GOOGLE ADS EVENATA

## 🔧 Instalacija Alata za Testiranje

### 1. Google Tag Assistant (Chrome Extension)
- Idi na: [Chrome Web Store - Google Tag Assistant](https://chrome.google.com/webstore/detail/google-tag-assistant)
- Klikni "Add to Chrome"
- Pinuj extension na toolbar

### 2. Meta Pixel Helper (Chrome Extension)
- Idi na: [Chrome Web Store - Meta Pixel Helper](https://chrome.google.com/webstore/detail/meta-pixel-helper)
- Klikni "Add to Chrome"
- Pinuj extension na toolbar

---

## 📝 TESTIRANJE - Korak po Korak

### Pre nego što počneš:
1. ✅ Otvori sajt u Chrome browser-u
2. ✅ Otvori **Developer Console** (F12 ili Ctrl+Shift+I)
3. ✅ Idi na **Console** tab
4. ✅ Klikni na **Meta Pixel Helper** ikonicu (gornji desni ugao)
5. ✅ Klikni na **Google Tag Assistant** ikonicu

---

## 🏆 TIER 1 - GLAVNI LEADOVI (Testiranje)

### ✅ TEST 1: Contact Form Lead

**Koraci:**
1. Idi na `/contact` stranicu
2. Popuni formu:
   - Name: Test User
   - Email: test@example.com
   - Phone: +381 61 123 4567
3. Klikni "Pošalji"
4. Biće redirektovan na `/thank-you?name=Test+User&source=contact_page&lang=sr`

**Šta treba da vidiš:**

**U Console:**
```
🏆 TIER 1 Lead tracked: {source: "contact_page", userName: "Test User", language: "sr", value: 15}
```

**U Meta Pixel Helper:**
- ✅ Event: `Lead`
- ✅ content_name: "Contact Form Submission"
- ✅ content_category: "Lead Generation - Tier 1"
- ✅ value: 15
- ✅ currency: "EUR"

**U Google Tag Assistant:**
- ✅ Event: `generate_lead`
- ✅ event_category: "Lead Generation"
- ✅ value: 15

---

### ✅ TEST 2: Quiz Complete Lead

**Koraci:**
1. Idi na `/resources/quiz`
2. Odgovori na sva 4 pitanja (bilo šta)
3. Klikni "Vidi Rezultat"
4. Unesi:
   - Name: Test User
   - Email: test@example.com
5. Klikni "Pošalji"

**Šta treba da vidiš:**

**U Console:**
```
🏆 TIER 1 Quiz Lead tracked: {userName: "Test User", userEmail: "test@example.com", totalAnswers: 4, language: "sr", value: 15}
```

**U Meta Pixel Helper:**
- ✅ Event: `Lead`
- ✅ content_name: "Quiz Completion"
- ✅ content_category: "Lead Generation - Tier 1"
- ✅ value: 15

**U Google Tag Assistant:**
- ✅ Event: `quiz_complete`
- ✅ value: 15

---

### ✅ TEST 3: Audit Form Lead

**Koraci:**
1. Idi na `/resources/audit`
2. Popuni formu:
   - Name: Test User
   - Email: test@example.com
   - Website: https://example.com
   - Phone: +381 61 123 4567 (opciono)
3. Klikni "Pošalji na Analizu"

**Šta treba da vidiš:**

**U Console:**
```
🏆 TIER 1 Audit Lead tracked: {userName: "Test User", userEmail: "test@example.com", websiteUrl: "https://example.com", language: "sr", value: 15}
```

**U Meta Pixel Helper:**
- ✅ Event: `Lead`
- ✅ content_name: "Audit Form Submission"
- ✅ content_category: "Lead Generation - Tier 1"
- ✅ value: 15

---

## 🥈 TIER 2 - SREDNJI LEADOVI (Testiranje)

### ✅ TEST 4: Video Gate Unlock

**Napomena:** Ova funkcionalnost trenutno nije aktivna na sajtu, ali kod je spreman.

**Kada bude aktivna, testiraće se ovako:**
1. Idi na stranicu sa video gate popup-om
2. Unesi ime i email
3. Klikni "Unlock Video"

**Šta treba da vidiš:**
```
🥈 TIER 2 Video Lead tracked: {userName: "...", userEmail: "...", videoId: "...", value: 5}
```

---

### ✅ TEST 5: PDF Download

**Koraci:**
1. Idi na `/resources/guide` ili `/resources/checklist`
2. Popuni formu sa imenom i emailom
3. Klikni "Download"

**Šta treba da vidiš:**

**U Console:**
```
🥈 TIER 2 PDF Lead tracked: {pdfType: "guide", userName: "...", userEmail: "...", value: 5}
```

**U Meta Pixel Helper:**
- ✅ Event: `Lead`
- ✅ content_category: "Lead Generation - Tier 2"
- ✅ content_type: "document"
- ✅ value: 5

---

## 🥉 TIER 3 - ENGAGEMENT EVENTI (Testiranje)

### ✅ TEST 6: CTA Click

**Koraci:**
1. Idi na Home page
2. Klikni bilo koje CTA dugme ("Započni projekat", "Kontaktirajte nas", etc.)

**Šta treba da vidiš:**
```
🥉 TIER 3 CTA Click tracked: {buttonLabel: "...", location: "...", language: "sr"}
```

**U Meta Pixel Helper:**
- ✅ Custom Event: `CTAClick`

---

### ✅ TEST 7: Portfolio Click

**Koraci:**
1. Idi na Home page
2. Skroluj do Portfolio sekcije
3. Klikni "Vidi Sajt" na bilo kom projektu

**Šta treba da vidiš:**
```
🥉 TIER 3 Portfolio Click tracked: {projectName: "...", projectUrl: "...", language: "sr"}
```

**U Meta Pixel Helper:**
- ✅ Event: `ViewContent`
- ✅ content_category: "Portfolio"

---

### ✅ TEST 8: Scroll Depth

**Koraci:**
1. Idi na Home page
2. Skroluj polako do dna stranice
3. Prati Console log

**Šta treba da vidiš:**
```
🥉 TIER 3 Scroll 25% tracked: {pagePath: "/", language: "sr"}
🥉 TIER 3 Scroll 50% tracked: {pagePath: "/", language: "sr"}
🥉 TIER 3 Scroll 75% tracked: {pagePath: "/", language: "sr"}
🥉 TIER 3 Scroll 90% tracked: {pagePath: "/", language: "sr"}
```

**U Meta Pixel Helper (samo za 75%+):**
- ✅ Custom Event: `HighEngagement`
- ✅ engagement_type: "scroll_depth"

---

### ✅ TEST 9: Time on Page

**Koraci:**
1. Idi na Home page
2. Ostani na stranici (ne zatvaraj tab)
3. Prati Console log u intervalima od 30s, 60s, 120s, 180s

**Šta treba da vidiš:**

**Nakon 30 sekundi:**
```
🥉 TIER 3 Time on Page 30s tracked: {pagePath: "/", language: "sr"}
```

**Nakon 60 sekundi:**
```
🥉 TIER 3 Time on Page 60s tracked: {pagePath: "/", language: "sr"}
```

**Nakon 120 sekundi (2 minuta):**
```
🥉 TIER 3 Time on Page 120s tracked: {pagePath: "/", language: "sr"}
```

**U Meta Pixel Helper (samo za 120s+):**
- ✅ Custom Event: `HighEngagement`
- ✅ engagement_type: "time_on_page"

---

## ✅ FINAL CHECKLIST

Uradi sve ovo pre nego što pokreneš ads kampanje:

### Google Ads:
- [ ] Instaliraj Google Tag Assistant extension
- [ ] Testiraj Contact Form - vidiš li `generate_lead` event?
- [ ] Testiraj Quiz - vidiš li `quiz_complete` event?
- [ ] Testiraj Audit Form - vidiš li `audit_form_submit` event?
- [ ] Otvori Google Ads → Conversions → proveri da li vidiš test konverzije

### Meta Pixel:
- [ ] Instaliraj Meta Pixel Helper extension
- [ ] Testiraj Contact Form - vidiš li `Lead` event sa value 15?
- [ ] Testiraj Quiz - vidiš li `Lead` event sa value 15?
- [ ] Testiraj Audit Form - vidiš li `Lead` event sa value 15?
- [ ] Otvori Meta Events Manager → Test Events → vidiš li sve događaje?

### Engagement Events:
- [ ] Klikni CTA - vidiš li `CTAClick` custom event?
- [ ] Klikni Portfolio - vidiš li `ViewContent` event?
- [ ] Skroluj 75%+ - vidiš li `HighEngagement` event?
- [ ] Ostani 2+ minuta - vidiš li `HighEngagement` event?

---

## 🚨 ŠTA AKO NEŠTO NE RADI?

### Problem: Ne vidim evente u Console

**Rešenje:**
1. Refresh stranicu (Ctrl+F5)
2. Proveri da li je Console otvoren (F12)
3. Proveri da li filter u Console-u prikazuje sve logove (ne samo Errors)

### Problem: Meta Pixel Helper ne pokazuje evente

**Rešenje:**
1. Refresh stranicu
2. Proveri da li je Meta Pixel Helper extension aktivna (ikonica treba da bude ZELENA)
3. Klikni na ikonicu - trebalo bi da vidiš listu evenata
4. Ako je SIVA - znači Pixel nije detektovan, proveri `index.html` da li je Pixel kod prisutan

### Problem: Google Tag Assistant ne pokazuje evente

**Rešenje:**
1. Klikni na extension
2. Klikni "Enable" dugme
3. Refresh stranicu
4. Uradi test ponovo

### Problem: Eventi stižu ali nemaju vrednost (value)

**Rešenje:**
- Proveri `analytics.ts` fajl
- Proveri da li funkcije šalju `value` parametar
- Proveri Console log - trebalo bi da vidiš `value: 15` ili `value: 5`

---

## 📞 SUPPORT

Ako sve ovo ne pomogne:
1. Proveri `src/utils/analytics.ts` - sve funkcije su tamo
2. Proveri `index.html` - Meta Pixel i Google Analytics kodovi
3. Proveri konzolu za JavaScript greške (crveni tekst)

**Srećno sa testiranjem!** 🚀


