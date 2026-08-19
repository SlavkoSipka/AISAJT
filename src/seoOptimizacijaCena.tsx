import type { MetaFunction } from 'react-router';
import { SEOPage } from './components/pages/SEOPage';
import { buildPageMeta } from './utils/pageMeta';

export const meta: MetaFunction = () => buildPageMeta({
  title: 'SEO Optimizacija Cena | SEO Optimizacija Sajta | Prva Pozicija Google',
  description: 'SEO optimizacija sajta za prvu poziciju na Google u Beogradu i Srbiji. Profesionalna SEO optimizacija - cena od 250€. Besplatna analiza sajta. Dovedite svoj web sajt na prvu stranicu Google pretrage.',
  keywords: 'seo optimizacija cena, seo optimizacija sajta, cena seo optimizacije, seo optimizacija beograd, prva pozicija google, seo cena beograd',
  canonical: 'https://aisajt.com/seo-optimizacija-cena',
});

export default function SeoOptimizacijaCenaRoute() {
  return <SEOPage />;
}
