# 🚀 POČNI OVDE - META PIXEL & GOOGLE ADS SETUP

## ✅ ŠTA SAM URADIO

Kompletno sam setupovao **Meta Pixel (Facebook Ads)** i **Google Ads** tracking sistem sa **3 nivoa prioriteta**:

### 🏆 TIER 1 - GLAVNI LEADOVI (15€ vrednost)
1. **Contact Form** → Thank You page ✅
2. **Quiz** → Email submit ✅  
3. **Audit Form** → Email submit ✅

### 🥈 TIER 2 - SREDNJI LEADOVI (5€ vrednost)
4. **Video Unlock** → Email za video ✅
5. **PDF Download** → Email za PDF ✅

### 🥉 TIER 3 - ENGAGEMENT (0€, za retargeting)
6. **CTA klikovi** ✅
7. **Portfolio klikovi** ✅
8. **Video play** ✅
9. **Scroll depth** (25%, 50%, 75%, 90%) ✅
10. **Time on page** (30s, 60s, 2min, 3min) ✅

---

## 📋 ŠTA TI TREBA DA URADIŠ - 3 KORAKA

### KORAK 1: Google Ads (15 min) ⏱️

1. Otvori `index.html` (linija 47)
2. Odkomentiraj:
   ```html
   gtag('config', 'AW-XXXXXXXXXX');
   ```
3. Zameni `AW-XXXXXXXXXX` sa tvojim Google Ads Conversion ID-om
4. Idi u Google Ads → Tools → Conversions
5. Kreiraj 5 conversions:
   - `contact_form_submit` (15€)
   - `quiz_complete` (15€)
   - `audit_form_submit` (15€)
   - `video_unlock` (5€)
   - `pdf_download` (5€)

**Detaljno:** `META_GOOGLE_ADS_SETUP_COMPLETE.md` (strana 1)

---

### KORAK 2: Meta (Facebook) Ads (20 min) ⏱️

1. Idi u Meta Events Manager
2. Kreiraj 5 Custom Conversions:
   - Contact Form Lead (15€)
   - Quiz Complete Lead (15€)
   - Audit Form Lead (15€)
   - Video Unlock Lead (5€)
   - PDF Download Lead (5€)

3. Kreiraj 4 Custom Audiences za retargeting:
   - High Engagement Audience (scroll 75%+ ili 2+ min)
   - Video Viewers (not converted)
   - CTA Clickers (not converted)
   - Portfolio Viewers

**Detaljno:** `META_GOOGLE_ADS_SETUP_COMPLETE.md` (strana 2)

---

### KORAK 3: Testiraj Sve (30 min) ⏱️

1. Instaliraj Chrome extensions:
   - Google Tag Assistant
   - Meta Pixel Helper

2. Testiraj 3 glavne forme:
   - Contact Form
   - Quiz
   - Audit Form

3. Proveri u:
   - Browser Console (F12) - vidiš logove?
   - Meta Pixel Helper - vidiš `Lead` evente?
   - Google Tag Assistant - vidiš `generate_lead`, `quiz_complete`, `audit_form_submit`?

**Detaljno:** `TESTIRANJE_EVENTA_QUICK_GUIDE.md`

---

## 📄 DOKUMENTACIJA - GDE ŠTAGOD?

| Fajl | Šta sadrži |
|------|------------|
| **START_OVDE.md** | ⭐ Ovaj fajl - brzi pregled |
| **META_GOOGLE_ADS_SETUP_COMPLETE.md** | 📖 Detaljno uputstvo za setup (korak po korak) |
| **TESTIRANJE_EVENTA_QUICK_GUIDE.md** | 🧪 Kako testirati sve evente |
| **META_GOOGLE_ADS_FINALNO.md** | 📊 Kompletan sažetak svega |

---

## ❓ ZAŠTO SAM DODAO DODATNE EVENTE (TIER 3)?

**Pitao si me da razmislim da li ima smisla pratiti ostale dugmice.**

**Moj odgovor: DA!** Evo zašto:

### 1. **CTA Klikovi** ✅
- **Zašto:** Pokazuje intent - ljudi koji kliknu CTA ali ne popune formu
- **Kako koristiti:** Retargetuj ih sa special offers ili testimonials
- **Meta Ads:** Custom audience "CTA Clickers - Not Converted"

### 2. **Portfolio Klikovi** ✅
- **Zašto:** Visok engagement signal - gledaju tvoj rad = potencijalni klijenti
- **Kako koristiti:** Retargetuj sa case studies ili "contact us" porukom
- **Meta Ads:** Lookalike audience od portfolio viewers

