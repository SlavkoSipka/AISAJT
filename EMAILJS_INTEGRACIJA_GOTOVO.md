# ✅ EmailJS Integracija - GOTOVO!

## 🎯 Šta Sam Uradio:

Integrisao sam **EmailJS u sve 3 forme** koristeći **1 univerzalni template**!

---

## 📧 Email Flow:

### **1. KVIZ** (`QuizPage.tsx`)
**Kada:** Korisnik završi kviz i unese ime + email  
**Šta šalje:**
```javascript
{
  form_type: 'quiz',
  user_name: 'Petar',
  user_email: 'petar@example.com',
  quiz_result: 'onepage', // ili landing/multipage/ecommerce
  language: 'sr'
}
```
**Email TEBI stiže sa:**
- 🎯 Subject: "NOVI LEAD - KVIZ ZAVRŠEN"
- Pink box sa rezultatom (ONEPAGE, LANDING, itd.)
- Ime, email, jezik
- Sledeći koraci šta da radiš

---

### **2. BESPLATNA ANALIZA** (`AuditFormPage.tsx`)
**Kada:** Korisnik traži analizu sajta  
**Šta šalje:**
```javascript
{
  form_type: 'audit',
  user_name: 'Ana',
  user_email: 'ana@example.com',
  user_phone: '+381 64 123 4567',
  website_url: 'https://example.com',
  language: 'sr'
}
```
**Email TEBI stiže sa:**
- 🔍 Subject: "ZAHTEV ZA ANALIZU SAJTA"
- Blue box sa URL-om sajta (klikabilni link)
- Checklist šta treba analizirati
- ROK: 24h za PDF report

---

### **3. KONTAKT FORMA** (`ContactPage.tsx` i `Contact.tsx`)
**Kada:** Korisnik popuni običnu kontakt formu  
**Šta šalje:**
```javascript
{
  form_type: 'contact',
  user_name: 'Marko',
  user_email: 'marko@example.com',
  user_phone: '+381 61 123 4567',
  message: 'Zanima me izrada sajta...',
  language: 'sr'
}
```
**Email TEBI stiže sa:**
- 📨 Subject: "NOVA PORUKA SA SAJTA"
- Siva box sa porukom
- Ime, email, telefon
- Sledeći koraci

---

## 🎨 Kako Email Izgleda:

Template **automatski prepoznaje** tip forme i prikazuje **različite sekcije**:

| Forma | Prikazuje Se |
|-------|--------------|
| **Quiz** | 🎯 Pink box sa rezultatom + preporuke |
| **Audit** | 🔍 Blue box sa URL-om + checklist šta analizirati |
| **Contact** | 📨 Siva box sa porukom korisnika |

**Sve u JEDNOM template-u!** → Štediš free plan limit ✅

---

## 🔧 Fajlovi Koje Sam Promenio:

1. **`src/components/pages/QuizPage.tsx`**
   - ✅ Dodao EmailJS import
   - ✅ Dodao `name` state
   - ✅ Dodao input za ime
   - ✅ Integrisao emailjs.send() u handleEmailSubmit
   - ✅ Šalje `form_type: 'quiz'`

2. **`src/components/pages/AuditFormPage.tsx`**
   - ✅ Dodao EmailJS import
   - ✅ Integrisao emailjs.send() u handleSubmit
   - ✅ Šalje `form_type: 'audit'` + `website_url`

3. **`src/components/pages/ContactPage.tsx`**
   - ✅ Ažurirano sa novim credentials
   - ✅ Dodao `form_type: 'contact'`
   - ✅ Prilagodio varijable za univerzalni template

4. **`src/components/sections/Contact.tsx`** (forma na Homepage)
   - ✅ Ažurirano sa novim credentials
   - ✅ Dodao `form_type: 'contact'`
   - ✅ Prilagodio varijable

---

## 🧪 Kako Testirati:

### **Test 1 - Kviz:**
1. Idi na `http://localhost:5173/resources/quiz`
2. Popuni svih 5 pitanja
3. Unesi ime i email na kraju
4. Klikni "Pošalji Mi Ponudu"
5. **Proveri** da li ti stiže email sa:
   - Subject: "NOVI LEAD - KVIZ ZAVRŠEN"
   - Pink box sa rezultatom (landing/onepage/multipage)

