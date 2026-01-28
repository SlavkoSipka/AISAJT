# 🔧 Google Search Console - Rešenje za Indeksiranje

## ✅ Šta smo popravili:

### 1. **Redirect Pravila** (`public/_redirects`)
- ✅ HTTP www → HTTPS non-www (301)
- ✅ HTTPS www → HTTPS non-www (301)
- ✅ HTTP non-www → HTTPS non-www (301)
- ✅ Netlify subdomain → Main domain (301)

### 2. **Netlify Konfiguracija** (`netlify.toml`)
- ✅ Dodati svi HTTP → HTTPS redirects
- ✅ Dodati www → non-www redirects
- ✅ Force HTTPS za sve URL-ove

### 3. **Robots.txt**
- ✅ Jasna definicija canonical domaina
- ✅ Sitemap sa canonical URL-om
- ✅ Blokiran Netlify subdomain

### 4. **Canonical URL-ovi**
- ✅ SEOHelmet komponenta automatski dodaje canonical linkove
- ✅ Svi URL-ovi upućuju na: `https://aisajt.com`

---

## 🚀 Šta treba da uradiš dalje:

### **1. Push izmene na GitHub i redeploy na Netlify**

```bash
git add .
git commit -m "Fix: Google Search Console redirects i canonical URLs"
git push origin main
```

Netlify će automatski deploy-ovati izmene.

---

### **2. U Google Search Console:**

#### **A. Ukloni stare verzije:**
1. Idi na: **Settings** → **Property settings**
2. Ako imaš više properties (www, non-www, http), **ukloni sve osim**:
   - `https://aisajt.com` (BEZ www)

#### **B. Proveri Preferred Domain:**
1. Idi na: **Settings** → **Address change**
2. Potvrdi da je preferred domain: `https://aisajt.com`

#### **C. Resubmit Sitemap:**
1. Idi na: **Sitemaps**
2. Ukloni stari sitemap (ako postoji)
3. Dodaj novi: `https://aisajt.com/sitemap.xml`
4. Klikni **Submit**

#### **D. Request Indexing za ključne stranice:**
1. Idi na: **URL Inspection**
2. Unesi svaki URL (npr. `https://aisajt.com/seo-optimizacija-cena`)
3. Klikni **Request Indexing**

**Ključne stranice za re-index:**
- `https://aisajt.com/`
- `https://aisajt.com/seo-optimizacija-cena`
- `https://aisajt.com/izrada-sajta-cena`
- `https://aisajt.com/web-dizajn`
- `https://aisajt.com/contact`

#### **E. Ukloni stare URL-ove:**
1. Idi na: **Removals** → **Temporary Removals**
2. Zatraži uklanjanje za:
   - `http://www.aisajt.com/*`
   - `http://aisajt.com/*`
   - `https://www.aisajt.com/*`
   - `https://aisajt.netlify.app/*`

---

### **3. Proveri da redirects rade:**

Otvori terminal i testiraj:

```bash
# Provera HTTP → HTTPS redirect
curl -I http://aisajt.com

# Provera www → non-www redirect
curl -I https://www.aisajt.com

# Trebalo bi da dobiješ: 301 Moved Permanently → https://aisajt.com
```

Ili u browseru otvori:
- `http://www.aisajt.com` → trebalo bi da redirect-uje na `https://aisajt.com`
- `http://aisajt.com` → trebalo bi da redirect-uje na `https://aisajt.com`
- `https://www.aisajt.com` → trebalo bi da redirect-uje na `https://aisajt.com`

---

## ⏱️ Koliko traje da se popravi?

- **Redirects**: Odmah (nakon deploy-a)
- **Google Search Console**: 2-7 dana za puno re-indeksiranje
- **Zelena oznaka u GSC**: 1-2 nedelje

---

## 📊 Kako proveriti napredak:

### **Svaki dan proveri:**
1. **Coverage** → Trebalo bi da vidiš smanjenje "Redirect" strana
2. **Sitemaps** → Trebalo bi da vidiš povećanje "Discovered" strana
3. **Performance** → Trebalo bi da vidiš povećanje impressions

---

## ✅ Kada će sve biti zeleno?

Kada u **Google Search Console** → **Coverage** vidiš:
- ✅ **Valid**: sve tvoje stranice
- ❌ **Excluded**: 0 redirect strana
- ✅ **Sitemap**: sve stranice indeksirane

---

## 🆘 Problem i dalje postoji?

Ako nakon 7 dana i dalje imaš "redirect" stranice:

1. Proveri da li su svi redirects aktivni (test sa `curl`)
2. U GSC, idi na **URL Inspection** i proveri svaki problem URL
3. Zatraži **manual indexing** za svaki problem URL

---

## 📝 Dodatne optimizacije:

1. ✅ Canonical URLs - Već dodato u SEOHelmet
2. ✅ Sitemap.xml - Ažuriran sa svim stranicama
3. ✅ Robots.txt - Konfigurisan da dozvoljava indeksiranje
4. ✅ 301 Redirects - Svi URL-ovi redirectuju na canonical verziju

---

**Sve je spremno! Samo push-uj kod i sačekaj 1-2 nedelje da Google procesira promene.** 🚀


