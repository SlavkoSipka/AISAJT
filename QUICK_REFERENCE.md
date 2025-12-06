# ⚡ QUICK REFERENCE - Meta Pixel & Google Ads Eventi

## 🎯 PRIORITETI LEADOVA

```
🏆 TIER 1 (15€) - GLAVNI LEADOVI:
├── Contact Form Submit → /thank-you?source=contact_page
├── Quiz Complete → /thank-you?source=quiz
└── Audit Form Submit → /thank-you?source=audit_form

🥈 TIER 2 (5€) - SREDNJI LEADOVI:
├── Video Gate Unlock → Email za video
└── PDF Download → Email za PDF

🥉 TIER 3 (0€) - ENGAGEMENT (retargeting):
├── CTA Click
├── Portfolio Click
├── Video Play
├── Scroll Depth (25%, 50%, 75%, 90%)
└── Time on Page (30s, 60s, 120s, 180s)
```

---

## 📊 ANALYTICS FUNKCIJE

### Tier 1 - Glavni Leadovi

```typescript
// Contact Form (poziva se na ThankYouPage)
trackLeadGeneration('contact_page', userName, language);

// Quiz (poziva se na QuizPage kada submituje email)
trackQuizComplete(userName, userEmail, answers, language);

// Audit Form (poziva se na AuditFormPage)
trackAuditFormSubmit(userName, userEmail, websiteUrl, language);
```

### Tier 2 - Srednji Leadovi

```typescript
// Video Gate
trackVideoGate(userName, userEmail, videoId, language);

// PDF Download
trackPDFDownloadRequest(pdfType, userName, userEmail, language);
```

### Tier 3 - Engagement

```typescript
// CTA Click
trackCTAClick(buttonLabel, location, language);

// Portfolio Click
trackPortfolioClick(projectName, projectUrl, language);

// Video Play
trackVideoPlay(videoTitle, videoId, language);

// Scroll Depth
trackScrollDepth(percentage, pagePath, language); // 25, 50, 75, 90

// Time on Page
trackTimeOnPage(seconds, pagePath, language); // 30, 60, 120, 180
```

---

## 🔍 KAKO TESTIRATI - BRZINSKI VODIČ

### 1. Otvori Browser Console
```
F12 ili Ctrl+Shift+I → Console tab
```

### 2. Testiraj Contact Form
1. Idi na `/contact`
2. Popuni formu
3. Klikni "Pošalji"
4. U Console treba da vidiš:
   ```
   🏆 TIER 1 Lead tracked: {source: "contact_page", userName: "...", value: 15}
   ```

### 3. Proveri Meta Pixel Helper
- Ikonica treba da bude **ZELENA**
- Klikni na ikonicu → vidiš `Lead` event sa `value: 15`

### 4. Proveri Google Tag Assistant
- Klikni "Enable"
- Refresh stranicu
- Vidiš `generate_lead` event

---

## 🎨 META (FACEBOOK) ADS - CUSTOM CONVERSIONS

### Tier 1 Conversions (15€)

**1. Contact Form Lead**
```
Event: Lead
URL contains: /thank-you
URL parameter "source" equals: contact_page
Value: 15 EUR
```

**2. Quiz Complete Lead**
```
Event: Lead
URL contains: /thank-you
URL parameter "source" equals: quiz
Value: 15 EUR
```

**3. Audit Form Lead**
```
Event: Lead
URL contains: /thank-you
URL parameter "source" equals: audit_form
Value: 15 EUR
```

### Tier 2 Conversions (5€)

**4. Video Unlock Lead**
```
Event: Lead
content_category contains: "Tier 2"
content_type equals: "video"
Value: 5 EUR
```

**5. PDF Download Lead**
```
Event: Lead
content_category contains: "Tier 2"
content_type equals: "document"
Value: 5 EUR
```

---

## 🎯 GOOGLE ADS - CONVERSION ACTIONS

Kreiraj ovih 5 conversions u Google Ads:

| Name | Category | Value | Conversion Label |
|------|----------|-------|------------------|
| contact_form_submit | Submit lead form | 15€ | contact_form_submit |
| quiz_complete | Submit lead form | 15€ | quiz_complete |
| audit_form_submit | Submit lead form | 15€ | audit_form_submit |
| video_unlock | Sign up | 5€ | video_unlock |
| pdf_download | Sign up | 5€ | pdf_download |

**Gde:** Google Ads → Tools → Measurement → Conversions → New conversion action

---

## 👥 META CUSTOM AUDIENCES - Za Retargeting

### 1. High Engagement Audience
```
Event: Custom Event "HighEngagement"
Retention: 30 days
Use: Lookalike Audiences (1-3%)
```

### 2. Video Viewers - Not Converted
```
Event: Custom Event "VideoPlay"
Exclude: Event "Lead"
Retention: 14 days
Use: Retargeting sa case studies
```

