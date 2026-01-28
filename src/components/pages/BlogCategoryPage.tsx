import { useParams, Navigate, Link } from 'react-router-dom';
import { Navbar } from '../layout/Navbar';
import { Footer } from '../layout/Footer';
import { SEOHelmet } from '../seo/SEOHelmet';
import { Breadcrumbs } from '../blog/Breadcrumbs';
import { Clock, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { getPostsByCategory } from '../../data/blogPosts';
import { getCategoryBySlug, blogCategories } from '../../data/blogCategories';
import { trackEvent } from '../../utils/analytics';

export function BlogCategoryPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const { language } = useLanguage();

  const category = categorySlug ? getCategoryBySlug(categorySlug) : undefined;
  const posts = category ? getPostsByCategory(category.id) : [];

  if (!category) {
    return <Navigate to="/blog" replace />;
  }

  const handlePostClick = (postSlug: string) => {
    trackEvent('blog_post_click', {
      post_slug: postSlug,
      category: category.id,
      source: 'category_page'
    });
  };

  return (
    <>
      <SEOHelmet
        title={language === 'sr' ? category.metaTitle : category.metaTitleEn}
        description={language === 'sr' ? category.metaDescription : category.metaDescriptionEn}
        canonicalUrl={`https://aisajt.com/blog/category/${category.slug}`}
        image="/images/baza.jpg"
      />

      <Navbar />

      <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <Breadcrumbs 
            items={[
              {
                label: 'Blog',
                labelEn: 'Blog',
                path: '/blog'
              },
              {
                label: category.name,
                labelEn: category.nameEn
              }
            ]}
          />

          {/* Hero Section */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="text-6xl mb-4">{category.icon}</div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6">
              {language === 'sr' ? category.name : category.nameEn}
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              {language === 'sr' ? category.description : category.descriptionEn}
            </p>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              <Link
                to="/blog"
                className="px-6 py-3 rounded-full font-semibold bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-900 transition-all duration-300"
              >
                {language === 'sr' ? '🔥 Sve' : '🔥 All'}
              </Link>
              {blogCategories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/blog/category/${cat.slug}`}
                  className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                    cat.id === category.id
                      ? 'bg-gray-900 text-white shadow-lg'
                      : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-900'
                  }`}
                >
                  {cat.icon} {language === 'sr' ? cat.name : cat.nameEn}
                </Link>
              ))}
            </div>
          </div>

          {/* Posts Grid */}
          {posts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-gray-600">
                {language === 'sr' 
                  ? '😔 Trenutno nema članaka u ovoj kategoriji. Uskoro ćemo dodati novi sadržaj!'
                  : '😔 No articles in this category yet. We\'ll add new content soon!'}
              </p>
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 mt-6 text-violet-600 font-semibold hover:text-violet-700 transition-colors"
              >
                <ArrowRight className="w-5 h-5 rotate-180" />
                {language === 'sr' ? 'Nazad na Blog' : 'Back to Blog'}
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  onClick={() => handlePostClick(post.slug)}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-violet-300 hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={post.coverImage} 
                      alt={language === 'sr' ? post.title : post.titleEn}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{post.readTime} {language === 'sr' ? 'min' : 'min'}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-violet-600 transition-colors mb-3 line-clamp-2">
                      {language === 'sr' ? post.title : post.titleEn}
                    </h3>
                    <p className="text-gray-700 line-clamp-3 mb-4">
                      {language === 'sr' ? post.excerpt : post.excerptEn}
                    </p>
                    <div className="flex items-center text-violet-600 font-semibold group-hover:gap-2 transition-all">
                      {language === 'sr' ? 'Pročitaj više' : 'Read more'}
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* CTA Section */}
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-violet-600 to-indigo-600 rounded-3xl p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {language === 'sr' 
                ? '🚀 Spremni da pokrenete vaš projekat?'
                : '🚀 Ready to start your project?'}
            </h2>
            <p className="text-xl mb-8 opacity-90">
              {language === 'sr'
                ? 'Zakažite besplatne konsultacije i vidimo kako možemo da pomognemo vašem biznisu.'
                : 'Schedule a free consultation and see how we can help your business.'}
            </p>
            <Link
              to="/#kontakt"
              className="inline-flex items-center gap-2 bg-white text-violet-600 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
            >
              {language === 'sr' ? 'Zakaži Konsultacije' : 'Schedule Consultation'}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

