import type { LoaderFunctionArgs, MetaFunction } from 'react-router';
import { BlogPostPage } from './components/pages/BlogPostPage';
import { getPostBySlug } from './data/blogPosts';
import { buildPageMeta } from './utils/pageMeta';

// Small loader whose only job is exposing the resolved post title to
// BreadcrumbSchema (useMatches() reads handle.breadcrumb(data), where data
// is this loader's return value) — blogPost.tsx isn't nested under
// blogHub.tsx in routes.ts, so there's no other way to get a dynamic
// "Blog > [Post Title]" breadcrumb without duplicating the lookup here.
export function loader({ params }: LoaderFunctionArgs) {
  const post = params.slug ? getPostBySlug(params.slug) : undefined;
  return { title: post?.title };
}

export const handle = {
  breadcrumb: (data: { title?: string }) => [
    { label: 'Blog', path: '/blog' },
    { label: data?.title ?? 'Blog' },
  ],
};

export const meta: MetaFunction = ({ params }) => {
  const post = params.slug ? getPostBySlug(params.slug) : undefined;
  if (!post) {
    return buildPageMeta({
      title: 'Blog | SEO, Web Dizajn i Izrada Sajtova Saveti | AiSajt',
      description: 'Naučite sve o SEO optimizaciji, izradi web sajtova, web dizajnu i e-commerce strategijama.',
      canonical: 'https://aisajt.com/blog',
    });
  }
  return buildPageMeta({
    title: post.metaTitle,
    description: post.metaDescription,
    canonical: `https://aisajt.com/blog/${post.slug}`,
    ogImage: `https://aisajt.com${post.coverImage}`,
  });
};

export default function BlogPostRoute() {
  return <BlogPostPage />;
}
