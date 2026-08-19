import type { MetaFunction } from 'react-router';
import { PortfolioPage } from './components/pages/PortfolioPage';
import { buildPageMeta } from './utils/pageMeta';

export const meta: MetaFunction = () => buildPageMeta({
  title: 'Portfolio | Naši Projekti i Radovi | AiSajt',
  description: 'Pogledajte naše projekte izrade web sajtova, web shopova i SEO optimizacije. Portfolio radova za klijente iz Beograda, Novog Sada i cele Srbije.',
  keywords: 'portfolio, izrada sajtova primeri, web dizajn portfolio, web sajt projekti, AiSajt radovi',
  canonical: 'https://aisajt.com/portfolio',
});

export const handle = { breadcrumb: 'Portfolio' };

export default function PortfolioRoute() {
  return <PortfolioPage />;
}
