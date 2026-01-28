# 🎯 META PIXEL & GOOGLE ADS - KOMPLETAN SETUP VODIČ

## ✅ ŠTA JE URAĐENO

### 1. **Analytics Sistem (`src/utils/analytics.ts`)**

Implementiran **3-tier sistem praćenja konverzija**:

#### 🏆 TIER 1 - GLAVNI LEADOVI (Vrednost: 15€)

**Ovi eventi su NAJVAŽNIJI - to su tvoji glavni leadovi:**

1. **Contact Form Submit** → Thank You page
   - Funkcija: `trackLeadGeneration()`
   - Šalje: GA4 event `generate_lead` + Meta Pixel `Lead` + Google Ads conversion `contact_form_submit`
   - Poziva se: Na `ThankYouPage.tsx` kada je `source=contact_page`

2. **Quiz Complete** (sa emailom)
   - Funkcija: `trackQuizComplete()`
   - Šalje: GA4 event `quiz_complete` + Meta Pixel `Lead` + Google Ads conversion `quiz_complete`
   - Poziva se: Na `QuizPage.tsx` kada korisnik submituje email sa odgovorima

3. **Audit Form Submit** (besplatna analiza sajta)
   - Funkcija: `trackAuditFormSubmit()`
   - Šalje: GA4 event `audit_form_submit` + Meta Pixel `Lead` + Google Ads conversion `audit_form_submit`
   - Poziva se: Na `AuditFormPage.tsx` kada korisnik submituje formu

#### 🥈 TIER 2 - SREDNJI LEADOVI (Vrednost: 5€)

**Ovi leadovi su takođe važni, ali malo manje kvalitetni od Tier 1:**

1. **Video Gate Unlock** (email za gledanje videa)
   - Funkcija: `trackVideoGate()`
   - Šalje: GA4 event `video_gate_unlock` + Meta Pixel `Lead` + Google Ads conversion `video_unlock`

2. **PDF Download Request** (email za skidanje PDF-a)
   - Funkcija: `trackPDFDownloadRequest()`
   - Šalje: GA4 event `pdf_download_request` + Meta Pixel `Lead` + Google Ads conversion `pdf_download`

#### 🥉 TIER 3 - ENGAGEMENT EVENTI (Vrednost: 0€)

**Ovi eventi NE GENERIŠU leadove direktno, ali su ODLIČNI za retargeting i Lookalike audiences:**

1. **CTA Click** - Klik na Call-to-Action dugmad
   - Funkcija: `trackCTAClick()`
   - Šalje: GA4 + Meta Pixel custom event `CTAClick`
   - **Zašto je koristan:** Pokazuje intent - možeš retargetovati ljude koji su kliknuli CTA ali nisu konvertovali

2. **Portfolio Click** - Klik na portfolio projekat
   - Funkcija: `trackPortfolioClick()`
   - Šalje: GA4 + Meta Pixel `ViewContent`
   - **Zašto je koristan:** Visok engagement signal - ljudi koji gledaju tvoj rad su potencijalni klijenti

3. **Video Play** - Reprodukcija videa
   - Funkcija: `trackVideoPlay()`
   - Šalje: GA4 + Meta Pixel custom event `VideoPlay`
   - **Zašto je koristan:** Ljudi koji gledaju video su veoma angažovani - odličan za retargeting

4. **Scroll Depth** - Skrolovanje 25%, 50%, 75%, 90%
   - Funkcija: `trackScrollDepth()`
   - Šalje: GA4 + Meta Pixel custom event `HighEngagement` (za 75%+)
   - **Zašto je koristan:** Možeš praviti Lookalike audience od ljudi koji skroluju 75%+ stranice

5. **Time on Page** - Vreme provedeno na strani
   - Funkcija: `trackTimeOnPage()`
   - Šalje: GA4 + Meta Pixel custom event `HighEngagement` (za 120s+)
   - **Zašto je koristan:** Kvalitetni posetioci koji provode 2+ minuta na sajtu - odlični za Lookalike

---

## 🔧 ŠTA TREBAŠ DA URADIŠ

### A) GOOGLE ADS SETUP

#### Korak 1: Dodaj Google Ads Conversion ID u `index.html`

1. Idi na **Google Ads → Tools & Settings → Measurement → Conversions**
2. Ako već imaš konverzije, pronađi svoj **Conversion ID** (format: `AW-XXXXXXXXXX`)
3. Ako nemaš, Google će ti ga dati kada kreiraš prvu konverziju
4. Otvori `index.html` i odkomentiraj liniju:
   ```html
   <!-- gtag('config', 'AW-XXXXXXXXXX'); -->
   ```
   I zameni `AW-XXXXXXXXXX` sa tvojim ID-jem:
   ```html
   gtag('config', 'AW-1234567890');
   ```

#### Korak 2: Kreiraj Conversion Actions

U Google Ads, kreiraj 5 konverzija sa **TAČNO OVIM IMENIMA**:

**TIER 1 Konverzije (Vrednost: 15€ svaka):**

