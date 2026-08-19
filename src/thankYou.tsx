import type { MetaFunction } from 'react-router';
import { ThankYouPage } from './components/pages/ThankYouPage';
import { buildPageMeta } from './utils/pageMeta';

// Sub-step Phase 3: this route previously had no meta() export, so it was
// silently inheriting root.tsx's site-wide fallback — including that
// fallback's keyword-stuffed title (see PHASE_3_REPORT.md §3.2). Giving it
// its own natural meta() closes that gap. This page is only ever reached
// via a post-submit redirect with a name query param (never organically),
// so a generic title/description is correct — there's no static content to
// describe more specifically. Noindex would be the ideal long-term treatment
// for a transactional page like this, but per-route robots control doesn't
// exist yet (root.tsx hardcodes "index, follow" for every route) — flagged
// as a follow-up, not implemented here (out of Phase 3's scope).
export const meta: MetaFunction = () => buildPageMeta({
  title: 'Hvala Vam | AiSajt',
  description: 'Hvala što ste nas kontaktirali. Javićemo vam se u najkraćem mogućem roku.',
  canonical: 'https://aisajt.com/thank-you',
});

export const handle = { breadcrumb: 'Hvala Vam' };

export default function ThankYouRoute() {
  return <ThankYouPage />;
}
