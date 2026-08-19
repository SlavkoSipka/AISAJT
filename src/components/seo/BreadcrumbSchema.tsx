import { useMatches } from 'react-router';
import { SITE_URL } from '../../lib/site-config';

interface Crumb {
  label: string;
  /** Explicit path override; falls back to the matching route's own pathname if omitted. */
  path?: string;
}

type BreadcrumbValue = string | Crumb[] | ((data: unknown) => string | Crumb[]);

interface RouteHandle {
  breadcrumb?: BreadcrumbValue;
}

/**
 * Sitewide BreadcrumbList JSON-LD (Phase 4) — one component, rendered once
 * from root.tsx, instead of copy-pasting a schema block into every route.
 * Each route module opts in by exporting `handle: { breadcrumb }`:
 *   - a plain string for a static single-level crumb, or
 *   - a function of the route's loader `data` for a dynamic label
 *     (used by blog posts/categories), which may itself return either a
 *     single string or an array of crumbs (blog posts need two: "Blog"
 *     plus the post title, since blogPost.tsx isn't nested under
 *     blogHub.tsx in routes.ts).
 * Routes with no `handle.breadcrumb` (home) contribute nothing; on `/`
 * itself this renders null entirely — no breadcrumb schema on the homepage.
 */
export function BreadcrumbSchema() {
  const matches = useMatches();

  const crumbs: Crumb[] = [{ label: 'Početna', path: '/' }];
  for (const match of matches) {
    const handle = match.handle as RouteHandle | undefined;
    if (!handle?.breadcrumb) continue;
    const resolved = typeof handle.breadcrumb === 'function' ? handle.breadcrumb(match.data) : handle.breadcrumb;
    if (Array.isArray(resolved)) {
      crumbs.push(...resolved.map((c) => ({ label: c.label, path: c.path ?? match.pathname })));
    } else {
      crumbs.push({ label: resolved, path: match.pathname });
    }
  }

  if (crumbs.length <= 1) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      item: `${SITE_URL}${c.path ?? ''}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