| Conversion Name       | Category              | Value | Conversion Label (već setupovano u kodu) |
|-----------------------|-----------------------|-------|------------------------------------------|
| contact_form_submit   | Submit lead form      | 15€   | contact_form_submit                      |
| quiz_complete         | Submit lead form      | 15€   | quiz_complete                            |
| audit_form_submit     | Submit lead form      | 15€   | audit_form_submit                        |

**TIER 2 Konverzije (Vrednost: 5€ svaka):**

| Conversion Name       | Category              | Value | Conversion Label (već setupovano u kodu) |
|-----------------------|-----------------------|-------|------------------------------------------|
| video_unlock          | Sign up               | 5€    | video_unlock                             |
| pdf_download          | Sign up               | 5€    | pdf_download                             |

#### Korak 3: Verifikuj tracking

1. Instaliraj **Google Tag Assistant** Chrome extension
2. Pokreni sajt lokalno ili na Netlify
3. Testiraj svaku formu (contact, quiz, audit)
4. Google Tag Assistant će ti pokazati da li se konverzije šalju

---

### B) META (FACEBOOK) ADS SETUP

✅ **Meta Pixel je već instaliran!** (ID: 1518014729424098)

Sada treba da kreiraš **Custom Conversions**.

#### Korak 1: Otvori Meta Events Manager

