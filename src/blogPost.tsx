import type { MetaFunction } from 'react-router';
import { BlogPostPage } from './components/pages/BlogPostPage';
import { getPostBySlug } from './data/blogPosts';
import { buildPageMeta } from './utils/pageMeta';

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
