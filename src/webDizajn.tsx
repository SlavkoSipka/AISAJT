import type { MetaFunction } from 'react-router';
import { WebDizajnPage } from './components/pages/WebDizajnPage';
import { buildPageMeta } from './utils/pageMeta';

export const meta: MetaFunction = () => buildPageMeta({
  title: 'Web Dizajn Cena u Beogradu | Moderan, Responzivan Dizajn',
  description: 'Profesionalan web dizajn u Beogradu i Srbiji, cena od 350€. Moderan, responzivan dizajn prilagođen vašem brendu, uz besplatnu konsultaciju.',
  keywords: 'web dizajn, web dizajn cena, web dizajn beograd, dizajn sajta, dizajn web stranice, profesionalan web dizajn',
  canonical: 'https://aisajt.com/web-dizajn',
});

export default function WebDizajnRoute() {
  return <WebDizajnPage />;
}
