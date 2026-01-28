import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../layout/Navbar';
import { Footer } from '../layout/Footer';
import { SEOHelmet } from '../seo/SEOHelmet';
import { Clock, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { blogPosts, getPostsByCategory } from '../../data/blogPosts';
import { blogCategories } from '../../data/blogCategories';
import { BlogPost } from '../../types/blog';
import { trackEvent } from '../../utils/analytics';

export function BlogHubPage() {
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesCategory;
  });

  const handlePostClick = (postSlug: string) => {
    trackEvent('blog_post_click', {
      post_slug: postSlug,
      category: selectedCategory,
      source: 'blog_hub'
    });
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    trackEvent('blog_category_filter', {
      category: categoryId
    });
  };

  return (
    <>
      <SEOHelmet
        title={language === 'sr' 
          ? 'Blog | SEO, Web Dizajn i Izrada Sajtova Saveti | AiSajt'
          : 'Blog | SEO, Web Design and Website Development Tips | AiSajt'}
        description={language === 'sr'
          ? 'Naučite sve o SEO optimizaciji, izradi web sajtova, web dizajnu i e-commerce strategijama. Praktični saveti, case studies i strategije koje donose rezultate.'
          : 'Learn everything about SEO optimization, website development, web design and e-commerce strategies. Practical tips, case studies and strategies that deliver results.'}
        canonicalUrl="https://aisajt.com/blog"
        image="/images/baza.jpg"
      />

      <Navbar />

      <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-24 md:pt-32 pb-12 md:pb-20">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="max-w-5xl mx-auto text-center mb-8 md:mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-4 md:mb-6 leading-tight px-2 whitespace-normal md:whitespace-nowrap">
              {language === 'sr' 
                ? 'Blog: SEO, Web Dizajn i Izrada Sajtova'
                : 'Blog: SEO, Web Design and Website Development'}
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 mb-6 md:mb-8 px-2">
              {language === 'sr'
                ? 'Praktični saveti, strategije i case studies koji će pomoći tvom biznisu da raste online.'
                : 'Practical tips, strategies and case studies that will help your business grow online.'}
            </p>
          </div>

          {/* Category Filter */}
          <div className="mb-6 md:mb-12 overflow-x-auto scrollbar-hide px-2">
            <div className="flex justify-start md:justify-center gap-2 md:gap-3 min-w-max md:min-w-0 pb-2">
              <button
                onClick={() => handleCategoryClick('all')}
                className={`px-3 py-1.5 md:px-6 md:py-3 rounded-full font-semibold transition-all duration-300 text-xs md:text-base whitespace-nowrap ${
                  selectedCategory === 'all'
                    ? 'bg-gray-900 text-white shadow-lg'
                    : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-900'
                }`}
              >
                {language === 'sr' ? '🔥 Sve' : '🔥 All'}
              </button>
              {blogCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`px-3 py-1.5 md:px-6 md:py-3 rounded-full font-semibold transition-all duration-300 text-xs md:text-base whitespace-nowrap ${
                    selectedCategory === category.id
                      ? 'bg-gray-900 text-white shadow-lg'
                      : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-900'
                  }`}
                >
                  {category.icon} {language === 'sr' ? category.name : category.nameEn}
                </button>
              ))}
            </div>
          </div>

          {/* All Posts */}
          <div className="mb-8 md:mb-16 px-2">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-8 text-center">
              {selectedCategory === 'all' 
                ? (language === 'sr' ? 'Svi Članci' : 'All Articles')
                : `${blogCategories.find(cat => cat.id === selectedCategory)?.icon} ${language === 'sr' 
                    ? blogCategories.find(cat => cat.id === selectedCategory)?.name
                    : blogCategories.find(cat => cat.id === selectedCategory)?.nameEn}`}
            </h2>

            {filteredPosts.length === 0 ? (
              <div className="text-center py-8 md:py-16">
                <p className="text-base md:text-xl text-gray-600 px-4">
                  {language === 'sr' 
                    ? '😔 Nema pronađenih članaka. Pokušaj sa drugom pretragom ili kategorijom.'
                    : '😔 No articles found. Try a different search or category.'}
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                {filteredPosts.map((post) => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.slug}`}
                    onClick={() => handlePostClick(post.slug)}
                    className="group bg-white rounded-xl md:rounded-2xl overflow-hidden border border-gray-200 hover:border-violet-300 hover:shadow-lg md:hover:shadow-xl transition-all duration-300 flex flex-col"
                  >
                    <div className="relative h-36 sm:h-44 md:h-48 overflow-hidden">
                      <img 
                        src={post.coverImage} 
                        alt={language === 'sr' ? post.title : post.titleEn}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-3 sm:p-4 md:p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-2 text-xs text-gray-600">
                        <span className="bg-violet-100 text-violet-700 px-2 py-0.5 md:px-3 md:py-1 rounded-full font-semibold">
                          {blogCategories.find(cat => cat.id === post.category)?.icon}{' '}
                          <span className="hidden sm:inline">
                            {language === 'sr' 
                              ? blogCategories.find(cat => cat.id === post.category)?.name
                              : blogCategories.find(cat => cat.id === post.category)?.nameEn}
                          </span>
                        </span>
                        <Clock className="w-3 h-3 md:w-4 md:h-4" />
                        <span>{post.readTime} min</span>
                      </div>
                      <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 group-hover:text-violet-600 transition-colors mb-2 md:mb-3 line-clamp-2">
                        {language === 'sr' ? post.title : post.titleEn}
                      </h3>
                      <p className="text-xs sm:text-sm md:text-base text-gray-700 line-clamp-2 md:line-clamp-3 mb-3 md:mb-4">
                        {language === 'sr' ? post.excerpt : post.excerptEn}
                      </p>
                      <div className="flex items-center text-violet-600 font-semibold group-hover:gap-2 transition-all text-xs md:text-sm mt-auto">
                        {language === 'sr' ? 'Pročitaj' : 'Read'}
                        <ArrowRight className="w-3 h-3 md:w-4 md:h-4 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* CTA Section */}
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-12 text-center text-white">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">
              {language === 'sr' 
                ? '🚀 Spremni da pokrenete projekat?'
                : '🚀 Ready to start your project?'}
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 md:mb-8 opacity-90">
              {language === 'sr'
                ? 'Zakažite besplatne konsultacije i vidimo kako možemo da pomognemo vašem biznisu.'
                : 'Schedule a free consultation and see how we can help your business.'}
            </p>
            <Link
              to="/#kontakt"
              className="inline-flex items-center gap-2 bg-white text-violet-600 px-5 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-full font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 text-sm md:text-base"
            >
              {language === 'sr' ? 'Zakaži Konsultacije' : 'Schedule Consultation'}
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

