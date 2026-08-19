import type { MetaFunction } from 'react-router';
import { SEOPage } from './components/pages/SEOPage';
import { buildPageMeta } from './utils/pageMeta';

export const meta: MetaFunction = () => buildPageMeta({
  title: 'SEO Optimizacija Cena u Beogradu | Prva Pozicija na Google',
  description: 'SEO optimizacija sajta za bolju poziciju na Google, cena od 250€. Radimo u Beogradu i širom Srbije, uz besplatnu analizu i transparentnu ponudu.',
  keywords: 'seo optimizacija cena, seo optimizacija sajta, cena seo optimizacije, seo optimizacija beograd, prva pozicija google, seo cena beograd',
  canonical: 'https://aisajt.com/seo-optimizacija-cena',
});

export const handle = { breadcrumb: 'SEO Optimizacija Cena' };

export default function SeoOptimizacijaCenaRoute() {
  return <SEOPage />;
}
