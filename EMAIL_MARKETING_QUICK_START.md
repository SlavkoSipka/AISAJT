# 🚀 Email Marketing - Quick Start Guide

## ✅ Šta je Gotovo

Implementirano **10+ stranica** sa sistemom za prikupljanje email-ova:

### 📍 Nove Stranice:

1. **`/resources`** - Hub za sve lead magnete
2. **`/pricing`** - Cene i paketi
3. **`/faq`** - Često postavljana pitanja
4. **`/resources/calculator`** - ROI Kalkulator (interaktivni)
5. **`/resources/quiz`** - Kviz: Koji sajt vam treba
6. **`/resources/audit`** - Besplatna analiza sajta
7. **`/resources/guide`** - Download PDF vodiča
8. **`/resources/checklist`** - Download checklist-a
9. **`/case-studies`** - Projekti i rezultati
10. **`/blog`** - Blog sa postovima
11. **Exit-Intent Popup** - Globalni popup (prikazuje se automatski)

---

## 🎯 Kako Pokrećeš Email Capture

Sve forme trenutno loguju u **console**. Da uhvatiš email-ove:

### Brza Integracija sa EmailJS (već imaš):

U svakoj formi (npr. `QuizPage.tsx`, `AuditFormPage.tsx`), dodaj:

```typescript
import emailjs from '@emailjs/browser';

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  
  // Pošalji email tebi
  emailjs.send(
    'YOUR_SERVICE_ID',
    'lead_notification_template', // Kreiraj u EmailJS
    {
      to_email: 'office@aisajt.com',
      lead_name: formData.name,
      lead_email: formData.email,
      lead_source: 'quiz', // ili 'audit', 'guide', itd.
      lead_data: JSON.stringify(formData)
    },
    'YOUR_PUBLIC_KEY'
  ).then(() => {
    // Redirect to Thank You page
    navigate(`/thank-you?name=${formData.name}&source=quiz`);
  });
};
```

### Alternativa: Mailchimp

```bash
npm install @mailchimp/mailchimp_marketing
```

```typescript
const mailchimp = require('@mailchimp/mailchimp_marketing');

mailchimp.setConfig({
  apiKey: 'YOUR_API_KEY',
  server: 'us1' // Tvoj server prefix
});

await mailchimp.lists.addListMember('LIST_ID', {
  email_address: email,
  status: 'subscribed',
  merge_fields: {
    FNAME: name.split(' ')[0],
    SOURCE: 'quiz'
  }
});
```

---

## 📊 Tačke Email Capture

| Stranica | Lead Magnet | Conv. Rate |
|----------|------------|------------|
| Exit Popup | Audit ili Vodič | 3-5% |
| ROI Calculator | PDF Report | 10-15% |
| Quiz | Personalizovana ponuda | 10-15% |
| Audit Form | Analiza sajta | 5-10% |
| Guide/Checklist | PDF Download | 5-10% |
| Blog Newsletter | Recurring tips | 2-4% |

**Očekivano: 10%+ konverzija** (100+ emails sa 1,000 posetilaca)

---

## 🛠️ Šta Treba Da Uradiš

### 1. **Integriši Email Service** (30 min)
- EmailJS, Mailchimp, ili Brevo
- Dodaj API keys u `.env`
- Testiraj submit forme

### 2. **Kreiraj PDF-ove** (2-3h)
- "Od Ideje do Sajta: 7 Koraka" (Vodič)
- "27 Stvari koje Sajt Mora Imati" (Checklist)
- Tool: Canva (besplatno)

### 3. **Setup Auto-Reply Emails** (1h)
- Welcome email sa PDF attachment-om
- Confirmation email za audit request
- Newsletter template

### 4. **Testiranje** (30 min)
- Popuni sve forme
- Proveri da email stiže
- Testiraj na mobilu

### 5. **Deploy** (15 min)
```bash
npm run build
# Deploy na Netlify/Vercel
```

---

## 📧 Email Templates (Primer)

### Welcome Email (za PDF download):

