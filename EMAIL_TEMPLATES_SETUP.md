# 📧 Email Templates - Kompletno Uputstvo

## 🎯 Šta Ti Treba

Trebaš **2 različita email template-a** u EmailJS-u:

### **1. Template za KVIZ** (`quiz_completion`)
### **2. Template za BESPLATNU ANALIZU** (`audit_request`)

---

## 📋 Šta Sam Uradio:

✅ Exit Popup - prikazuje se samo jednom (zapamti sa localStorage)  
✅ Kviz dugme na Hero sekciji (glavna pozicija)  
✅ "Alati" sekcija premeštena PRE Portfolio-a  
✅ Uklonjeno: Pricing page, ROI Calculator  
✅ Kviz vraća korisnika na homepage posle completion  
✅ Resources page ima samo 3 opcije: Audit, Guide, Checklist  

---

## 1️⃣ EMAIL TEMPLATE ZA KVIZ

### **Kada se šalje:**
- Kada korisnik završi Kviz i unese email
- Šalje se sa `QuizPage.tsx`

### **Potrebne Varijable u EmailJS template-u:**

```
{{to_email}}         - office@aisajt.com (tvoj email)
{{lead_name}}        - Ime korisnika
{{lead_email}}       - Email korisnika
{{quiz_result}}      - Rezultat (landing, onepage, multipage, ecommerce)
{{language}}         - sr ili en
```

### **Template - HTML Body:**

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Novi Lead - Kviz Završen</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">🎯 NOVI LEAD - KVIZ ZAVRŠEN!</h1>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #667eea;">Nova Osoba Je Završila Kviz!</h2>
            
            <div style="background: #f3f4f6; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Ime:</strong> {{lead_name}}</p>
                <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:{{lead_email}}">{{lead_email}}</a></p>
                <p style="margin: 5px 0;"><strong>Jezik:</strong> {{language}}</p>
            </div>
            
            <h3 style="color: #ec4899;">Preporučeni Tip Sajta:</h3>
            <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; font-size: 24px; font-weight: bold;">
                {{quiz_result}}
            </div>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            
            <h3 style="color: #667eea;">Sledeći Koraci:</h3>
            <ul style="background: #fef3c7; padding: 20px; border-radius: 8px;">
                <li>Kontaktiraj {{lead_name}} u roku od 24h</li>
                <li>Pošalji personalizovanu ponudu za <strong>{{quiz_result}}</strong> sajt</li>
                <li>Zakaži besplatnu konsultaciju</li>
            </ul>
            
            <div style="text-align: center; margin-top: 30px;">
                <a href="mailto:{{lead_email}}" style="display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">
                    Odgovori Na Email
                </a>
            </div>
        </div>
        
        <div style="text-center; padding: 20px; color: #6b7280; font-size: 12px;">
            <p>AISajt.com - Email Marketing System</p>
        </div>
    </div>
