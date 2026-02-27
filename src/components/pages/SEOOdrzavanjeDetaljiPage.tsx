import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, Play, Star, ExternalLink } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { SEOHelmet } from '../seo/SEOHelmet';

function useCountUp(target: number, duration = 1400, started = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    let start = 0;
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = Math.round(eased * target);
      if (next !== start) { start = next; setCount(next); }
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [started, target, duration]);
  return count;
}

function useInView(threshold = 0.25): [React.RefObject<HTMLDivElement>, boolean] {
  const ref = useRef<HTMLDivElement>(null!);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function useReveal(): [React.RefObject<HTMLElement>, boolean] {
  const ref = useRef<HTMLElement>(null!);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

export function SEOOdrzavanjeDetaljiPage() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  const [statsRef, statsInView] = useInView(0.3);
  const c1 = useCountUp(50, 1200, statsInView);
  const c2 = useCountUp(50, 1200, statsInView);
  const c3 = useCountUp(100, 1400, statsInView);
  const c4 = useCountUp(1, 800, statsInView);

  const [metricsRef, metricsVisible] = useReveal();
  const [teamRef, teamVisible] = useReveal();
  const [reviewsRef, reviewsVisible] = useReveal();
  const [ctaRef, ctaVisible] = useReveal();

  const [widgetOpen, setWidgetOpen] = useState(false);
  const [widgetAutoOpened, setWidgetAutoOpened] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);
  const [stickyBarVisible, setStickyBarVisible] = useState(false);
  const [expandedReviewIndex, setExpandedReviewIndex] = useState<number | null>(null);

  /* ── Trailing cursor square ─────────────────────────────────── */
  const trailRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: -200, y: -200 });
  const pos = useRef({ x: -200, y: -200 });
  const rafId = useRef<number>(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (trailRef.current) trailRef.current.style.opacity = '1';
    };
    const onLeave = () => {
      if (trailRef.current) trailRef.current.style.opacity = '0';
    };
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const animate = () => {
      pos.current.x = lerp(pos.current.x, mouse.current.x, 0.07);
      pos.current.y = lerp(pos.current.y, mouse.current.y, 0.07);
      if (trailRef.current) {
        trailRef.current.style.transform = `translate(${pos.current.x - 6}px, ${pos.current.y - 6}px)`;
      }
      rafId.current = requestAnimationFrame(animate);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    rafId.current = requestAnimationFrame(animate);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(rafId.current);
    };
  }, []);
  /* ──────────────────────────────────────────────────────────── */

  useEffect(() => {
    const onScroll = () => {
      if (!widgetAutoOpened) {
        const scrolled = window.scrollY + window.innerHeight;
        const total = document.documentElement.scrollHeight;
        if (scrolled >= total * 0.72) {
          setWidgetOpen(true);
          setWidgetAutoOpened(true);
        }
      }
      const heroEl = document.querySelector('section.pt-14') as HTMLElement | null;
      const inHero = heroEl ? heroEl.getBoundingClientRect().bottom > 0 && heroEl.getBoundingClientRect().top < window.innerHeight : false;
      setStickyBarVisible(!inHero && window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [widgetAutoOpened]);

  const dayLabels = language === 'sr'
    ? ['PON', 'UTO', 'SRE', 'ČET', 'PET', 'SUB']
    : ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const revealClass = (v: boolean) =>
    `transition-all duration-700 ease-out ${v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`;

  const goToFunnel = () => navigate('/funnel');

  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 overflow-x-hidden relative">
      {/* ── Trailing cursor square ─────────────────────────────── */}
      <div
        ref={trailRef}
        className="fixed top-0 left-0 z-[99999] pointer-events-none opacity-0 transition-opacity duration-200"
        style={{ willChange: 'transform' }}
      >
        <div className="w-2 h-2 bg-[#05afd1] shadow-[0_0_6px_rgba(5,175,209,0.7)]" />
      </div>
      {/* ──────────────────────────────────────────────────────── */}
      <div className="fixed top-0 left-0 right-0 h-[95vh] max-h-[1200px] pointer-events-none z-0">
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 50% -60%, rgba(5, 175, 209, 0.35), rgba(5, 175, 209, 0.15) 40%, rgba(0, 0, 0, 0) 70%)'
          }}
        />
        <div className="absolute -top-[500px] left-1/2 -translate-x-1/2 w-[1600px] h-[1200px] bg-[#05afd1]/25 rounded-full blur-[150px]" />
        <div className="absolute -top-[200px] left-1/2 -translate-x-1/2 w-[1000px] h-[800px] bg-[#05afd1]/15 rounded-full blur-[130px]" />
        <div className="absolute top-1/4 -left-40 w-[700px] h-[700px] bg-[#05afd1]/12 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-[700px] h-[700px] bg-[#05afd1]/12 rounded-full blur-[120px]" />
      </div>

      <SEOHelmet
        title={language === 'sr'
          ? 'SEO Održavanje Beograd, Srbija | Šta ti donosi redovno SEO održavanje? | AiSajt'
          : 'SEO Maintenance Belgrade, Serbia | What Does Regular SEO Maintenance Bring You? | AiSajt'
        }
        description={language === 'sr'
          ? 'SEO održavanje Beograd i Srbija. Pogledaj kako redovno SEO održavanje donosi više posetilaca i bolje pozicije. Video i detalji od AiSajt tima.'
          : 'SEO maintenance Belgrade and Serbia. See how regular SEO maintenance brings more visitors and better rankings. Video and details from AiSajt.'
        }
        keywords={language === 'sr'
          ? 'SEO održavanje beograd, SEO održavanje srbija, mesečna SEO optimizacija'
          : 'SEO maintenance belgrade, SEO maintenance serbia, monthly SEO'
        }
        canonicalUrl="https://aisajt.com/seo-optimizacija-detalji"
      />

      <main id="main-content" className="relative z-10">
        <div className="fixed top-5 left-4 right-4 md:left-auto md:right-6 z-50 flex items-center justify-between md:justify-end gap-2">
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 md:px-5 md:py-2.5 border border-[#05afd1]/30 bg-gray-950/80 backdrop-blur-md text-[#05afd1] text-xs md:text-sm font-semibold tracking-wide rounded-full hover:bg-[#05afd1]/20 hover:text-white hover:border-[#05afd1] transition-all duration-300 flex items-center gap-1.5 md:gap-2 shadow-[0_0_16px_rgba(5,175,209,0.15)]"
          >
            {language === 'sr' ? 'Početna' : 'Home'}
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={goToFunnel}
            className="px-4 py-2 md:px-5 md:py-2.5 border border-[#05afd1]/30 bg-gray-950/80 backdrop-blur-md text-[#05afd1] text-xs md:text-sm font-semibold tracking-wide rounded-full hover:bg-[#05afd1]/20 hover:text-white hover:border-[#05afd1] transition-all duration-300 flex items-center gap-1.5 md:gap-2 shadow-[0_0_16px_rgba(5,175,209,0.15)]"
          >
            {language === 'sr' ? 'Zakaži poziv' : 'Book a call'}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Hero – SEO Održavanje */}
        <section className="pt-10 pb-4 md:pt-16 md:pb-14 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10 w-full">
            <div className="max-w-4xl mx-auto text-center">
              <div className={`mb-2 md:mb-8 transform transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
                <div className="flex justify-center -mt-1 md:mt-0">
                  <img
                    src="/images/aisajt_providno-removebg-preview.png"
                    alt="AiSajt Logo"
                    className="h-8 md:h-10 w-auto opacity-85"
                  />
                </div>
              </div>

              <div className={`transform transition-all duration-700 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                <div className="flex flex-row items-center justify-center gap-2 md:gap-3 flex-wrap mb-2 md:mb-6">
                  <img src="/images/ljudi.webp" alt="" className="h-6 w-auto rounded-full object-cover flex-shrink-0 md:h-8" />
                  <span className="text-gray-400 text-[11px] md:text-sm font-medium text-left md:text-center leading-tight">
                    {language === 'sr' ? (
                      <>Pridruži se preko 50+<br className="md:hidden" /> zadovoljnih klijenata</>
                    ) : (
                      <>Join 50+ satisfied<br className="md:hidden" /> clients</>
                    )}
                  </span>
                </div>
              </div>

              <div className={`transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-1 md:mb-5">
                  {language === 'sr' ? (
                    <>
                      <span className="text-white">Šta Ti Donosi Stalno</span>
                      <span className="block mt-1 md:mt-2 text-[#05afd1]">SEO Održavanje?</span>
                    </>
                  ) : (
                    <>
                      <span className="text-white">What Does Constant</span>
                      <span className="block mt-1 md:mt-2 text-[#05afd1]">SEO Maintenance?</span>
                    </>
                  )}
                </h1>
              </div>

              <div className={`transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <p className="text-sm md:text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto mb-3 md:mb-8">
                  {language === 'sr'
                    ? 'Pogledaj šta možeš da dobiješ od redovnog SEO održavanja — više posetilaca, bolje pozicije i dokazani sistem.'
                    : 'See what you can get from regular SEO maintenance — more visitors, better rankings and a proven system.'}
                </p>
              </div>

              <div className={`transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="relative rounded-lg md:rounded-xl overflow-hidden shadow-2xl border border-[#05afd1]/20 bg-gradient-to-br from-gray-900 to-gray-800 max-w-3xl mx-auto">
                  <div className="bg-gradient-to-r from-[#05afd1] to-[#05afd1] text-white py-1.5 md:py-2 px-4 md:px-6 text-center">
                    <p className="font-semibold text-xs md:text-sm flex items-center justify-center gap-2">
                      <Play className="w-3 h-3 md:w-3.5 md:h-3.5" />
                      {language === 'sr' ? 'Klikni Play Da Naučiš Više' : 'Click Play to Learn More'}
                    </p>
                  </div>
                  <div className="aspect-video bg-gradient-to-br from-gray-800 via-gray-900 to-black flex items-center justify-center relative group cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#05afd1]/20 to-black/40" />
                    <div className="relative z-10 text-center">
                      <div className="w-12 h-12 md:w-20 md:h-20 rounded-full bg-gradient-to-r from-[#05afd1] to-[#05afd1] flex items-center justify-center mb-2 md:mb-3 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <Play className="w-6 h-6 md:w-10 md:h-10 text-white ml-0.5 md:ml-1" />
                      </div>
                      <div className="bg-[#05afd1]/90 backdrop-blur-sm rounded-lg md:rounded-xl px-3 py-2 md:px-5 md:py-3 max-w-xs mx-auto border border-[#05afd1]/50">
                        <p className="text-white font-bold text-sm md:text-base mb-0.5">
                          {language === 'sr' ? 'Tvoj Video Se Pušta' : 'Your Video is Playing'}
                        </p>
                        <p className="text-white/80 text-[10px] md:text-xs">
                          {language === 'sr' ? 'Klikni Da Isključiš Zvuk' : 'Click To Unmute'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`mt-6 flex justify-center transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <button
                  type="button"
                  onClick={goToFunnel}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#05afd1] hover:bg-[#05afd1] text-white font-bold uppercase text-sm tracking-wide rounded-lg transition-colors shadow-[0_4px_14px_0_rgba(0,0,0,0.1),0_0_48px_rgba(5,175,209,0.65)]"
                >
                  {language === 'sr' ? 'Zakaži poziv' : 'Book a call'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Meet the Team */}
        <section id="meet-the-team" ref={teamRef as React.RefObject<HTMLElement>} className="py-16 md:py-24 relative overflow-hidden z-10 bg-black">
          <div className={`container mx-auto px-4 relative z-10 ${revealClass(teamVisible)}`}>
            <div className="max-w-5xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">
                {language === 'sr' ? 'Upoznajte tim ' : 'Meet the Team '}
                <span className="text-[#05afd1]">{language === 'sr' ? 'iza AiSajt-a.' : 'Behind AiSajt.'}</span>
              </h2>
              <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto mb-4">
                {language === 'sr'
                  ? 'Upoznajte ljude koji su pomogli brojnim kompanijama da dobiju moderan sajt i jaču online prisutnost.'
                  : "Get to know the specialists who've helped many companies get a modern site and stronger online presence."}
              </p>
              <div className="w-3 h-3 bg-[#05afd1] rounded-sm mx-auto mb-12" />
              <div className="max-w-4xl mx-auto">
                {/* Bogdan i Strahinja – dva reda jedan pored drugog */}
                <div className="grid grid-cols-2 gap-4 md:gap-8 mb-8 md:mb-10">
                  {[
                    { name: 'Bogdan Gradjanin', role: language === 'sr' ? 'Suvlasnik, specijalizovani programer' : 'Co-owner & Specialized Developer', image: '/images/boban Izrada sajta .webp' },
                    { name: 'Strahinja Zekanovic', role: language === 'sr' ? 'Suvlasnik, dizajner i poslovanje' : 'Co-owner, Designer & Operations', image: '/images/Strahinja izrada sajta.webp' },
                  ].map((member) => (
                    <div key={member.name} className="rounded-2xl border border-gray-600/60 bg-gray-900/80 backdrop-blur-sm overflow-hidden shadow-xl flex flex-col">
                      <div className="aspect-square bg-gray-700/80 flex items-center justify-center text-4xl font-bold text-gray-500 overflow-hidden">
                        <img src={member.image} alt={member.name} className="w-full h-full object-cover object-top" />
                      </div>
                      <div className="p-4 sm:p-5">
                        <p className="font-bold text-sm sm:text-lg">
                          <span className="text-[#05afd1]">{member.name.split(' ')[0]}</span>
                          <span className="text-white"> {member.name.split(' ').slice(1).join(' ')}</span>
                        </p>
                        <p className="text-gray-400 text-xs sm:text-sm mt-0.5">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Marko – horizontalna kartica ispod, zadužen za SEO održavanje */}
                <div className="rounded-2xl border border-gray-600/60 bg-gray-900/80 backdrop-blur-sm overflow-hidden shadow-xl flex flex-col md:flex-row md:items-stretch w-full">
                  <div className="md:w-80 md:min-w-[280px] aspect-square md:aspect-auto md:min-h-[240px] bg-gray-700/80 flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img src="/images/Dedza SEO OPTIMIZACIJA.webp" alt="Marko Devedzic" className="w-full h-full object-cover object-top" />
                  </div>
                  <div className="p-5 md:p-6 md:flex-1 flex flex-col justify-center">
                    <p className="font-bold text-lg md:text-xl">
                      <span className="text-[#05afd1]">Marko</span>
                      <span className="text-white"> Devedzic</span>
                    </p>
                    <p className="text-[#05afd1]/90 text-sm font-medium mt-0.5">
                      {language === 'sr' ? 'SEO i održavanje sajtova' : 'SEO & Website Maintenance'}
                    </p>
                    <p className="text-gray-400 text-sm md:text-base mt-3 leading-relaxed">
                      {language === 'sr'
                        ? 'Zadužen za SEO optimizaciju i mesečno održavanje sajtova — praćenje pozicija, sadržaj, tehničke optimizacije i izveštaje za klijente. Tu je da vaš sajt ostane vidljiv na Googleu i da kontinuirano raste organski saobraćaj.'
                        : 'In charge of SEO optimization and monthly website maintenance — rank tracking, content, technical optimizations and client reports. Here to keep your site visible on Google and grow organic traffic over time.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews / Recenzije */}
        <section id="reviews" ref={reviewsRef as React.RefObject<HTMLElement>} className="py-16 md:py-24 relative overflow-hidden z-10 bg-black">
          <div className={`container mx-auto px-4 relative z-10 ${revealClass(reviewsVisible)}`}>
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">
                  {language === 'sr' ? 'Odlično' : 'Excellent'}
                </h2>
                <div className="flex justify-center gap-0.5 mb-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-8 h-8 text-green-500 fill-green-500" />
                  ))}
                </div>
                <p className="text-white/90 text-sm md:text-base">
                  {language === 'sr' ? (
                    <>Ocenjeno <strong>4.8 / 5</strong> na osnovu recenzija na{' '}
                      <span className="inline-flex items-center gap-1">
                        Trustpilot
                        <Star className="w-3.5 h-3.5 text-green-500 fill-green-500 inline" />
                      </span>
                    </>
                  ) : (
                    <>Rated <strong>4.8 / 5</strong> based on reviews on{' '}
                      <span className="inline-flex items-center gap-1">
                        Trustpilot
                        <Star className="w-3.5 h-3.5 text-green-500 fill-green-500 inline" />
                      </span>
                    </>
                  )}
                </p>
                <p className="text-gray-400 text-sm mt-4 text-left max-w-4xl mx-auto">
                  {language === 'sr' ? 'Prikazujemo naše 4 i 5 zvezdica recenzije.' : 'Showing our 4 & 5 star reviews.'}
                </p>
              </div>

              <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 auto-rows-fr"
                style={{ gridAutoRows: 'minmax(200px, auto)' }}
              >
                {(language === 'sr' ? [
                  { name: 'Marko P.', date: 'pre 3 nedelje', title: 'Nisam očekivao ovako brze rezultate', body: 'Kontaktirao sam ih jer Google jednostavno nije prikazivao moj sajt. Bogdan mi je isti dan odgovorio i objasnio tačno šta je problem. Posle mesec dana rada vidim prve rezultate, upiti počinju da stižu organskim putem. Preporučujem svakome ko se muči sa vidljivošću.' },
                  { name: 'Nebojša M.', date: 'pre 14 meseci', title: 'Objasne sve bez besmislica', body: 'Bavim se nekretninama i dugo sam odlagao SEO jer nisam znao odakle da počnem. Momci su mi sve objasnili bez žargona i bez pritiska. Posle drugog meseca pojavio sam se na prvoj strani za par ključnih reči koje su mi važne. Šalju mesečne izveštaje i uvek su dostupni kada imam pitanje. Definitivno nastavljamo saradnju.' },
                  { name: 'Nikola K.', date: 'pre 2 meseca', title: 'Novi sajt', body: 'Imao sam zastareo sajt koji je odbijao klijente, spor, ružan na telefonu, ni Google ga nije prikazivao. Bogdan mi je napravio potpuno novu verziju, moderan izgled, brzo učitavanje. Odmah sam primetio razliku, a i klijenti su počeli da komentarišu kako sajt dobro izgleda.' },
                  { name: 'Jelena M.', date: 'pre 4 meseca', title: 'Ima me na Googleu napokon', body: 'Pre nego što smo počeli saradnju, sajt mi se gotovo nije ni pojavljivao. Posle nekih dva meseca primetila sam prve promene, a sad redovno stižu i upiti od novih klijenata. Hvala Bogdanu i timu na strpljenju i stručnosti.' },
                  { name: 'Stefan D.', date: 'pre 7 meseci', title: 'Više organskih upita nego ikad', body: 'Angažovao sam ih najpre za izradu sajta, ali kada su mi pokazali plan SEO održavanja, odlučio sam da produžimo saradnju. Uvek brzo odgovore na poruke i pažljivo prođu kroz svaku stavku izveštaja. Za pet meseci organski saobraćaj nam je utrostručen, nisam ni slutio da je to moguće ovako brzo. Svakome ko ozbiljno gleda na rast, ovo je pravo rešenje.' },
                  { name: 'Ivana S.', date: 'pre 5 meseci', title: 'Sajt gotov na vreme bez stresa', body: 'Tražila sam nekog da napravi sajt za moj salon lepote. Sve je urađeno profesionalno, dogovorili smo rok i rok je ispoštovan. Nema onih klasičnih "još malo, još malo" situacija. Sajt lepo izgleda i na telefonu, što mi je bilo jako važno. Zadovoljna sam.' },
                  { name: 'Miloš R.', date: 'pre 11 meseci', rating: 4, title: 'Rezultati dobri odgovor ponekad kasni', body: 'Bavim se stolarijom i trebao mi je SEO da me ljudi nađu kad traže nameštaj po meri. Pozicije su se vidno poboljšale već posle prvog meseca, za ključne reči u mojoj branši smo skočili na prvu stranicu. Jedino što bih napomenuo je da sam ponekad malo duže čekao na odgovor, ali kada odgovore, sve je jasno i precizno. Momci su stvarno dobri u poslu, preporučujem.' },
                ] : [
                  { name: 'Mark P.', date: '3 weeks ago', title: 'Results faster than I expected', body: 'I reached out because Google simply wasn\'t showing my site. Bogdan replied the same day and explained exactly what the problem was. After a month I started seeing results, inquiries are now coming through organically. Highly recommended.' },
                  { name: 'Nebojsa M.', date: '14 months ago', title: 'They explain everything no nonsense', body: 'I work in real estate and kept putting off SEO because I didn\'t know where to start. The guys explained everything without jargon or pressure. After the second month I appeared on the first page for a few key terms that matter to me. They send monthly reports and are always available when I have questions. We will definitely continue.' },
                  { name: 'Nick K.', date: '2 months ago', title: 'New site', body: 'My old site was outdated and was pushing clients away, slow, ugly on mobile, not showing up on Google. Bogdan built me a completely new version, modern design, fast loading. I noticed the difference right away, and clients started commenting on how good the site looks.' },
                  { name: 'Helen M.', date: '4 months ago', title: 'We\'re on Google now finally', body: 'Before we started working together, my site barely appeared anywhere. After about two months I noticed the first changes, and now new client inquiries come in regularly. Thanks to Bogdan and the team for their patience and expertise.' },
                  { name: 'Steve D.', date: '7 months ago', title: 'More organic leads than ever', body: 'I originally hired them just to build a website, but when they showed me the SEO maintenance plan, I decided to continue the collaboration. They always reply quickly and go through every item in the report. In five months our organic traffic tripled, I didn\'t think that was possible this fast. For anyone serious about growth, this is the right solution.' },
                  { name: 'Ivy S.', date: '5 months ago', title: 'Site done on time no stress', body: 'I needed someone to build a website for my beauty salon. Everything was done professionally, we agreed on a deadline and the deadline was met. None of the usual "just a bit more" delays. The site looks great on mobile too, which was really important to me. Very satisfied.' },
                  { name: 'Milos R.', date: '11 months ago', rating: 4, title: 'Good results replies can be slow', body: 'I run a carpentry workshop and needed SEO so people could find me when searching for custom furniture. Rankings improved noticeably after the first month, for key terms in my niche we jumped to the first page. The only thing I\'d mention is that replies sometimes took a bit longer, but when they did respond everything was clear and precise. The guys are genuinely good at what they do, I recommend them.' },
                ]).map((review, i) => {
                  const isExpanded = expandedReviewIndex === i;
                  const isBigCard = [1, 4].includes(i);
                  const stars = (rating: number) => [1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`w-4 h-4 ${s <= rating ? 'text-green-500 fill-green-500' : 'text-gray-300 fill-gray-300'}`} />
                  ));
                  return (
                    <div
                      key={i}
                      className={`relative rounded-xl border border-gray-200 bg-white shadow-lg p-5 flex flex-col text-left ${
                        isBigCard ? 'md:row-span-2' : ''
                      } ${isExpanded ? 'z-50' : 'z-0'}`}
                    >
                      <div className="flex gap-0.5 mb-3">
                        {stars(review.rating ?? 5)}
                      </div>
                      <p className="text-gray-500 text-xs mb-2">
                        {review.name}, {review.date}
                      </p>
                      <h3 className="font-bold text-gray-900 text-sm md:text-base mb-2">
                        {review.title}
                      </h3>
                      <p className={`text-gray-600 text-sm leading-relaxed flex-1 ${!isBigCard ? 'line-clamp-3' : ''}`}>
                        {review.body}
                      </p>
                      {!isBigCard && (
                        <>
                          <button
                            type="button"
                            onClick={() => setExpandedReviewIndex(isExpanded ? null : i)}
                            className="text-[#05afd1] hover:text-[#05afd1] text-sm font-medium mt-2 self-start cursor-pointer hover:underline underline-offset-2"
                          >
                            {language === 'sr' ? 'Pročitaj više' : 'Read more'}
                          </button>
                          {isExpanded && (
                            <div className="absolute left-0 top-0 w-full rounded-xl border border-[#05afd1] bg-white shadow-2xl p-5 flex flex-col">
                              <div className="flex gap-0.5 mb-3">
                                {stars(review.rating ?? 5)}
                              </div>
                              <p className="text-gray-500 text-xs mb-2">
                                {review.name}, {review.date}
                              </p>
                              <h3 className="font-bold text-gray-900 text-sm md:text-base mb-2">
                                {review.title}
                              </h3>
                              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                                {review.body}
                              </p>
                              <button
                                type="button"
                                onClick={() => setExpandedReviewIndex(null)}
                                className="text-[#05afd1] hover:text-[#05afd1] text-sm font-medium self-start cursor-pointer hover:underline underline-offset-2"
                              >
                                {language === 'sr' ? 'Pročitaj manje' : 'Read less'}
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Success metrics */}
        <section id="success-metrics" ref={metricsRef as React.RefObject<HTMLElement>} className="py-16 md:py-24 relative overflow-hidden z-10">
          <div className={`container mx-auto px-4 relative z-10 ${revealClass(metricsVisible)}`}>
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
                <img src="/images/ljudi.webp" alt="" className="h-8 w-auto rounded-full object-cover" />
                <p className="text-white text-sm md:text-base">
                  {language === 'sr' ? (
                    <>Pridružite se <strong>50+</strong> zadovoljnih <strong>klijenata</strong> i <strong>preduzeća</strong>.</>
                  ) : (
                    <>Join <strong>50+</strong> satisfied <strong>clients</strong> and <strong>businesses</strong>.</>
                  )}
                </p>
              </div>
              <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight mb-2">
                {language === 'sr' ? '50+ Uspešnih Projekata, Priče Uspeha.' : '50+ Successful Projects, Success Stories.'}
              </h2>
              <h3 className="text-xl md:text-2xl font-bold text-[#05afd1] mb-6">
                {language === 'sr' ? 'Jedan Dokazan Pristup.' : 'One Proven Approach.'}
              </h3>
              <p className="text-gray-400 text-base md:text-lg max-w-4xl mx-auto mb-10">
                {language === 'sr'
                  ? 'Od korporativnih sajtova do e-commerce i landing stranica — znamo šta je potrebno da vaš biznis zasija na internetu. Bez nagađanja, bez zastoja.'
                  : 'From corporate sites to e-commerce and landing pages — we know what it takes to make your business shine online. No guesswork, no plateaus.'}
              </p>
              <div className="rounded-xl overflow-hidden border border-gray-700/60 shadow-2xl max-w-4xl mx-auto">
                <img src="/images/filmska%207.jpg" alt={language === 'sr' ? 'Rad na projektu — AiSajt tim' : 'Project work — AiSajt team'} className="w-full h-auto object-cover" />
              </div>
              <div ref={statsRef} className="relative z-10 -mt-14 md:-mt-16 rounded-2xl bg-gray-900/95 border border-gray-700/60 backdrop-blur-sm px-6 py-6 md:px-8 md:py-7 shadow-xl w-full">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                  <div className="text-center md:text-left">
                    <p className="text-2xl md:text-3xl font-bold text-white tabular-nums">{c1}+</p>
                    <p className="text-gray-400 text-sm mt-0.5">{language === 'sr' ? 'realizovanih projekata' : 'projects delivered'}</p>
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-2xl md:text-3xl font-bold text-white tabular-nums">{c2}+</p>
                    <p className="text-gray-400 text-sm mt-0.5">{language === 'sr' ? 'zadovoljnih klijenata' : 'satisfied clients'}</p>
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-2xl md:text-3xl font-bold text-white tabular-nums">{c3}%</p>
                    <p className="text-gray-400 text-sm mt-0.5">{language === 'sr' ? 'posvećenost rezultatu' : 'commitment to results'}</p>
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-2xl md:text-3xl font-bold text-white tabular-nums">{c4}</p>
                    <p className="text-gray-400 text-sm mt-0.5">{language === 'sr' ? 'dokazan sistem' : 'proven system'}</p>
                  </div>
                </div>
              </div>
              <div className="mt-10 flex justify-center">
                <div className="w-10 h-10 flex items-center justify-center text-[#05afd1]">
                  <div className="w-6 h-6 border-2 border-[#05afd1] rotate-45" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section id="cta-final" ref={ctaRef as React.RefObject<HTMLElement>} className="py-16 md:py-24 bg-black relative z-10 -mt-1">
          <div className={`container mx-auto px-4 ${revealClass(ctaVisible)}`}>
            <div className="max-w-6xl mx-auto">
              <div className="relative rounded-3xl bg-gray-900/95 border border-gray-700/50 overflow-hidden">
                <div className="absolute -top-40 -left-40 w-[500px] h-[400px] bg-[#05afd1]/25 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute -top-32 -right-32 w-[400px] h-[350px] bg-[#05afd1]/15 rounded-full blur-[100px] pointer-events-none" />
                <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 p-8 md:p-10 lg:p-12">
                  <div className="flex flex-col justify-center">
                    <div className="flex flex-col items-start gap-3 mb-6">
                      <p className="text-white text-sm md:text-base">
                        {language === 'sr' ? 'Pridružite se 50+ uspešnih preduzeća' : 'Join 50+ successful businesses'}
                      </p>
                      <img src="/images/ljudi.webp" alt="" className="h-8 w-auto rounded-full object-cover" />
                    </div>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
                      <span className="text-[#05afd1]">
                        {language === 'sr' ? 'Stigli ste do ovde — sada ' : "You've made it this far — now "}
                      </span>
                      <span className="text-white">
                        {language === 'sr' ? 'skalirajmo vaš biznis.' : "let's scale your business."}
                      </span>
                    </h2>
                    <p className="text-gray-400 text-sm leading-snug mb-3 md:leading-relaxed md:text-base md:mb-6 max-w-xl">
                      {language === 'sr' ? (
                        <>Potrebno je 30 sekundi da se{' '}
                          <button type="button" onClick={goToFunnel} className="text-[#05afd1] font-bold hover:text-[#05afd1] underline underline-offset-2 cursor-pointer">
                            prijavite
                          </button>
                          {' '}i proverimo da li AiSajt može da vam pomogne da brže rastete — sa jasnoćom i rezultatima.</>
                      ) : (
                        <>Take 30 seconds to{' '}
                          <button type="button" onClick={goToFunnel} className="text-[#05afd1] font-bold hover:text-[#05afd1] underline underline-offset-2 cursor-pointer">
                            apply now
                          </button>
                          {' '}and let's see if AiSajt is the right fit to help you scale faster—with clarity and results.</>
                      )}
                    </p>
                    <p className="text-white font-medium text-sm mb-3">
                      {language === 'sr' ? 'Šta ćemo obraditi na besplatnom pozivu:' : "Here's what we'll cover on your free discovery call:"}
                    </p>
                    <ul className="space-y-2 mb-6">
                      {[
                        language === 'sr' ? 'Pregled vaše trenutne situacije i ciljeva' : 'Review your current situation + goals',
                        language === 'sr' ? 'Brze pobede i skrivene prilike' : 'Spot quick wins and hidden gaps',
                        language === 'sr' ? 'Iskren savet o sledećim koracima' : 'Share honest advice on next steps',
                        language === 'sr' ? 'Bez pritiska, bez nametljive prodaje' : 'No pressure, no hard pitch',
                      ].map((item) => (
                        <li key={item} className="flex items-center gap-3 text-gray-300 text-sm">
                          <CheckCircle className="w-5 h-5 text-[#05afd1] flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <p className="text-gray-400 text-sm">
                      {language === 'sr' ? (
                        <>Kontaktiraćemo vas i na pozivu ćete dobiti <strong className="text-white">konkretan savet i jasne sledeće korake</strong> za vaš biznis. Bez obaveze — fokus je na vašem uspehu.</>
                      ) : (
                        <>We'll contact you and on the call you'll get <strong className="text-white">concrete advice and clear next steps</strong> for your business. No obligation — the focus is on your success.</>
                      )}
                    </p>
                  </div>
                  <div className="relative flex items-center justify-center w-full max-w-md">
                    <div className="rounded-2xl overflow-hidden border border-gray-700/60 shadow-2xl bg-gray-800/50 w-full max-h-[280px] md:max-h-[340px] flex items-center justify-center">
                      <img src="/images/filmska.jpg" alt="" className="w-full h-full object-contain" />
                    </div>
                  </div>
                </div>
                <div className="relative flex justify-center pb-8 md:pb-10">
                  <button
                    type="button"
                    onClick={goToFunnel}
                    className="inline-flex items-center gap-2 px-10 py-4 bg-white hover:bg-gray-100 text-gray-900 font-bold uppercase text-sm tracking-wide rounded-xl transition-colors shadow-[0_4px_14px_0_rgba(0,0,0,0.08),0_0_48px_rgba(255,255,255,0.55)]"
                  >
                    {language === 'sr' ? 'Zakaži poziv' : 'Book a call'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="bg-black border-t border-gray-800 py-8 md:py-10 relative z-10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex justify-center mb-5">
                <img src="/images/aisajt_providno-removebg-preview.png" alt="AiSajt Logo" className="h-8 md:h-10 w-auto opacity-85" />
              </div>
              <p className="text-gray-500 text-xs leading-relaxed mb-6">
                {language === 'sr'
                  ? 'Rezultati zavise od vrste projekta i saradnje. Prikazani projekti su stvarni radovi naših klijenata. Svaki biznis je drugačiji — uspeh na webu zavisi od vaših ciljeva, potreba i angažmana. Nismo povezani ni sa jednom trećom stranom navedenom na sajtu.'
                  : 'Results depend on project type and collaboration. Projects shown are real work for our clients. Every business is different — online success depends on your goals, needs, and commitment. We are not affiliated with any third parties mentioned on this site.'}
              </p>
              <p className="text-gray-500 text-xs">
                © {new Date().getFullYear()} AiSajt
                <span className="mx-1.5">•</span>
                <a href="/privacy" className="hover:text-[#05afd1] transition-colors">Privacy</a>
                <span className="mx-1.5">•</span>
                <a href="/terms" className="hover:text-[#05afd1] transition-colors">{language === 'sr' ? 'Uslovi' : 'Terms'}</a>
                <span className="mx-1.5">•</span>
                <a href="/terms#disclaimer" className="hover:text-[#05afd1] transition-colors">{language === 'sr' ? 'Izjava' : 'Disclaimer'}</a>
              </p>
            </div>
          </div>
        </footer>

        {/* Sticky bottom bar → funnel */}
        <div
          className={`fixed bottom-5 left-0 right-0 z-40 hidden md:flex justify-center px-4 transition-all duration-500 ease-out ${
            stickyBarVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'
          }`}
        >
          <div className="inline-flex items-center gap-3 md:gap-5 px-4 py-2.5 md:px-6 md:py-3 rounded-2xl border border-[#05afd1]/25 bg-black/55 backdrop-blur-xl shadow-[0_4px_32px_rgba(5,175,209,0.18)]">
            <p className="text-gray-300 text-xs md:text-sm leading-snug whitespace-nowrap">
              {language === 'sr' ? (
                <>Nauči kako da dobiješ nove klijente sa <span className="text-[#05afd1] font-semibold">AiSajt sistemom.</span></>
              ) : (
                <>Get new clients with the <span className="text-[#05afd1] font-semibold">AiSajt system.</span></>
              )}
            </p>
            <button
              onClick={goToFunnel}
              className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 md:px-5 md:py-2.5 bg-[#05afd1] hover:bg-[#05afd1] text-white font-bold text-xs md:text-sm rounded-xl transition-all shadow-[0_0_16px_rgba(5,175,209,0.45)] hover:shadow-[0_0_24px_rgba(5,175,209,0.65)] whitespace-nowrap"
            >
              {language === 'sr' ? 'Zakaži Poziv' : 'Book a Call'}
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Floating widget → funnel */}
        <div className="fixed bottom-6 right-5 z-50 flex flex-col items-end gap-3">
          <div
            className={`transition-all duration-300 ease-out origin-bottom-right ${
              widgetOpen ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-90 translate-y-4 pointer-events-none'
            }`}
          >
            <div className="w-80 rounded-2xl bg-[#1a1a1a] border border-white/10 shadow-2xl overflow-hidden">
              <div className="px-4 pt-4 pb-3 flex items-start gap-3">
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img src="/images/Strahinja izrada sajta.webp" alt="Strahinja Zekanovic" className="w-full h-full object-cover object-top" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-[#1a1a1a]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm leading-tight">AiSajt Tim</p>
                  <p className="text-gray-400 text-xs">Strahinja Zekanović · Co-founder</p>
                </div>
                <button onClick={() => setWidgetOpen(false)} className="text-gray-500 hover:text-gray-300 transition-colors mt-0.5 flex-shrink-0" aria-label="Zatvori">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="px-4 pb-3 border-b border-white/8">
                <p className="text-white font-bold text-sm">{language === 'sr' ? 'AiSajt Strategijski Poziv' : 'AiSajt Strategy Call'}</p>
                <p className="text-gray-400 text-xs mt-0.5">{language === 'sr' ? 'Zakaži besplatni 1-1 poziv sa timom.' : 'Book your free 1-1 call with the team.'}</p>
              </div>
              <div className="mx-4 mt-3 px-3 py-2 bg-white/5 rounded-lg flex items-center justify-between">
                <p className="text-gray-300 text-xs font-medium">{language === 'sr' ? 'Malo slobodnih termina.' : 'Only few slots left.'}</p>
                <span className="text-[#05afd1] font-bold text-xs tabular-nums">⚡ {language === 'sr' ? 'Ograničeno' : 'Limited'}</span>
              </div>
              <div className="px-4 pt-3 pb-1">
                <div className="flex gap-1.5">
                  {dayLabels.map((label, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedDay(i)}
                      className={`flex-1 flex flex-col items-center py-2.5 rounded-lg border text-xs font-medium transition-all ${
                        selectedDay === i ? 'bg-[#05afd1] border-[#05afd1] text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:border-[#05afd1]/50 hover:text-white'
                      }`}
                    >
                      <span className="text-[9px] uppercase tracking-wide leading-tight">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="px-4 py-4">
                <button
                  onClick={goToFunnel}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#05afd1] to-[#05afd1] hover:from-[#05afd1] hover:to-[#05afd1] text-white font-bold text-sm transition-all shadow-lg hover:shadow-[#05afd1]/30"
                >
                  {language === 'sr' ? 'Zakaži Poziv' : 'Book a Call'}
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={() => setWidgetOpen(v => !v)}
            className="relative w-14 h-14 rounded-full shadow-2xl border-2 border-[#05afd1] hover:border-[#05afd1] transition-all hover:scale-105 active:scale-95 bg-[#05afd1] flex items-center justify-center"
            aria-label="Zakaži poziv"
          >
            <img src="/images/aisajt_providno-removebg-preview.png" alt="AiSajt" className="w-9 h-9 object-contain" />
            <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-gray-950" />
          </button>
        </div>
      </main>
    </div>
  );
}