```
Subject: ✅ Vaš [VODIČ/CHECKLIST] je spreman!

Pozdrav [IME],

Hvala što ste preuzeli [NAZIV]!

📎 [LINK ZA DOWNLOAD]

Šta dalje?
1. Pročitajte vodič
2. Primenite savete
3. Kontaktirajte nas ako imate pitanja

Želite da razgovaramo o vašem projektu?
→ Zakažite besplatnu konsultaciju: [LINK]

Vaš AISajt Tim
office@aisajt.com
```

### Audit Request Confirmation:

```
Subject: 🔍 Analiza vašeg sajta je u toku!

Pozdrav [IME],

Primili smo vaš zahtev za analizu:
📊 Sajt: [URL]

Šta dalje?
→ Detaljnu analizu ćete dobiti za 24h
→ Dobićete konkretne akcione korake
→ Besplatne preporuke za poboljšanje

Hvala na poverenju!

Vaš AISajt Tim
```

---

## 🎨 Design Komponente

Sve stranice koriste:

- **Gradient** - violet → indigo → pink
- **Animacije** - fade-in-up, blob, float
- **Hover efekti** - scale, shadow
- **Ikonice** - Lucide React
- **Responzivan** - mobile-first

---

## 🔗 Linkovi za Navigaciju

Dodaj u glavni meni (HomePage):

```typescript
<Link to="/resources">Resursi</Link>
<Link to="/pricing">Cene</Link>
<Link to="/faq">FAQ</Link>
<Link to="/blog">Blog</Link>
<Link to="/case-studies">Projekti</Link>
```

Ili dodaj kao dropdown "Resursi":

```
Resursi ▼
  → Besplatna Analiza
  → ROI Kalkulator
  → Kviz
  → Vodič (PDF)
  → Checklist (PDF)
```

---

## 📈 Metrike za Praćenje

U Google Analytics, prati:

- **Pageviews:** `/resources`, `/pricing`, `/resources/calculator`
- **Custom Events:**
  - `lead_magnet_download`
  - `quiz_completed`
  - `audit_request`
  - `newsletter_signup`
- **Conversion Rate:** Email captures / Total visitors

Goal: **10%+ conversion rate**

---

## 🚨 Važne Napomene

1. **Exit Popup** se prikazuje:
   - Kad miš izlazi sa vrha stranice
   - Ili nakon 30 sekundi
   - Samo jednom po sesiji

2. **Thank You Page** (`/thank-you`):
   - Automatski triggeruje `generate_lead` event
   - Prikazuje konfete animaciju
   - Dinamički sadržaj prema source-u

3. **Sve forme** imaju:
   - Validation (required fields)
   - Loading states
   - Success redirect
   - GA4 tracking

4. **Responzivnost:**
   - Sve testirano na desktop, tablet, mobile
   - Hamburger menu na mobilnom
   - Touch-friendly dugmad

---

## 💡 Pro Tips

**Conversion Optimization:**
- Testiraj različite headline-ove na Exit Popup-u
- A/B test CTA dugmad (boje, tekstovi)
- Dodaj social proof ("2,340+ ljudi veruje nama")
- Postavi urgency ("Besplatno samo ovu nedelju!")

**Email List Building:**
- Segment od prvog dana (quiz vs audit vs guide)
- Šalji drip campaign (7 dana, 3 emaila)
- Ne spamuj - max 1-2 emaila nedeljno

**Retargeting:**
- Facebook Custom Audience sa email listom
- Google Customer Match
- LinkedIn Matched Audiences

---

## 🎯 Quick Win Checklist

- [ ] Integriši EmailJS/Mailchimp
- [ ] Kreiraj 2 PDF-a (Vodič + Checklist)
- [ ] Setup auto-reply email template
- [ ] Testiraj sve forme
- [ ] Deploy na production
- [ ] Dodaj linkove u navigaciju
- [ ] Prati metrike u GA4

**Vreme:** ~4-6 sati za kompletan setup

---

**Sreća u radu!** 🚀

Ako nešto ne radi, proveri console za greške ili kontaktiraj AISajt support.