</body>
</html>
```

### **Kako Dodati u EmailJS:**

1. Idi na https://dashboard.emailjs.com/
2. Klikni **Email Templates** → **Create New Template**
3. **Template Name:** `quiz_completion`
4. Kopiraj gornji HTML u **Content** tab
5. Dodaj varijable: `to_email`, `lead_name`, `lead_email`, `quiz_result`, `language`
6. **Test** sa primerom podataka
7. **Save Template**

---

## 2️⃣ EMAIL TEMPLATE ZA BESPLATNU ANALIZU

### **Kada se šalje:**
- Kada korisnik popuni "Besplatna Analiza Sajta" formu
- Šalje se sa `AuditFormPage.tsx`

### **Potrebne Varijable:**

```
{{to_email}}         - office@aisajt.com
{{lead_name}}        - Ime korisnika
{{lead_email}}       - Email korisnika
{{website_url}}      - URL njihovog sajta
{{phone}}            - Telefon (opciono)
{{language}}         - sr ili en
```

### **Template - HTML Body:**

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Novi Zahtev - Besplatna Analiza Sajta</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">🔍 ZAHTEV ZA ANALIZU SAJTA!</h1>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #667eea;">Nova Osoba Želi Analizu Sajta!</h2>
            
            <div style="background: #f3f4f6; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Ime:</strong> {{lead_name}}</p>
                <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:{{lead_email}}">{{lead_email}}</a></p>
                {{#phone}}
                <p style="margin: 5px 0;"><strong>Telefon:</strong> <a href="tel:{{phone}}">{{phone}}</a></p>
                {{/phone}}
                <p style="margin: 5px 0;"><strong>Jezik:</strong> {{language}}</p>
            </div>
            
            <h3 style="color: #ec4899;">Sajt Za Analizu:</h3>
            <div style="background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; font-size: 18px; font-weight: bold; word-break: break-all;">
                <a href="{{website_url}}" style="color: white; text-decoration: underline;">{{website_url}}</a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            
            <h3 style="color: #667eea;">Šta Treba Analizirati:</h3>
            <ul style="background: #fef3c7; padding: 20px; border-radius: 8px;">
                <li><strong>SEO:</strong> Meta tagovi, keywords, sitemap, robots.txt</li>
                <li><strong>Performanse:</strong> Load time, Core Web Vitals, image optimization</li>
                <li><strong>Dizajn & UX:</strong> Responzivnost, navigacija, CTA dugmad</li>
                <li><strong>Sigurnost:</strong> SSL, HTTPS, security headers</li>
                <li><strong>Konkurencija:</strong> Kako se rangiraju na Google-u</li>
                <li><strong>Konverzija:</strong> Contact forme, tracking, analytics</li>
            </ul>
            
            <div style="background: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0;"><strong>⏰ ROK:</strong> Pošalji PDF report za <strong>24h</strong></p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
                <a href="mailto:{{lead_email}}" style="display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; margin-right: 10px;">
                    Odgovori Na Email
                </a>
                <a href="{{website_url}}" target="_blank" style="display: inline-block; background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">
                    Otvori Sajt
                </a>
            </div>
        </div>
        
        <div style="text-center; padding: 20px; color: #6b7280; font-size: 12px;">
            <p>AISajt.com - Email Marketing System</p>
        </div>
    </div>
</body>
</html>
```

### **Kako Dodati:**

1. EmailJS Dashboard → **Create New Template**
2. **Template Name:** `audit_request`
3. Kopiraj HTML gore
4. Dodaj varijable
5. **Save**

---

## 3️⃣ KOD - Kako Integrisati u Forme

### **A) U `QuizPage.tsx`** (već postoji, samo dodaj EmailJS):

```typescript
import emailjs from '@emailjs/browser';

const handleEmailSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  const result = calculateResult();
  
  // Pošalji email TEBI
  emailjs.send(
    'YOUR_SERVICE_ID',        // Tvoj EmailJS Service ID
    'quiz_completion',         // Template ime
    {
      to_email: 'office@aisajt.com',
      lead_name: name || 'User',
      lead_email: email,
      quiz_result: result,
      language: language
    },
    'YOUR_PUBLIC_KEY'          // Tvoj EmailJS Public Key
  ).then(() => {
    console.log('Email sent successfully!');
  }).catch((error) => {
    console.error('Email error:', error);
  });
  
  // Redirect to Thank You
  navigate(`/thank-you?name=${name}&source=quiz&result=${result}&lang=${language}`);
};
```

### **B) U `AuditFormPage.tsx`**:

```typescript
import emailjs from '@emailjs/browser';

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  
  // Pošalji email TEBI
  emailjs.send(
    'YOUR_SERVICE_ID',
    'audit_request',
    {
      to_email: 'office@aisajt.com',
      lead_name: formData.name,
      lead_email: formData.email,
      website_url: formData.website,
      phone: formData.phone || 'N/A',
      language: language
    },
    'YOUR_PUBLIC_KEY'
  ).then(() => {
    console.log('Audit request sent!');
  }).catch((error) => {
    console.error('Email error:', error);
  });
  
  // Redirect to Thank You
  navigate(`/thank-you?name=${formData.name}&source=audit&lang=${language}`);
};
```

