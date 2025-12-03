# ✅ SVE JE GOTOVO - Kompletan Email Tracking Sistem!

## 🎯 Šta Radi Sada:

### **5 Tipova Forme = 5 Notifikacija na EMAIL:**

| Forma | Form Type | Šta Ti Stiže |
|-------|-----------|--------------|
| **Kviz** | `KVIZ` | Ime, Email, Rezultat (landing/onepage/etc) |
| **Besplatna Analiza** | `AUDIT` | Ime, Email, Telefon, Website URL |
| **Kontakt Forma** | `KONTAKT` | Ime, Email, Telefon, Poruka |
| **Vodič PDF** | `VODIČ` | Ime, Email (preuzeo Vodič) |
| **Checklist PDF** | `CHECKLIST` | Ime, Email (preuzeo Checklist) |

---

## 📧 Email Template - JEDNOSTAVAN (BEZ Dinamičkih Varijabli)

**Subject:** `Novi Lead: {{form_type}}`

**Primer:**
- `Novi Lead: KVIZ`
- `Novi Lead: AUDIT`
- `Novi Lead: KONTAKT`
- `Novi Lead: VODIČ`
- `Novi Lead: CHECKLIST`

### **Svi Podaci Uvek Prisutni:**

```
form_type: KVIZ / AUDIT / KONTAKT / VODIČ / CHECKLIST
user_name: [ime korisnika]
user_email: [email korisnika]
user_phone: [telefon ili "N/A"]
message: [poruka ili opis akcije]
quiz_result: [rezultat kviza ili "N/A"]
website_url: [URL sajta ili "N/A"]
language: sr / en
```

**Nema više praznih stringova `''` - sve je ili pravi podatak ili "N/A"!**

---

## 📄 Template HTML (Kopiraj u EmailJS):

Fajl: `EMAILJS_TEMPLATE_FINALNI.html`

**Kako dodati:**
1. Idi na EmailJS → Email Templates
2. Otvori `template_jf2rgsy`
3. Kopiraj SVE iz `EMAILJS_TEMPLATE_FINALNI.html`
4. Paste u EmailJS editor
5. **Subject:** `Novi Lead: {{form_type}}`
6. **To Email:** `office@aisajt.com`
7. Sačuvaj!

**Template prikazuje:**
- Header sa tipom forme (KVIZ, AUDIT, itd.)
- Podaci o korisniku (ime, email, telefon)
- Detalji (kviz rezultat, website URL)
- Poruka
- Call to Action (odgovori u 24h)

---

## 🔧 Kako Funkcioniše:

### **1. KVIZ**
```javascript
// Korisnik završi kviz → unese ime + email
{
  form_type: 'KVIZ',
  user_name: 'Marko',
  user_email: 'marko@example.com',
  user_phone: 'N/A',
  message: 'Korisnik je završio kviz i dobio rezultat.',
  quiz_result: 'ONEPAGE', // ili LANDING, MULTIPAGE, ECOMMERCE
  website_url: 'N/A',
  language: 'sr'
}
```
**Email ti stigne:**  
"KVIZ - Korisnik Marko (marko@example.com) dobio rezultat: ONEPAGE"

---

### **2. BESPLATNA ANALIZA SAJTA**
```javascript
// Korisnik popuni audit formu
{
  form_type: 'AUDIT',
  user_name: 'Ana',
  user_email: 'ana@example.com',
  user_phone: '+381 61 123 4567',
  message: 'Korisnik traži besplatnu analizu sajta.',
  quiz_result: 'N/A',
  website_url: 'https://example.com',
  language: 'sr'
}
```
**Email ti stigne:**  
"AUDIT - Korisnik Ana traži analizu sajta: https://example.com"

---

### **3. KONTAKT FORMA**
```javascript
// Korisnik pošalje poruku preko kontakt forme
{
  form_type: 'KONTAKT',
  user_name: 'Petar',
  user_email: 'petar@example.com',
  user_phone: '+381 64 987 6543',
  message: 'Nova prijava za konsultacije:\n\nIme: Petar\nEmail: petar@example.com\nTelefon: +381 64 987 6543',
  quiz_result: 'N/A',
  website_url: 'N/A',
  language: 'sr'
}
```
**Email ti stigne:**  
"KONTAKT - Nova poruka od Petar (petar@example.com)"

---

### **4. VODIČ PDF**
```javascript
// Korisnik preuzima "Vodič: Od Ideje do Sajta"
{
  form_type: 'VODIČ',
  user_name: 'Milica',
  user_email: 'milica@example.com',
  user_phone: 'N/A',
  message: 'Korisnik je preuzeo VODIČ PDF.',
  quiz_result: 'N/A',
  website_url: 'N/A',
  language: 'sr'
}
```
**Email ti stigne:**  
"VODIČ - Milica je preuzela PDF Vodič"

