import type { MetaFunction } from 'react-router';
import { PrivacyPage } from './components/pages/PrivacyPage';
import { buildPageMeta } from './utils/pageMeta';

export const meta: MetaFunction = () => buildPageMeta({
  title: 'Politika Privatnosti | AiSajt',
  description: 'Politika privatnosti AI Sajt-a. Saznajte kako prikupljamo, koristimo i štitimo vaše lične podatke.',
  keywords: 'politika privatnosti, privacy policy, zaštita podataka, GDPR',
  canonical: 'https://aisajt.com/privacy',
});

export const handle = { breadcrumb: 'Politika Privatnosti' };

export default function PrivacyRoute() {
  return <PrivacyPage />;
}
