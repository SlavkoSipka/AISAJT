import type { MetaFunction } from 'react-router';
import { LokalniSeoBeogradPage } from './components/pages/LokalniSeoBeogradPage';
import { buildPageMeta } from './utils/pageMeta';

export const meta: MetaFunction = () => buildPageMeta({
  title: 'Lokalna SEO Optimizacija za Beogradske Opštine | AiSajt',
  description: 'Lokalna SEO optimizacija po beogradskim opštinama: Novi Beograd, Vračar, Zvezdara, Voždovac, Palilula i dalje. Pogledajte kako smo to uradili za Komotraks.',
  keywords: 'lokalni seo beograd, seo za beogradske opštine, lokalna seo optimizacija, lokalni seo za male biznise',
  canonical: 'https://aisajt.com/lokalni-seo-beograd',
});

export const handle = { breadcrumb: 'Lokalni SEO Beograd' };

export default function LokalniSeoBeogradRoute() {
  return <LokalniSeoBeogradPage />;
}
