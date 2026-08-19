import type { MetaFunction } from 'react-router';
import { IzradaSajtaCenaPage } from './components/pages/IzradaSajtaCenaPage';
import { buildPageMeta } from './utils/pageMeta';

export const meta: MetaFunction = () => buildPageMeta({
  title: 'Izrada Sajta Cena | Profesionalna Izrada Sajtova Beograd | Izrada Web Sajta',
  description: 'Izrada sajta cena od 299€. Profesionalna izrada sajtova u Beogradu, Novom Sadu i Srbiji. Transparentne cene za izradu web sajta. Besplatna konsultacija. Responzivni dizajn i SEO optimizacija.',
  keywords: 'izrada sajta cena, izrada sajtova, izrada web sajta, profesionalna izrada sajtova, izrada sajta beograd, cena izrade sajta',
  canonical: 'https://aisajt.com/izrada-sajta-cena',
});

export default function IzradaSajtaCenaRoute() {
  return <IzradaSajtaCenaPage />;
}
