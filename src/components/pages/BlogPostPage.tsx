import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Navbar } from '../layout/Navbar';
import { Footer } from '../layout/Footer';
import { SEOHelmet } from '../seo/SEOHelmet';
import { Breadcrumbs } from '../blog/Breadcrumbs';
import { TableOfContents } from '../blog/TableOfContents';
import { RelatedPosts } from '../blog/RelatedPosts';
import { CTABlock } from '../blog/CTABlock';
import { AuthorBox } from '../blog/AuthorBox';
import { BlogPostSchema } from '../blog/BlogPostSchema';
import { useLanguage } from '../../hooks/useLanguage';
import { getPostBySlug, getRelatedPosts } from '../../data/blogPosts';
import { getCategoryById } from '../../data/blogCategories';
import { TableOfContentsItem } from '../../types/blog';
import { trackEvent } from '../../utils/analytics';
import ReactMarkdown from 'react-markdown';

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const [tocItems, setTocItems] = useState<TableOfContentsItem[]>([]);

  const post = slug ? getPostBySlug(slug) : undefined;

  useEffect(() => {
    if (post) {
      // Track blog post view
      trackEvent('blog_post_view', {
        post_slug: post.slug,
        post_category: post.category,
        post_title: language === 'sr' ? post.title : post.titleEn
      });

      // Extract TOC from content (H2 and H3)
      const content = language === 'sr' ? post.content : post.contentEn;
      const headingRegex = /^(#{2,3})\s+(.+)$/gm;
      const items: TableOfContentsItem[] = [];
      let match;

      while ((match = headingRegex.exec(content)) !== null) {
        const level = match[1].length;
        const text = match[2].trim();
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-');
        
        items.push({ id, text, level });
      }

      setTocItems(items);
    }
  }, [post, language]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const category = getCategoryById(post.category);
  const relatedPosts = getRelatedPosts(post.id, post.category, 2);

  // Pillar page recommendation based on category
  const pillarPageConfig = getPillarPageForCategory(post.category, language);

  return (
    <>
      <SEOHelmet
        title={language === 'sr' ? post.metaTitle : post.metaTitleEn}
        description={language === 'sr' ? post.metaDescription : post.metaDescriptionEn}
        canonicalUrl={`https://aisajt.com/blog/${post.slug}`}
        image={post.coverImage}
        article={{
          publishedTime: post.publishedAt,
          modifiedTime: post.updatedAt,
          author: post.author.name,
          section: language === 'sr' ? category?.name : category?.nameEn
        }}
      />

      <BlogPostSchema post={post} category={category!} />

      <Navbar />

      <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-32 pb-20">
        <article className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumbs */}
            <Breadcrumbs 
              items={[
                {
                  label: 'Blog',
                  labelEn: 'Blog',
                  path: '/blog'
                },
                {
                  label: category?.name || '',
                  labelEn: category?.nameEn || '',
                  path: `/blog/category/${category?.slug}`
                },
                {
                  label: post.title,
                  labelEn: post.titleEn
                }
              ]}
            />

            {/* Hero Section */}
            <div className="mb-8 md:mb-12">
              {/* Category Badge */}
              <div className="flex flex-wrap items-center gap-2 mb-3 md:mb-4">
                <span className="bg-violet-100 text-violet-700 px-2.5 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-bold uppercase whitespace-nowrap">
                  {category?.icon} {language === 'sr' ? category?.name : category?.nameEn}
                </span>
                <span className="text-gray-600 text-xs md:text-sm whitespace-nowrap">
                  ⏱️ {post.readTime} min
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-gray-900 mb-4 md:mb-6 leading-tight">
                {language === 'sr' ? post.title : post.titleEn}
              </h1>

              {/* Excerpt */}
              <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-6 md:mb-8 leading-relaxed">
                {language === 'sr' ? post.excerpt : post.excerptEn}
              </p>

              {/* Author Box */}
              <AuthorBox 
                author={post.author}
                publishedAt={post.publishedAt}
                updatedAt={post.updatedAt}
              />

              {/* Cover Image */}
              <div className="relative w-full h-[250px] sm:h-[350px] md:h-[450px] lg:h-[500px] rounded-2xl md:rounded-3xl overflow-hidden shadow-xl md:shadow-2xl mb-6 md:mb-8">
                <img 
                  src={post.coverImage}
                  alt={language === 'sr' ? post.title : post.titleEn}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
            </div>

            {/* Content Grid - TOC + Content */}
            <div className="grid lg:grid-cols-12 gap-6 md:gap-8 lg:gap-12">
              {/* Table of Contents - Sidebar (Desktop) */}
              <aside className="hidden lg:block lg:col-span-3">
                <TableOfContents items={tocItems} />
              </aside>

              {/* Main Content */}
              <div className="lg:col-span-9">
                {/* Mobile TOC */}
                <div className="lg:hidden mb-8">
                  <TableOfContents items={tocItems} />
                </div>

                {/* Soft CTA - After Intro */}
                <CTABlock type="soft" />

                {/* Blog Content */}
                <div className="prose prose-lg max-w-none blog-content">
                  <ReactMarkdown
                    components={{
                      h2: ({ node, ...props }) => {
                        const text = props.children?.toString() || '';
                        const id = text
                          .toLowerCase()
                          .replace(/[^a-z0-9\s-]/g, '')
                          .replace(/\s+/g, '-');
                        return <h2 id={id} className="text-3xl font-bold text-gray-900 mt-12 mb-6" {...props} />;
                      },
                      h3: ({ node, ...props }) => {
                        const text = props.children?.toString() || '';
                        const id = text
                          .toLowerCase()
                          .replace(/[^a-z0-9\s-]/g, '')
                          .replace(/\s+/g, '-');
                        return <h3 id={id} className="text-2xl font-bold text-gray-900 mt-8 mb-4" {...props} />;
                      },
                      h4: ({ node, ...props }) => (
                        <h4 className="text-xl font-bold text-gray-900 mt-6 mb-3" {...props} />
                      ),
                      p: ({ node, ...props }) => (
                        <p className="text-gray-700 leading-relaxed mb-6" {...props} />
                      ),
                      a: ({ node, ...props }) => (
                        <a 
                          className="text-violet-600 hover:text-violet-700 font-semibold underline decoration-2 underline-offset-2 transition-colors" 
                          {...props} 
                        />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700" {...props} />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol className="list-decimal list-inside space-y-2 mb-6 text-gray-700" {...props} />
                      ),
                      li: ({ node, ...props }) => (
                        <li className="ml-4" {...props} />
                      ),
                      strong: ({ node, ...props }) => (
                        <strong className="font-bold text-gray-900" {...props} />
                      ),
                      blockquote: ({ node, ...props }) => (
                        <blockquote className="border-l-4 border-violet-500 pl-6 py-2 my-6 italic text-gray-700 bg-violet-50 rounded-r-lg" {...props} />
                      ),
                      code: ({ node, ...props }) => (
                        <code className="bg-gray-100 text-violet-600 px-2 py-1 rounded font-mono text-sm" {...props} />
                      ),
                      pre: ({ node, ...props }) => (
                        <pre className="bg-gray-900 text-gray-100 p-6 rounded-xl overflow-x-auto mb-6" {...props} />
                      )
                    }}
                  >
                    {language === 'sr' ? post.content : post.contentEn}
                  </ReactMarkdown>
                </div>

                {/* Hard CTA - At Bottom */}
                <CTABlock type="hard" category={post.category} />

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-gray-200">
                    <div className="flex flex-wrap gap-2">
                      <span className="text-gray-600 font-semibold mr-2">
                        {language === 'sr' ? 'Tagovi:' : 'Tags:'}
                      </span>
                      {post.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-violet-100 hover:text-violet-700 transition-colors cursor-pointer"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Related Posts */}
                <RelatedPosts 
                  posts={relatedPosts}
                  pillarPage={pillarPageConfig}
                />
              </div>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </>
  );
}

// Helper to get pillar page recommendation based on category
function getPillarPageForCategory(category: string, language: 'sr' | 'en') {
  switch (category) {
    case 'seo':
      return {
        url: '/seo-optimizacija-cena',
        title: 'SEO Optimizacija - Cene i Paketi',
        titleEn: 'SEO Optimization - Pricing & Packages'
      };
    case 'izrada-sajtova':
      return {
        url: '/izrada-sajta-cena',
        title: 'Izrada Sajta - Cene i Procesi',
        titleEn: 'Website Development - Pricing & Process'
      };
    case 'web-dizajn':
      return {
        url: '/web-dizajn',
        title: 'Web Dizajn Usluge',
        titleEn: 'Web Design Services'
      };
    case 'web-shop':
      return {
        url: '/izrada-web-shopa',
        title: 'Izrada Web Shop-a',
        titleEn: 'Web Shop Development'
      };
    default:
      return {
        url: '/',
        title: 'AiSajt - Početna',
        titleEn: 'AiSajt - Home'
      };
  }
}