**BONUS:** PDF se automatski downloaduje na Thank You stranici!

---

### **5. CHECKLIST PDF**
```javascript
// Korisnik preuzima "27 Stvari Koje Sajt Mora Imati"
{
  form_type: 'CHECKLIST',
  user_name: 'Stefan',
  user_email: 'stefan@example.com',
  user_phone: 'N/A',
  message: 'Korisnik je preuzeo CHECKLIST PDF.',
  quiz_result: 'N/A',
  website_url: 'N/A',
  language: 'sr'
}
```
**Email ti stigne:**  
"CHECKLIST - Stefan je preuzeo PDF Checklist"

**BONUS:** PDF se automatski downloaduje na Thank You stranici!

---

## 📂 Kako Dodati PDF-ove:

### **Korak 1: Kreiraj PDF-ove**

#### **PDF #1: Vodič - Od Ideje do Sajta (7 Koraka)**
**Sadržaj:**
1. Koji tip sajta vam treba (Landing, One-Page, Multi-Page, E-commerce)
2. Koliko košta i koliko traje izrada
3. Šta pripremiti pre nego što započnete
4. Kako izabrati pravu agenciju
5. Red flags na koje treba paziti
6. Pitanja koja treba postaviti pre potpisivanja
7. Checklist za kompletnu pripremu

**Alat:** Canva, Google Docs, PowerPoint, Word

---

#### **PDF #2: 27 Stvari Koje Sajt Mora Imati**
**Sadržaj (Checklist format):**
- ✅ SEO: Meta tagovi, alt tekst, sitemap
- ✅ Brzina: Optimizovane slike, caching
- ✅ Sigurnost: SSL, HTTPS, backup
- ✅ Responzivnost: Desktop, tablet, mobil
- ✅ Pravni: Privacy Policy, Terms & Conditions
- ✅ Analytics: Google Analytics, Facebook Pixel
- ✅ Kontakt: Forma, email, telefon, mapa
- ✅ UX: Navigacija, call-to-action, search
- ... (još 19 stavki)

**Format:** Checkboxes koje mogu da štikliraju

**Alat:** Canva, Google Sheets → PDF

---

### **Korak 2: Dodaj PDF-ove u Projekat**

```
AISAJT-main/
└── public/
    └── downloads/
        ├── vodic.pdf          ← STAVI OVDE
        ├── checklist.pdf      ← STAVI OVDE
        └── README.txt         ← UPUTSTVO
```

**Nazivi moraju biti TAČNO:**
- `vodic.pdf` (sve malim slovima)
- `checklist.pdf` (sve malim slovima)

---

### **Korak 3: Testiraj**

```bash
npm run dev
```

**Test Vodič:**
1. Idi na `http://localhost:5173/resources/guide`
2. Unesi ime i email
3. Klikni "Preuzmi PDF"
4. **Proveri:**
   - ✅ Email ti stigne na office@aisajt.com sa tipom "VODIČ"
   - ✅ PDF se automatski downloaduje nakon 1.5s

**Test Checklist:**
1. Idi na `http://localhost:5173/resources/checklist`
2. Unesi ime i email
3. Klikni "Preuzmi PDF"
4. **Proveri:**
   - ✅ Email ti stigne na office@aisajt.com sa tipom "CHECKLIST"
   - ✅ PDF se automatski downloaduje nakon 1.5s

---

## 🎨 Kreiranje PDF-ova u Canva (Preporuka):

### **Vodič PDF - Struktura:**

**Stranica 1 (Naslov):**
```
[LOGO]
━━━━━━━━━━━━━━━━━━━━━━━━

Vodič: Od Ideje do Sajta
7 Koraka do Vašeg Savršenog Web Sajta

━━━━━━━━━━━━━━━━━━━━━━━━
AiSajt.com | 2025
```

**Stranica 2-8 (Svaki Korak):**
```
━━━━━━━━━━━━━━━━━━━━━━━━
KORAK 1: Koji Tip Sajta Vam Treba
━━━━━━━━━━━━━━━━━━━━━━━━

🟣 Landing Page
   → Za kampanje, događaje, produkte
   → Cena: €300-€800
   → Vreme: 5-7 dana

🟣 One-Page Sajt
   → Za freelancere, male biznise
   → Cena: €500-€1,200
   → Vreme: 7-10 dana

🟣 Multi-Page Sajt
   → Za kompanije, agencije
   → Cena: €1,500-€5,000
   → Vreme: 2-4 nedelje

🟣 E-commerce
   → Za online prodavnice
   → Cena: €3,000+
   → Vreme: 4-8 nedelja

💡 Savet: Počnite sa manjim i skalujte!
```

---

### **Checklist PDF - Struktura:**

