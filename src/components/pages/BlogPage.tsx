import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, Tag, Search } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { Navbar } from '../layout/Navbar';
import { Footer } from '../layout/Footer';
import { SEOHelmet } from '../seo/SEOHelmet';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
}

export function BlogPage() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const content = {
    sr: {
      hero: 'Blog & Saveti',
      subtitle: 'Najnovije vesti, saveti i trendovi u web dizajnu',
      search: 'Pretraži blog...',
      allCategories: 'Sve Kategorije',
      readMore: 'Pročitaj Više',
      categories: ['Web Dizajn', 'SEO', 'Marketing', 'Trendovi'],
      posts: [
        {
          id: '1',
          title: 'Kako Izabrati Pravu Agenciju za Web Sajt u 2025?',
          excerpt: 'Izrada web sajta je velika investicija. Evo 10 ključnih pitanja koja morate postaviti pre nego potpišete ugovor sa agencijom...',
          author: 'AiSajt Tim',
          date: '15. Jan 2025',
          readTime: '5 min',
          category: 'Web Dizajn',
          image: '/images/blog-1.jpg'
        },
        {
          id: '2',
          title: 'SEO u 2025: Šta Google Zapravo Želi da Vidi?',
          excerpt: 'Google algoritam se menja svake godine. Saznajte koje faktore Google sada najviše vrednuje i kako optimizovati vaš sajt...',
          author: 'AiSajt Tim',
          date: '10. Jan 2025',
          readTime: '8 min',
          category: 'SEO',
          image: '/images/blog-2.jpg'
        },
        {
          id: '3',
          title: 'Web Dizajn Trendovi 2025: Šta je IN, Šta je OUT',
          excerpt: 'Minimalizam je i dalje kralj, ali sa novim pristupom. Evo šta je popularno u web dizajnu ove godine...',
          author: 'AiSajt Tim',
          date: '5. Jan 2025',
          readTime: '6 min',
          category: 'Trendovi',
          image: '/images/blog-3.jpg'
        },
        {
          id: '4',
          title: 'Koliko Košta Web Sajt u Srbiji? [Kompletna Analiza]',
          excerpt: 'Detaljno raščlanjena cena web sajtova: Landing page, One-page, Multi-page, E-commerce. Šta je uključeno u svaki paket...',
          author: 'AiSajt Tim',
          date: '28. Dec 2024',
          readTime: '10 min',
          category: 'Web Dizajn',
          image: '/images/blog-4.jpg'
        },
        {
          id: '5',
          title: 'Google Ads vs Organic Traffic: Šta je Bolje?',
          excerpt: 'Plaćene reklame ili organičan saobraćaj? Analiza prednosti i mana oba pristupa, i kako ih kombinovati...',
          author: 'AiSajt Tim',
          date: '20. Dec 2024',
          readTime: '7 min',
          category: 'Marketing',
          image: '/images/blog-5.jpg'
        },
      ]
    },
    en: {
      hero: 'Blog & Tips',
      subtitle: 'Latest news, tips and trends in web design',
      search: 'Search blog...',
      allCategories: 'All Categories',
      readMore: 'Read More',
      categories: ['Web Design', 'SEO', 'Marketing', 'Trends'],
      posts: [
        {
          id: '1',
          title: 'How to Choose the Right Web Agency in 2025?',
          excerpt: 'Building a website is a big investment. Here are 10 key questions you must ask before signing a contract with an agency...',
          author: 'AiSajt Team',
          date: 'Jan 15, 2025',
          readTime: '5 min',
          category: 'Web Design',
          image: '/images/blog-1.jpg'
        },
        {
          id: '2',
          title: 'SEO in 2025: What Google Really Wants to See?',
          excerpt: 'Google algorithm changes every year. Learn which factors Google now values most and how to optimize your site...',
          author: 'AiSajt Team',
          date: 'Jan 10, 2025',
          readTime: '8 min',
          category: 'SEO',
          image: '/images/blog-2.jpg'
        },
        {
          id: '3',
          title: 'Web Design Trends 2025: What\'s IN, What\'s OUT',
          excerpt: 'Minimalism is still king, but with a new approach. Here\'s what\'s popular in web design this year...',
          author: 'AiSajt Team',
          date: 'Jan 5, 2025',
          readTime: '6 min',
          category: 'Trends',
          image: '/images/blog-3.jpg'
        },
        {
          id: '4',
          title: 'How Much Does a Website Cost in Serbia? [Complete Analysis]',
          excerpt: 'Detailed breakdown of website prices: Landing page, One-page, Multi-page, E-commerce. What\'s included in each package...',
          author: 'AiSajt Team',
          date: 'Dec 28, 2024',
          readTime: '10 min',
          category: 'Web Design',
          image: '/images/blog-4.jpg'
        },
        {
          id: '5',
          title: 'Google Ads vs Organic Traffic: Which is Better?',
          excerpt: 'Paid ads or organic traffic? Analysis of pros and cons of both approaches, and how to combine them...',
          author: 'AiSajt Team',
          date: 'Dec 20, 2024',
          readTime: '7 min',
          category: 'Marketing',
          image: '/images/blog-5.jpg'
        },
      ]
    }
  };

  const t = content[language];

  // Filter posts
  const filteredPosts = t.posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white">
      <SEOHelmet
        title={language === 'sr' ? 'Blog | Web Development Saveti i Vodiči | AISajt' : 'Blog | Web Development Tips & Guides | AISajt'}
        description={language === 'sr' ? 'Pročitajte naše članke o web development-u, SEO optimizaciji, dizajnu i digitalnom marketingu. Saveti i trikovi za uspešan online biznis.' : 'Read our articles about web development, SEO optimization, design and digital marketing. Tips and tricks for successful online business.'}
        keywords="blog, web development, seo saveti, dizajn saveti, ai sajt blog"
        canonicalUrl="https://aisajt.com/blog"
      />
      
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-violet-50/30 to-white" />
        
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-gradient-to-br from-violet-400 to-indigo-500 rounded-full opacity-10 blur-3xl animate-blob" />
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-gradient-to-br from-pink-400 to-violet-500 rounded-full opacity-10 blur-3xl animate-blob animation-delay-2000" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight animate-fade-in-up animation-delay-200">
              {t.hero}
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed animate-fade-in-up animation-delay-400">
              {t.subtitle}
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto animate-fade-in-up animation-delay-600">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={t.search}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-violet-500 focus:outline-none text-gray-900 placeholder-gray-400 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                selectedCategory === null
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t.allCategories}
            </button>
            {t.categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  selectedCategory === category
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            
            {filteredPosts.map((post, index) => (
              <article 
                key={post.id}
                className="group bg-white rounded-2xl border-2 border-gray-200 hover:border-violet-400 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-violet-500/20 hover:-translate-y-2 animate-fade-in-up cursor-pointer"
                style={{ animationDelay: `${0.1 * index}s` }}
                onClick={() => navigate(`/blog/${post.id}`)}
              >
                {/* Image */}
                <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  {/* Placeholder - replace with actual image */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Tag className="w-16 h-16 text-gray-400" />
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 text-gray-900 text-xs font-semibold rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Meta */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.readTime}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-violet-600 transition-colors">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Read More */}
                  <div className="flex items-center gap-2 text-violet-600 font-semibold group-hover:gap-3 transition-all">
                    <span>{t.readMore}</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </article>
            ))}

          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-20">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {language === 'sr' ? 'Nema rezultata. Pokušajte drugu pretragu.' : 'No results. Try another search.'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bg-gradient-to-r from-violet-50 via-indigo-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {language === 'sr' ? 'Pratite Najnovije Postove' : 'Follow Latest Posts'}
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              {language === 'sr' 
                ? 'Prijavite se na newsletter i dobijajte najnovije savete direktno u inbox.'
                : 'Subscribe to newsletter and get latest tips directly in your inbox.'
              }
            </p>
            <form className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="vas@email.com"
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:outline-none transition-colors"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:scale-105 transition-all flex items-center gap-2"
              >
                {language === 'sr' ? 'Prijavi Se' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

