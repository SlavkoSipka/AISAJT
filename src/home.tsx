import type { MetaFunction } from 'react-router';
import { HomePage } from './components/pages/HomePage';
import { buildPageMeta } from './utils/pageMeta';

export const meta: MetaFunction = () => buildPageMeta({
  title: 'AI Sajt - Agencija za Izradu Sajta | SEO Optimizacija | Beograd',
  description: 'AI Sajt - agencija iz Beograda. Profesionalna izrada sajtova i SEO optimizacija. Radimo širom Srbije - Beograd, Novi Sad.',
  keywords: 'agencija za izradu sajta, seo optimizacija, izrada sajta cena, seo optimizacija cena, web agencija beograd, aisajt',
  canonical: 'https://aisajt.com/',
});

export default function Home() {
  return <HomePage />;
}
