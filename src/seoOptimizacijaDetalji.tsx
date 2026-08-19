import type { MetaFunction } from 'react-router';
import { SEOOdrzavanjeDetaljiPage } from './components/pages/SEOOdrzavanjeDetaljiPage';
import { buildPageMeta } from './utils/pageMeta';

export const meta: MetaFunction = () => buildPageMeta({
  title: 'SEO Održavanje Beograd, Srbija | Šta ti donosi redovno SEO održavanje? | AiSajt',
  description: 'SEO održavanje Beograd i Srbija. Pogledaj kako redovno SEO održavanje donosi više posetilaca i bolje pozicije. Video i detalji od AiSajt tima.',
  keywords: 'SEO održavanje beograd, SEO održavanje srbija, mesečna SEO optimizacija',
  canonical: 'https://aisajt.com/seo-optimizacija-detalji',
});

export default function SeoOptimizacijaDetaljiRoute() {
  return <SEOOdrzavanjeDetaljiPage />;
}
