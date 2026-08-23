import type { LoaderFunctionArgs, MetaFunction } from 'react-router';
import { PortfolioDetailPage } from './components/pages/PortfolioDetailPage';
import { getProjectBySlug } from './data/portfolioProjects';
import { buildPageMeta } from './utils/pageMeta';

// Same pattern as blogPost.tsx: the loader's only job is exposing the
// resolved project title to BreadcrumbSchema via handle.breadcrumb(data).
export function loader({ params }: LoaderFunctionArgs) {
  const project = params.slug ? getProjectBySlug(params.slug) : undefined;
  return { title: project?.title };
}

export const handle = {
  breadcrumb: (data: { title?: string }) => [
    { label: 'Portfolio', path: '/izrada-sajta-detalji#case-study' },
    { label: data?.title ?? 'Portfolio' },
  ],
};

export const meta: MetaFunction = ({ params }) => {
  const project = params.slug ? getProjectBySlug(params.slug) : undefined;
  if (!project) {
    return buildPageMeta({
      title: 'Portfolio | AiSajt',
      description: 'Pogledajte naše projekte izrade web sajtova, web shopova i SEO optimizacije.',
      canonical: 'https://aisajt.com/portfolio',
    });
  }
  return buildPageMeta({
    title: `${project.title} | Portfolio | AiSajt`,
    description: project.longDescription.sr,
    canonical: `https://aisajt.com/portfolio/${project.slug}`,
    ogImage: project.image,
    keywords: `${project.title}, portfolio, izrada sajta, ${project.tags.sr.join(', ')}`,
  });
};

export default function PortfolioDetailRoute() {
  return <PortfolioDetailPage />;
}