---

## 📄 PDF-OVI - Šta Treba Da Napraviš

Trebaš **2 PDF-a** koje korisnici mogu da preuzmu:

### **1. Vodič: Od Ideje do Sajta (7 Koraka)**

**Sadržaj (10-15 strana):**

- **Korica:** Logo, naslov, "Besplatni vodič od AISajt.com"
- **Strana 1 - Uvod:** Zašto vam treba web sajt u 2025?
- **Strana 2 - Korak 1:** Koji tip sajta vam treba?
  - Landing Page (1 stranica, 1 cilj)
  - One-Page (5-7 sekcija na jednoj strani)
  - Multi-Page (10+ stranica, blog)
  - E-commerce (online prodavnica)
  - Tabela sa poređenjem
- **Strana 3 - Korak 2:** Definisanje ciljeva
  - Lead generation vs E-commerce vs Portfolio
  - Kviz: Koje pitanje postaviti sebi
- **Strana 4 - Korak 3:** Priprema materijala
  - Logo (vektor format)
  - Slike (high resolution, min 1920px)
  - Tekstovi (copywriting tips)
  - Boje i fontovi (brand identity)
- **Strana 5 - Korak 4:** Izbor agencije - 10 pitanja
  - "Koliko projekata ste uradili?"
  - "Mogu li videti portfolio?"
  - "Ko će raditi na mom projektu?"
  - "Koji je proces izrade?"
  - "Šta je uključeno u cenu?"
  - "Da li nudite podršku posle lansiranja?"
  - Itd.
- **Strana 6 - Korak 5:** Cena i rokovi
  - Tabela sa prosečnim cenama (Landing 800€, One-Page 1,500€, Multi 2,500€+)
  - Rokovi (Landing 1-2 nedelje, itd.)
  - Dodatni troškovi (hosting, domena, itd.)
- **Strana 7 - Korak 6:** Proces izrade (timeline)
  - Konsultacija (1 dan)
  - Ponuda i ugovor (2-3 dana)
  - Dizajn mockup (3-5 dana)
  - Razvoj (1-3 nedelje)
  - Testiranje (2-3 dana)
  - Deployment (1 dan)
- **Strana 8 - Korak 7:** Nakon lansiranja
  - Održavanje (backup, security, updates)
  - Marketing (SEO, Google Ads, Social Media)
  - Analitika (Google Analytics, tracking)
- **Strana 9 - Red Flags:** Šta IZBEGAVATI kod agencija
  - "Cena previše niska"
  - "Bez ugovora"
  - "Bez portfolia"
  - "Svi projekti izgledaju isto"
  - Itd.
- **Strana 10 - Checklist:** Za download
  - [ ] Definisan cilj sajta
  - [ ] Logo spreman
  - [ ] Slike pripremljene
  - [ ] Tekstovi napisani
  - [ ] Agencija izabrana
  - [ ] Ugovor potpisan
- **Poslednja strana:** CTA - "Spremni za razgovor? Kontaktirajte nas!"

**Tool za kreiranje:** **Canva** (besplatno, ima PDF export)

**Template:** Koristi Canva "E-book" template

---

### **2. Checklist: 27 Stvari Koje Sajt Mora Imati**

**Format:** Checklist stil (svaka stavka sa checkbox)

**Sadržaj (6-8 strana):**

- **Korica:** "27 Stvari Koje Svaki Sajt Mora Imati - AISajt Checklist"
- **Kategorija 1: OSNOVNO (5 stvari)**
  - [ ] Responzivan dizajn (desktop, tablet, mobil)
  - [ ] Brz load time (< 3 sekunde)
  - [ ] Kontakt forma koja radi
  - [ ] Validna email adresa i telefon
  - [ ] Aktivan domain i hosting
