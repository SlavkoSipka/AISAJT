import type { MetaFunction } from 'react-router';
import { PrometSistemPage } from './components/pages/PrometSistemPage';
import { buildPageMeta } from './utils/pageMeta';

export const meta: MetaFunction = () => buildPageMeta({
  title: 'Promet Sistem — reklame koje dovode klijente | AiSajt',
  description: 'Pravimo ti reklame na Instagramu i Facebooku i dovodimo klijente direktno na tvoj telefon. Pogledaj video i cene.',
  keywords: 'promet sistem, meta reklame, reklame za firme, marketing agencija, dovođenje klijenata',
  canonical: 'https://aisajt.com/promet-sistem',
});

export default function PrometSistemRoute() {
  return <PrometSistemPage />;
}
