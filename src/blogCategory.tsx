import type { MetaFunction } from 'react-router';
import { BlogCategoryPage } from './components/pages/BlogCategoryPage';
import { getCategoryBySlug } from './data/blogCategories';
import { buildPageMeta } from './utils/pageMeta';

export const meta: MetaFunction = ({ params }) => {
  const category = params.categorySlug ? getCategoryBySlug(params.categorySlug) : undefined;
  if (!category) {
    return buildPageMeta({
      title: 'Blog | SEO, Web Dizajn i Izrada Sajtova Saveti | AiSajt',
      description: 'Naučite sve o SEO optimizaciji, izradi web sajtova, web dizajnu i e-commerce strategijama.',
      canonical: 'https://aisajt.com/blog',
    });
  }
  return buildPageMeta({
    title: category.metaTitle,
    description: category.metaDescription,
    canonical: `https://aisajt.com/blog/category/${category.slug}`,
  });
};

export default function BlogCategoryRoute() {
  return <BlogCategoryPage />;
}
