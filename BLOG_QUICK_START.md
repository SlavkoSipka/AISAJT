# 🚀 Blog - Quick Start Guide

## Dodaj Novi Post za 5 Minuta

### 1️⃣ Otvori `src/data/blogPosts.ts`

### 2️⃣ Copy-Paste Template:

```typescript
{
  id: 'tvoj-post-slug',
  slug: 'tvoj-post-slug',
  title: 'Tvoj SEO Naslov (Max 60 Karaktera)',
  titleEn: 'Your SEO Title (Max 60 Chars)',
  excerpt: 'Kratak opis posta 150-160 karaktera koji opisuje sadržaj.',
  excerptEn: 'Short post description 150-160 chars that describes content.',
  
  content: `
# Glavni Naslov Posta

Uvodni pasus koji će zainteresovati čitaoca...

## Prva Glavna Sekcija

Tvoj sadržaj ovde. [Link ka pillar stranici](/izrada-sajta-cena).

### Podsekcija

Više sadržaja...

## Druga Glavna Sekcija

Nastavak...

## Zaključak

Finalni misli i poziv na akciju.
  `,
  contentEn: `[English version...]`,
  
  category: 'seo', // ili: izrada-sajtova, web-dizajn, web-shop, case-studies
  tags: ['tag1', 'tag2', 'tag3'],
  
  author: {
    name: 'AiSajt Tim',
    image: '/images/providna2.png'
  },
  
  coverImage: '/images/baza.jpg',
  publishedAt: '2025-01-06',
  updatedAt: '2025-01-06',
  readTime: 10,
  featured: false,
  
  metaTitle: 'SEO Meta Naslov (60 chars) | AiSajt',
  metaTitleEn: 'SEO Meta Title (60 chars) | AiSajt',
  metaDescription: 'Meta opis 150-160 karaktera sa keywordom i pozivom na akciju.',
  metaDescriptionEn: 'Meta description 150-160 chars with keyword and call-to-action.',
  
  relatedPosts: ['drugi-post-slug', 'treci-post-slug'],
  pillarPageLink: {
    url: '/seo-optimizacija-cena', // Relevantna usluga
    anchor: 'profesionalna SEO usluga',
    anchorEn: 'professional SEO service'
  }
}
```

### 3️⃣ Popuni Podatke:

**Required (obavezno):**
- `id` i `slug` - isti, lowercase, hyphens
- `title` i `titleEn`
- `excerpt` i `excerptEn`
- `content` i `contentEn` (minimum 1000 reči)
- `category` (jedna od: seo, izrada-sajtova, web-dizajn, web-shop, case-studies)
- `publishedAt` (format: YYYY-MM-DD)
- `metaTitle` i `metaDescription`

**Optional (opciono):**
- `tags` - za dodatni SEO boost
- `featured` - prikaži u "Featured" sekciji (true/false)
- `relatedPosts` - slugovi srodnih postova
- `pillarPageLink` - link ka money page

### 4️⃣ Interno Linkovanje (BITNO!):

U `content` dodaj:
```markdown
[opisni anchor text](/pillar-page-url)
```

Primeri:
```markdown
[profesionalna izrada sajta](/izrada-sajta-cena)
[SEO optimizacija](/seo-optimizacija-cena)
[moderan web dizajn](/web-dizajn)
```

### 5️⃣ Dodaj u Sitemap:

Otvori `public/sitemap.xml` i dodaj:

```xml
<url>
  <loc>https://aisajt.com/blog/tvoj-post-slug</loc>
  <lastmod>2025-01-06</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.75</priority>
</url>
```

### 6️⃣ Test Lokalno:

```bash
npm run dev
```

Otvori: `http://localhost:5173/blog/tvoj-post-slug`

**Proveri:**
- ✅ Naslov, excerpt, cover image
- ✅ TOC (Table of Contents) radi
- ✅ CTA blokovi prikazani (soft + hard)
- ✅ Related posts prikazani
- ✅ Breadcrumbs prikazani
- ✅ Mobile responsive

### 7️⃣ Deploy:

```bash
git add .
git commit -m "Add blog post: [title]"
git push
```

Netlify automatski deploya za 2-3min! 🚀

---

## 📊 Kategorije i Pillar Mapiranje:

| Kategorija | Pillar URL | Anchor Primeri |
|------------|-----------|----------------|
| `seo` | `/seo-optimizacija-cena` | "SEO usluge", "optimizacija sajta", "Google rangiranje" |
| `izrada-sajtova` | `/izrada-sajta-cena` | "izrada web sajta", "web development", "kreiranje sajta" |
| `web-dizajn` | `/web-dizajn` | "profesionalan dizajn", "web dizajn usluge", "brend identitet" |
| `web-shop` | `/izrada-web-shopa` | "online prodavnica", "e-commerce sistem", "web shop izrada" |
| `case-studies` | `/#portfolio` | "naši projekti", "portfolio", "realni rezultati" |

---

## ✅ Pre-Launch Checklist:

- [ ] **Title:** Max 60 chars, keyword na početku
- [ ] **Meta Description:** 150-160 chars, uključuje keyword + CTA
- [ ] **Content:** Minimum 1000 reči
- [ ] **H2/H3:** Barem 5 sekcija za TOC
- [ ] **Internal Links:** 1 ka pillar-u + 2-3 ka drugim postovima
- [ ] **Images:** Cover image + alt text
- [ ] **Dates:** publishedAt i updatedAt tačni
- [ ] **Read Time:** Realan (170 reči/min)
- [ ] **Category:** Pravilno dodeljena
- [ ] **Slug:** SEO-friendly, unique
- [ ] **Sitemap:** Dodat post URL

---

## 🎯 SEO Power Tips:

1. **Keyword u prvom paragrafu** - Google gleda prve 100 reči
2. **Question headlines** - "Kako...?", "Zašto...?", "Šta je...?"
3. **Short paragraphs** - 2-3 rečenice (mobile readability)
4. **Bullets & numbers** - Lakše skeniranje sadržaja
5. **CTA svakih 500 reči** - Drži engagement visok
6. **Internal links varied** - Nemoj 10x isti anchor text
7. **Alt text na slikama** - "[Keyword] - [Description]"
8. **Update old posts** - Svaki post refresh posle 6 meseci

---

## 🔗 Markdown Shortcuts:

```markdown
# H1 Naslov
## H2 Sekcija
### H3 Podsekcija

**Bold text**
*Italic text*

[Link text](url)
![Image alt](image-url)

- Bullet 1
- Bullet 2

1. Numbered 1
2. Numbered 2

> Blockquote za citate

`Inline code`

```javascript
// Code block
const example = 'code';
```
```

---

## 🚨 Česte Greške:

❌ **Duplicate slug** - Proveri da slug ne postoji
❌ **Missing meta tags** - metaTitle i metaDescription obavezni
❌ **No internal links** - Minimum 1 ka pillar-u
❌ **Short content** - Minimum 1000 reči
❌ **Wrong category** - Mora biti: seo, izrada-sajtova, web-dizajn, web-shop, case-studies
❌ **Invalid date format** - Mora biti: YYYY-MM-DD
❌ **Zaboravio sitemap** - Dodaj post u `public/sitemap.xml`

---

## 📈 Expected Results:

| Timeframe | What to Expect |
|-----------|----------------|
| **Week 1-2** | Google indexuje post |
| **Month 1-3** | Pojavljuje se na stranici 3-5 |
| **Month 3-6** | Kreće organski traffic (10-50 visits/month) |
| **Month 6-12** | Stabilni rankings (50-200+ visits/month) |
| **12+ months** | Compound effect, blog = traffic engine |

**Konzistencija je ključ!** 1-2 posta mesečno = 12-24 posta godišnje = 500-1000+ organic visits/month.

---

## 💡 Content Ideas (Starter Pack):

### SEO Kategorija:
1. "SEO Osnove za Početnike 2025"
2. "Kako Doći na Prvu Stranicu Google-a"
3. "On-Page vs Off-Page SEO: Šta je Važnije?"
4. "Lokalni SEO: Kako Dominirati Google Maps"
5. "10 SEO Grešaka koje Ubijaju Tvoj Ranking"

### Izrada Sajtova:
1. "Koliko Košta Izrada Sajta u 2025?"
2. "WordPress vs Custom Development: Šta Izabrati?"
3. "7 Must-Have Stranica za Svaki Biznis Sajt"
4. "Kako Pripremiti Sadržaj Pre Izrade Sajta"
5. "Landing Page vs Website: Kada Šta Koristiti?"

### Web Dizajn:
1. "Top 10 Web Dizajn Trendova za 2025"
2. "Kako Dizajnirati Sajt koji Konvertuje"
3. "Boje u Web Dizajnu: Psihologija i Primena"
4. "Mobile-First Dizajn: Zašto je to Prioritet"
5. "UX vs UI: Razlike i Kako Zajedno Funkcionišu"

### Web Shop:
1. "Kako Pokrenuti Online Prodavnicu za 7 Dana"
2. "WooCommerce vs Shopify: Šta je Bolje za Tebe?"
3. "10 Strategija za Povećanje Konverzije na Web Shopu"
4. "Kako Odabrati Payment Gateway za Online Prodavnicu"
5. "Email Marketing za E-commerce: Complete Guide"

### Case Studies:
1. "Kako Smo Doveli [Klijent] na #1 Poziciju na Google-u"
2. "Redizajn Sajta: Pre i Posle (+ 300% Traffic)"
3. "Od 0 do 10,000€ Mesečno: E-commerce Success Story"
4. "Kako Smo Ubrzali Sajt za 5 Sekundi (i Poboljšali SEO)"

---

**Sve jasno? Kreni sa prvim postom! 🚀**

Pitanja? Proveri `BLOG_SISTEM_UPUTSTVO.md` za detaljno uputstvo.