### 3. CTA Clickers - Not Converted
```
Event: Custom Event "CTAClick"
Exclude: Event "Lead"
Retention: 7 days
Use: Warm retargeting sa offers
```

### 4. Portfolio Viewers
```
Event: Standard Event "ViewContent"
Content Category: Portfolio
Exclude: Event "Lead"
Retention: 14 days
Use: Retargeting sa testimonials
```

---

## 📱 CHROME EXTENSIONS - OBAVEZNO INSTALIRAJ

### Google Tag Assistant
```
https://chrome.google.com/webstore
Search: "Google Tag Assistant"
```

### Meta Pixel Helper
```
https://chrome.google.com/webstore
Search: "Meta Pixel Helper"
```

---

## 🚨 TROUBLESHOOTING - BRZO

### Problem: Ne vidim evente u Console
```
✅ Refresh stranicu (Ctrl+F5)
✅ Proveri da li je Console filter = "All levels"
✅ Testiraj ponovo
```

### Problem: Meta Pixel Helper je SIVA
```
✅ Pixel nije detektovan
✅ Proveri index.html - da li je Pixel kod prisutan?
✅ Refresh stranicu
```

### Problem: Eventi nemaju vrednost (value)
```
✅ Proveri src/utils/analytics.ts
✅ Proveri Console log - trebalo bi da vidiš "value: 15" ili "value: 5"
✅ Proveri Meta Pixel Helper - klikni na event → vidiš li "value"?
```

---

## 🎯 KAMPANJE - PREPORUČENA STRATEGIJA

### Faza 1: Prikupljanje Podataka (2 nedelje)
```
Cilj: 20-30 TIER 1 konverzija
Meta: Traffic campaign
Google: Search campaign
Bidding: Lowest Cost / Maximize Clicks
```

### Faza 2: Optimization (Nedelje 3-4)
```
Prebaci na Conversion campaigns
Bidding: Lowest Cost per conversion
Eliminiši non-performers
```

### Faza 3: Scaling (Mesec 2+)
```
Lookalike Audiences (1-3% od TIER 1 leadova)
Povećaj budžet za best performing campaigns
Test različite kreative
```

### Faza 4: Advanced Retargeting
```
High Engagement → special offers
Video Viewers → case studies
CTA Clickers → limited time offers
Portfolio Viewers → testimonials
```

---

## 📊 TRACKING FLOW - VIZUALIZACIJA

### Contact Form Flow:
```
User popuni formu → ContactPage.tsx
       ↓
EmailJS pošalje email
       ↓
Redirect na /thank-you?source=contact_page
       ↓
ThankYouPage.tsx → trackLeadGeneration()
       ↓
┌─────────────────┬─────────────────┬──────────────────┐
│ Google Analytics│  Meta Pixel     │  Google Ads      │
│ generate_lead   │  Lead (15€)     │  contact_form... │
└─────────────────┴─────────────────┴──────────────────┘
```

### Quiz Flow:
```
User odgovori na pitanja → QuizPage.tsx
       ↓
User unese ime i email
       ↓
trackQuizComplete() + EmailJS
       ↓
Redirect na /thank-you?source=quiz
       ↓
┌─────────────────┬─────────────────┬──────────────────┐
│ Google Analytics│  Meta Pixel     │  Google Ads      │
│ quiz_complete   │  Lead (15€)     │  quiz_complete   │
└─────────────────┴─────────────────┴──────────────────┘
```

### Engagement Flow:
```
User skroluje 75% stranice
       ↓
HomePage.tsx → trackScrollDepth(75, ...)
       ↓
┌─────────────────┬─────────────────────────────────┐
│ Google Analytics│  Meta Pixel                     │
│ scroll_depth    │  HighEngagement (custom event)  │
└─────────────────┴─────────────────────────────────┘
       ↓
Meta Custom Audience: "High Engagement"
       ↓
Lookalike Audience (1-3%)
```

---

## 🎉 FINALNI CHECKLIST

```
[ ] Google Ads ID dodat u index.html
[ ] 5 Google Ads conversions kreirano
[ ] 5 Meta Custom Conversions kreirano
[ ] 4 Meta Custom Audiences kreirano
[ ] Google Tag Assistant instaliran
[ ] Meta Pixel Helper instaliran
[ ] Contact Form testiran ✅
[ ] Quiz testiran ✅
[ ] Audit Form testiran ✅
[ ] Scroll depth testiran (skroluj 75%+)
[ ] Time on page testiran (ostani 2+ min)
[ ] Meta Events Manager → Test Events provereno
[ ] Google Ads → Conversions provereno
[ ] Kampanje kreirane i spremne
```

---

**SPREMNO ZA LAUNCH!** 🚀


