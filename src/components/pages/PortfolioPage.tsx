import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowUpRight, Filter } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { Navbar } from '../layout/Navbar';
import { Footer } from '../layout/Footer';
import { portfolioProjects, PortfolioProject } from '../../data/portfolioProjects';

type FilterCategory = 'all' | 'web-sajt' | 'e-commerce' | 'seo';

export function PortfolioPage() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Staggered card reveal animation
  useEffect(() => {
    setVisibleCards(new Set());
    const filteredItems = getFilteredProjects();
    filteredItems.forEach((_, index) => {
      const timer = setTimeout(() => {
        setVisibleCards((prev) => new Set(prev).add(index));
      }, 100 + index * 120);
      return () => clearTimeout(timer);
    });
  }, [activeFilter]);

  const getFilteredProjects = (): PortfolioProject[] => {
    if (activeFilter === 'all') return portfolioProjects;
    return portfolioProjects.filter((p) => p.category === activeFilter);
  };

  const filteredProjects = getFilteredProjects();

  const filters: { key: FilterCategory; label: { sr: string; en: string } }[] = [
    { key: 'all', label: { sr: 'Svi Projekti', en: 'All Projects' } },
    { key: 'web-sajt', label: { sr: 'Web Sajtovi', en: 'Websites' } },
    { key: 'e-commerce', label: { sr: 'E-commerce', en: 'E-commerce' } },
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />

      <main id="main-content">
        {/* Hero Section */}
        <section className="pt-32 md:pt-40 pb-16 md:pb-24 relative overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-white via-violet-50/30 to-white"></div>

          {/* Animated Background Circles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 -left-20 w-80 h-80 bg-gradient-to-br from-violet-400 to-indigo-500 rounded-full opacity-10 blur-3xl animate-blob"></div>
            <div className="absolute bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-pink-400 to-violet-500 rounded-full opacity-10 blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-indigo-300 to-pink-300 rounded-full opacity-8 blur-3xl animate-blob animation-delay-4000"></div>
          </div>

          {/* Giant Background Letter */}
          <div className="hidden sm:block absolute top-1/2 left-0 md:left-10 -translate-y-1/2 z-[2] pointer-events-none overflow-hidden">
            <div className="text-[180px] sm:text-[280px] md:text-[350px] lg:text-[420px] xl:text-[500px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-br from-violet-600 via-indigo-500 to-pink-500 select-none opacity-20 sm:opacity-30 md:opacity-25" aria-hidden="true">
              P
            </div>
          </div>

          <div className="container mx-auto px-4 relative z-10 desktop-vertical-nav-offset">
            <div className="max-w-5xl mx-auto text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4 md:mb-6 px-2 animate-fade-in-up animation-delay-200">
                {language === 'sr' ? 'Naši Projekti' : 'Our Projects'}
              </h1>

              <p className="text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto mb-8 md:mb-10 px-4 animate-fade-in-up animation-delay-400">
                {language === 'sr'
                  ? 'Svaki projekat je jedinstvena priča o uspehu. Od ideje do realizacije, kreiramo digitalna iskustva koja inspirišu i pretvaraju posetioce u klijente.'
                  : 'Every project is a unique success story. From concept to completion, we create digital experiences that inspire and convert visitors into customers.'}
              </p>

              {/* Filter Buttons */}
              <div className="flex flex-wrap justify-center gap-3 animate-fade-in-up animation-delay-600">
                {filters.map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setActiveFilter(filter.key)}
                    className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border-2 ${
                      activeFilter === filter.key
                        ? 'bg-gray-900 text-white border-gray-900 shadow-lg'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-violet-400 hover:text-violet-600'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {filter.key === 'all' && <Filter className="w-4 h-4" />}
                      {filter.label[language]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Portfolio Grid */}
        <section className="pb-20 md:pb-28 relative">
          <div className="container mx-auto px-4 desktop-vertical-nav-offset">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {filteredProjects.map((project, index) => (
                <div
                  key={project.id}
                  className={`transform transition-all duration-700 ease-out ${
                    visibleCards.has(index)
                      ? 'opacity-100 translate-y-0 scale-100'
                      : 'opacity-0 translate-y-12 scale-95'
                  }`}
                >
                  <Link
                    to={`/portfolio/${project.slug}`}
                    className="group relative block bg-white rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-violet-400 transition-all duration-500 hover:shadow-2xl hover:shadow-violet-500/30 hover:-translate-y-2 cursor-pointer"
                  >
                    {/* Image Container */}
                    <div className="relative h-64 sm:h-72 overflow-hidden bg-gray-50">
                      <img
                        src={project.image}
                        alt={project.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-all duration-700 ease-out"
                      />

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                          <div className="flex items-center gap-2 text-white font-semibold text-lg mb-2">
                            <span>{language === 'sr' ? 'Pogledaj Detalje' : 'View Details'}</span>
                            <ArrowUpRight className="w-5 h-5 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                          </div>
                          <p className="text-white/90 text-sm">{project.description[language]}</p>
                        </div>
                      </div>

                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-violet-700 shadow-sm">
                          {project.clientIndustry[language]}
                        </span>
                      </div>

                      {/* Corner Arrow */}
                      <div className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-45 transition-all duration-500">
                        <ArrowUpRight className="w-5 h-5 text-violet-600" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 bg-gradient-to-b from-white to-gray-50/50">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-violet-600 transition-colors duration-300">
                        {project.title}
                      </h3>

                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {project.description[language]}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {project.tags[language].map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-gradient-to-r from-violet-50 to-indigo-50 text-violet-700 border border-violet-200 group-hover:from-violet-100 group-hover:to-indigo-100 group-hover:border-violet-300 group-hover:scale-105 transition-all duration-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Animated Border Glow */}
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-500 via-indigo-500 to-pink-500 blur-xl opacity-20"></div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {/* No results */}
            {filteredProjects.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">
                  {language === 'sr' ? 'Nema projekata u ovoj kategoriji.' : 'No projects in this category.'}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-violet-50/50 via-indigo-50/30 to-pink-50/25 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 -right-20 w-72 h-72 bg-gradient-to-br from-violet-400 to-indigo-500 rounded-full opacity-10 blur-3xl animate-blob"></div>
            <div className="absolute bottom-10 -left-20 w-80 h-80 bg-gradient-to-br from-pink-400 to-violet-500 rounded-full opacity-10 blur-3xl animate-blob animation-delay-2000"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10 desktop-vertical-nav-offset">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                {language === 'sr'
                  ? 'Vaš Projekat Može Biti Sledeći'
                  : 'Your Project Could Be Next'}
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                {language === 'sr'
                  ? 'Spremni ste da napravite web sajt koji ostavlja utisak? Javite nam se za besplatnu konsultaciju i saznajte kako možemo pomoći vašem biznisu.'
                  : "Ready to create a website that leaves an impression? Contact us for a free consultation and discover how we can help your business."}
              </p>
              <button
                onClick={() => navigate('/contact')}
                className="group px-8 py-4 bg-gray-900 text-white text-lg font-semibold rounded-full hover:bg-white hover:text-gray-900 border-2 border-gray-900 transition-all duration-300 flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl"
              >
                {language === 'sr' ? 'Besplatna Konsultacija' : 'Free Consultation'}
                <ArrowUpRight className="w-5 h-5 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
