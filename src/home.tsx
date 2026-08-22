import type { MetaFunction } from 'react-router';
import { HomePage } from './components/pages/HomePage';
import { buildPageMeta } from './utils/pageMeta';

export const meta: MetaFunction = () => buildPageMeta({
  title: 'AiSajt - Agencija za Izradu Sajta | Beograd',
  description: 'AiSajt je agencija iz Beograda za izradu web sajtova i SEO optimizaciju. Preko 50 realizovanih projekata za klijente širom Srbije.',
  keywords: 'aisajt, ai sajt, agencija za izradu sajta beograd, web agencija beograd, aisajt tim',
  canonical: 'https://aisajt.com/',
});

export default function Home() {
  return <HomePage />;
}