1. Idi na: [Meta Events Manager](https://business.facebook.com/events_manager2)
2. Izaberi tvoj Pixel (1518014729424098)
3. Klikni **Custom Conversions** → **Create Custom Conversion**

#### Korak 2: Kreiraj TIER 1 Custom Conversions

**1. Contact Form Lead**
- **Name:** Contact Form Lead
- **Data Source:** Tvoj Pixel (1518014729424098)
- **Conversion Event:** Lead
- **Rules:** 
  - URL contains `/thank-you`
  - AND URL parameter `source` equals `contact_page`
- **Value:** 15
- **Currency:** EUR
- **Category:** Lead Generation

**2. Quiz Complete Lead**
- **Name:** Quiz Complete Lead
- **Data Source:** Tvoj Pixel
- **Conversion Event:** Lead
- **Rules:** 
  - URL contains `/thank-you`
  - AND URL parameter `source` equals `quiz`
- **Value:** 15
- **Currency:** EUR
- **Category:** Lead Generation

**3. Audit Form Lead**
- **Name:** Audit Form Lead
- **Data Source:** Tvoj Pixel
- **Conversion Event:** Lead
- **Rules:** 
  - URL contains `/thank-you`
  - AND URL parameter `source` equals `audit_form`
- **Value:** 15
- **Currency:** EUR
- **Category:** Lead Generation

#### Korak 3: Kreiraj TIER 2 Custom Conversions

**4. Video Unlock Lead**
- **Name:** Video Unlock Lead
- **Data Source:** Tvoj Pixel
- **Conversion Event:** Lead
- **Rules:** 
  - Event `Lead`
  - AND Content Category contains `Tier 2`
  - AND Content Type equals `video`
- **Value:** 5
- **Currency:** EUR
- **Category:** Sign Up

**5. PDF Download Lead**
- **Name:** PDF Download Lead
- **Data Source:** Tvoj Pixel
- **Conversion Event:** Lead
- **Rules:** 
  - Event `Lead`
  - AND Content Category contains `Tier 2`
  - AND Content Type equals `document`
- **Value:** 5
- **Currency:** EUR
- **Category:** Sign Up

#### Korak 4: Kreiraj Custom Audiences za Retargeting

Ovo su **ENGAGEMENT eventi** koji NE generišu leadove, ali su odlični za retargeting:

**1. High Engagement Audience** (ljudi koji su veoma angažovani)
- **Name:** High Engagement - Scroll or Time
- **Source:** Website
- **Events:** Custom Event `HighEngagement`
- **Retention:** 30 days
- **Use for:** Lookalike Audiences

**2. Video Viewers Audience**
- **Name:** Video Viewers - Not Converted
- **Source:** Website
- **Events:** Custom Event `VideoPlay`
- **Exclude:** People who triggered event `Lead`
- **Retention:** 14 days
- **Use for:** Retargeting campaigns

**3. CTA Clickers Audience**
- **Name:** CTA Clicked - Not Converted
- **Source:** Website
- **Events:** Custom Event `CTAClick`
- **Exclude:** People who triggered event `Lead`
- **Retention:** 7 days
- **Use for:** Warm retargeting campaigns

**4. Portfolio Viewers Audience**
- **Name:** Portfolio Viewers - Warm Leads
- **Source:** Website
- **Events:** Standard Event `ViewContent`
- **Content Category equals:** Portfolio
- **Exclude:** People who triggered event `Lead`
- **Retention:** 14 days
- **Use for:** Retargeting with case studies

#### Korak 5: Testiraj Pixel

1. Instaliraj **Meta Pixel Helper** Chrome extension
2. Pokreni sajt i testiraj sve forme
3. Proveri u **Events Manager → Test Events** da li stignu eventi

---

## 📊 KAKO KORISTITI OVE KONVERZIJE

### Za Google Ads:

1. **Conversion Campaigns:**
   - Postavi TIER 1 konverzije kao **Primary goal**
   - Postavi TIER 2 konverzije kao **Secondary goal**
   
2. **Bidding Strategy:**
   - Koristi **Target CPA** (Target Cost Per Acquisition)
   - Ili **Maximize Conversions** sa budžetom
   
3. **Reporting:**
   - Fokusiraj se na **Cost per TIER 1 Lead**
   - TIER 2 su bonus

### Za Meta (Facebook) Ads:

1. **Conversion Campaigns:**
   - Campaign Objective: **Conversions**
   - Conversion Event: Izaberi custom conversion (npr. "Contact Form Lead")
   
2. **Lookalike Audiences:**
   - Napravi Lookalike od TIER 1 leadova (1% - 3%)
   - Napravi Lookalike od "High Engagement" audience (3% - 5%)
   
3. **Retargeting Campaigns:**
   - Targetuj "Video Viewers - Not Converted" sa case studies
   - Targetuj "CTA Clickers - Not Converted" sa special offers
   - Targetuj "Portfolio Viewers" sa testimonials

4. **Creative Testing:**
   - Koristi Portfolio Click events da vidiš koje projekte ljudi najviše gledaju
   - Pravi ads oko tih portfolio projekata

---

## 🧪 TESTING CHECKLIST

Pre nego što pokreneš ads, OBAVEZNO testiraj:

### Google Ads Testing:

- [ ] Odkomentiraj i dodaj Google Ads ID u `index.html`
- [ ] Kreiraj sve 5 conversion actions u Google Ads
- [ ] Instaliraj Google Tag Assistant
- [ ] Testiraj Contact Form → proveri da li se šalje `contact_form_submit`
- [ ] Testiraj Quiz → proveri da li se šalje `quiz_complete`
- [ ] Testiraj Audit Form → proveri da li se šalje `audit_form_submit`
- [ ] Proveri u Google Ads → Conversions da li vidiš test konverzije

### Meta Pixel Testing:

- [ ] Instaliraj Meta Pixel Helper
- [ ] Testiraj Contact Form → proveri da li se šalje `Lead` event sa `content_category: "Tier 1"`
- [ ] Testiraj Quiz → proveri da li se šalje `Lead` event
- [ ] Testiraj Audit Form → proveri da li se šalje `Lead` event
- [ ] Proveri u Meta Events Manager → Test Events da li vidiš događaje
- [ ] Kreiraj sve Custom Conversions
- [ ] Kreiraj Custom Audiences za retargeting

### Engagement Events Testing:

- [ ] Klikni na CTA dugme → proveri `CTAClick` custom event
- [ ] Klikni na portfolio projekat → proveri `ViewContent` event
- [ ] Pusti video → proveri `VideoPlay` custom event
- [ ] Skroluj do 75% stranice → proveri `HighEngagement` event (scroll_depth)
- [ ] Ostani 2+ minuta na strani → proveri `HighEngagement` event (time_on_page)

---

## 📈 PREPORUČENA STRATEGIJA

### Faza 1: Prikupljanje Podataka (Prva 2 nedelje)

- Pokreni Traffic campaigns na Meta i Search campaigns na Google
- Ne optimizuj još za konverzije - samo skupljaj podatke
- Cilj: Minimum 20-30 konverzija (TIER 1)

### Faza 2: Optimization (Nedelje 3-4)

- Prebaci na Conversion campaigns
- Koristi **Lowest Cost** bidding strategy
- Eliminiši neperformantne ad sets

### Faza 3: Scaling (Mesec 2+)

- Kreiraj Lookalike Audiences od TIER 1 leadova
- Povećaj budžet za best performing campaigns
- Testuj različite kreative bazirane na Portfolio Click data

### Faza 4: Advanced Retargeting

- Targetuj "High Engagement" audience sa special offers
- Targetuj "Video Viewers" sa case studies i testimonials
- Targetuj "CTA Clickers" sa limited time offers

---

## 🎯 ZAKLJUČAK

**Sistem je KOMPLETAN i spreman za korišćenje!**

Sve što trebaš je da:
1. ✅ Dodaš Google Ads ID u `index.html`
2. ✅ Kreiraš 5 Google Ads conversions
3. ✅ Kreiraš 5 Meta Custom Conversions
4. ✅ Kreiraš 4 Custom Audiences za retargeting
5. ✅ Testiraš sve forme i proveriš da li eventi stižu

**Sav kod je već implementiran i radi!** 🚀

---

## 📞 DODATNA POMOĆ

Ako imaš pitanja ili treba pomoć sa setupom, proveri:
- Google Ads Help: [support.google.com/google-ads](https://support.google.com/google-ads)
- Meta Business Help: [facebook.com/business/help](https://facebook.com/business/help)
- Analytics.ts fajl u projektu: `src/utils/analytics.ts`

**Srećno sa kampanjama!** 🎉


