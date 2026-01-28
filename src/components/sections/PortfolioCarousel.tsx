import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PortfolioCard } from '../cards/PortfolioCard';
import { Language } from '../../types/language';

interface PortfolioCarouselProps {
  language: Language;
}

interface PortfolioItem {
  title: string;
  description: string;
  image: string;
  tags: string[];
  link: string;
}

export function PortfolioCarousel({ language }: PortfolioCarouselProps) {
  const portfolioItems: PortfolioItem[] = [
    {
      title: "Kralj Residence",
      description: language === 'sr' ? "Moderan web sajt za apartmane i hotele" : "Modern website for apartments and hotels",
      image: "https://res.cloudinary.com/dij7ynio3/image/upload/w_600,f_webp,q_auto:good/v1739663014/kralj12_um1xrk",
      tags: language === 'sr' ? ["Web Sajt", "Responzivan"] : ["Website", "Responsive"],
      link: "https://kraljresidence.rs"
    },
    {
      title: "BN Autofolije",
      description: language === 'sr' ? "Profesionalni web sajt za auto folije i detailing" : "Professional website for car wraps and detailing",
      image: "https://res.cloudinary.com/dij7ynio3/image/upload/w_600,f_webp,q_auto:good/v1740502433/pozadina-min_gfbxfp",
      tags: language === 'sr' ? ["Web Sajt", "Auto Detailing", "SEO"] : ["Website", "Auto Detailing", "SEO"],
      link: "https://bnautofolije.com/"
    },
    {
      title: "Prestige Gradnja",
      description: language === 'sr' ? "Moderan web sajt za nekretnine i apartmane" : "Modern website for real estate and apartments",
      image: "https://aislike.rs/aisajt/prestige-min.png",
      tags: language === 'sr' ? ["Web Sajt"] : ["Website"],
      link: "https://prestigegradnja.rs"
    },
    {
      title: "Custom RC Parts",
      description: language === 'sr' ? "Ecommerce web sajt" : "Ecommerce website",
      image: "https://aislike.rs/aisajt/rc-min.png",
      tags: ["E-commerce", language === 'sr' ? "Web Shop" : "Online Store"],
      link: "https://customrc.parts"
    },
    {
      title: "White Club",
      description: language === 'sr' ? "Online rezervacije" : "Online reservations",
      image: "https://aislike.rs/aisajt/white-min.png",
      tags: language === 'sr' ? ["Web Sajt", "Rezervacije"] : ["Website", "Reservations"],
      link: "https://whiteclub.rs"
    },
    {
      title: "Pokloni Portret",
      description: language === 'sr' ? "Personalizovani portreti kao poklon" : "Personalized portraits as gifts",
      image: "https://aislike.rs/aisajt/pokloniportret-min.png",
      tags: language === 'sr' ? ["Web Sajt", "Umetnost"] : ["Website", "Art"],
      link: "https://pokloniportret.rs"
    },
    {
      title: "IN-STAN",
      description: language === 'sr' ? "Stolarija i nameštaj po meri" : "Custom carpentry and furniture",
      image: "https://aislike.rs/aisajt/instan-min.png",
      tags: language === 'sr' ? ["Web Sajt", "Stolarija"] : ["Website", "Carpentry"],
      link: "https://in-stan.rs"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(portfolioItems.length);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [cardWidth, setCardWidth] = useState(420);
  const [cardGap, setCardGap] = useState(48);

  // Update card dimensions on window resize
  useEffect(() => {
    const updateDimensions = () => {
      if (window.innerWidth < 768) {
        setCardWidth(300);
        setCardGap(24);
      } else if (window.innerWidth < 1024) {
        setCardWidth(360);
        setCardGap(32);
      } else {
        setCardWidth(420);
        setCardGap(48);
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Klonirane kartice za beskonačan efekat - 3 puna kruga
  const extendedItems = [
    ...portfolioItems,
    ...portfolioItems,
    ...portfolioItems
  ];

  // Auto-play: automatski ide na sledeći projekat svakih 5 sekundi
  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const goToNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const goToPrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  };

  // Reset index kada dođe do kraja kruga (beskonačan loop bez praznog prostora)
  useEffect(() => {
    if (!isTransitioning) return;

    const timeout = setTimeout(() => {
      const totalItems = portfolioItems.length;
      
      // Ako je otišao u prvi krug (ispod srednjeg), teleportuj u treći krug
      if (currentIndex < totalItems) {
        setCurrentIndex(currentIndex + totalItems);
      } 
      // Ako je otišao u treći krug (iznad srednjeg), teleportuj u prvi krug
      else if (currentIndex >= totalItems * 2) {
        setCurrentIndex(currentIndex - totalItems);
      }
      
      setIsTransitioning(false);
    }, 700);

    return () => clearTimeout(timeout);
  }, [currentIndex, isTransitioning, portfolioItems.length]);

  return (
    <section id="portfolio" className="py-16 md:py-24 relative overflow-visible bg-gradient-to-b from-violet-50/50 via-indigo-50/30 to-pink-50/25">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-violet-50/15 to-indigo-50/20"></div>
      
      {/* Animated Background Circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-32 w-96 h-96 bg-gradient-to-br from-violet-400 to-violet-600 rounded-full opacity-10 animate-blob"></div>
        <div className="absolute -bottom-20 right-1/4 w-80 h-80 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 -right-20 w-72 h-72 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <div className="container mx-auto px-4 relative z-10 mb-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            {language === 'sr' ? (
              <>
                Izuzetni Sajtovi
                <br />
                za Izuzetne Brendove
              </>
            ) : (
              <>
                Exceptional Results
                <br />
                for Exceptional Brands
              </>
            )}
          </h2>
          
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            {language === 'sr' 
              ? 'Svaki projekat je priča o uspehu. Od ideje do realizacije, stvaramo digitalna iskustva koja inspirišu i pretvaraju posetiоce u klijente.'
              : 'Every project is a success story. From concept to completion, we create digital experiences that inspire and convert visitors into customers.'
            }
          </p>
        </div>
      </div>

      {/* Carousel Container - full width */}
      <div className="relative z-10 w-full">
        {/* Cards Container */}
        <div className="relative overflow-x-hidden pb-4">
          <div 
            className="flex items-center"
            style={{ 
              gap: `${cardGap}px`,
              transform: `translateX(calc(50% - ${currentIndex * (cardWidth + cardGap)}px - ${cardWidth / 2}px))`,
              transition: isTransitioning ? 'transform 700ms cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
            }}
          >
            {extendedItems.map((item, index) => {
              const distance = Math.abs(index - currentIndex);
              const isCenter = index === currentIndex;
              
              // Kalkulacija opacity bazirana na udaljenosti
              let opacity = 1;
              if (distance === 1) opacity = 0.6;
              else if (distance === 2) opacity = 0.3;
              else if (distance >= 3) opacity = 0.1;
              
              return (
                <div 
                  key={`${item.title}-${index}`}
                  className="flex-shrink-0"
                  style={{ 
                    width: `${cardWidth}px`
                  }}
                >
                  <div 
                    className="transition-all duration-500"
                    style={{
                      opacity: opacity,
                      transform: isCenter ? 'scale(1)' : `scale(${0.9 - distance * 0.05})`,
                      filter: isCenter ? 'blur(0px)' : `blur(${distance * 2}px)`,
                      pointerEvents: isCenter ? 'auto' : 'none'
                    }}
                  >
                    <PortfolioCard
                      title={item.title}
                      description={item.description}
                      image={item.image}
                      tags={item.tags}
                      link={item.link}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation Arrows - ispod kartice */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={goToPrevious}
            className="w-12 h-12 md:w-14 md:h-14 bg-white hover:bg-violet-500 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 border-2 border-gray-200 hover:border-violet-500 group"
            aria-label="Previous project"
          >
            <ChevronLeft className="w-6 h-6 md:w-7 md:h-7 text-gray-900 group-hover:text-white transition-colors" />
          </button>
          
          <button
            onClick={goToNext}
            className="w-12 h-12 md:w-14 md:h-14 bg-white hover:bg-violet-500 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 border-2 border-gray-200 hover:border-violet-500 group"
            aria-label="Next project"
          >
            <ChevronRight className="w-6 h-6 md:w-7 md:h-7 text-gray-900 group-hover:text-white transition-colors" />
          </button>
        </div>
      </div>
    </section>
  );
}
