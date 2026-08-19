import type { MetaFunction } from 'react-router';
import { FunnelPage } from './components/pages/FunnelPage';
import { buildPageMeta } from './utils/pageMeta';

export const meta: MetaFunction = () => buildPageMeta({
  title: 'Izrada Sajta Beograd | Besplatna Ponuda i Konsultacija | AiSajt',
  description: 'Besplatna ponuda za izradu sajta u Beogradu. Zakažite konsultaciju bez obaveze. AiSajt.',
  keywords: 'izrada sajta beograd, besplatna ponuda sajt, izrada web sajta cena, konsultacija izrada sajta, web dizajn beograd',
  canonical: 'https://aisajt.com/funnel',
});

export default function FunnelRoute() {
  return <FunnelPage />;
}