- **Kategorija 2: SEO (7 stvari)**
  - [ ] Title tag na svakoj stranici
  - [ ] Meta description
  - [ ] H1 tag sa ključnom rečju
  - [ ] Alt text na slikama
  - [ ] Sitemap.xml
  - [ ] Robots.txt
  - [ ] Schema markup (optional ali preporučeno)
- **Kategorija 3: SIGURNOST (4 stvari)**
  - [ ] SSL sertifikat (HTTPS)
  - [ ] Security headers
  - [ ] Backup sistem
  - [ ] Zaštita od spam-a na formama
- **Kategorija 4: PERFORMANSE (4 stvari)**
  - [ ] Optimizovane slike (WebP, lazy loading)
  - [ ] Minified CSS i JS
  - [ ] CDN (Content Delivery Network)
  - [ ] Browser caching
- **Kategorija 5: PRAVNO (3 stvari)**
  - [ ] Privacy Policy stranica
  - [ ] Terms of Service
  - [ ] Cookie notice (GDPR)
- **Kategorija 6: MARKETING & TRACKING (4 stvari)**
  - [ ] Google Analytics
  - [ ] Facebook Pixel (ako koristiš FB Ads)
  - [ ] Google Search Console
  - [ ] Conversion tracking setup

**Stil:** Minimalistički, svaka kategorija druga boja

---

## 4️⃣ Kako Napraviti PDF-ove u Canvi

### **Korak po korak:**

1. **Idi na** https://www.canva.com/ (besplatno)
2. **Kreiraj** → "Document" ili "E-book"
3. **Dimenzije:** A4 (210x297mm) ili US Letter
4. **Dodaj stranice** (10-15 za vodič, 6-8 za checklist)
5. **Dizajn:**
   - Koristi tvoje boje: Violet (#667eea), Indigo (#6366f1), Pink (#ec4899)
   - Font: Inter, Poppins, ili Montserrat
   - Logo: Dodaj svoj AISajt logo
6. **Export:** Download → PDF Print (najbolji kvalitet)

---

## 5️⃣ Gde Staviti PDF-ove

Imaš **2 opcije:**

### **Opcija A: Direktan Link** (brže, lakše)

1. Upload PDF na tvoj hosting ili Google Drive
2. Napravi public link
3. U kodu (kad korisnik unese email), pošalji mu link:

```typescript
emailjs.send('SERVICE_ID', 'guide_download', {
  to_email: email, // Korisnikov email
  pdf_link: 'https://yoursite.com/guide.pdf',
  guide_name: 'Od Ideje do Sajta'
});
```

### **Opcija B: Email Attachment** (profesionalnije)

1. Upload PDF u EmailJS
2. Dodaj attachment u template
3. Šalje se automatski kad korisnik unese email

---

## 📦 REZIME - Šta Sad Treba Da Uradiš:

### **ODMAH (1-2h):**
1. ✅ Napravi 2 email template-a u EmailJS (`quiz_completion`, `audit_request`)
2. ✅ Testiraj oba template-a sa dummy podacima
3. ✅ Integriši EmailJS u `QuizPage.tsx` i `AuditFormPage.tsx`

### **USKORO (2-4h):**
4. ✅ Kreiraj PDF "Vodič: Od Ideje do Sajta" u Canvi
5. ✅ Kreiraj PDF "Checklist: 27 Stvari" u Canvi
6. ✅ Upload PDF-ove na hosting ili Google Drive
7. ✅ Dodaj auto-reply email sa PDF linkom

### **TESTIRANJE (30 min):**
8. ✅ Popuni Kviz → proveri da li stiže email
9. ✅ Popuni Audit formu → proveri email
10. ✅ Preuzmi PDF-ove → proveri da rade linkovi

---

## 🚨 VAŽNO:

- **EmailJS Keys:** Čuvaj ih u `.env` fajlu (nikad commit na Git)
- **PDF linkovi:** Moraju biti javno dostupni (public)
- **Testiranje:** Uvek prvo testiraj sa svojim emailom
- **Spam filter:** Možda prvi email ode u spam - proveri

---

**Pitanja? Pročitaj ponovo ili javi! 🚀**