### 3. **Video Play** ✅
- **Zašto:** Ljudi koji gledaju video su veoma angažovani
- **Kako koristiti:** Retargetuj sa "free consultation" ponudom
- **Meta Ads:** Warm audience za retargeting

### 4. **Scroll Depth 75%+** ✅
- **Zašto:** Duboko engažovani korisnici koji čitaju celu stranicu
- **Kako koristiti:** Napravi Lookalike audience - Meta će naći slične ljude
- **Meta Ads:** Odličan signal za kvalitet - bolja konverzija od cold traffic

### 5. **Time on Page 2+ min** ✅
- **Zašto:** Kvalitetni posetioci koji su zaista zainteresovani
- **Kako koristiti:** Lookalike audience - targetuj slične ljude
- **Meta Ads:** Najbolji signal za "high intent" publiku

**Rezultat:** Imaš 3 nivoa leadova + 5 engagement signala za retargeting i Lookalike audiences! 🎯

---

## 🎯 GLAVNI FOKUS - REZIME

| Prioritet | Event | Vrednost | Šta je |
|-----------|-------|----------|--------|
| 🏆 #1 | Contact Form | 15€ | **GLAVNI LEAD** |
| 🏆 #1 | Quiz Complete | 15€ | **GLAVNI LEAD** |
| 🏆 #1 | Audit Form | 15€ | **GLAVNI LEAD** |
| 🥈 #2 | Video Unlock | 5€ | Srednji lead |
| 🥈 #2 | PDF Download | 5€ | Srednji lead |
| 🥉 #3 | CTA Click | 0€ | Engagement (retargeting) |
| 🥉 #3 | Portfolio View | 0€ | Engagement (retargeting) |
| 🥉 #3 | Scroll 75%+ | 0€ | High engagement (Lookalike) |
| 🥉 #3 | Time 2+ min | 0€ | High engagement (Lookalike) |

---

## 🚀 KAKO KORISTITI OVO U KAMPANJAMA?

### Meta (Facebook) Ads Strategija:

**Campaign 1: Conversion Campaign (TIER 1 Leadovi)**
- Objective: Conversions
- Conversion Event: "Contact Form Lead" ili "Quiz Complete Lead"
- Target: Cold audience (interest targeting)
- Budget: 60% total budgeta

**Campaign 2: Lookalike Campaign**
- Objective: Conversions
- Audience: Lookalike 1-3% od TIER 1 leadova + High Engagement audience
- Budget: 30% total budgeta

**Campaign 3: Retargeting Campaign**
- Objective: Conversions
- Audience: Video Viewers, CTA Clickers, Portfolio Viewers (koji nisu konvertovali)
- Creative: Special offers, testimonials, limited time deals
- Budget: 10% total budgeta

### Google Ads Strategija:

**Campaign 1: Search - Brand Keywords**
- Conversion Tracking: TIER 1 (primary)
- Bidding: Target CPA ili Maximize Conversions
- Budget: 40% total budgeta

**Campaign 2: Search - Generic Keywords**
- Conversion Tracking: TIER 1 + TIER 2 (secondary)
- Bidding: Target CPA
- Budget: 40% total budgeta

**Campaign 3: Remarketing**
- Target: Website visitors koji nisu konvertovali
- Budget: 20% total budgeta

---

## ✅ FINALNI CHECKLIST

Pre nego što pokreneš kampanje:

### Setup:
- [ ] Dodao Google Ads ID u `index.html`
- [ ] Kreirao 5 Google Ads conversions
- [ ] Kreirao 5 Meta Custom Conversions
- [ ] Kreirao 4 Meta Custom Audiences

### Testing:
- [ ] Instalirano Google Tag Assistant i Meta Pixel Helper
- [ ] Testirao Contact Form - radi? ✅
- [ ] Testirao Quiz - radi? ✅
- [ ] Testirao Audit Form - radi? ✅
- [ ] Proveren Meta Events Manager - vidiš evente? ✅
- [ ] Proveren Google Ads Conversions - vidiš evente? ✅

### Campaigns:
- [ ] Kreiran Meta Conversion Campaign
- [ ] Kreiran Google Search Campaign
- [ ] Setupovan Remarketing

---

## 🎉 SPREMNO!

**Sistem je kompletan i spreman za rad!**

Sve što treba je da:
1. ✅ Dodaš Google Ads ID (15 min)
2. ✅ Kreiraš Custom Conversions u Meta (20 min)
3. ✅ Testiraš sve forme (30 min)
4. ✅ Pokreneš kampanje! 🚀

**Srećno!** 💪💰

---

P.S. Ako imaš bilo kakva pitanja ili nešto ne radi, proveri `META_GOOGLE_ADS_SETUP_COMPLETE.md` - tamo je sve detaljno objašnjeno korak po korak.


