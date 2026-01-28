# 📚 Blog Sistem - Kompletno Uputstvo

## 🎯 Pregled

Blog sistem je dizajniran da **maksimalno pojača SEO**, prirodno vodi ka **HOME i CONTACT sekciji**, i sistemski podržava **pillar stranice**:

### Glavni Pillar-i (Money Pages):
- "Izrada sajta cena" (`/izrada-sajta-cena`)
- "SEO optimizacija cena" (`/seo-optimizacija-cena`)

### Sekundarni Pillar-i:
- "Web dizajn" (`/web-dizajn`)
- "Izrada web shopa" (`/izrada-web-shopa`)

---

## 📁 Struktura Blog Sistema

```
src/
├── types/
│   └── blog.ts                    # TypeScript tipovi za blog
├── data/
│   ├── blogCategories.ts          # Definicije kategorija
│   └── blogPosts.ts               # Baza blog postova
├── components/
│   ├── blog/
│   │   ├── Breadcrumbs.tsx        # SEO breadcrumbs (+ schema)
│   │   ├── TableOfContents.tsx    # TOC (sticky desktop, collapsible mobile)
│   │   ├── RelatedPosts.tsx       # "Recommended next" blok
│   │   ├── CTABlock.tsx           # Soft/Hard CTA-ovi
│   │   ├── AuthorBox.tsx          # Author + publish/update datumi
│   │   └── BlogPostSchema.tsx     # JSON-LD za BlogPosting
│   └── pages/
│       ├── BlogHubPage.tsx        # Glavna blog lista
│       ├── BlogPostPage.tsx       # Single post template
│       └── BlogCategoryPage.tsx   # Category hub stranice
```

---

## ✍️ Kako Dodati Novi Blog Post

### 1. Otvori `src/data/blogPosts.ts`

### 2. Dodaj novi post objekt:

```typescript
{
  id: 'unique-post-slug',
  slug: 'unique-post-slug',
  title: 'SEO Naslov Posta (60 karaktera)',
  titleEn: 'SEO Post Title (60 chars)',
  excerpt: 'Kratak opis posta - 150-160 karaktera',
  excerptEn: 'Short post description - 150-160 chars',
  
  // Sadržaj u Markdown formatu
  content: `
# Glavni Naslov

Uvodni pasus koji će čitaoca zainteresovati...

## Prvi H2 Naslov (Pojavi će se u TOC)

Tvoj sadržaj ovde...

### H3 Podsekcija (Takođe u TOC)

Više sadržaja...

**Bold text**, *italic text*, [link ka pillar stranici](/izrada-sajta-cena).

- Bullet point 1
- Bullet point 2

1. Numbered list item 1
2. Numbered list item 2

> Blockquote za istaknute delove

\`\`\`javascript
// Code block
const example = 'code';
\`\`\`
  `,
  contentEn: `[English content...]`,
  
  category: 'seo', // ili: 'izrada-sajtova', 'web-dizajn', 'web-shop', 'case-studies'
  tags: ['seo osnove', 'google optimizacija', 'keyword research'],
  
  author: {
    name: 'AiSajt Tim',
    image: '/images/providna2.png'
  },
  
  coverImage: '/images/baza.jpg', // Cover slika posta
  publishedAt: '2025-01-06',      // Datum objave (YYYY-MM-DD)
  updatedAt: '2025-01-06',        // Datum poslednjeg ažuriranja
  readTime: 12,                    // Vreme čitanja u minutima
  featured: false,                 // Prikaži u "Featured" sekciji?
  
  // SEO Meta Tags
  metaTitle: 'SEO Meta Title (60 chars) | AiSajt',
  metaTitleEn: 'SEO Meta Title (60 chars) | AiSajt',
  metaDescription: 'Meta description 150-160 karaktera koja jasno opisuje sadržaj i uključuje glavni keyword.',
  metaDescriptionEn: 'Meta description 150-160 chars that clearly describes content and includes main keyword.',
  
  // Internal Linking - BITNO!
  relatedPosts: ['drugi-post-slug', 'treci-post-slug'], // 2-5 srodnih postova
  pillarPageLink: {
    url: '/seo-optimizacija-cena',     // Money page URL
    anchor: 'profesionalna SEO usluga', // Anchor text (varied, partial-match)
    anchorEn: 'professional SEO service'
  }
}
```

---

## 🔗 Reversed Silo: Interno Linkovanje (KLJUČNO!)

### Pravila Internog Linkovanja:

1. **Svaki post MORA imati:**
   - 1 kontekstualan link ka relevantnom **pillar-u** (money page)
   - 2-5 linkova ka **srodnim blog postovima** (horizontalno)
   - "Recommended next" blok: **1 pillar + 2 članka**

2. **Anchor Text Varijacije:**
   ❌ Ne koristi uvek exact-match: "SEO optimizacija cena"
   ✅ Variraj anchor text:
   - "profesionalna SEO usluga"
   - "SEO paketi i cene"
   - "optimizuj svoj sajt"
   - "naša SEO ponuda"

3. **Kontekstualni Linkovi u Content-u:**

```markdown
Ako želiš da [optimizuješ svoj sajt za pretraživače](/seo-optimizacija-cena), 
prvo moraš razumeti osnove keyword research-a.

