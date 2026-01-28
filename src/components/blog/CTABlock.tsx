import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

interface CTABlockProps {
  type: 'soft' | 'hard';
  category?: 'seo' | 'izrada-sajtova' | 'web-dizajn' | 'web-shop' | 'case-studies';
}

export function CTABlock({ type, category }: CTABlockProps) {
  const { language } = useLanguage();

  // Soft CTA - Leads to HOME or #kontakt
  if (type === 'soft') {
    return (
      <div className="my-8 md:my-12 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 border border-gray-200">
        <div className="flex items-start gap-3 md:gap-4">
          <div className="flex-shrink-0">
            <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-gray-900" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
              {language === 'sr' 
                ? '💡 Hajde da razgovaramo o tvojoj ideji' 
                : "💡 Let's talk about your idea"}
            </h3>
            <p className="text-sm md:text-base text-gray-700 mb-3 md:mb-4">
              {language === 'sr'
                ? 'Sviđa ti se šta čitaš? Zakažimo besplatne konsultacije i vidimo kako možemo da pomognemo tvom biznisu da raste.'
                : 'Like what you read? Let\'s schedule a free consultation and see how we can help your business grow.'}
            </p>
            <Link
              to="/#kontakt"
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 md:px-6 md:py-3 rounded-full font-semibold hover:bg-white hover:text-gray-900 border-2 border-gray-900 transition-all duration-300 text-sm md:text-base"
            >
              {language === 'sr' ? 'Zakaži konsultacije' : 'Schedule consultation'}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Hard CTA - Contextual to category (leads to pillar pages)
  const ctaConfig = getCTAConfig(category, language);

  return (
    <div className={`my-8 md:my-12 bg-gradient-to-br ${ctaConfig.gradient} rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 border-2 ${ctaConfig.border}`}>
      <div className="flex items-start gap-3 md:gap-4">
        <div className="flex-shrink-0 text-2xl md:text-4xl">
          {ctaConfig.icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2">
            {ctaConfig.title}
          </h3>
          <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-3 md:mb-4">
            {ctaConfig.description}
          </p>
          <Link
            to={ctaConfig.link}
            className={`inline-flex items-center gap-2 ${ctaConfig.buttonClass} px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-full font-bold transition-all duration-300 text-white hover:scale-105 transform shadow-lg text-sm md:text-base`}
          >
            {ctaConfig.buttonText}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function getCTAConfig(category: string | undefined, language: 'sr' | 'en') {
  switch (category) {
    case 'seo':
      return {
        icon: '🚀',
        title: language === 'sr' ? 'Spreman za SEO Rezultate?' : 'Ready for SEO Results?',
        description: language === 'sr' 
          ? 'Naš tim SEO stručnjaka će optimizovati tvoj sajt i dovesti ga na prvu stranicu Google-a. Proveren proces, merljivi rezultati.'
          : 'Our SEO experts team will optimize your site and bring it to Google\'s first page. Proven process, measurable results.',
        buttonText: language === 'sr' ? 'Pogledaj SEO Cene' : 'View SEO Pricing',
        link: '/seo-optimizacija-cena',
        gradient: 'from-violet-50 to-indigo-50',
        border: 'border-violet-300',
        buttonClass: 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700'
      };

    case 'izrada-sajtova':
      return {
        icon: '💻',
        title: language === 'sr' ? 'Trebа ti profesionalan sajt?' : 'Need a professional website?',
        description: language === 'sr'
          ? 'Od ideje do live sajta za 24-48h. Moderan dizajn, SEO optimizacija i tehnička podrška uključeni u cenu.'
          : 'From idea to live website in 24-48h. Modern design, SEO optimization and technical support included.',
        buttonText: language === 'sr' ? 'Pogledaj Cene Izrade' : 'View Development Pricing',
        link: '/izrada-sajta-cena',
        gradient: 'from-indigo-50 to-blue-50',
        border: 'border-indigo-300',
        buttonClass: 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700'
      };

    case 'web-dizajn':
      return {
        icon: '🎨',
        title: language === 'sr' ? 'Dizajn koji ostavlja utisak' : 'Design that makes an impression',
        description: language === 'sr'
          ? 'Kreiraj brand identity koji oduševljava. Naši dizajneri će pretvoriti tvoju viziju u stvarnost.'
          : 'Create a brand identity that impresses. Our designers will turn your vision into reality.',
        buttonText: language === 'sr' ? 'Saznaj Više o Web Dizajnu' : 'Learn More About Web Design',
        link: '/web-dizajn',
        gradient: 'from-pink-50 to-rose-50',
        border: 'border-pink-300',
        buttonClass: 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700'
      };

    case 'web-shop':
      return {
        icon: '🛒',
        title: language === 'sr' ? 'Pokreni svoj web shop' : 'Launch your web shop',
        description: language === 'sr'
          ? 'Kompletan e-commerce sistem sa payment gateway-em, inventory management-om i CRM-om. Start prodaje online danas.'
          : 'Complete e-commerce system with payment gateway, inventory management and CRM. Start selling online today.',
        buttonText: language === 'sr' ? 'Pogledaj E-Commerce Rešenja' : 'View E-Commerce Solutions',
        link: '/izrada-web-shopa',
        gradient: 'from-emerald-50 to-teal-50',
        border: 'border-emerald-300',
        buttonClass: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'
      };

    default:
      // Default CTA - leads to homepage
      return {
        icon: '✨',
        title: language === 'sr' ? 'Upoznaj AiSajt' : 'Get to Know AiSajt',
        description: language === 'sr'
          ? 'Saznaj više o nama, našim uslugama i kako možemo da pomognemo tvom biznisu da raste online.'
          : 'Learn more about us, our services and how we can help your business grow online.',
        buttonText: language === 'sr' ? 'O Nama' : 'About Us',
        link: '/#video-section',
        gradient: 'from-gray-50 to-slate-50',
        border: 'border-gray-300',
        buttonClass: 'bg-gradient-to-r from-gray-900 to-slate-800 hover:from-gray-800 hover:to-slate-700'
      };
  }
}