**Stranica 1 (Naslov):**
```
[LOGO]
━━━━━━━━━━━━━━━━━━━━━━━━

27 Stvari Koje Sajt Mora Imati
Kompletan Checklist za 2025

━━━━━━━━━━━━━━━━━━━━━━━━
AiSajt.com
```

**Stranica 2-8 (Checklist po Kategorijama):**
```
━━━━━━━━━━━━━━━━━━━━━━━━
SEO & Vidljivost
━━━━━━━━━━━━━━━━━━━━━━━━

☐ Meta Title i Description na svakoj stranici
☐ Alt tekst na svim slikama
☐ Sitemap.xml genererisan i poslat Google-u
☐ Google Analytics instaliran i testiran
☐ Facebook Pixel instaliran (za reklame)
☐ Google Search Console verifikovan
☐ Brzina sajta < 3 sekunde (PageSpeed Insights)

━━━━━━━━━━━━━━━━━━━━━━━━
Sigurnost
━━━━━━━━━━━━━━━━━━━━━━━━

☐ SSL Sertifikat (HTTPS)
☐ Automatski backup sistema
☐ Zaštita od spama na formi
☐ GDPR Privacy Policy
☐ Cookie Consent banner

━━━━━━━━━━━━━━━━━━━━━━━━
Responzivnost
━━━━━━━━━━━━━━━━━━━━━━━━

☐ Sajt radi na telefonu (iOS + Android)
☐ Sajt radi na tabletu
☐ Sajt radi na desktopu
☐ Navigacija funkciona na svim uređajima

... (još kategorija)
```

---

## 🚀 Deployment:

Kada dodaš PDF-ove u `/public/downloads/`:

```bash
npm run build
```

Upload na hosting i PDF-ovi će biti dostupni na:
- `https://aisajt.com/downloads/vodic.pdf`
- `https://aisajt.com/downloads/checklist.pdf`

---

## ✅ Finalni Checklist:

### **Kod (Gotovo ✅)**
- ✅ EmailJS integrisan u sve forme
- ✅ Svi podaci imaju default vrednosti (ne šalju prazne stringove)
- ✅ Template pojednostavljen (nema conditional logiku)
- ✅ Auto-download PDF-ova na Thank You stranici

### **EmailJS Setup (Potrebno)**
1. ⏳ Otvori `template_jf2rgsy` na EmailJS
2. ⏳ Kopiraj HTML iz `EMAILJS_TEMPLATE_FINALNI.html`
3. ⏳ Postavi **Subject:** `Novi Lead: {{form_type}}`
4. ⏳ Postavi **To Email:** `office@aisajt.com`
5. ⏳ Sačuvaj

### **PDF-ovi (Potrebno)**
1. ⏳ Kreiraj `vodic.pdf` (Canva/Google Docs)
2. ⏳ Kreiraj `checklist.pdf` (Canva/Google Docs)
3. ⏳ Stavi ih u `/public/downloads/`
4. ⏳ Test download

---

## 🎯 Test Plan:

### **Test #1 - Kviz**
1. Idi na `/resources/quiz`
2. Odgovori na svih 5 pitanja
3. Unesi ime i email
4. **Očekujem:** Email "Novi Lead: KVIZ" sa rezultatom

### **Test #2 - Audit**
1. Idi na `/resources/audit`
2. Popuni: ime, email, telefon, URL sajta
3. **Očekujem:** Email "Novi Lead: AUDIT" sa URL-om

### **Test #3 - Kontakt**
1. Idi na `/contact`
2. Popuni: ime, email, telefon
3. **Očekujem:** Email "Novi Lead: KONTAKT"

### **Test #4 - Vodič**
1. Idi na `/resources/guide`
2. Unesi ime i email
3. **Očekujem:** Email "Novi Lead: VODIČ" + auto-download PDF-a

### **Test #5 - Checklist**
1. Idi na `/resources/checklist`
2. Unesi ime i email
3. **Očekujem:** Email "Novi Lead: CHECKLIST" + auto-download PDF-a

---

## 🛠️ Troubleshooting:

**Problem:** "One or more dynamic variables are corrupted"  
**Fix:** ✅ REŠENO! Svi podaci sad imaju default vrednost "N/A" ili realnu vrednost.

**Problem:** PDF se ne downloaduje  
**Fix:** Proveri da li postoje fajlovi:
- `/public/downloads/vodic.pdf`
- `/public/downloads/checklist.pdf`

**Problem:** Email ne stiže  
**Fix:** Proveri EmailJS credentials:
- Service ID: `service_rsasqr9`
- Template ID: `template_jf2rgsy`
- Public Key: `O6sCZaCGoXrFHvBGT`

---

## 📞 Support:

Sve je implementirano! Samo:
1. Dodaj template u EmailJS
2. Kreiraj 2 PDF-a
3. Testiraj!

**Sve je spremno za produkciju!** 🚀

