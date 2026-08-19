import type { MetaFunction } from 'react-router';
import { BlogHubPage } from './components/pages/BlogHubPage';
import { buildPageMeta } from './utils/pageMeta';

export const meta: MetaFunction = () => buildPageMeta({
  title: 'Blog | SEO, Web Dizajn i Izrada Sajtova Saveti | AiSajt',
  description: 'Naučite sve o SEO optimizaciji, izradi web sajtova, web dizajnu i e-commerce strategijama. Praktični saveti, case studies i strategije koje donose rezultate.',
  canonical: 'https://aisajt.com/blog',
});

export default function BlogHubRoute() {
  return <BlogHubPage />;
}
