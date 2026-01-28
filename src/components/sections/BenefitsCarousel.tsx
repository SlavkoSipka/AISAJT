import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Package, CreditCard, Truck, Shield, BarChart3, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Language } from '../../types/language';

interface BenefitsCarouselProps {
  language: Language;
}

export function BenefitsCarousel({ language }: BenefitsCarouselProps) {
  const benefitItems = [
    {
      icon: Package,
      iconColor: 'from-indigo-500 to-violet-600',
      title: language === 'sr' ? 'Upravljanje Proizvodima' : 'Product Management',
      description: language === 'sr'
        ? 'Jednostavno dodavanje, uređivanje i organizacija proizvoda. Varijante, zalihe, kategorije - sve na jednom mestu.'
        : 'Easy adding, editing and organizing products. Variants, inventory, categories - all in one place.',
      bgGradient: 'from-indigo-500/10 to-violet-500/10',
      glowGradient: 'from-indigo-400/20 to-violet-400/20'
    },
    {
      icon: CreditCard,
      iconColor: 'from-violet-500 to-pink-600',
      title: language === 'sr' ? 'Integracija Plaćanja' : 'Payment Integration',
      description: language === 'sr'
        ? 'Pouzdane metode plaćanja - kartice, pouzećem, bankovna transakcija. Sigurnost i jednostavnost za vaše kupce.'
        : 'Reliable payment methods - cards, cash on delivery, bank transfer. Security and simplicity for your customers.',
      bgGradient: 'from-violet-500/10 to-pink-500/10',
      glowGradient: 'from-violet-400/20 to-pink-400/20'
    },
    {
      icon: Truck,
      iconColor: 'from-pink-500 to-rose-600',
      title: language === 'sr' ? 'Sistem Dostave' : 'Delivery System',
      description: language === 'sr'
        ? 'Automatski obračun troškova dostave. Integracija sa kurirskim službama za praćenje pošiljki.'
        : 'Automatic shipping cost calculation. Integration with courier services for tracking.',
      bgGradient: 'from-pink-500/10 to-rose-500/10',
      glowGradient: 'from-pink-400/20 to-rose-400/20'
    },
    {
      icon: Shield,
      iconColor: 'from-indigo-500 to-violet-600',
      title: language === 'sr' ? 'Sigurnost' : 'Security',
      description: language === 'sr'
        ? 'SSL sertifikati, enkripcija podataka, zaštita od prevara. Vaši kupci mogu da kupuju bez brige.'
        : 'SSL certificates, data encryption, fraud protection. Your customers can shop worry-free.',
      bgGradient: 'from-indigo-500/10 to-violet-500/10',
      glowGradient: 'from-indigo-400/20 to-violet-400/20'
    },
    {
      icon: BarChart3,
      iconColor: 'from-violet-500 to-pink-600',
      title: language === 'sr' ? 'Analitika i Izveštaji' : 'Analytics and Reports',
      description: language === 'sr'
        ? 'Detaljni izveštaji o prodaji, najprodavanijim proizvodima, ponašanju kupaca. Donosite odluke na osnovu podataka.'
        : 'Detailed reports on sales, best-selling products, customer behavior. Make data-driven decisions.',
      bgGradient: 'from-violet-500/10 to-pink-500/10',
      glowGradient: 'from-violet-400/20 to-pink-400/20'
    },
    {
      icon: Target,
      iconColor: 'from-pink-500 to-rose-600',
      title: language === 'sr' ? 'Marketing Alati' : 'Marketing Tools',
      description: language === 'sr'
        ? 'Kuponi, popusti, newsletter, Facebook Pixel. Profesionalni web dizajn i marketing alati u jednom paketu.'
        : 'Coupons, discounts, newsletter, Facebook Pixel. Professional web design and marketing tools in one package.',
      bgGradient: 'from-pink-500/10 to-rose-500/10',
      glowGradient: 'from-pink-400/20 to-rose-400/20'
    }
  ];

  const extendedItems = [...benefitItems, ...benefitItems, ...benefitItems];
  const [currentIndex, setCurrentIndex] = useState(benefitItems.length);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [cardWidth, setCardWidth] = useState(380);
  const [cardGap, setCardGap] = useState(32);

  // Update card dimensions on window resize
  useEffect(() => {
    const updateDimensions = () => {
      if (window.innerWidth < 768) {
        setCardWidth(280);
        setCardGap(24);
      } else if (window.innerWidth < 1024) {
        setCardWidth(340);
        setCardGap(28);
      } else {
        setCardWidth(380);
        setCardGap(32);
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Auto-play
  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 4000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  // Handle index reset for infinite loop
  useEffect(() => {
    if (!isTransitioning) return;

    const timer = setTimeout(() => {
      if (currentIndex >= extendedItems.length - benefitItems.length) {
        setIsTransitioning(false);
        setCurrentIndex(benefitItems.length);
      } else if (currentIndex < benefitItems.length) {
        setIsTransitioning(false);
        setCurrentIndex(extendedItems.length - benefitItems.length - 1);
      } else {
        setIsTransitioning(false);
      }
    }, 700);

    return () => clearTimeout(timer);
  }, [currentIndex, isTransitioning]);

  const goToNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(prev => prev + 1);
  };

  const goToPrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(prev => prev - 1);
  };

  return (
    <section className="py-10 md:py-24 bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 -left-20 w-80 h-80 bg-gradient-to-br from-violet-400 to-indigo-500 rounded-full opacity-5 blur-3xl animate-blob"></div>
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-pink-400 to-violet-500 rounded-full opacity-5 blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4 px-4 leading-tight">
            {language === 'sr'
              ? 'Dodatne Prednosti Naših Web Shopova'
              : 'Additional Benefits of Our Web Shops'}
          </h2>
        </div>

        {/* Carousel - Desktop */}
        <div className="hidden md:block relative max-w-full mx-auto mb-12">
          {/* Cards Container */}
          <div className="overflow-hidden relative">
            <div
              className="flex items-center py-8"
              style={{
                transform: `translateX(calc(50% - ${currentIndex * cardWidth}px - ${currentIndex * cardGap}px - ${cardWidth / 2}px))`,
                transition: isTransitioning ? 'transform 0.7s ease-in-out' : 'none',
                gap: `${cardGap}px`
              }}
            >
              {extendedItems.map((item, index) => {
                const distance = Math.abs(currentIndex - index);
                // Fade effect using opacity only (no overlay rectangles)
                const opacity = distance === 0 ? 1 : distance === 1 ? 0.5 : 0.25;
                const scale = distance === 0 ? 1 : distance === 1 ? 0.93 : 0.85;

                const Icon = item.icon;

                return (
                  <div
                    key={index}
                    className="flex-shrink-0 transition-all duration-700"
                    style={{
                      width: `${cardWidth}px`,
                      opacity,
                      transform: `scale(${scale})`
                    }}
                  >
                    <div className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 min-h-[240px]">
                      <div className={`absolute inset-0 bg-gradient-to-br ${item.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                      <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${item.glowGradient} rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`}></div>

                      <div className="relative p-4 sm:p-6 z-10">
                        <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${item.iconColor} rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                          <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                          {item.title}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Arrows - Below Carousel */}
          <div className="flex items-center justify-center gap-6 mt-8">
            <button
              onClick={goToPrevious}
              disabled={isTransitioning}
              className="group flex items-center justify-center w-14 h-14 bg-white hover:bg-violet-50 border-2 border-violet-200 hover:border-violet-400 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous benefit"
            >
              <ChevronLeft className="w-6 h-6 text-violet-600 group-hover:scale-110 transition-transform" />
            </button>

            <button
              onClick={goToNext}
              disabled={isTransitioning}
              className="group flex items-center justify-center w-14 h-14 bg-white hover:bg-violet-50 border-2 border-violet-200 hover:border-violet-400 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next benefit"
            >
              <ChevronRight className="w-6 h-6 text-violet-600 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>

        {/* Horizontal Scroll - Mobile */}
        <div 
          className="md:hidden overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide" 
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <style dangerouslySetInnerHTML={{__html: `
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}} />
          <div className="flex gap-4" style={{minWidth: 'min-content'}}>
            {benefitItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="flex-shrink-0 w-[280px]"
                >
                  <div className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 min-h-[240px]">
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                    <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${item.glowGradient} rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`}></div>

                    <div className="relative p-4 sm:p-6 z-10">
                      <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${item.iconColor} rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                        {item.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

