import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Mail, Phone, MapPin, CheckCircle, Send, PartyPopper, Sparkles } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { trackFormInteraction, trackFormSubmitAttempt, trackFormError, trackContactInfoClick } from '../../utils/analytics';
import { submitContactForm } from '../../utils/hubspot';
import { Navbar } from '../layout/Navbar';
import { Footer } from '../layout/Footer';
import { useLanguage } from '../../hooks/useLanguage';
import { SEOHelmet } from '../seo/SEOHelmet';

interface FormData {
  name: string;
  email: string;
  phone: string;
}

export function ContactPage() {
  const { language } = useLanguage();
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Track when user starts filling the form (only once per field)
    if (value && !formData[name as keyof FormData]) {
      trackFormInteraction(name, 'contact_page', language);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Track form submission attempt
    trackFormSubmitAttempt('contact_page', language);

    try {
      // Submit to HubSpot
      const result = await submitContactForm({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      });

      if (result.success) {
        // Redirect na Thank You page - tamo će se triggerovati generate_lead event
        navigate(`/thank-you?name=${encodeURIComponent(formData.name)}&source=contact_page&lang=${language}`);
        setFormData({ name: '', email: '', phone: '' });
      } else {
        throw new Error(result.message || 'HubSpot submission failed');
      }
    } catch (error) {
      // Track form error
      trackFormError('contact_page', language, String(error));

      toast.error(
        language === 'sr' 
          ? 'Došlo je do greške. Molimo pokušajte ponovo.' 
          : 'An error occurred. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <SEOHelmet
        title={language === 'sr' ? 'Kontakt - Besplatna Konsultacija | AiSajt' : 'Contact - Free Consultation | AiSajt'}
        description={language === 'sr' 
          ? 'Kontaktirajte nas za besplatnu konsultaciju o izradi vašeg web sajta. Profesionalna izrada sajtova, SEO optimizacija i digitalni marketing.'
          : 'Contact us for a free consultation about your website development. Professional website creation, SEO optimization, and digital marketing.'
        }
        keywords={language === 'sr'
          ? 'kontakt, besplatna konsultacija, izrada sajta kontakt, web dizajn kontakt, SEO konsultacija'
          : 'contact, free consultation, website development contact, web design contact, SEO consultation'
        }
        canonicalUrl="https://aisajt.com/contact"
      />
      <Toaster position="top-center" />
      
      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-white/98 backdrop-blur-md flex items-center justify-center z-50">
          <div className="text-center p-8 max-w-2xl mx-auto">
            <div className="flex justify-center space-x-6 mb-8">
              <PartyPopper className="w-12 h-12 text-violet-500 animate-bounce" />
              <Sparkles className="w-12 h-12 text-indigo-500 animate-bounce" style={{ animationDelay: '0.1s' }} />
              <PartyPopper className="w-12 h-12 text-pink-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {language === 'sr' ? 'Hvala Vam!' : 'Thank You!'}
            </h3>
            <p className="text-lg text-gray-600 mb-8">
              {language === 'sr' 
                ? 'Vaša poruka je uspešno poslata. Javićemo vam se uskoro!'
                : 'Your message has been sent successfully. We will get back to you soon!'
              }
            </p>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          </div>
        </div>
      )}

      <Navbar />

      {/* Hero Section with Contact Form */}
      <section className="pt-24 pb-12 md:pt-40 md:pb-32 relative overflow-hidden min-h-screen">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-violet-50/30 to-white"></div>
        
        {/* Animated Background Circles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 -left-20 w-80 h-80 bg-gradient-to-br from-violet-400 to-indigo-500 rounded-full opacity-10 blur-3xl animate-blob"></div>
          <div className="absolute bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-pink-400 to-violet-500 rounded-full opacity-10 blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-indigo-300 to-pink-300 rounded-full opacity-8 blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        {/* Floating Animated Logos - Varied sizes and opacity for depth */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Large - Far back */}
          <img 
            src="/images/providna 1.png" 
            alt="" 
            className="hidden md:block absolute top-20 left-[6%] w-24 h-24 md:w-36 md:h-36 object-contain opacity-8 animate-float"
            style={{ animationDelay: '0s', animationDuration: '8s' }}
          />
          {/* Medium - Mid depth */}
          <img 
            src="/images/providna 1.png" 
            alt="" 
            className="hidden md:block absolute top-28 right-[10%] w-16 h-16 md:w-24 md:h-24 object-contain opacity-15 animate-float"
            style={{ animationDelay: '1.2s', animationDuration: '7s' }}
          />
          {/* Small - Close */}
          <img 
            src="/images/providna 1.png" 
            alt="" 
            className="hidden md:block absolute top-40 left-[15%] w-10 h-10 md:w-14 md:h-14 object-contain opacity-25 animate-float"
            style={{ animationDelay: '2.5s', animationDuration: '6s' }}
          />
          {/* Large - Middle left */}
          <img 
            src="/images/providna 1.png" 
            alt="" 
            className="absolute top-[45%] left-[4%] w-20 h-20 md:w-32 md:h-32 object-contain opacity-10 animate-float"
            style={{ animationDelay: '3s', animationDuration: '9s' }}
          />
          {/* Small - Middle */}
          <img 
            src="/images/providna 1.png" 
            alt="" 
            className="hidden md:block absolute top-[35%] left-[25%] w-8 h-8 md:w-12 md:h-12 object-contain opacity-20 animate-float"
            style={{ animationDelay: '0.8s', animationDuration: '5.5s' }}
          />
          {/* Medium - Bottom left */}
          <img 
            src="/images/providna 1.png" 
            alt="" 
            className="absolute bottom-[35%] left-[8%] w-14 h-14 md:w-20 md:h-20 object-contain opacity-12 animate-float"
            style={{ animationDelay: '1.5s', animationDuration: '7.5s' }}
          />
          {/* Large - Bottom right */}
          <img 
            src="/images/providna 1.png" 
            alt="" 
            className="absolute bottom-[28%] right-[6%] w-28 h-28 md:w-40 md:h-40 object-contain opacity-8 animate-float"
            style={{ animationDelay: '2s', animationDuration: '8.5s' }}
          />
          {/* Small - Top center */}
          <img 
            src="/images/providna 1.png" 
            alt="" 
            className="hidden md:block absolute top-[18%] left-[42%] w-12 h-12 object-contain opacity-18 animate-float"
            style={{ animationDelay: '3.5s', animationDuration: '6.5s' }}
          />
          {/* Medium - Bottom center */}
          <img 
            src="/images/providna 1.png" 
            alt="" 
            className="absolute bottom-[20%] left-[35%] w-16 h-16 object-contain opacity-10 animate-float"
            style={{ animationDelay: '4s', animationDuration: '7s' }}
          />
          {/* Small - Far right top */}
          <img 
            src="/images/providna 1.png" 
            alt="" 
            className="absolute top-[52%] right-[3%] w-10 h-10 object-contain opacity-22 animate-float"
            style={{ animationDelay: '2.2s', animationDuration: '5s' }}
          />
          {/* Medium - Right middle */}
          <img 
            src="/images/providna 1.png" 
            alt="" 
            className="absolute top-[70%] right-[12%] w-18 h-18 md:w-24 md:h-24 object-contain opacity-12 animate-float"
            style={{ animationDelay: '1s', animationDuration: '6.8s' }}
          />
          {/* Large - Top far left */}
          <img 
            src="/images/providna 1.png" 
            alt="" 
            className="hidden md:block absolute top-[12%] left-[2%] w-32 h-32 md:w-44 md:h-44 object-contain opacity-6 animate-float"
            style={{ animationDelay: '0.5s', animationDuration: '9.5s' }}
          />
          {/* Small - Bottom far right */}
          <img 
            src="/images/providna 1.png" 
            alt="" 
            className="absolute bottom-[12%] right-[2%] w-8 h-8 md:w-12 md:h-12 object-contain opacity-25 animate-float"
            style={{ animationDelay: '3.8s', animationDuration: '5.8s' }}
          />
        </div>

        {/* Giant Background Letter */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 pointer-events-none">
          <h1 className="text-[400px] md:text-[600px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-br from-violet-600 via-indigo-500 to-pink-500 select-none opacity-[0.04]">
            @
          </h1>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-6 md:gap-12 lg:gap-20 items-start">
              
              {/* Left - Hero Content */}
              <div className="space-y-4 md:space-y-6 lg:space-y-8">
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-400 uppercase tracking-widest mb-2 md:mb-4">
                    {language === 'sr' ? 'Stupite u kontakt' : 'Get in Touch'}
                  </p>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight mb-3 md:mb-6">
                    {language === 'sr' ? 'Besplatne Konsultacije' : 'Free Consultations'}
                    <br />
                    <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">{language === 'sr' ? 'za Vaš Website' : 'for Your Website'}</span>
                  </h1>
                  <p className="text-sm md:text-base lg:text-lg text-gray-600 leading-relaxed max-w-lg hidden md:block">
                    {language === 'sr' 
                      ? 'Spremni smo da saslušamo vašu ideju i pretvorimo je u moderan, funkcionalan website koji privlači klijente.'
                      : 'We are ready to hear your idea and turn it into a modern, functional website that attracts clients.'
                    }
                  </p>
                  <p className="text-sm text-gray-500 mt-3 hidden md:block">
                    {language === 'sr' ? (
                      <>
                        Saznajte više o našim uslugama na{' '}
                        <a href="/" className="text-violet-600 hover:text-violet-700 font-semibold underline">
                          početnoj stranici
                        </a>
                        {' '}ili pogledajte{' '}
                        <Link to="/seo" className="text-violet-600 hover:text-violet-700 font-semibold underline">
                          SEO optimizaciju
                        </Link>.
                      </>
                    ) : (
                      <>
                        Learn more about our services on our{' '}
                        <a href="/" className="text-violet-600 hover:text-violet-700 font-semibold underline">
                          homepage
                        </a>
                        {' '}or check out{' '}
                        <Link to="/seo" className="text-violet-600 hover:text-violet-700 font-semibold underline">
                          SEO optimization
                        </Link>.
                      </>
                    )}
                  </p>
                </div>

                {/* Contact Info - Hidden on mobile */}
                <div className="hidden md:flex md:flex-col space-y-4 lg:space-y-6 pt-6 lg:pt-8 border-t border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-violet-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">{language === 'sr' ? 'Lokacija' : 'Location'}</p>
                      <p className="text-lg text-gray-900 font-medium">Beograd, Srbija</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Email</p>
                      <a 
                        href="mailto:office@aisajt.com"
                        onClick={() => trackContactInfoClick('email', 'office@aisajt.com', language)}
                        className="text-lg text-gray-900 font-medium hover:text-violet-600 transition-colors"
                      >
                        office@aisajt.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-pink-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">{language === 'sr' ? 'Telefon' : 'Phone'}</p>
                      <a 
                        href="tel:+381613091583"
                        onClick={() => trackContactInfoClick('phone', '+381613091583', language)}
                        className="text-lg text-gray-900 font-medium hover:text-violet-600 transition-colors"
                      >
                        +381 61 309 1583
                      </a>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right - Form */}
              <div className="relative">
                {/* Decorative elements - hidden on mobile */}
                <div className="hidden md:block absolute -top-6 -right-6 w-24 h-24 border-2 border-violet-200 rounded-2xl opacity-50"></div>
                <div className="hidden md:block absolute -bottom-6 -left-6 w-32 h-32 border-2 border-pink-200 rounded-2xl opacity-50"></div>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-xl md:shadow-2xl shadow-violet-500/10 p-5 md:p-8 lg:p-10 border border-gray-100 relative">
                  <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-1 md:mb-2">
                    {language === 'sr' ? 'Pošaljite nam poruku' : 'Send us a message'}
                  </h3>
                  <p className="text-xs md:text-sm lg:text-base text-gray-500 mb-4 md:mb-6 lg:mb-8">
                    {language === 'sr' ? 'Popunite formular ispod' : 'Fill out the form below'}
                  </p>
                  
                  <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-semibold text-violet-600 uppercase tracking-widest mb-2 md:mb-3">
                        {language === 'sr' ? 'Ime' : 'Name'} *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                        required
                        placeholder={language === 'sr' ? 'Vaše ime i prezime' : 'Your full name'}
                        className={`w-full px-0 py-3 md:py-4 bg-transparent border-0 border-b-2 text-gray-900 text-base md:text-lg placeholder-gray-400 focus:outline-none transition-colors duration-300 ${
                          focusedField === 'name' ? 'border-violet-500' : 'border-gray-300'
                        }`}
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-semibold text-indigo-600 uppercase tracking-widest mb-2 md:mb-3">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        required
                        placeholder={language === 'sr' ? 'vas@email.com' : 'your@email.com'}
                        className={`w-full px-0 py-3 md:py-4 bg-transparent border-0 border-b-2 text-gray-900 text-base md:text-lg placeholder-gray-400 focus:outline-none transition-colors duration-300 ${
                          focusedField === 'email' ? 'border-indigo-500' : 'border-gray-300'
                        }`}
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-semibold text-pink-600 uppercase tracking-widest mb-2 md:mb-3">
                        {language === 'sr' ? 'Telefon' : 'Phone'} *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('phone')}
                        onBlur={() => setFocusedField(null)}
                        required
                        placeholder="+381 XX XXX XXXX"
                        className={`w-full px-0 py-3 md:py-4 bg-transparent border-0 border-b-2 text-gray-900 text-base md:text-lg placeholder-gray-400 focus:outline-none transition-colors duration-300 ${
                          focusedField === 'phone' ? 'border-pink-500' : 'border-gray-300'
                        }`}
                      />
                    </div>

                    {/* Submit */}
                    <div className="pt-2 md:pt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full group px-6 md:px-8 py-3 md:py-4 bg-gray-900 text-white font-semibold rounded-full hover:bg-white hover:text-gray-900 border-2 border-gray-900 transition-all duration-300 flex items-center justify-center gap-2 md:gap-3 text-base md:text-lg ${
                          isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                        }`}
                      >
                        <Send className={`w-4 h-4 md:w-5 md:h-5 ${isSubmitting ? 'animate-pulse' : 'group-hover:rotate-12 transition-transform'}`} />
                        {isSubmitting 
                          ? (language === 'sr' ? 'Šaljem...' : 'Sending...') 
                          : (language === 'sr' ? 'Pošalji' : 'Send')
                        }
                        <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </form>

                  {/* Trust note */}
                  <p className="text-xs md:text-sm text-gray-400 text-center mt-4 md:mt-6">
                    {language === 'sr' 
                      ? '✨ Odgovaramo u roku od 24h. Bez obaveza.'
                      : '✨ We respond within 24h. No obligations.'
                    }
                  </p>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

