import type { MetaFunction } from 'react-router';
import { WebDizajnPage } from './components/pages/WebDizajnPage';
import { buildPageMeta } from './utils/pageMeta';

export const meta: MetaFunction = () => buildPageMeta({
  title: 'Web Dizajn Cena | Profesionalan Web Dizajn Beograd | Dizajn Sajta',
  description: 'Profesionalan web dizajn po najpovoljnijoj ceni u Beogradu i Srbiji. Moderni, responzivni web dizajn prilagođen vašem brendu. Dizajn sajta od 350€. Besplatna konsultacija za web dizajn projekat.',
  keywords: 'web dizajn, web dizajn cena, web dizajn beograd, dizajn sajta, dizajn web stranice, profesionalan web dizajn',
  canonical: 'https://aisajt.com/web-dizajn',
});

export default function WebDizajnRoute() {
  return <WebDizajnPage />;
}
