import type { MetaFunction } from 'react-router';
import { AuditFormPage } from './components/pages/AuditFormPage';
import { buildPageMeta } from './utils/pageMeta';

export const meta: MetaFunction = () => buildPageMeta({
  title: 'Besplatan Audit Sajta | Analiza Performansi i SEO | AISajt',
  description: 'Dobijte besplatnu profesionalnu analizu vašeg sajta. Proveravamo SEO, performanse, sigurnost i korisničko iskustvo. Rezultati u roku od 24h.',
  keywords: 'audit sajta, besplatna analiza, seo analiza, web audit, performanse sajta, aisajt audit',
  canonical: 'https://aisajt.com/resources/audit',
});

export default function ResourcesAuditRoute() {
  return <AuditFormPage />;
}
