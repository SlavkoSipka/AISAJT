import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Target, Shield, TrendingUp } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { Navbar } from '../layout/Navbar';
import { Footer } from '../layout/Footer';
import { SEOHelmet } from '../seo/SEOHelmet';

interface TeamMember {
  name: string;
  role: { sr: string; en: string };
  image: string;
  bio: { sr: string; en: string };
}

const teamMembers: TeamMember[] = [
  {
    name: 'Strahinja',
    role: { sr: 'Osnivač', en: 'Founder' },
    image: '/images/team/strahinja.png',
    bio: {
      sr: 'Strahinja je vizionar iza AiSajt-a — čovek koji je spojio strast prema tehnologiji sa preduzetniškim duhom. Sa dubokim razumevanjem web razvoja i digitalnih trendova, on vodi svaki projekat od ideje do realizacije. Njegova filozofija je jednostavna: svaki sajt mora da radi za vas, ne samo da izgleda lepo. Strahinja je taj koji osigurava da svaki piksel ima svrhu i da svaki red koda donosi rezultat. Kada ne kodira, analizira tržište i traži načine da klijentima donese još veću vrednost.',
      en: 'Strahinja is the visionary behind AiSajt — the person who merged a passion for technology with an entrepreneurial spirit. With a deep understanding of web development and digital trends, he leads every project from concept to completion. His philosophy is simple: every website must work for you, not just look good. Strahinja ensures that every pixel has a purpose and every line of code delivers results. When he\'s not coding, he\'s analyzing the market and finding ways to bring even more value to clients.'
    }
  },
  {
    name: 'Bogdan',
    role: { sr: 'Osnivač & Web Developer', en: 'Founder & Web Developer' },
    image: '/images/team/bogdan.png',
    bio: {
      sr: 'Bogdan je kreativna sila AiSajt tima. Kao suosnivač, on donosi jedinstvenu kombinaciju dizajnerskog oka i strateškog razmišljanja. Svaki projekat koji prođe kroz njegove ruke dobija onaj "wow" faktor koji konkurencija ne može lako da kopira. Bogdan veruje da dobar dizajn nije samo estetika — to je komunikacija. On razume kako boje, tipografija i raspored elemenata utiču na ponašanje korisnika i koristi to znanje da kreira sajtove koji ne samo da privlače pažnju, već i pretvaraju posetioce u klijente.',
      en: 'Bogdan is the creative force of the AiSajt team. As co-founder, he brings a unique combination of a designer\'s eye and strategic thinking. Every project that passes through his hands gets that "wow" factor that competitors can\'t easily replicate. Bogdan believes that good design isn\'t just aesthetics — it\'s communication. He understands how colors, typography, and layout influence user behavior and uses that knowledge to create websites that not only attract attention but also convert visitors into clients.'
    }
  },
  {
    name: 'Marko',
    role: { sr: 'SEO Specijalista', en: 'SEO Specialist' },
    image: '/images/team/marko.png',
    bio: {
      sr: 'Marko je naš SEO mag — čovek koji zna kako da vaš sajt dovede na prvu stranu Google-a. Sa godinama iskustva u optimizaciji za pretraživače, on razume algoritme, ključne reči i sve što je potrebno da vaš biznis bude vidljiv online. Marko ne veruje u prečice — njegov pristup je zasnovan na podacima, analizi i dokazanim strategijama koje donose dugoročne rezultate. Od tehničkog SEO-a do strategije sadržaja, on pokriva sve aspekte koji su potrebni da vaš sajt ne samo postoji, već i dominira u pretragama.',
      en: 'Marko is our SEO wizard — the person who knows how to get your website to the first page of Google. With years of experience in search engine optimization, he understands algorithms, keywords, and everything needed to make your business visible online. Marko doesn\'t believe in shortcuts — his approach is based on data, analysis, and proven strategies that deliver long-term results. From technical SEO to content strategy, he covers every aspect needed for your website to not just exist, but dominate in search results.'
    }
  }
];