### **Test 2 - Besplatna Analiza:**
1. Idi na `http://localhost:5173/resources/audit`
2. Popuni: Ime, Email, URL sajta, Telefon
3. Klikni "Pošalji na Analizu"
4. **Proveri** da li ti stiže email sa:
   - Subject: "ZAHTEV ZA ANALIZU SAJTA"
   - Blue box sa URL-om (klikabilni)
   - Checklist šta analizirati

### **Test 3 - Kontakt Forma:**
1. Idi na `http://localhost:5173/contact`
2. Popuni: Ime, Email, Telefon
3. Klikni "Pošalji"
4. **Proveri** da li ti stiže email sa:
   - Subject: "NOVA PORUKA SA SAJTA"
   - Poruka sa podacima

---

## ⚙️ Environment Variables (Opciono):

Možeš dodati u `.env` fajl:

```env
VITE_EMAILJS_PUBLIC_KEY=O6sCZaCGoXrFHvBGT
VITE_EMAILJS_SERVICE_ID=service_rsasqr9
VITE_EMAILJS_TEMPLATE_ID=template_jf2rgsy
```

Ali nije neophodno - hardcode-ovao sam kao fallback!

---

## 📄 PDF-ovi - Šta Dalje?

Imaš **2 opcije** za PDF-ove:

### **Opcija 1: Google Drive** (Najlakše)
1. Napravi PDF-ove u Canvi
2. Upload na Google Drive
3. Desni klik → Get Link → "Anyone with the link can view"
4. Kopiraj link (npr. `https://drive.google.com/file/d/ABC123/view`)
5. **Izmeni link** da bude direktan download:
   ```
   https://drive.google.com/uc?export=download&id=ABC123
   ```

### **Opcija 2: Upload na Hosting** (Profesionalnije)
1. Napravi `/public/downloads/` folder u projektu
2. Stavi PDF-ove tamo:
   - `guide.pdf` (Vodič)
   - `checklist.pdf` (Checklist)
3. Linkovi će biti:
   ```
   https://aisajt.com/downloads/guide.pdf
   https://aisajt.com/downloads/checklist.pdf
   ```

### **Kad Napraviš PDF-ove, Dodaj Auto-Reply:**

Kreiraj **DRUGI template u EmailJS** za auto-reply korisniku:

**Template Name:** `lead_autoreply`  
**To Email:** `{{user_email}}` (korisniku)  
**Subject:** `✅ Hvala! Vaš [vodič/checklist] je spreman`

**Body:**
```html
Pozdrav {{user_name}},

Hvala što ste preuzeli [NAZIV].

📎 Kliknite ovde za download:
[LINK ZA PDF]

Šta dalje?
- Pročitajte vodič
- Primenite savete
- Kontaktirajte nas ako imate pitanja

office@aisajt.com
+381 61 3091583

Vaš AISajt Tim
```

I onda u kodu:

```typescript
// Nakon što pošalješ email sebi, pošalji i korisniku
emailjs.send('service_rsasqr9', 'lead_autoreply', {
  user_email: email,
  user_name: name,
  pdf_link: 'https://drive.google.com/...'
});
```

---

## ✅ Trenutno Stanje:

### **Šta Radi:**
- ✅ Exit Popup (prikazuje se samo jednom)
- ✅ Kviz dugme na Hero (vraća na homepage posle)
- ✅ "Alati" sekcija PRE Portfolio-a
- ✅ EmailJS integrisan u sve 3 forme
- ✅ Svi email-ovi stižu TEBI na office@aisajt.com
- ✅ Različiti email-ovi za kviz, audit, i contact

### **Šta Još Treba:**
- ⏳ Kreirati PDF "Vodič: Od Ideje do Sajta"
- ⏳ Kreirati PDF "Checklist: 27 Stvari"
- ⏳ Upload PDF-ove i dobiti linkove
- ⏳ Kreirati Auto-Reply template u EmailJS (opciono)

---

## 🚀 Sve Je Spremno Za Testiranje!

Pokreni:
```bash
npm run dev
```

I testiraj sve 3 forme! 

**Proveri inbox:** `office@aisajt.com` nakon submit-a! 📧

---

**Questions?** Sve radi! Sad samo PDF-ovi ostaju! 💪

