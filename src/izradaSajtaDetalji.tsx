import type { MetaFunction } from 'react-router';
import { IzradaSajtaDetaljiPage } from './components/pages/IzradaSajtaDetaljiPage';
import { buildPageMeta } from './utils/pageMeta';

export const meta: MetaFunction = () => buildPageMeta({
  title: 'Izrada Sajta Beograd, Srbija | Šta ti donosi dobar sajt? | AiSajt',
  description: 'Izrada sajta Beograd i Srbija. Pogledaj kako dobar sajt donosi nove klijente i jaču online prisutnost. Video i detalji od AiSajt tima.',
  keywords: 'izrada sajta beograd, izrada sajta srbija, dobar sajt, web sajt',
  canonical: 'https://aisajt.com/izrada-sajta-detalji',
});

export const handle = { breadcrumb: 'Izrada Sajta Detalji' };

export default function IzradaSajtaDetaljiRoute() {
  return <IzradaSajtaDetaljiPage />;
}
