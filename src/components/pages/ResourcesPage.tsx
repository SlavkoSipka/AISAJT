import { useNavigate, Link } from 'react-router-dom';
import { Search, BookOpen, Calculator, HelpCircle, Layout, Download, ArrowRight, CheckCircle, Sparkles, Target, FileText } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { Navbar } from '../layout/Navbar';
import { Footer } from '../layout/Footer';
import { SEOHelmet } from '../seo/SEOHelmet';

interface ResourceCardProps {
  icon: any;
  title: string;
  description: string;
  buttonText: string;
  gradient: string;
  delay: number;
  onClick: () => void;
}

function ResourceCard({ icon: Icon, title, description, buttonText, gradient, delay, onClick }: ResourceCardProps) {
  return (
    <div 
      className="group relative bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-violet-400 transition-all duration-500 hover:shadow-2xl hover:shadow-violet-500/20 hover:-translate-y-2 animate-fade-in-up"
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Background Gradient on Hover */}
      <div className={`absolute inset-0 ${gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`} />
      
      <div className="relative">
        {/* Icon */}
        <div className={`inline-flex items-center justify-center w-14 h-14 ${gradient} rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-7 h-7 text-white" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 mb-6 leading-relaxed">
          {description}
        </p>

        {/* Button */}
        <button
          onClick={onClick}
          className="group/btn w-full px-6 py-3 border-2 border-gray-900 text-gray-900 font-semibold rounded-full hover:bg-gray-900 hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
        >
          {buttonText}
          <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}

export function ResourcesPage() {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const t = {
    sr: {
      title: 'Besplatni Resursi',
      subtitle: 'Sve što vam treba da donesete pametnu odluku o vašem web sajtu',
      hero: 'Alati i Vodiči za Uspešan Web',
      menu: {
        services: 'Usluge',
        portfolio: 'Portfolio',
        about: 'O Nama',
        contact: 'Kontakt',
        home: 'Početna'
      },
      resources: {
        quiz: {
          title: 'Kviz: Koji Sajt Vam Treba?',
          desc: 'Odgovorite na 4 brza pitanja i saznajte koji tip sajta najbolje odgovara vašem biznisu.',
          button: 'Započni Kviz'
        },
        audit: {
          title: 'Besplatna Analiza Sajta',
          desc: 'Saznajte šta vam sajt košta u izgubljenim klijentima. SEO analiza, brzina, dizajn.',
          button: 'Analiziraj Sajt'
        },
        guide: {
          title: 'Vodič: Od Ideje do Sajta',
          desc: '7 koraka do vašeg sajta. Tipovi sajtova, cene, priprema, izbor agencije.',
          button: 'Preuzmi PDF'
        },
        checklist: {
          title: '27 Stvari koje Sajt Mora Imati',
          desc: 'Kompletan checklist za proveru da li vaš sajt ima SVE što treba.',
          button: 'Preuzmi Checklist'
        }
      }
    },
    en: {
      title: 'Free Resources',
      subtitle: 'Everything you need to make a smart decision about your website',
      hero: 'Tools & Guides for Successful Web',
      menu: {
        services: 'Services',
        portfolio: 'Portfolio',
        about: 'About',
        contact: 'Contact',
        home: 'Home'
      },
      resources: {
        quiz: {
          title: 'Quiz: Which Site Do You Need?',
          desc: 'Answer 4 quick questions and find out which type of site best suits your business.',
          button: 'Start Quiz'
        },
        audit: {
          title: 'Free Website Audit',
          desc: 'Find out what your site costs in lost clients. SEO analysis, speed, design.',
          button: 'Analyze Site'
        },
        guide: {
          title: 'Guide: From Idea to Website',
          desc: '7 steps to your website. Site types, prices, preparation, agency selection.',
          button: 'Download PDF'
        },
        checklist: {
          title: '27 Things Your Site Must Have',
          desc: 'Complete checklist to verify your site has EVERYTHING it needs.',
          button: 'Download Checklist'
        }
      }
    }
  };

  const content = t[language];

  return (
    <div className="min-h-screen bg-white">
      <SEOHelmet
        title={language === 'sr' ? 'Resursi za Web Development | Vodič, Kviz, Audit | AISajt' : 'Web Development Resources | Guide, Quiz, Audit | AISajt'}
        description={language === 'sr' ? 'Besplatni resursi za web development: Vodič za izradu sajta, kviz za procenu potreba, besplatan audit sajta. Sve što vam treba za uspešan web projekat.' : 'Free web development resources: Website creation guide, needs assessment quiz, free website audit. Everything you need for a successful web project.'}
        keywords="web resursi, vodič za sajt, audit sajta, web kviz, besplatni resursi, aisajt resursi"
        canonicalUrl="https://aisajt.com/resources"
      />
      
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-violet-50/30 to-white" />
        
        {/* Animated Background Circles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 -left-20 w-80 h-80 bg-gradient-to-br from-violet-400 to-indigo-500 rounded-full opacity-10 blur-3xl animate-blob" />
          <div className="absolute bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-pink-400 to-violet-500 rounded-full opacity-10 blur-3xl animate-blob animation-delay-2000" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight animate-fade-in-up animation-delay-200">
              {content.hero}
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed animate-fade-in-up animation-delay-400 mb-4">
              {content.subtitle}
            </p>
            
            {/* Link to HomePage */}
            <p className="text-base text-gray-500 animate-fade-in-up animation-delay-500">
              {language === 'sr' ? (
                <>
                  Novo na sajtu? Pogledajte našu{' '}
                  <Link to="/" className="text-violet-600 hover:text-violet-700 font-semibold underline">
                    početnu stranicu
                  </Link>
                  {' '}i saznajte više o uslugama izrade web sajtova ili pogledajte našu{' '}
                  <Link to="/seo" className="text-violet-600 hover:text-violet-700 font-semibold underline">
                    SEO optimizaciju
                  </Link>.
                </>
              ) : (
                <>
                  New here? Check out our{' '}
                  <Link to="/" className="text-violet-600 hover:text-violet-700 font-semibold underline">
                    homepage
                  </Link>
                  {' '}to learn more about our website development services or check out our{' '}
                  <Link to="/seo" className="text-violet-600 hover:text-violet-700 font-semibold underline">
                    SEO optimization
                  </Link>.
                </>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">

            {/* Resource 1: Audit */}
            <ResourceCard
              icon={Search}
              title={content.resources.audit.title}
              description={content.resources.audit.desc}
              buttonText={content.resources.audit.button}
              gradient="bg-gradient-to-br from-violet-500 to-indigo-600"
              delay={0.1}
              onClick={() => navigate('/resources/audit')}
            />

            {/* Resource 2: Guide */}
            <ResourceCard
              icon={BookOpen}
              title={content.resources.guide.title}
              description={content.resources.guide.desc}
              buttonText={content.resources.guide.button}
              gradient="bg-gradient-to-br from-indigo-500 to-violet-600"
              delay={0.2}
              onClick={() => navigate('/resources/guide')}
            />

            {/* Resource 3: Checklist */}
            <ResourceCard
              icon={CheckCircle}
              title={content.resources.checklist.title}
              description={content.resources.checklist.desc}
              buttonText={content.resources.checklist.button}
              gradient="bg-gradient-to-br from-violet-600 to-pink-500"
              delay={0.3}
              onClick={() => navigate('/resources/checklist')}
            />

          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-20 animate-fade-in-up animation-delay-800">
            <div className="max-w-2xl mx-auto bg-gradient-to-r from-violet-50 via-indigo-50 to-pink-50 rounded-3xl p-8 border border-violet-100">
              <Sparkles className="w-12 h-12 text-violet-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {language === 'sr' ? 'Spremni za razgovor?' : 'Ready to talk?'}
              </h3>
              <p className="text-gray-600 mb-6">
                {language === 'sr' 
                  ? 'Zakažite besplatnu konsultaciju i dobijte personalizovane savete.'
                  : 'Schedule a free consultation and get personalized advice.'
                }
              </p>
              <button
                onClick={() => navigate('/contact')}
                className="group px-8 py-4 bg-gray-900 text-white rounded-full font-semibold hover:scale-105 transition-all duration-300 inline-flex items-center gap-2"
              >
                {language === 'sr' ? 'Kontaktirajte Nas' : 'Contact Us'}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

