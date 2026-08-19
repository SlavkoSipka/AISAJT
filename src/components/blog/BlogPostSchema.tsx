import { BlogPost } from '../../types/blog';
import { useLanguage } from '../../hooks/useLanguage';
import { SITE_URL } from '../../lib/site-config';
import { BUSINESS_ID } from '../seo/BusinessSchema';

interface BlogPostSchemaProps {
  post: BlogPost;
  category: {
    name: string;
    nameEn: string;
  };
}

export function BlogPostSchema({ post, category }: BlogPostSchemaProps) {
  const { language } = useLanguage();

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: language === 'sr' ? post.title : post.titleEn,
    description: language === 'sr' ? post.excerpt : post.excerptEn,
    image: `${SITE_URL}${post.coverImage}`,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Organization',
      name: post.author.name,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}${post.author.image}`
      }
    },
    // Cross-references the sitewide business node (root.tsx's BusinessSchema)
    // by @id instead of repeating a disconnected Organization stub.
    publisher: { '@id': BUSINESS_ID },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${post.slug}`
    },
    articleSection: language === 'sr' ? category.name : category.nameEn,
    keywords: post.tags?.join(', ') || '',
    inLanguage: language === 'sr' ? 'sr-RS' : 'en-US'
  };

  // Raw JSX <script> (same pattern as FAQ.tsx), not react-helmet-async's
  // <Helmet> — nothing extracts/injects Helmet's context into the prerendered
  // response under Framework Mode, so it never shipped in static HTML.
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

