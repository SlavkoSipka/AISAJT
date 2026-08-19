import type { MetaFunction } from 'react-router';
import { IzradaSajtaCenaPage } from './components/pages/IzradaSajtaCenaPage';
import { buildPageMeta } from './utils/pageMeta';

export const meta: MetaFunction = () => buildPageMeta({
  title: 'Izrada Sajta Cena u Beogradu | Transparentne Cene | AiSajt',
  description: 'Izrada sajta po ceni od 299€ u Beogradu, Novom Sadu i širom Srbije. Transparentne cene, responzivan dizajn i SEO optimizacija uključeni. Besplatna konsultacija.',
  keywords: 'izrada sajta cena, izrada sajtova, izrada web sajta, profesionalna izrada sajtova, izrada sajta beograd, cena izrade sajta',
  canonical: 'https://aisajt.com/izrada-sajta-cena',
});

export const handle = { breadcrumb: 'Izrada Sajta Cena' };

export default function IzradaSajtaCenaRoute() {
  return <IzradaSajtaCenaPage />;
}