[Profesionalna izrada sajta](/izrada-sajta-cena) uključuje i SEO optimizaciju od prvog dana.
```

---

## 🎨 CTA Strategija

### Soft CTA (ka HOME/#kontakt):
- Pojavljuje se **posle uvoda**
- Blagog tona, ne smrdi na prodaju
- "Hajde da razgovaramo o tvojoj ideji"

### Hard CTA (ka pillar-ima):
- Pojavljuje se **pri dnu posta**
- **Kontekstualan** po kategoriji:
  - SEO post → SEO cena
  - Izrada sajtova post → Izrada sajta cena
  - Web dizajn post → Web dizajn usluge
  - Web shop post → E-commerce rešenja

**Automatski se bira na osnovu kategorije posta!**

---

## 🏷️ Kategorije

### Dostupne kategorije (`src/data/blogCategories.ts`):

1. **seo** (🔍)
   - SEO strategije, tehnike, case studies
   - Link ka: `/seo-optimizacija-cena`

2. **izrada-sajtova** (💻)
   - Web development, tehnologije, best practices
   - Link ka: `/izrada-sajta-cena`

3. **web-dizajn** (🎨)
   - Dizajn trendovi, UX/UI, inspiracija
   - Link ka: `/web-dizajn`

4. **web-shop** (🛒)
   - E-commerce strategije, online prodavnice
   - Link ka: `/izrada-web-shopa`

5. **case-studies** (📊)
   - Realni primeri projekata, rezultati

---

## ✅ SEO Checklist Pre Objave:

### Content:
- [ ] Minimum 1000 reči sadržaja
- [ ] H2/H3 struktura za TOC
- [ ] 1 link ka pillar stranici (varied anchor)
- [ ] 2-5 linkova ka srodnim postovima
- [ ] Alt text na slikama
- [ ] Keyword u prvom paragrafu

### Meta:
- [ ] Meta title (max 60 chars, keyword na početku)
- [ ] Meta description (150-160 chars, uključuje keyword + CTA)
- [ ] Cover image optimizovana (WebP, <200KB)
- [ ] Canonical URL (`https://aisajt.com/blog/post-slug`)

### Technical:
- [ ] Slug SEO-friendly (lowercase, hyphens)
- [ ] publishedAt i updatedAt datumi tačni
- [ ] readTime realan (170 reči/min)
- [ ] Category pravilno dodeljena
- [ ] Tags relevantni (3-5)
- [ ] relatedPosts popunjeni
- [ ] pillarPageLink definisan

---

## 📊 Post Performance Tracking

Blog sistem automatski trackuje:
- `blog_post_view` - Kada neko otvori post
- `blog_post_click` - Klikovi na postove iz liste
- `blog_category_filter` - Filter po kategoriji

Google Analytics će pokazati:
- Koji postovi donose najviše traffic-a
- Conversion path od bloga ka pillar stranicama
- Bounce rate i engagement po postu

---

## 🚀 Workflow za Dodavanje Posta:

1. **Planiranje:**
   - Odaberi keyword (Google Keyword Planner, Ahrefs)
   - Analiziraj konkurenciju
   - Definiši cilj (awareness, konverzija, link ka pillar-u)

2. **Pisanje:**
   - Napiši sadržaj u Markdown editoru (Notion, Obsidian)
   - Optimizuj za E-E-A-T (Experience, Expertise, Authority, Trust)
   - Uključi primjere, case studies, screenshots

3. **Dodavanje u sistem:**
   - Dodaj post u `src/data/blogPosts.ts`
   - Postavi cover image u `public/images/blog/`
   - Definiši meta tags i internal links

4. **Review:**
   - Proveri na lokalnom (`npm run dev`)
   - Proveri TOC funkcioniše
   - Proveri CTA-ovi prikazani
   - Proveri related posts

5. **Objava:**
   - Commit i push (`git add . && git commit -m "New blog post: [title]" && git push`)
   - Netlify automatski deploya
   - Proveri live verziju

