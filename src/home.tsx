import type { MetaFunction } from 'react-router';
import { HomePage } from './components/pages/HomePage';
import { buildPageMeta } from './utils/pageMeta';

export const meta: MetaFunction = () => buildPageMeta({
  title: 'AiSajt | Web Agencija u Beogradu: Sajtovi, SEO i Reklame',
  description: 'AiSajt je digitalna agencija iz Beograda. Web razvoj, SEO optimizacija, Meta reklame i održavanje za firme širom Srbije. Preko 50 realizovanih projekata.',
  keywords: 'aisajt, ai sajt, digitalna agencija beograd, web agencija beograd, aisajt tim',
  canonical: 'https://aisajt.com/',
});

export default function Home() {
  return <HomePage />;
}
