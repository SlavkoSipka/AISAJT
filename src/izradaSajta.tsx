import type { MetaFunction } from 'react-router';
import { IzradaSajtaPage } from './components/pages/IzradaSajtaPage';
import { buildPageMeta } from './utils/pageMeta';

export const meta: MetaFunction = () => buildPageMeta({
  title: 'Izrada Sajta: Cene, Paketi i Proces | od 299€ | AiSajt',
  description: 'Izrada sajta od 299€, sa transparentnim cenama i rokom 2 do 4 nedelje. Radimo za firme u Beogradu. Besplatna konsultacija.',
  keywords: 'izrada sajta, izrada web sajta, izrada sajta beograd, izrada sajta cena, izrada web sajta cena',
  canonical: 'https://aisajt.com/izrada-sajta',
});

export const handle = { breadcrumb: 'Izrada Sajta' };

export default function IzradaSajtaRoute() {
  return <IzradaSajtaPage />;
}
