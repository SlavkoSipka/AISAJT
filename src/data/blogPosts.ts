import { BlogPost } from '../types/blog';

/**
 * BLOG POSTS DATABASE
 * 
 * SEO Strategy:
 * - Each post links to at least 1 pillar page (money page)
 * - Each post links to 2-5 related blog posts (horizontal linking)
 * - Varied anchor text (partial-match, not exact-match spam)
 * - CTA blocks: 1 soft (HOME/#contact) + 1 hard (pillar pages)
 */

export const blogPosts: BlogPost[] = [
  // POST 1 - Izrada Sajtova Category
  {
    id: 'koji-sajt-mi-treba-za-firmu',
    slug: 'koji-sajt-mi-treba-za-firmu',
    title: 'Koji Sajt Mi Treba za Firmu? Kompletan Vodič za Izbor Pravog Web Sajta',
    titleEn: 'What Website Does My Business Need? Complete Guide to Choosing the Right Website',
    excerpt: 'Ne znaš koji tip sajta odgovara tvojoj firmi? Otkri razliku između landing page, korporativnog sajta i web shopa, i saznaj koji je pravi izbor za tvoj biznis.',
    excerptEn: 'Not sure what type of website fits your business? Discover the difference between landing pages, corporate sites and web shops, and find out which is right for your business.',
    content: `
# Koji Sajt Mi Treba za Firmu? Kompletan Vodič za Izbor Pravog Web Sajta

Pokrećeš biznis ili želiš da proširite online prisustvo, ali nisi siguran **koji tip web sajta** zapravo trebaš? 

Ovo je pitanje koje nam postavljaju **90% klijenata** na prvom sastanku. I to je potpuno normalno! Sa toliko različitih tipova sajtova, paketa, tehnologija - lako je zbuniti se.

U ovom vodiču ću ti objasniti **tačno koji sajt ti treba**, na osnovu:
- **Tipa biznisa** koji vodiš
- **Ciljeva** koje želiš da postigneš
- **Budžeta** koji imaš na raspolaganju

Na kraju ovog članka, imaćeš **kristalno jasnu sliku** koji sajt trebaš i zašto. Hajde da krenemo! 🚀

---

## 📊 Kviz: Koji Sajt Ti Treba? (2 Minuta)

Pre nego što počnemo, uradi **brzi kviz** (samo 6 pitanja, 2 minuta) koji će ti **instant** reći koji tip sajta odgovara tvojoj firmi:

[👉 **Uradi Besplatni Kviz: Koji Sajt Mi Treba?**](/resources/quiz)

*(ili nastavi da čitaš da naučiš više o svakom tipu sajta)*

---

## Zašto Je Važno Izabrati Pravi Tip Sajta?

**Greška #1** koju male firme prave: Grade **prevelik** ili **premali** sajt za svoje potrebe.

### Šta se dešava kada izabereš POGREŠAN tip sajta:

❌ **Prevelik sajt** (npr. web shop kad ti treba samo landing page):
- Plaćaš više nego što treba
- Duže traje da se napravi
- Teže je održavati
- Komplikovanije za posetioce

❌ **Premali sajt** (npr. landing page kad ti treba pun sajt):
- Ne možeš da postaviš sve informacije
- Gubi se SEO potencijal
- Ne možeš da skaluješ biznis
- Izgleda "jeftino"

**Cilj:** Izabrati **pravu veličinu** - kao Goldilocks princip. Ni preveliko, ni premalo. **Upravo kako treba!**

---

## 🔍 Glavna Pitanja Koja Treba Da Postaviš Sebi

Pre nego što odlučiš koji sajt ti treba, odgovori na ova 5 pitanja:

### 1. **Šta je tvoj glavni cilj?**
- Da dobijaš kontakte/upite? → **Landing Page** ili **Korporativni Sajt**
- Da prodaješ proizvode online? → **Web Shop (E-commerce)**
- Da educiješ publiku i gradiš autoritet? → **Blog/Content sajt**
- Da prikažeš portfolio radova? → **Portfolio sajt**

### 2. **Ko je tvoja ciljna publika?**
- B2B (prodaješ firmama)? → **Korporativni sajt** sa detaljnim info
- B2C (prodaješ krajnjim korisnicima)? → **Landing page** ili **Web shop**
- Oba? → **Hybrid sajt** sa različitim sekcijama

### 3. **Koliko proizvoda/usluga nudiš?**
- 1-3 usluge? → **Landing Page** (jedna fokusirana poruka)
- 4-10 usluga? → **Korporativni Sajt** (više stranica)
- 10+ proizvoda? → **Web Shop** sa katalogom

### 4. **Kakav je tvoj budžet?**
- **199-399€**: Landing Page, QR meni
- **399-799€**: Korporativni sajt (5-10 stranica)
- **999-2500€**: E-commerce / Web Shop
- **Custom**: Aplikacija, SaaS, kompleksni sistemi

### 5. **Koliko vremena imaš za održavanje?**
- **Malo vremena**: Jednostavan sajt, retko ažuriranje
- **Redovno vreme**: Blog, novosti, ažuriranje proizvoda
- **Dnevno**: Web shop, e-commerce sa inventory management-om

---

## 📁 Tipovi Web Sajtova - Kompletan Pregled

Hajde da prođemo kroz **6 glavnih tipova** web sajtova i vidimo za koga je koji najbolji:

---

### 1. 🎯 **Landing Page (Jedna Stranica)**

**Šta je:** Jedna fokusirana stranica sa **jednim ciljem** - da posetilac klikne CTA (Call-to-Action).

**Kada ti treba:**
✅ Lansiraš novi proizvod/uslugu
✅ Vodiš Facebook/Google Ads kampanje
✅ Nudiš 1-2 glavne usluge
✅ Cilj je da dobijaš **kontakte/upite**
✅ Želiš **brzo** i **jeftino** rešenje

**Struktura:**
1. Hero sekcija (naslov + CTA)
2. Problem/Rešenje
3. Benefiti (3-5)
4. Kako funkcioniše? (proces)
5. Testimonials (ocene klijenata)
6. FAQ
7. Finalni CTA (kontakt forma)

**Cena:** 199-399€

**Primer:** [Pogledaj primer landing page-a](/izrada-sajta-cena)

**Za koga je idealan:**
- **Freelanceri** (fotografi, dizajneri, programeri)
- **Lokalni biznisi** (frizeri, majstori, dostava)
- **Startups** (validacija ideje pre velikog ulaganja)
- **Agencije** (fokus na 1 uslugu)

---

### 2. 🏢 **Korporativni Sajt (5-15 Stranica)**

**Šta je:** Klasičan web sajt sa **više stranica** - Početna, O nama, Usluge, Portfolio, Blog, Kontakt.

**Kada ti treba:**
✅ Imaš 3+ različite usluge/proizvode
✅ Želiš da **detaljno** objasniš šta radiš
✅ Gradiš **brand** i **autoritet**
✅ Cilj je **SEO** i **organski traffic**
✅ B2B poslovanje (korporacije, agencije)

**Struktura:**
1. **Početna** (hero, usluge overview, testimonials, CTA)
2. **O nama** (priča, tim, vrednosti)
3. **Usluge** (detaljne stranice za svaku uslugu)
4. **Portfolio** (projekti, case studies)
5. **Blog** (SEO, edukacija, autoritet)
6. **Kontakt** (forma, mapa, info)

**Cena:** 399-799€

**Primer:** [Pogledaj AiSajt (naš sajt je primer!)](/)]

**Za koga je idealan:**
- **IT firme, agencije** (kompleksnije usluge)
- **Konsultanti** (edukativni sadržaj)
- **B2B kompanije** (duži sales cycle)
- **Professional services** (advokati, računovođe)

---

### 3. 🛒 **Web Shop / E-commerce (Online Prodavnica)**

**Šta je:** Kompletan sistem za **online prodaju** - katalog proizvoda, korpa, checkout, payment gateway.

**Kada ti treba:**
✅ Prodaješ **fizičke proizvode** (odeća, nakit, elektronika)
✅ Prodaješ **digitalne proizvode** (kursevi, eBooks, software)
✅ Imaš **10+ proizvoda** u ponudi
✅ Želiš da **automizuješ** prodaju (24/7)
✅ Cilj je **direktna prodaja** (ne samo inquiry)

**Funkcionalnosti:**
- **Katalog proizvoda** (sa slikama, opisima, varijantama)
- **Korpa** (dodaj/ukloni proizvode)
- **Checkout** (adresa, dostava, plaćanje)
- **Payment gateway** (kartice, PayPal, crypto)
- **Inventory management** (praćenje zaliha)
- **Shipping** (praćenje pošiljki, automatski tracking)
- **CRM** (praćenje kupaca, email marketing)

**Cena:** 999-2500€ (zavisi od kompleksnosti)

**Za koga je idealan:**
- **Online prodavnice** (fashion, dekor, tech)
- **Kreatori** (digitalni proizvodi, kursevi)
- **Dropshipping** biznisi
- **B2C kompanije** sa katalogom

[Vidi više o web shop izradi](/izrada-web-shopa)

---

### 4. 📱 **QR Online Meni (Za Restorane/Kafiće)**

**Šta je:** Digitalni meni dostupan preko **QR koda** - skeniraš kod, otvoriš meni na telefonu.

**Kada ti treba:**
✅ Imaš **restoran, kafić, bar**
✅ Želiš da **eliminiš** papirne menije
✅ Često menjaju **jela i cene**
✅ Hygiene standard (post-COVID)
✅ Multi-language podrška (turisti)

**Cena:** Od 199€

**Za koga je idealan:**
- Restorani, kafići, barovi
- Picerije, dostava
- Hoteli (room service)

---

### 5. 🎨 **Portfolio Sajt (Za Kreativce)**

**Šta je:** Vizuelno fokusiran sajt gde prikazuješ **radove** (fotografije, dizajn, video).

**Kada ti treba:**
✅ **Fotograf, dizajner, artist**
✅ Arhitekta, interijer dizajner
✅ Video producent, animator
✅ Cilj je da **prikažeš radove** vizuelno

**Struktura:**
- **Hero** (best work)
- **Gallery** (filterabilan po kategorijama)
- **O meni** (priča, expertise)
- **Kontakt**

**Cena:** 299-599€

---

### 6. 📝 **Blog / Content Sajt**

**Šta je:** Sajt fokusiran na **sadržaj** - članci, vodiči, tutorials.

**Kada ti treba:**
✅ Gradiš **autoritet** u niši
✅ SEO strategija (organski traffic)
✅ Affiliate marketing
✅ Educiješ publiku pre prodaje

**Primer:** News portali, lifestyle blogovi, edukativni sajtovi

**Cena:** Od 399€

---

## 💭 Real Talk: Većina Vas Treba Landing Page ili Korporativni Sajt

Okej, prošli smo kroz sve tipove sajtova. Sad da ti kažem šta **zapravo** treba 90% malih biznisa i freelancera:

**Landing Page** ili **Korporativni Sajt**. That's it.

Znam, znam - web shop zvuči kul, portfolio izgledalo bi sjajno... Ali bukvalno?

Ako tek počinješ ili imaš **malu do srednju firmu**, fokusiraj se na ovo:
- **1-2 usluge?** → Landing Page (199-399€, gotovo za 3 dana)
- **3-5+ usluga?** → Korporativni sajt (399-799€, gotovo za nedelju-dve)

**Zašto ne web shop odmah?** Zato što:
- Košta **3x više** (999-2500€)
- Traje **3x duže** da se napravi
- Komplikovaniji je za održavanje
- Treba ti **inventory system**, payment gateway, shipping...

**Start small, grow fast.** Lansiraš landing page danas, testiraš da li ljudi uopšte žele tvoju uslugu/proizvod. Ako radi - nadogradiš na pun sajt ili shop za 6 meseci.

Ne pravi grešku "sve ili ništa" - kreći sa onim što ti **zaista treba** danas, a ne onim što **možda** trebaš za godinu dana.

---

## 🤔 Kako Odlučiti? Dijagram Odluke

Hajde da **pojednostavimo** odluku:

### **START: Šta je tvoj glavni cilj?**

**Cilj 1: Dobijanje kontakata/upita** 📞
→ Imaš 1-2 usluge? → **Landing Page**
→ Imaš 3-5+ usluga? → **Korporativni Sajt**

**Cilj 2: Online prodaja** 💰
→ 1-10 proizvoda? → **Landing Page sa payment-om**
→ 10-50 proizvoda? → **Web Shop (mali)**
→ 50+ proizvoda? → **Web Shop (kompletan sa CRM)**

**Cilj 3: Prikazivanje radova** 🎨
→ **Portfolio Sajt**

**Cilj 4: Digitalni meni** 🍕
→ **QR Meni**

**Cilj 5: Edukacija i autoritet** 📚
→ **Blog sajt** ili **Korporativni + Blog**

---

## 💡 Najčešća Pitanja (FAQ)

### 1. **Da li mogu da dodam funkcionalnosti kasnije?**

**DA!** Dobar sajt se **skalira**.

- Kreći sa **Landing Page** → kasnije dodaj Blog sekciju
- Kreći sa **Korporativnim sajtom** → kasnije dodaj **Web Shop**

**Pametan pristup:** "Start small, grow fast."

---

### 2. **Koliko košta održavanje sajta?**

- **Landing Page / Korporativni**: 0-50€/mesečno (hosting + domen)
- **Web Shop**: 50-200€/mesečno (hosting + payment processing + inventory tools)

[Vidi detaljne cene izrade sajta](/izrada-sajta-cena)

---

### 3. **Koliko dugo traje izrada sajta?**

- **Landing Page**: 1-3 dana
- **Korporativni sajt**: 5-14 dana
- **Web Shop**: 14-30 dana

**Naš rekord:** Landing page za 24h! ⚡

---

### 4. **Da li mogu sam da ažuriram sajt?**

**DA!** Svaki sajt dolazi sa:
- CMS (Content Management System) - WordP ress / Custom CMS
- Video tutorial kako da ažuriraš sadržaj
- 3 meseca besplatne podrške

---

### 5. **Šta ako se predomislim posle?**

Bez problema! Dobar sajt je **fleksibilan**.

Ako kreće sa Landing Page-om, a kasnije ti treba **pun sajt** - možemo da **ekstendujemo** umesto da pravimo od nule.

---

## 🎯 Zaključak: Koji Sajt Ti Treba?

Hajde da **recap-ujemo**:

### **Trebaš LANDING PAGE ako:**
✅ Imaš 1-2 usluge
✅ Fokus na **konverziju** (upiti, kontakti)
✅ Budzet: 199-399€
✅ Vreme: 1-3 dana

### **Trebaš KORPORATIVNI SAJT ako:**
✅ Imaš 3+ usluga
✅ Fokus na **brand** i **SEO**
✅ Budzet: 399-799€
✅ Vreme: 5-14 dana

### **Trebaš WEB SHOP ako:**
✅ Prodaješ proizvode online
✅ 10+ proizvoda u katalogu
✅ Budzet: 999-2500€
✅ Vreme: 14-30 dana

---

## 🚀 Sledeći Korak: Uradi Kviz ili Zakaži Konsultacije

### Opcija 1: Uradi Brzi Kviz (2 minuta)

[👉 **Koji Sajt Mi Treba? - Besplatni Kviz**](/resources/quiz)

Odgovori na 6 pitanja i saznaćeš **instant** koji tip sajta odgovara tvojoj firmi!

---

### Opcija 2: Zakaži Besplatne Konsultacije

Želiš da razgovaramo uživo o tvojim potrebama?

[📅 **Zakaži Besplatne Konsultacije**](/#kontakt)

Na konsultacijama ćemo:
- **Analizirati** tvoj biznis i ciljeve
- **Preporučiti** tip sajta koji ti treba
- **Dati cenu** i timeline
- **Odgovoriti** na sva pitanja

**100% besplatno, bez obaveze!**

---

## 📚 Dodatni Resursi

Ako želiš da naučiš više:

- [Koliko Košta Izrada Sajta u 2025?](/izrada-sajta-cena)
- [SEO Osnove za Početnike](/blog/seo-osnove-za-pocetnike)
- [Web Dizajn Trendovi 2025](/web-dizajn)
- [Portfolio Naših Radova](/#portfolio)

---

**Imaš još pitanja?** Piši nam na [office@aisajt.com](mailto:office@aisajt.com) ili nam se javi putem [kontakt forme](/#kontakt)!

Srećno sa tvojim novim sajtom! 🎉
`,
    contentEn: `[English version of the content...]`,
    category: 'izrada-sajtova',
    tags: ['izbor sajta', 'tipovi sajtova', 'web development', 'landing page vs sajt'],
    author: {
      name: 'AiSajt Tim',
      image: '/images/providna2.png'
    },
    coverImage: '/images/izrada sajta cena.jpg',
    publishedAt: '2025-01-06',
    updatedAt: '2025-01-06',
    readTime: 15,
    featured: true,
    metaTitle: 'Koji Sajt Mi Treba za Firmu? Vodič za Izbor Pravog Web Sajta 2025 | AiSajt',
    metaTitleEn: 'What Website Does My Business Need? Complete Guide 2025 | AiSajt',
    metaDescription: 'Ne znaš koji tip sajta treba tvojoj firmi? Landing page, korporativni sajt ili web shop? Otkri koji sajt ti treba na osnovu biznisa, budžeta i ciljeva. Besplatni kviz + expert saveti.',
    metaDescriptionEn: 'Not sure what type of website your business needs? Landing page, corporate site or web shop? Discover which website you need based on business, budget and goals. Free quiz + expert advice.',
    relatedPosts: ['seo-osnove-za-pocetnike'],
    pillarPageLink: {
      url: '/izrada-sajta-cena',
      anchor: 'cene izrade web sajtova',
      anchorEn: 'website development pricing'
    }
  },

  // POST 2 - SEO Category
  {
    id: 'seo-osnove-za-pocetnike',
    slug: 'seo-osnove-za-pocetnike',
    title: 'SEO Osnove za Početnike: Kompletna Objašnjenje',
    titleEn: 'SEO Basics for Beginners: Complete Guide',
    excerpt: 'Naučite SEO od nule. Sve što vam treba da optimizujete sajt i poboljšate rangiranje na Google-u.',
    excerptEn: 'Learn SEO from scratch. Everything you need to optimize your site and improve Google rankings.',
    content: `
# SEO Osnove za Početnike: Kompletna Objašnjenje

Da li želite da vaš sajt bude vidljiv na Google-u? U ovom vodiču otkrijte kako funkcionoše SEO optimizacija i kako možete da poboljšate svoju online vidljivost.

## Šta je SEO i Zašto je Važan?

**SEO (Search Engine Optimization)** je proces optimizacije web sajta kako bi bio vidljiviji na pretraživačima. Kada neko pretražuje usluge koje nudite, želite da vaš sajt bude među prvim rezultatima.

### Zašto je SEO kritičan za vaš biznis:

- **95% ljudi** ne gleda dalje od prve stranice rezultata
- Organski SEO traffic je **besplatan** (za razliku od plaćenih oglasa)
- **Dugoročna** strategija koja donosi rezultate godinama
- Gradi **kredibilitet i autoritet** vašeg brenda

## Ključni SEO Faktori u 2025.

### 1. Keyword Research (Istraživanje Ključnih Reči)

Pre nego što počnete sa optimizacijom, morate da znate **šta vaša publika pretražuje**. Evo kako:

- Koristite Google Keyword Planner za pronalaženje relevantnih termina
- Analizirajte konkurenciju (šta oni targetiraju?)
- Fokusirajte se na **long-tail keywords** (manja konkurencija, veća konverzija)

**Primer**: Umesto samo "izrada sajta", targetirajte "izrada sajta cena Beograd" - specifičnije, manje konkurentno, veća šansa za konverziju.

### 2. On-Page SEO Optimizacija

#### Title Tag (Naslov Stranice)
Najvažniji on-page SEO faktor. Treba da sadrži:
- Glavni keyword na početku
- Brand name na kraju
- Maksimum 60 karaktera

**Dobar primer**: "Izrada Sajta Cena - Od 199€ | AiSajt Beograd"

#### Meta Description
Opis stranice koji se pojavljuje u rezultatima pretrage:
- 150-160 karaktera
- Uključite keyword prirodno
- Call-to-action (poziv na akciju)

#### H1, H2, H3 Tagovi
Struktuirajte sadržaj hijerarhijski:
- **H1**: Glavni naslov (samo 1 po stranici)
- **H2**: Glavne sekcije
- **H3**: Podsekcije

### 3. Tehnički SEO

#### Brzina Sajta
Google favorizu brze sajtove:
- Optimizuj slike (WebP format, lazy loading)
- Koristi CDN (Content Delivery Network)
- Minimiziraj CSS/JS fajlove
- **Cilj**: Load time ispod 2 sekunde

#### Mobile-Friendly (Responzivan Dizajn)
Više od **60% pretrage** dolazi sa mobilnih uređaja:
- Sajt mora biti prilagođen svim screen size-ovima
- Touch-friendly interfejs
- Google koristi **mobile-first indexing**

#### SSL Sertifikat (HTTPS)
- **Must-have** za svaki sajt
- Google rangira HTTPS sajtove bolje
- Gradi trust kod posetilaca

### 4. Content is King (Sadržaj je Kralj)

Kvalitetan, relevantan sadržaj je temelj SEO-a:

#### Dužina Sadržaja
- **Minimum 1000 reči** za blog postove
- Duži sadržaj (2000+ reči) rangira bolje
- Ali: **kvalitet > kvantitet**

#### E-E-A-T Princip
Google evaluira sadržaj kroz:
- **Experience** (Iskustvo)
- **Expertise** (Stručnost)
- **Authoritativeness** (Autoritet)
- **Trustworthiness** (Pouzdanost)

#### Freshness (Svežina)
- Redovno ažurirajte stari sadržaj
- Dodajte "Last updated" datum
- Google voli **fresh content**

## Link Building: Izgradnja Autoriteta

### Interno Linkovanje
- Povežite relevantne stranice na svom sajtu
- Koristi descriptive anchor text
- **Primer**: Umesto "kliknite ovde", koristite "SEO optimizacija cena"

[SEO usluge](/#seo-optimizacija-cena) mogu značajno da poboljšaju vašu online vidljivost i dovedu do većeg broja kvalifikovanih posetilaca.

### Eksterno Linkovanje (Backlinks)
- Linkovi sa drugih sajtova ka vašem
- **Kvalitet > kvantitet**
- Linkovi sa autoritativnih sajtova najvredniji

## Lokalni SEO za Male Biznise

Ako targetirate lokalnu publiku:

### Google Business Profile (Google My Business)
- **Obavezno** kreirajte profil
- Kompletne informacije (adresa, telefon, radno vreme)
- Redovno dodajte fotografije
- Prikupljajte reviews (ocene)

### Lokalne Ključne Reči
Targetirajte geo-specifične termine:
- "izrada sajta Beograd"
- "SEO optimizacija Novi Sad"
- "web dizajn Niš"

## Kako Meriti SEO Uspeh?

### Google Analytics 4
Pratite:
- **Organski traffic** (koliko ljudi dolazi iz pretrage)
- **Bounce rate** (procenat ljudi koji odmah napuštaju sajt)
- **Conversion rate** (procenat ljudi koji konvertuju)

### Google Search Console
- Koje ključne reči **donose traffic**
- **CTR** (Click-Through Rate)
- Tehnički problemi (indexing errors)
- Backlinks

## Najčešće SEO Greške koje Treba Izbegavati

❌ **Keyword stuffing** - Prepucavanje ključnih reči (izgleda spamovano)
❌ **Duplicate content** - Isti sadržaj na više stranica
❌ **Ignoring mobile optimization** - Sajt koji ne radi na mobilnom
❌ **Slow loading speed** - Spor sajt (ljudi napuštaju)
❌ **No internal linking** - Izolovane stranice bez veza
❌ **Thin content** - Sadržaj bez vrednosti (manje od 300 reči)

## Koliko Dugo Traje SEO da Pokaže Rezultate?

Budite realni:
- **Prvi rezultati**: 3-6 meseci
- **Značajan progress**: 6-12 meseci
- **Pun potencijal**: 12+ meseci

SEO je **maraton, ne sprint**. Zahteva strpljenje, konzistenciju i kontinuiranu optimizaciju.

## Zaključak: Vaš SEO Action Plan

1. **Keyword research** - Pronađite šta vaša publika pretražuje
2. **On-page optimizacija** - Title, meta, headings, content
3. **Tehnički SEO** - Brzina, mobile, HTTPS
4. **Content strategija** - Kvalitetan, relevantan sadržaj redovno
5. **Link building** - Interno i eksterno linkovanje
6. **Lokalni SEO** - Google Business, lokalne ključne reči
7. **Merenje** - Analytics i Search Console tracking

Ako vam sve ovo zvuči komplikovano i želite da profesionalci preuzmu SEO vašeg sajta, [pogledajte našu SEO uslugu](/seo-optimizacija-cena) gde nudimo kompletnu optimizaciju po pristupačnoj ceni.

## Započnite Vaš SEO Putovanje Danas

SEO može izgledati zastrašujuće na početku, ali svaki veliki sajt je počeo od osnova. **Ključ je konzistencija** - radite male korake svakog dana, i rezultati će doći.

Potrebna vam je pomoć? [Zakažite besplatne konsultacije](/#kontakt) i razgovarajmo o tome kako možemo da optimizujemo vaš sajt.
`,
    contentEn: `
# SEO Basics for Beginners: Complete Guide

Want your website to be visible on Google? In this guide, discover how SEO optimization works and how you can improve your online visibility.

[English content would follow the same structure...]
`,
    category: 'seo',
    tags: ['seo osnove', 'google optimizacija', 'keyword research'],
    author: {
      name: 'AiSajt Tim',
      image: '/images/providna2.png'
    },
    coverImage: '/images/baza.jpg',
    publishedAt: '2025-01-05',
    updatedAt: '2025-01-06',
    readTime: 12,
    featured: true,
    metaTitle: 'SEO Osnove za Početnike 2025: Kompletna Objašnjenje | AiSajt',
    metaTitleEn: 'SEO Basics for Beginners 2025: Complete Guide | AiSajt',
    metaDescription: 'Naučite SEO od nule. Kompletna objašnjenje keyword research, on-page optimizacije, link building i merenje rezultata. Praktični saveti za 2025.',
    metaDescriptionEn: 'Learn SEO from scratch. Complete guide on keyword research, on-page optimization, link building and measuring results. Practical tips for 2025.',
    relatedPosts: [], // Will be filled when we add more posts
    pillarPageLink: {
      url: '/seo-optimizacija-cena',
      anchor: 'profesionalna SEO usluga',
      anchorEn: 'professional SEO service'
    }
  }
];

// Helper functions
export const getPostBySlug = (slug: string): BlogPost | undefined => {
  return blogPosts.find(post => post.slug === slug);
};

export const getPostsByCategory = (category: string): BlogPost[] => {
  return blogPosts.filter(post => post.category === category);
};

export const getFeaturedPosts = (): BlogPost[] => {
  return blogPosts.filter(post => post.featured).slice(0, 3);
};

export const getLatestPosts = (limit: number = 6): BlogPost[] => {
  return [...blogPosts]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
};

export const getRelatedPosts = (currentPostId: string, category: string, limit: number = 3): BlogPost[] => {
  return blogPosts
    .filter(post => post.id !== currentPostId && post.category === category)
    .slice(0, limit);
};

