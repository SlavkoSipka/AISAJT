import type { LoaderFunctionArgs, MetaFunction } from 'react-router';
import { BlogCategoryPage } from './components/pages/BlogCategoryPage';
import { getCategoryBySlug } from './data/blogCategories';
import { buildPageMeta } from './utils/pageMeta';

// See blogPost.tsx's loader comment — same reasoning for the category name.
export function loader({ params }: LoaderFunctionArgs) {
  const category = params.categorySlug ? getCategoryBySlug(params.categorySlug) : undefined;
  return { name: category?.name };
}

export const handle = {
  breadcrumb: (data: { name?: string }) => [
    { label: 'Blog', path: '/blog' },
    { label: data?.name ?? 'Blog' },
  ],
};

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
