import { type RouteConfig, index, route } from '@react-router/dev/routes';

// Sub-step 2D: every marketing route has a real route module, and the
// catchall is gone — /portal/* is no longer reachable through this route
// config at all. It's served by a dedicated static shell (portal.html,
// mounted by src/entry.portal.tsx / src/portal/PortalApp.tsx) that Vercel
// rewrites /portal/* requests to directly, bypassing Framework Mode's own
// SSR/hydration pipeline entirely. See PHASE_2D_REPORT.md for why.
export default [
  index('home.tsx'),
  route('izrada-sajta-cena', 'izradaSajtaCena.tsx'),
  route('izrada-sajta-detalji', 'izradaSajtaDetalji.tsx'),
  route('seo-optimizacija-cena', 'seoOptimizacijaCena.tsx'),
  route('seo', 'seoOptimizacijaCena.tsx', { id: 'seoAlias' }),
  route('seo-optimizacija-detalji', 'seoOptimizacijaDetalji.tsx'),
  route('web-dizajn', 'webDizajn.tsx'),
  route('izrada-web-shopa', 'izradaWebShopa.tsx'),
  route('funnel', 'funnel.tsx'),
  route('contact', 'funnel.tsx', { id: 'contactAlias' }),
  route('promet-sistem', 'prometSistem.tsx'),
  route('portfolio', 'portfolio.tsx'),
  route('portfolio/:slug', 'portfolioDetail.tsx'),
  route('thank-you', 'thankYou.tsx'),
  route('resources', 'resources.tsx'),
  route('resources/quiz', 'resourcesQuiz.tsx'),
  route('resources/audit', 'resourcesAudit.tsx'),
  route('resources/guide', 'resourcesGuide.tsx'),
  route('resources/checklist', 'resourcesChecklist.tsx'),
  route('blog', 'blogHub.tsx'),
  route('blog/category/:categorySlug', 'blogCategory.tsx'),
  route('blog/:slug', 'blogPost.tsx'),
  route('privacy', 'privacy.tsx'),
  route('terms', 'terms.tsx'),
] satisfies RouteConfig;
