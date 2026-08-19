import type { MetaFunction } from 'react-router';
import { SEOOdrzavanjeDetaljiPage } from './components/pages/SEOOdrzavanjeDetaljiPage';
import { buildPageMeta } from './utils/pageMeta';

export const meta: MetaFunction = () => buildPageMeta({
  title: 'SEO Održavanje Beograd, Srbija | Šta ti donosi redovna optimizacija? | AiSajt',
  description: 'SEO održavanje za Beograd i Srbiju — redovna optimizacija donosi više posetilaca i bolje pozicije na Google. Pogledaj video i detalje od AiSajt tima.',
  keywords: 'SEO održavanje beograd, SEO održavanje srbija, mesečna SEO optimizacija',
  canonical: 'https://aisajt.com/seo-optimizacija-detalji',
});

export const handle = { breadcrumb: 'SEO Optimizacija Detalji' };

export default function SeoOptimizacijaDetaljiRoute() {
  return <SEOOdrzavanjeDetaljiPage />;
}
