import type { MetaFunction } from 'react-router';
import { LeadMagnetDownloadPage } from './components/pages/LeadMagnetDownloadPage';
import { buildPageMeta } from './utils/pageMeta';

export const meta: MetaFunction = () => buildPageMeta({
  title: 'Besplatna Checklist - 27 Stvari Koje Sajt Mora Imati | AISajt',
  description: 'Preuzmite besplatnu checklist sa 27 stvari koje svaki sajt mora imati. SEO, performanse, sigurnost i više.',
  keywords: 'checklist sajt, 27 stvari, seo checklist, web checklist',
  canonical: 'https://aisajt.com/resources/checklist',
});

export const handle = { breadcrumb: 'Checklist' };

export default function ResourcesChecklistRoute() {
  return <LeadMagnetDownloadPage magnetType="checklist" />;
}
