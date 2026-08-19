import type { MetaFunction } from 'react-router';
import { LeadMagnetDownloadPage } from './components/pages/LeadMagnetDownloadPage';
import { buildPageMeta } from './utils/pageMeta';

export const meta: MetaFunction = () => buildPageMeta({
  title: 'Besplatan Vodič za Izradu Sajta | AISajt',
  description: 'Preuzmite besplatni vodič za izradu web sajta. Saznajte sve što vam treba za uspešan web projekat - od planiranja do lansiranja.',
  keywords: 'vodič za sajt, besplatan pdf, izrada sajta, web development guide',
  canonical: 'https://aisajt.com/resources/guide',
});

export const handle = { breadcrumb: 'Vodič' };

export default function ResourcesGuideRoute() {
  return <LeadMagnetDownloadPage magnetType="guide" />;
}
