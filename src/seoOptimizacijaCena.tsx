import type { MetaFunction } from 'react-router';
import { SEOPage } from './components/pages/SEOPage';
import { buildPageMeta } from './utils/pageMeta';

export const meta: MetaFunction = () => buildPageMeta({
  title: 'SEO Optimizacija Cena | od 250€ | AiSajt',
  description: 'SEO optimizacija sajta od 250€. Radimo u Beogradu i širom Srbije, sa besplatnom analizom i transparentnom ponudom, jednokratno ili mesečno.',
  keywords: 'seo optimizacija cena, seo optimizacija, seo optimizacija sajta, seo optimizacija beograd, cena seo optimizacije',
  canonical: 'https://aisajt.com/seo-optimizacija-cena',
});

export const handle = { breadcrumb: 'SEO Optimizacija Cena' };

export default function SeoOptimizacijaCenaRoute() {
  return <SEOPage />;
}
