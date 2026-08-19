import type { MetaFunction } from 'react-router';
import { TermsPage } from './components/pages/TermsPage';
import { buildPageMeta } from './utils/pageMeta';

export const meta: MetaFunction = () => buildPageMeta({
  title: 'Uslovi Korišćenja | AiSajt',
  description: 'Uslovi korišćenja usluga AI Sajt-a. Pročitajte naše uslove za izradu web sajtova, online prodavnica i QR menija.',
  keywords: 'uslovi korišćenja, terms of service, pravila korišćenja',
  canonical: 'https://aisajt.com/terms',
});

export default function TermsRoute() {
  return <TermsPage />;
}