const stats = [
  { value: '50+', label: { sr: 'Završenih Projekata', en: 'Completed Projects' } },
  { value: '3+', label: { sr: 'Godine Iskustva', en: 'Years of Experience' } },
  { value: '98%', label: { sr: 'Zadovoljnih Klijenata', en: 'Satisfied Clients' } },
  { value: '24/7', label: { sr: 'Podrška', en: 'Support' } },
];

export function ONamaPage() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-visible');
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const content = {
    sr: {
      heroTitle: 'Upoznajte Tim Iza',
      heroHighlight: 'Vašeg Uspeha',
      heroSubtitle: 'Tri stručnjaka. Jedna vizija. Beskompromisan kvalitet. Mi smo AiSajt — tim koji pretvara digitalne ideje u stvarnost.',
      teamSectionTitle: 'Naš Tim',
      teamSectionSubtitle: 'Svaki član donosi jedinstvenu ekspertizu koja zajedno čini nepobedivu kombinaciju',
      togetherTitle: 'Zajedno Smo',
      togetherHighlight: 'Nepobedivi',
      togetherText: 'Kada spojite Strahinjinu tehničku preciznost, Bogdanovo kreativno oko i Markovu SEO ekspertizu, dobijate tim koji pokriva svaki aspekt digitalnog uspeha. Mi ne pravimo samo sajtove — mi gradimo digitalne mašine za rast vašeg biznisa. Od prvog piksela do prve pozicije na Google-u, svaki korak je promišljen, svaki detalj ima svrhu. To je razlog zašto naši klijenti ne dolaze samo jednom — oni ostaju, rastu i preporučuju nas dalje.',
      teamPhotoCaption: 'AiSajt Tim — Strahinja, Bogdan & Marko',
      ctaTitle: 'Spremni da Upoznate Svoj Novi Tim?',
      ctaText: 'Zakažite besplatnu konsultaciju i otkrijte kako možemo da transformišemo vaše online prisustvo.',
      ctaButton: 'Kontaktirajte Nas',
      ctaSecondary: 'Pogledajte Portfolio',
    },
    en: {
      heroTitle: 'Meet the Team Behind',
      heroHighlight: 'Your Success',
      heroSubtitle: 'Three experts. One vision. Uncompromising quality. We are AiSajt — a team that turns digital ideas into reality.',
      teamSectionTitle: 'Our Team',
      teamSectionSubtitle: 'Each member brings unique expertise that together creates an unbeatable combination',
      togetherTitle: 'Together We Are',
      togetherHighlight: 'Unstoppable',
      togetherText: 'When you combine Strahinja\'s technical precision, Bogdan\'s creative eye, and Marko\'s SEO expertise, you get a team that covers every aspect of digital success. We don\'t just build websites — we build digital growth machines for your business. From the first pixel to the first position on Google, every step is deliberate, every detail has purpose. That\'s why our clients don\'t come just once — they stay, grow, and recommend us to others.',
      teamPhotoCaption: 'AiSajt Team — Strahinja, Bogdan & Marko',
      ctaTitle: 'Ready to Meet Your New Team?',
      ctaText: 'Schedule a free consultation and discover how we can transform your online presence.',
      ctaButton: 'Contact Us',
      ctaSecondary: 'View Portfolio',
    }
  };

  const t = content[language];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <SEOHelmet
        title={language === 'sr'
          ? 'O Nama | Upoznajte AiSajt Tim | Strahinja, Bogdan & Marko'
          : 'About Us | Meet the AiSajt Team | Strahinja, Bogdan & Marko'
        }
        description={language === 'sr'
          ? 'Upoznajte tim iza AiSajt-a — Strahinja i Bogdan (osnivači) i Marko (SEO specijalista). Tri stručnjaka koji zajedno prave nepobediv tim u svetu digitalnog marketinga.'
          : 'Meet the team behind AiSajt — Strahinja and Bogdan (founders) and Marko (SEO specialist). Three experts who together create an unbeatable team in digital marketing.'
        }
        keywords={language === 'sr'
          ? 'o nama, AiSajt tim, web agencija srbija, digitalni marketing tim, izrada sajtova tim, Beograd web agencija'
          : 'about us, AiSajt team, web agency Serbia, digital marketing team, website development team, Belgrade web agency'
        }
        canonicalUrl="https://aisajt.com/o-nama"
      />

      <Navbar />

      <main id="main-content">
        {/* ============ HERO SECTION ============ */}
        <section className="pt-32 md:pt-40 pb-16 md:pb-24 relative overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-white via-violet-50/30 to-white"></div>

          {/* Animated Background Blobs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 -left-20 w-80 h-80 bg-gradient-to-br from-violet-400 to-indigo-500 rounded-full opacity-10 blur-3xl animate-blob"></div>
            <div className="absolute bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-pink-400 to-violet-500 rounded-full opacity-10 blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-indigo-300 to-pink-300 rounded-full opacity-8 blur-3xl animate-blob animation-delay-4000"></div>
          </div>

          {/* Giant Background Letter */}
          <div className="hidden sm:block absolute top-1/2 left-0 md:left-10 -translate-y-1/2 z-[2] pointer-events-none overflow-hidden">
            <div className="text-[180px] sm:text-[280px] md:text-[350px] lg:text-[420px] xl:text-[500px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-br from-violet-600 via-indigo-500 to-pink-500 select-none opacity-20 sm:opacity-30 md:opacity-25" aria-hidden="true">
              O
            </div>
          </div>

          <div className="container mx-auto px-4 relative z-10 desktop-vertical-nav-offset">
            <div className="max-w-5xl mx-auto text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4 md:mb-6 px-2 animate-fade-in-up animation-delay-200">
                {t.heroTitle}{' '}
                <span className="gradient-text">{t.heroHighlight}</span>
              </h1>

              <p className="text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto mb-8 md:mb-10 px-4 animate-fade-in-up animation-delay-400">
                {t.heroSubtitle}
              </p>

              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-4xl mx-auto animate-fade-in-up animation-delay-600">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center p-4 md:p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200 hover:border-violet-300 transition-all duration-300 hover:shadow-lg">
                    <div className="text-2xl md:text-3xl lg:text-4xl font-black gradient-text mb-1">{stat.value}</div>
                    <div className="text-xs md:text-sm text-gray-600 font-medium">{stat.label[language]}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============ TEAM ZIGZAG SECTION ============ */}
        <section className="py-16 md:py-24 relative">
          <div className="container mx-auto px-4 desktop-vertical-nav-offset">
            {/* Section Header */}
            <div className="text-center mb-16 md:mb-20 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                {t.teamSectionTitle}
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                {t.teamSectionSubtitle}
              </p>
              <div className="w-20 h-1 bg-gradient-to-r from-violet-600 via-indigo-500 to-pink-500 mx-auto mt-6 rounded-full"></div>
            </div>

            {/* Team Members - Zigzag Layout */}
            <div className="max-w-6xl mx-auto space-y-20 md:space-y-32">
              {teamMembers.map((member, index) => {
                const isLeft = index % 2 === 0; // 0, 2 = left, 1 = right

                return (
                  <div
                    key={member.name}
                    ref={(el) => { sectionRefs.current[index] = el; }}
                    className={`animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 flex flex-col ${
                      isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                    } items-center gap-8 md:gap-12 lg:gap-16`}
                    style={{ transitionDelay: `${index * 150}ms` }}
                  >
                    {/* Image Side */}
                    <div className="w-full md:w-5/12 flex justify-center">
                      <div className="relative group">
                        {/* Decorative background shape */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${
                          index === 0 ? 'from-violet-500 to-indigo-600' :
                          index === 1 ? 'from-indigo-500 to-pink-500' :
                          'from-pink-500 to-violet-600'
                        } rounded-3xl transform ${isLeft ? 'rotate-3' : '-rotate-3'} scale-95 opacity-20 group-hover:opacity-30 transition-opacity duration-500`}></div>
                        
                        {/* Image Container */}
                        <div className="relative bg-gradient-to-b from-gray-100 to-gray-200 rounded-3xl overflow-hidden w-64 h-80 sm:w-72 sm:h-96 md:w-80 md:h-[420px] flex items-end justify-center shadow-xl group-hover:shadow-2xl transition-shadow duration-500">
                          {/* Gradient overlay at bottom for smooth blend */}
                          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-200 to-transparent z-10"></div>
                          
                          {/* Team member cutout image */}
                          <img
                            src={member.image}
                            alt={`${member.name} - ${member.role[language]}`}
                            className="w-full h-full object-cover object-top"
                            loading="lazy"
                            onError={(e) => {
                              // Fallback: show placeholder with initials if image not found
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                const placeholder = document.createElement('div');
                                placeholder.className = 'flex items-center justify-center w-full h-full';
                                placeholder.innerHTML = `
                                  <div class="text-center">
                                    <div class="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br ${
                                      index === 0 ? 'from-violet-500 to-indigo-600' :
                                      index === 1 ? 'from-indigo-500 to-pink-500' :
                                      'from-pink-500 to-violet-600'
                                    } flex items-center justify-center mx-auto mb-4 shadow-lg">
                                      <span class="text-4xl md:text-5xl font-black text-white">${member.name.charAt(0)}</span>
                                    </div>
                                    <p class="text-gray-500 text-sm font-medium">${language === 'sr' ? 'Slika uskoro' : 'Photo coming soon'}</p>
                                  </div>
                                `;
                                parent.appendChild(placeholder);
                              }
                            }}
                          />
                        </div>

                        {/* Name badge floating over image */}
                        <div className={`absolute -bottom-4 ${isLeft ? '-right-4 md:-right-6' : '-left-4 md:-left-6'} bg-white rounded-2xl shadow-xl px-5 py-3 border border-gray-100 z-20`}>
                          <p className="font-black text-gray-900 text-lg">{member.name}</p>
                          <p className={`text-sm font-semibold ${
                            index === 0 ? 'text-violet-600' :
                            index === 1 ? 'text-indigo-600' :
                            'text-pink-600'
                          }`}>{member.role[language]}</p>
                        </div>
                      </div>
                    </div>

                    {/* Text Side */}
                    <div className="w-full md:w-7/12 mt-8 md:mt-0">
                      <div className={`${isLeft ? 'md:text-left' : 'md:text-right'} text-center`}>
                        {/* Decorative accent */}
                        <div className={`flex ${isLeft ? 'md:justify-start' : 'md:justify-end'} justify-center mb-4`}>
                          <div className={`w-12 h-1 rounded-full bg-gradient-to-r ${
                            index === 0 ? 'from-violet-500 to-indigo-500' :
                            index === 1 ? 'from-indigo-500 to-pink-500' :
                            'from-pink-500 to-violet-500'
                          }`}></div>
                        </div>

                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                          {member.name}
                        </h3>
                        <p className={`text-lg font-semibold mb-6 ${
                          index === 0 ? 'text-violet-600' :
                          index === 1 ? 'text-indigo-600' :
                          'text-pink-600'
                        }`}>
                          {member.role[language]}
                        </p>
                        <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                          {member.bio[language]}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ============ TOGETHER / TEAM PHOTO SECTION ============ */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-white via-violet-50/20 to-white"></div>

          <div className="container mx-auto px-4 relative z-10 desktop-vertical-nav-offset">
            <div className="max-w-5xl mx-auto">
              {/* Section Title */}
              <div className="text-center mb-12 md:mb-16 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                  {t.togetherTitle}{' '}
                  <span className="gradient-text">{t.togetherHighlight}</span>
                </h2>
              </div>

              {/* Team Photo Placeholder */}
              <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 mb-12 md:mb-16">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-200 group">
                  <div className="aspect-[16/9] md:aspect-[21/9] bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 flex items-center justify-center">
                    <img
                      src="/images/team/team-photo.jpg"
                      alt={t.teamPhotoCaption}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          const placeholder = document.createElement('div');
                          placeholder.className = 'flex flex-col items-center justify-center w-full h-full p-8';
                          placeholder.innerHTML = `
                            <div class="flex gap-6 md:gap-10 mb-6">
                              <div class="w-20 h-20 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg">
                                <span class="text-2xl md:text-4xl font-black text-white">S</span>
                              </div>
                              <div class="w-20 h-20 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center shadow-lg">
                                <span class="text-2xl md:text-4xl font-black text-white">B</span>
                              </div>
                              <div class="w-20 h-20 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-pink-500 to-violet-600 flex items-center justify-center shadow-lg">
                                <span class="text-2xl md:text-4xl font-black text-white">M</span>
                              </div>
                            </div>
                            <p class="text-gray-400 text-sm md:text-base font-medium">${language === 'sr' ? 'Timska fotografija uskoro' : 'Team photo coming soon'}</p>
                          `;
                          parent.appendChild(placeholder);
                        }
                      }}
                    />
                  </div>
                  {/* Caption */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                    <p className="text-white font-semibold text-center text-sm md:text-base">{t.teamPhotoCaption}</p>
                  </div>
                </div>
              </div>

              {/* Together Text */}
              <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
                <p className="text-gray-700 text-base md:text-lg lg:text-xl leading-relaxed text-center max-w-4xl mx-auto">
                  {t.togetherText}
                </p>
              </div>

              {/* Values / Strengths */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-12 md:mt-16">
                {[
                  {
                    icon: <Target className="w-8 h-8" />,
                    title: { sr: 'Fokus na Rezultate', en: 'Results Focused' },
                    desc: { sr: 'Svaki projekat merimo stvarnim rezultatima — više posetilaca, više konverzija, veći rast.', en: 'We measure every project by real results — more visitors, more conversions, greater growth.' },
                    color: 'from-violet-500 to-indigo-600'
                  },
                  {
                    icon: <Shield className="w-8 h-8" />,
                    title: { sr: 'Poverenje & Transparentnost', en: 'Trust & Transparency' },
                    desc: { sr: 'Bez skrivenih troškova, bez iznenađenja. Komunikacija je ključ svakog uspešnog projekta.', en: 'No hidden costs, no surprises. Communication is the key to every successful project.' },
                    color: 'from-indigo-500 to-pink-500'
                  },
                  {
                    icon: <TrendingUp className="w-8 h-8" />,
                    title: { sr: 'Dugoročno Partnerstvo', en: 'Long-term Partnership' },
                    desc: { sr: 'Ne pravimo sajt i nestanemo — gradimo odnos koji raste zajedno sa vašim biznisom.', en: 'We don\'t build a website and disappear — we build a relationship that grows with your business.' },
                    color: 'from-pink-500 to-violet-600'
                  }
                ].map((value, index) => (
                  <div
                    key={index}
                    className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 bg-white rounded-2xl p-6 md:p-8 border-2 border-gray-200 hover:border-violet-300 hover:shadow-xl transition-all group text-center"
                    style={{ transitionDelay: `${index * 150}ms` }}
                  >
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${value.color} flex items-center justify-center text-white mb-5 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                      {value.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title[language]}</h3>
                    <p className="text-gray-600 leading-relaxed">{value.desc[language]}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============ CTA SECTION ============ */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
          
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-10 w-64 h-64 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full opacity-10 blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-br from-pink-500 to-violet-600 rounded-full opacity-10 blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10 desktop-vertical-nav-offset">
            <div className="max-w-3xl mx-auto text-center animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                {t.ctaTitle}
              </h2>
              <p className="text-gray-300 text-lg md:text-xl mb-10 leading-relaxed">
                {t.ctaText}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/contact');
                  }}
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 via-indigo-600 to-pink-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl hover:shadow-violet-500/25 transition-all duration-300 hover:scale-105"
                >
                  {t.ctaButton}
                  <ArrowRight className="w-5 h-5" />
                </a>
                <a
                  href="/portfolio"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/portfolio');
                  }}
                  className="inline-flex items-center justify-center gap-2 bg-transparent text-white px-8 py-4 rounded-full font-bold text-lg border-2 border-white/30 hover:border-white hover:bg-white/10 transition-all duration-300"
                >
                  {t.ctaSecondary}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Custom styles for scroll animations */}
      <style>{`
        .animate-on-scroll {
          opacity: 0;
          transform: translateY(32px);
          transition: opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1), transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animate-on-scroll.animate-visible {
          opacity: 1;
          transform: translateY(0);
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
        }
        .animation-delay-600 {
          animation-delay: 0.6s;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
