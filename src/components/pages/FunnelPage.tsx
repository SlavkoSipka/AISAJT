import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, Play, ExternalLink, Star } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useLanguage } from '../../hooks/useLanguage';
import { Navbar } from '../layout/Navbar';
import { SEOHelmet } from '../seo/SEOHelmet';
import { trackCTAClick, trackFormSubmitAttempt, trackFormError } from '../../utils/analytics';
import { submitFunnelForm } from '../../utils/hubspot';

export function FunnelPage() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    trackFormSubmitAttempt('funnel_booking', language);

    try {
      const result = await submitFunnelForm({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        ...(formData.message && { message: formData.message }),
      });

      if (result.success) {
        setSubmitSuccess(true);
        trackCTAClick('Funnel Form Submit', 'funnel_form', language);
        navigate(`/thank-you?name=${encodeURIComponent(formData.name)}&source=funnel_booking&lang=${language}`);
      } else {
        throw new Error(result.message || 'Slanje nije uspelo');
      }
    } catch (error) {
      trackFormError('funnel_booking', language, String(error));
      toast.error(
        language === 'sr'
          ? 'Došlo je do greške. Molimo pokušajte ponovo.'
          : 'An error occurred. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-950 overflow-x-hidden relative">
      {/* Violet glow samo na prve 2 sekcije (hero + booking); ispod toga samo tamna pozadina */}
      <div className="fixed top-0 left-0 right-0 h-[95vh] max-h-[1200px] pointer-events-none z-0">
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 50% -60%, rgba(139, 92, 246, 0.35), rgba(139, 92, 246, 0.15) 40%, rgba(0, 0, 0, 0) 70%)'
          }}
        ></div>
        <div className="absolute -top-[500px] left-1/2 -translate-x-1/2 w-[1600px] h-[1200px] bg-violet-600/25 rounded-full blur-[150px]"></div>
        <div className="absolute -top-[200px] left-1/2 -translate-x-1/2 w-[1000px] h-[800px] bg-pink-600/15 rounded-full blur-[130px]"></div>
        <div className="absolute top-1/4 -left-40 w-[700px] h-[700px] bg-violet-700/12 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/3 -right-40 w-[700px] h-[700px] bg-pink-700/12 rounded-full blur-[120px]"></div>
      </div>

      <SEOHelmet
        title={language === 'sr' 
          ? 'Skalirajte Vaš Biznis | AiSajt - AI Izrada Sajtova'
          : 'Scale Your Business | AiSajt - AI Website Development'
        }
        description={language === 'sr'
          ? 'Otkrijte kako možete da skalirate vaš biznis sa našim dokazanim sistemom. Besplatna strategijska konsultacija.'
          : 'Discover how to scale your business with our proven system. Free strategy consultation.'
        }
        canonicalUrl="https://aisajt.com/funnel"
      />
      <Toaster position="top-center" />

      <Navbar />

      <main id="main-content" className="relative z-10">
        {/* Fixed Home button in top right corner */}
        <button
          onClick={() => navigate('/')}
          className="fixed top-6 right-6 z-50 px-5 py-2.5 border border-violet-500/40 bg-gray-900/80 backdrop-blur-sm text-gray-300 text-sm font-medium rounded-full hover:bg-violet-600 hover:text-white hover:border-violet-600 transition-all duration-300 flex items-center gap-2 shadow-lg"
        >
          {language === 'sr' ? 'Početna' : 'Home'}
          <ExternalLink className="w-3.5 h-3.5" />
        </button>

        {/* Hero Section – čist layout, bez min-h-screen i negativnih margina */}
        <section className="pt-14 md:pt-16 pb-10 md:pb-14 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10 w-full">
            <div className="max-w-4xl mx-auto text-center">

              {/* AiSajt Logo */}
              <div className={`mb-6 md:mb-8 transform transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
                <div className="flex justify-center">
                  <img 
                    src="/images/aisajt_providno-removebg-preview.png" 
                    alt="AiSajt Logo" 
                    className="h-9 md:h-10 w-auto opacity-85"
                  />
                </div>
              </div>

              {/* Trust badges */}
              <div className={`transform transition-all duration-700 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                <div className="flex items-center justify-center gap-3 flex-wrap mb-5 md:mb-6">
                  <img src="/images/ljudi.webp" alt="" className="h-8 w-auto rounded-full object-cover" />
                  <span className="text-gray-400 text-sm font-medium">
                    {language === 'sr' ? 'Pridruži se preko 50+ zadovoljnih klijenata' : 'Join 50+ satisfied clients'}
                  </span>
                </div>
              </div>

              {/* Main Heading */}
              <div className={`transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 md:mb-5">
                  {language === 'sr' ? (
                    <>Kako Da Napraviš 💰 Sa <span className="text-violet-300">Online Biznisom</span></>
                  ) : (
                    <>How To Make 💰 With <span className="text-violet-300">Online Business</span></>
                  )}
                </h1>
              </div>

              {/* Subtitle */}
              <div className={`transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <p className="text-base md:text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto mb-6 md:mb-8">
                  {language === 'sr' 
                    ? 'Nauči dokazani traffic, lead & sales sistem koji smo koristili da napravimo milione.'
                    : 'Learn the proven traffic, lead & sales system we used to make millions.'
                  }
                </p>
              </div>

              {/* Video Section */}
              <div className={`transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="relative rounded-xl overflow-hidden shadow-2xl border border-violet-500/20 bg-gradient-to-br from-gray-900 to-gray-800 max-w-3xl mx-auto">
                  {/* CTA bar */}
                  <div className="bg-gradient-to-r from-violet-600 to-violet-700 text-white py-2 px-6 text-center">
                    <p className="font-semibold text-sm flex items-center justify-center gap-2">
                      <Play className="w-3.5 h-3.5" />
                      {language === 'sr' ? 'Klikni Play Da Naučiš Više' : 'Click Play to Learn More'}
                    </p>
                  </div>

                  {/* Video placeholder */}
                  <div className="aspect-video bg-gradient-to-br from-gray-800 via-gray-900 to-black flex items-center justify-center relative group cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/20 to-black/40"></div>
                    <div className="relative z-10 text-center">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-r from-violet-600 to-pink-600 flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <Play className="w-8 h-8 md:w-10 md:h-10 text-white ml-1" />
                      </div>
                      <div className="bg-violet-600/90 backdrop-blur-sm rounded-xl px-5 py-3 max-w-xs mx-auto border border-violet-500/50">
                        <p className="text-white font-bold text-base mb-0.5">
                          {language === 'sr' ? 'Tvoj Video Se Pušta' : 'Your Video is Playing'}
                        </p>
                        <p className="text-white/80 text-xs">
                          {language === 'sr' ? 'Klikni Da Isključiš Zvuk' : 'Click To Unmute'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Booking Section – bez negativnih margina, natural flow */}
        <section id="booking-form" className="pt-12 md:pt-16 pb-16 md:pb-24 relative overflow-hidden z-10">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-xl mx-auto text-center">
              {/* Header van kartice - veći tekst, na sredinu */}
              <p className="text-violet-400 text-sm font-medium tracking-wider uppercase mb-2">
                {language === 'sr' ? 'Besplatna konsultacija' : 'Free consultation'}
              </p>
              <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight mb-3">
                {language === 'sr' ? (
                  <>Hajde Da <span className="text-violet-300">Pričamo</span>.</>
                ) : (
                  <>Let&apos;s <span className="text-violet-300">Talk</span>.</>
                )}
              </h2>
              <p className="text-gray-500 text-base mb-6 max-w-lg mx-auto">
                {language === 'sr' 
                  ? 'Zakaži 1-na-1 poziv i saznaj kako možemo pomoći — plan strategije, prilike za rast.'
                  : 'Book a 1-on-1 call and see how we can help — strategy plan, growth opportunities.'
                }
              </p>

              {/* Card - kutija (samo forma) */}
              <div className="rounded-2xl border border-gray-700/80 bg-gray-900/40 backdrop-blur-sm overflow-hidden shadow-xl">
                <div className="p-8 md:p-10">
                {submitSuccess ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-10 h-10 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">
                      {language === 'sr' ? 'Uspešno Poslato!' : 'Successfully Sent!'}
                    </h4>
                    <p className="text-gray-400">
                      {language === 'sr' ? 'Kontaktiraćemo vas uskoro.' : 'We will contact you soon.'}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name field */}
                    <div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all text-sm"
                        placeholder={language === 'sr' ? 'Ime i prezime *' : 'Full name *'}
                      />
                    </div>

                    {/* Phone field */}
                    <div>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all text-sm"
                        placeholder={language === 'sr' ? 'Broj telefona *' : 'Phone number *'}
                      />
                    </div>

                    {/* Email field - shows after phone is entered */}
                    {formData.phone && (
                      <div className="animate-fadeIn">
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all text-sm"
                          placeholder={language === 'sr' ? 'Email adresa *' : 'Email address *'}
                        />
                      </div>
                    )}

                    {/* Budget - radio krugovi, pojavljuje se nakon emaila */}
                    {formData.email && (
                      <div className="animate-fadeIn pt-2">
                        <p className="text-white text-sm mb-4">
                          {language === 'sr' ? 'Koliki je budžet projekta? (opciono)' : 'What is your project budget? (optional)'}
                        </p>
                        <div className="space-y-3">
                          {[
                            { value: '<500', label: '< €500' },
                            { value: '500-1000', label: '€500 – €1,000' },
                            { value: '1000-2500', label: '€1,000 – €2,500' },
                            { value: '2500-5000', label: '€2,500 – €5,000' },
                            { value: '5000+', label: '€5,000+' },
                            { value: 'prefer-not-to-say', label: language === 'sr' ? 'Radije ne bih da kažem' : 'Prefer not to say' },
                          ].map((opt) => {
                            const isChecked = formData.message === opt.value;
                            return (
                              <label
                                key={opt.value}
                                className="flex items-center gap-3 cursor-pointer group"
                              >
                                <span className={`relative flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors ${isChecked ? 'border-violet-500' : 'border-gray-500 group-hover:border-gray-400'}`}>
                                  {isChecked && (
                                    <span className="h-2 w-2 rounded-full bg-violet-500" />
                                  )}
                                </span>
                                <input
                                  type="radio"
                                  name="message"
                                  value={opt.value}
                                  checked={isChecked}
                                  onChange={handleChange}
                                  className="sr-only"
                                />
                                <span className="text-gray-300 text-sm group-hover:text-white transition-colors">{opt.label}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Terms */}
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {language === 'sr' 
                        ? 'Unosom informacija, pristajete da vaši podaci budu sačuvani u skladu sa našom politikom privatnosti.'
                        : 'By entering your information, you consent to your data being saved in accordance with our privacy policy.'
                      }
                    </p>

                    {/* Submit button */}
                    <button
                      type="submit"
                      disabled={isSubmitting || !formData.name || !formData.phone || !formData.email}
                      className="w-full py-3.5 px-6 rounded-lg bg-gradient-to-r from-violet-600 to-violet-700 text-white font-semibold hover:from-violet-500 hover:to-violet-600 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl text-sm"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          {language === 'sr' ? 'Nastavi' : 'Continue'}
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Case Study – svi projekti sa logotipima iz /images/ */}
        <section id="case-study" className="py-16 md:py-24 relative overflow-hidden z-10 bg-black">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-2 h-8 rounded-full bg-violet-500 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                    {language === 'sr' ? (
                      <>Stvarni rezultati <span className="text-violet-300">od stvarnih klijenata.</span></>
                    ) : (
                      <>Real results <span className="text-violet-300">from real clients.</span></>
                    )}
                  </h2>
                  <p className="text-gray-400 mt-3 text-base md:text-lg max-w-2xl">
                    {language === 'sr' 
                      ? 'Pogledaj kako su naši klijenti dobili moderan sajt, više poseta i jasnu online prisutnost.'
                      : 'See how our clients got a modern site, more traffic, and a clear online presence.'
                    }
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 mt-10">
                {[
                  { id: 'komotraks', logo: '/images/komotraks-logotip.png', siteImg: '/images/komotraks.png', title: 'Komotraks', tag: language === 'sr' ? 'Komarnici' : 'Screens & sliding doors', headline: language === 'sr' ? 'Profesionalan web sajt za komarnike i klizna vrata - jasna ponuda i kontakti' : 'Professional website for screens and sliding doors — clear offer and contacts', text: language === 'sr' ? 'Moderan sajt sa uslugama i flotom. Klijent zadovoljan preglednošću.' : 'Modern site with services and fleet. Client happy with clarity.' },
                  { id: 'rc', logo: '/images/logo.png', siteImg: '/images/rc%20(2).png', title: 'Custom RC Parts', tag: language === 'sr' ? 'E-commerce, RC delovi' : 'E-commerce, RC parts', headline: language === 'sr' ? 'Web prodavnica za RC delove — porudžbine i katalog' : 'Online store for RC parts — orders and catalog', text: language === 'sr' ? 'Funkcionalan shop sa kategorijama i plaćanjem. Rast prodaje preko sajta.' : 'Functional shop with categories and payment. Sales growth via site.' },
                  { id: 'kralj', logo: '/images/Beli%20logo2.png', siteImg: '/images/kralj.png', title: 'Kralj Residence', tag: language === 'sr' ? 'apartmani i nekretnine' : 'Apartments & real estate', headline: language === 'sr' ? 'Moderan sajt za prodaju stanova - direktna prodaja' : 'Modern site for apartment sales — direct sales', text: language === 'sr' ? 'Responzivan sajt sa jasnom ponudom stanova. Zadovoljan klijent.' : 'Responsive site with clear property offer. Happy client.' },
                  { id: 'bora', logo: '/images/boralogo.jpg', siteImg: '/images/bora.png', title: 'Boracompany', tag: language === 'sr' ? 'CNC obrada' : 'CNC machining', headline: language === 'sr' ? 'Korporativni sajt — profesionalna prezentacija usluga' : 'Corporate site — professional service presentation', text: language === 'sr' ? 'Jasna struktura i poruka brenda. Povećana kredibilitet.' : 'Clear structure and brand message. Increased credibility.' },
                  { id: 'jastuci', logo: '/images/logo2.png', siteImg: '/images/jastuci.png', title: 'Vazdušni jastuci', tag: language === 'sr' ? 'Auto delovi' : 'Auto parts', headline: language === 'sr' ? 'Sajt za auto delove — katalog i upiti' : 'Site for auto parts — catalog and inquiries', text: language === 'sr' ? 'Pregledan katalog i kontakt forma. Više upita sa sajta.' : 'Clear catalog and contact form. More inquiries from site.' },
                  { id: 'poklon', logo: '/images/poklonilogo.png', siteImg: '/images/poklon.png', title: 'Pokloni Portret', tag: language === 'sr' ? 'Personalizovani pokloni' : 'Personalized gifts', headline: language === 'sr' ? 'Portreti po narudžbini — galerija i porudžbine' : 'Custom portraits — gallery and orders', text: language === 'sr' ? 'Umetnički brend na webu. Lako naručivanje i pregled radova.' : 'Art brand online. Easy ordering and portfolio view.' },
                  { id: 'prestige', logo: '/images/logop.png', siteImg: '/images/prestige.png', title: 'Prestige Gradnja', tag: language === 'sr' ? 'Nekretnine, gradnja' : 'Real estate, construction', headline: language === 'sr' ? 'Sajt za nekretnine i apartmane — projekti i kontakt' : 'Site for real estate and apartments — projects and contact', text: language === 'sr' ? 'Moderan izgled i jasna ponuda. Klijent zadovoljan.' : 'Modern look and clear offer. Client satisfied.' },
                  { id: 'loki', logo: '/images/lokilo.png', siteImg: '/images/loki.png', title: 'Loki N-4', tag: language === 'sr' ? 'Betonski elementi' : 'Concrete elements', headline: language === 'sr' ? 'Prepoznatljiv brend na webu — identitet i poruka' : 'Recognizable brand online — identity and message', text: language === 'sr' ? 'Jedinstven vizuelni identitet i jasna komunikacija.' : 'Unique visual identity and clear communication.' },
                  { id: 'bn', logo: '/images/logobn.png', siteImg: '/images/bn.png', title: 'BN Autofolije', tag: language === 'sr' ? 'Auto folije i detailing' : 'Car wraps & detailing', headline: language === 'sr' ? 'Web sajt za auto folije — više upita i preglednosti' : 'Website for car wraps — more inquiries and visibility', text: language === 'sr' ? 'Profesionalna prezentacija i galerija radova. Više upita.' : 'Professional presentation and portfolio. More inquiries.' },
                  { id: 'lako', logo: '/images/logolak.png', siteImg: '/images/lako.png', title: 'Lako Sistem', tag: language === 'sr' ? 'Papirna galanterija' : 'Paper goods', headline: language === 'sr' ? 'Moderan prezentacioni web sajt - preglednost i autoritet. Zadovoljstvo i rezultati.' : 'Modern presentation website — clarity and authority. Satisfaction and results.', text: language === 'sr' ? 'Sajt prilagođen potrebama klijenta. Zadovoljstvo i rezultati.' : 'Site tailored to client needs. Satisfaction and results.' },
                  { id: 'panic', logo: '/images/logoin.png', siteImg: '/images/panic.png', title: 'IN-STAN', tag: language === 'sr' ? 'Stolarija' : 'Joinery', headline: language === 'sr' ? 'Moderan funkcionalan sajt za stolariju sa katalogom' : 'Modern functional website for joinery with catalog', text: language === 'sr' ? 'Profesionalan sajt koji predstavlja brend na internetu.' : 'Professional site that represents the brand online.' },
                ].map((card) => (
                  <div key={card.id} className="rounded-2xl border border-gray-700/60 bg-gray-900/60 backdrop-blur-sm overflow-hidden shadow-xl">
                    <div className="p-5 md:p-6">
                      <div className="flex gap-0.5 mb-3">
                        {[1,2,3,4,5].map((i) => (
                          <Star key={i} className="w-4 h-4 text-violet-400 fill-violet-400" />
                        ))}
                      </div>
                      <h3 className="text-violet-300 font-bold text-sm md:text-base mb-3 leading-snug">
                        {card.headline}
                      </h3>
                      <div className="aspect-video rounded-lg bg-gray-800 border border-gray-700 mb-4 overflow-hidden">
                        <img src={card.siteImg} alt={card.title} className="w-full h-full object-cover" />
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed mb-4">
                        {card.text}
                      </p>
                      <div className="flex items-center gap-3">
                        <div className={`w-24 h-14 md:w-28 md:h-16 rounded-lg border flex-shrink-0 overflow-hidden flex items-center justify-center p-1.5 ${['bora', 'lako', 'panic'].includes(card.id) ? 'bg-white border-gray-300' : 'bg-gray-800 border-gray-700'}`}>
                          <img src={card.logo} alt="" className="max-w-full max-h-full w-auto h-auto object-contain" />
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">{card.title}</p>
                          <p className="text-gray-500 text-xs">{card.tag}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Social proof / 50+ projekata – 1:1 layout kao referenca */}
        <section id="success-metrics" className="py-16 md:py-24 relative overflow-hidden z-10">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              {/* Slika ljudi + tekst */}
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

              {/* Naslovi */}
              <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight mb-2">
                {language === 'sr' ? '50+ uspešnih projekata. Priče uspeha.' : '50+ successful projects. Success stories.'}
              </h2>
              <h3 className="text-xl md:text-2xl font-bold text-violet-400 mb-6">
                {language === 'sr' ? 'Jedan dokazan pristup.' : 'One proven approach.'}
              </h3>

              {/* Opis */}
              <p className="text-gray-400 text-base md:text-lg max-w-4xl mx-auto mb-10">
                {language === 'sr'
                  ? 'Od korporativnih sajtova do e-commerce i landing stranica — znamo šta je potrebno da vaš biznis zablesti na webu. Bez nagađanja, bez zastoja.'
                  : 'From corporate sites to e-commerce and landing pages — we know what it takes to make your business shine online. No guesswork, no plateaus.'}
              </p>

              {/* Centralna slika – donji deo prekriva stats ploča */}
              <div className="rounded-xl overflow-hidden border border-gray-700/60 shadow-2xl max-w-4xl mx-auto">
                <img src="/images/filmska%207.jpg" alt={language === 'sr' ? 'Rad na projektu — AiSajt tim' : 'Project work — AiSajt team'} className="w-full h-auto object-cover" />
              </div>

              {/* Statistike – preklapa dno slike, vizuelno spojeno */}
              <div className="relative z-10 -mt-14 md:-mt-16 rounded-2xl bg-gray-900/95 border border-gray-700/60 backdrop-blur-sm px-6 py-6 md:px-8 md:py-7 shadow-xl w-full">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                  <div className="text-center md:text-left">
                    <p className="text-2xl md:text-3xl font-bold text-white">50+</p>
                    <p className="text-gray-400 text-sm mt-0.5">{language === 'sr' ? 'realizovanih projekata' : 'projects delivered'}</p>
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-2xl md:text-3xl font-bold text-white">50+</p>
                    <p className="text-gray-400 text-sm mt-0.5">{language === 'sr' ? 'zadovoljnih klijenata' : 'satisfied clients'}</p>
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-2xl md:text-3xl font-bold text-white">100%</p>
                    <p className="text-gray-400 text-sm mt-0.5">{language === 'sr' ? 'posvećenost rezultatu' : 'commitment to results'}</p>
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-2xl md:text-3xl font-bold text-white">1</p>
                    <p className="text-gray-400 text-sm mt-0.5">{language === 'sr' ? 'dokazan sistem' : 'proven system'}</p>
                  </div>
                </div>
              </div>

              {/* Ikona na dnu */}
              <div className="mt-10 flex justify-center">
                <div className="w-10 h-10 flex items-center justify-center text-violet-500">
                  <div className="w-6 h-6 border-2 border-violet-500 rotate-45" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Meet the Team – 1:1 kopija, 3 člana */}
        <section id="meet-the-team" className="py-16 md:py-24 relative overflow-hidden z-10 bg-black">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">
                {language === 'sr' ? 'Upoznajte tim ' : 'Meet the Team '}
                <span className="text-violet-400">{language === 'sr' ? 'iza AiSajt-a.' : 'Behind AiSajt.'}</span>
              </h2>
              <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto mb-4">
                {language === 'sr'
                  ? 'Upoznajte ljude koji su pomogli desetinama kompanija da dobiju moderan sajt i jaču online prisutnost.'
                  : "Get to know the specialists who've helped dozens of companies get a modern site and stronger online presence."}
              </p>
              <div className="w-3 h-3 bg-violet-500 rounded-sm mx-auto mb-12" />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto">
                {[
                  { name: 'Bogdan Gradjanin', role: language === 'sr' ? 'Tehnički direktor' : 'Technical Director' },
                  { name: 'Strahinja Zekanovic', role: language === 'sr' ? 'Menadžer & dizajn' : 'Manager & Design' },
                  { name: 'Marko Devedzic', role: language === 'sr' ? 'SEO specijalista' : 'SEO Specialist' },
                ].map((member) => (
                  <div key={member.name} className="rounded-2xl border border-gray-600/60 bg-gray-900/80 backdrop-blur-sm overflow-hidden shadow-xl">
                    <div className="aspect-square bg-gray-700/80 flex items-center justify-center text-4xl font-bold text-gray-500">
                      {member.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div className="p-5">
                      <p className="text-violet-400 font-bold text-lg">{member.name}</p>
                      <p className="text-gray-400 text-sm mt-0.5">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 flex flex-col items-center gap-4">
                <p className="text-gray-500 text-sm flex items-center gap-2">
                  <span>{language === 'sr' ? 'Odlično' : 'Excellent'}</span>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 text-green-500 fill-green-500" />
                  ))}
                  <span className="text-gray-500">{language === 'sr' ? '50+ uspešnih projekata' : '50+ successful projects'}</span>
                </p>
                <button
                  type="button"
                  onClick={() => document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' })}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-violet-500 hover:bg-violet-600 text-white font-bold uppercase text-sm tracking-wide rounded-lg transition-colors shadow-[0_4px_14px_0_rgba(0,0,0,0.1),0_0_48px_rgba(139,92,246,0.65)]"
                >
                  {language === 'sr' ? 'Zakazi poziv' : 'Book a call'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Završna CTA sekcija – 1:1 dizajn, violetno svetlo */}
        <section id="cta-final" className="py-16 md:py-24 bg-black relative z-10 -mt-1">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="relative rounded-3xl bg-gray-900/95 border border-gray-700/50 overflow-hidden">
                {/* Svetlo u našim bojama – top-left i top-right */}
                <div className="absolute -top-40 -left-40 w-[500px] h-[400px] bg-violet-600/25 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute -top-32 -right-32 w-[400px] h-[350px] bg-violet-500/15 rounded-full blur-[100px] pointer-events-none" />

                <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 p-8 md:p-10 lg:p-12">
                  {/* Leva kolona – tekst */}
                  <div className="flex flex-col justify-center">
                    <div className="flex flex-col items-start gap-3 mb-6">
                      <p className="text-white text-sm md:text-base">
                        {language === 'sr' ? 'Pridružite se 50+ uspešnih preduzeća' : 'Join 50+ successful businesses'}
                      </p>
                      <img src="/images/ljudi.webp" alt="" className="h-8 w-auto rounded-full object-cover" />
                    </div>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
                      <span className="text-violet-400">
                        {language === 'sr' ? 'Stigli ste do ovde — sada ' : "You've made it this far — now "}
                      </span>
                      <span className="text-white">
                        {language === 'sr' ? 'skalirajmo vaš biznis.' : "let's scale your business."}
                      </span>
                    </h2>
                    <p className="text-gray-400 text-base mb-6">
                      {language === 'sr' ? (
                        <>Potrebno je 30 sekundi da se <strong className="text-violet-300">prijavite</strong> i proverimo da li AiSajt može da vam pomogne da brže rastete — sa jasnoćom i rezultatima.</>
                      ) : (
                        <>Take 30 seconds to <strong className="text-violet-300">apply now</strong> and let's see if AiSajt is the right fit to help you scale faster—with clarity and results.</>
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
                          <CheckCircle className="w-5 h-5 text-violet-400 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <p className="text-gray-400 text-sm">
                      {language === 'sr' ? (
                        <>Ako smo pravi izbor, kontaktiraćemo vas za saradnju sa nama. Ako nismo, nema problema. <strong className="text-white">U svakom slučaju, odlazite sa konkretnom vrednošću.</strong></>
                      ) : (
                        <>If we think you're a fit, we'll invite you to work with us. If not, no worries. <strong className="text-white">Either way, you'll walk away with value.</strong></>
                      )}
                    </p>
                  </div>

                  {/* Desna kolona – samo glavna slika, centrirana */}
                  <div className="relative flex items-center justify-center w-full max-w-md">
                    <div className="rounded-2xl overflow-hidden border border-gray-700/60 shadow-2xl bg-gray-800/50 w-full max-h-[280px] md:max-h-[340px] flex items-center justify-center">
                      <img src="/images/filmska.jpg" alt="" className="w-full h-full object-contain" />
                    </div>
                  </div>
                </div>
                {/* Dugme centrirano ispod sadržaja */}
                <div className="relative flex justify-center pb-8 md:pb-10">
                  <button
                    type="button"
                    onClick={() => document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' })}
                    className="inline-flex items-center gap-2 px-10 py-4 bg-white hover:bg-gray-100 text-gray-900 font-bold uppercase text-sm tracking-wide rounded-xl transition-colors shadow-[0_4px_14px_0_rgba(0,0,0,0.08),0_0_48px_rgba(255,255,255,0.55)]"
                  >
                    {language === 'sr' ? 'Zakazi poziv' : 'Book a call'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mini footer – disclaimer i linkovi */}
        <footer className="bg-black border-t border-gray-800 py-8 md:py-10 relative z-10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex justify-center gap-2 mb-5">
                <div className="w-1.5 h-1.5 bg-violet-500 rounded-sm" />
                <div className="flex gap-0.5">
                  <div className="w-1.5 h-1.5 bg-violet-500 rounded-sm" />
                  <div className="w-1.5 h-1.5 bg-violet-500 rounded-sm" />
                  <div className="w-1.5 h-1.5 bg-violet-500 rounded-sm" />
                  <div className="w-1.5 h-1.5 bg-violet-500 rounded-sm" />
                </div>
              </div>
              <p className="text-gray-500 text-xs leading-relaxed mb-6">
                {language === 'sr' ? (
                  'Rezultati zavise od vrste projekta i saradnje. Prikazani projekti su stvarni radovi naših klijenata. Svaki biznis je drugačiji — uspeh na webu zavisi od vaših ciljeva, potreba i angažmana. Nismo povezani ni sa jednom trećom stranom navedenom na sajtu.'
                ) : (
                  'Results depend on project type and collaboration. Projects shown are real work for our clients. Every business is different — online success depends on your goals, needs, and commitment. We are not affiliated with any third parties mentioned on this site.'
                )}
              </p>
              <p className="text-gray-500 text-xs">
                © {new Date().getFullYear()} AiSajt
                <span className="mx-1.5">•</span>
                <a href="/privacy" className="hover:text-violet-400 transition-colors">Privacy</a>
                <span className="mx-1.5">•</span>
                <a href="/terms" className="hover:text-violet-400 transition-colors">{language === 'sr' ? 'Uslovi' : 'Terms'}</a>
                <span className="mx-1.5">•</span>
                <a href="/terms#disclaimer" className="hover:text-violet-400 transition-colors">{language === 'sr' ? 'Izjava' : 'Disclaimer'}</a>
              </p>
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
}