6. **Promotion:**
   - Podeli na social media
   - Email newsletter (ako imaš listu)
   - Interlinuj sa starih postova ka novom

---

## 📝 Markdown Formatting Podrška:

Blog sistem podržava:

- **Headings:** `# H1`, `## H2`, `### H3`, `#### H4`
- **Bold:** `**bold text**`
- **Italic:** `*italic text*`
- **Links:** `[text](url)`
- **Lists:** `- item` ili `1. item`
- **Blockquotes:** `> quote`
- **Code inline:** \`code\`
- **Code blocks:** \`\`\`javascript ... \`\`\`
- **Images:** `![alt](url)` (auto lazy-loading)

---

## 🎯 SEO Best Practices:

### Keyword Strategy:
- **Primary keyword** u: title, H1, prvi pasus, meta description
- **Secondary keywords** u: H2/H3, kroz sadržaj prirodno
- **LSI keywords** (Latent Semantic Indexing) za kontekst

### Content Length:
- **Minimum:** 1000 reči
- **Optimal:** 1500-2500 reči
- **Long-form (2500+):** Za pillar content, comprehensive guides

### Internal Linking Density:
- **1-3 linka na 100 reči** sadržaja
- **Ne više od 5 linkova u paragrafu**
- **Varied anchor text** (nemoj 10x "SEO optimizacija cena")

### Update Strategy:
- Ažuriraj stare postove **svakih 6-12 meseci**
- Dodaj novi sadržaj, fresh data
- Promeni `updatedAt` datum
- Google voli **fresh, updated content**

---

## 🐛 Troubleshooting:

### Post se ne prikazuje:
- Proveri da li je slug unique
- Proveri da li je category validna
- Proveri da li su svi required fields popunjeni

### TOC ne radi:
- Proveri da imaš H2/H3 u content-u
- Proveri da Markdown nema syntax greške

### Related posts prazni:
- Dodaj `relatedPosts: ['slug-1', 'slug-2']` u post object
- Proveri da slugovi postoje u `blogPosts` array-u

### CTA ne prikazuje pillar page:
- Proveri `pillarPageLink` objekt u postu
- Ako nema, `CTABlock` će prikazati default (HOME)

---

## 🎨 Dizajn Sistem:

Blog koristi postojeći dizajn jezik sajta:
- **Violet/Indigo gradient** za primary akcije
- **Category colors** specifični po kategoriji
- **Responsive** (mobile-first)
- **Dark mode ready** (za buduće)

---

## 📈 Rezultati Koji Se Očekuju:

Sa kvalitetnim, SEO-optimizovanim blog content-om:

- **3-6 meseci:** Prvi organski traffic sa Google-a
- **6-12 meseci:** Značajan rast (50-100+ visitors/mesečno po postu)
- **12+ meseci:** Compound effect - blog postaje traffic engine

**Ključ je konzistencija:**
- 1-2 nova posta **mesečno**
- Redovno ažuriranje starih postova
- Sistematsko interno linkovanje

---

## 💡 Pro Tips:

1. **Featured Image Dimenzije:** 1200x630px (social media optimized)
2. **Alt Text Formula:** "[Keyword] - [Description]"
3. **First Paragraph:** Hook čitaoca u prvih 50 reči
4. **Bullets & Numbers:** Povećavaju readability 30%+
5. **Short Paragraphs:** 2-3 rečenice max (especially mobile)
6. **Question Headlines:** "Kako...?", "Zašto...?", "Šta je...?"
7. **Data & Stats:** Potvrđuj tvrdnje sa brojevima
8. **Call-to-Action:** Na svakih 500-700 reči jedan CTA

---

## 🔒 Canonical & NoIndex:

- **Blog hub** (`/blog`): Index, Follow
- **Category pages**: Index, Follow
- **Blog posts**: Index, Follow
- **Tag pages** (ako dodaš): **NoIndex, Follow** (thin content)
- **Search results**: NoIndex, NoFollow

Sitemap automatski uključuje:
- `/blog`
- `/blog/category/[slug]`
- `/blog/[post-slug]`

---

## 🚀 Sledeci Koraci:

1. Napiši **5 starter postova** (1 po kategoriji)
2. Interlinuj ih međusobno
3. Linkuj sa pillar stranica ka blog postovima
4. Promo na social media
5. Monitor Analytics za performance
6. Double down na što najbolje radi

---

**Pitanja? Dodatni zahtevi?**
Ažuriraj ovaj fajl ili pitaj AI za pomoć! 🎯

