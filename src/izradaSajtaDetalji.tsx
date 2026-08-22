import type { MetaFunction } from 'react-router';
import { IzradaSajtaDetaljiPage } from './components/pages/IzradaSajtaDetaljiPage';
import { buildPageMeta } from './utils/pageMeta';

export const meta: MetaFunction = () => buildPageMeta({
  title: 'AiSajt Tim i Proces Rada | Šta ti donosi dobar sajt? | AiSajt',
  description: 'Upoznaj AiSajt tim i naš proces rada. Pogledaj kako dobar sajt donosi nove klijente i jaču online prisutnost. Video i detalji od AiSajt tima.',
  keywords: 'aisajt tim, proces izrade sajta, dobar sajt, web sajt',
  canonical: 'https://aisajt.com/izrada-sajta-detalji',
});

export const handle = { breadcrumb: 'Tim i Proces Rada' };

export default function IzradaSajtaDetaljiRoute() {
  return <IzradaSajtaDetaljiPage />;
}
