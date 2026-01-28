import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, HelpCircle, ArrowRight, ArrowLeft, Check, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { NavLink, MobileNavLink } from '../navigation/NavLink';
import { translations } from '../../types/language';
import { trackQuizStart, trackQuizAnswer, trackQuizComplete } from '../../utils/analytics';
import { submitQuizForm } from '../../utils/hubspot';
import { SEOHelmet } from '../seo/SEOHelmet';
import { Navbar } from '../layout/Navbar';
import { Footer } from '../layout/Footer';
import { navigateToSection } from '../../utils/navigation';

interface Question {
  id: number;
  question: string;
  options: {
    text: string;
    value: string;
  }[];
}

export function QuizPage() {
  const { language, setLanguage } = useLanguage();
  const t = translations[language];
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const quizContent = {
    sr: {
      hero: 'Pronađite Idealno Rešenje Za Vaš Biznis',
      subtitle: 'Odgovorite na 4 brza pitanja i dobijte personalizovanu ponudu u roku od 24h',
      nextButton: 'Sledeće',
      prevButton: 'Nazad',
      questions: [
        {
          id: 1,
          question: 'Šta je vaš glavni cilj sajta?',
          options: [
            { text: '🎯 Predstavljanje jedne usluge/proizvoda', value: 'landing' },
            { text: '💼 Predstavljanje kompanije i svih usluga', value: 'onepage' },
            { text: '🏢 Kompletan web sistem', value: 'multipage' },
            { text: '🛒 Prodaja proizvoda online', value: 'ecommerce' }
          ]
        },
        {
          id: 2,
          question: 'Koliko sadržaja planirate da imate?',
          options: [
            { text: 'Website 1 stranica', value: '1-page' },
            { text: 'Website 3-5 stranica', value: '3-5-pages' },
            { text: 'Website 8+ stranica', value: '8plus-pages' },
            { text: 'Platforma (velika baza podataka)', value: 'platform' }
          ]
        },
        {
          id: 3,
          question: 'Koliko često ćete ažurirati sadržaj?',
          options: [
            { text: 'Retko - par puta godišnje', value: 'rarely' },
            { text: 'Povremeno - par puta mesečno', value: 'occasionally' },
            { text: 'Često - svaki dan/nedelju', value: 'often' },
            { text: 'Stalno - dodavanje proizvoda', value: 'constantly' }
          ]
        },
        {
          id: 4,
          question: 'Koji je vaš budžet?',
          options: [
            { text: '300 - 800€', value: '300-800' },
            { text: '800 - 2000€', value: '800-2000' },
            { text: '2000 - 5000€', value: '2000-5000' },
            { text: 'Više od 5000€', value: '5000plus' }
          ]
        }
      ],
      results: {
        title: 'Hvala što ste izdvojili vreme! 🎉',
        subtitle: 'Evo šta ste nam rekli:',
        email: {
          title: 'Pošaljite ove informacije za detaljnu ponudu',
          placeholder: 'vas@email.com',
          button: 'Pošalji'
        }
      }
    },
    en: {
      hero: 'Find The Perfect Solution For Your Business',
      subtitle: 'Answer 4 quick questions and get a personalized quote within 24h',
      nextButton: 'Next',
      prevButton: 'Back',
      questions: [
        {
          id: 1,
          question: 'What is your main website goal?',
          options: [
            { text: '🎯 Present one service/product', value: 'landing' },
            { text: '💼 Present company and all services', value: 'onepage' },
            { text: '🏢 Complete web system', value: 'multipage' },
            { text: '🛒 Sell products online', value: 'ecommerce' }
          ]
        },
        {
          id: 2,
          question: 'How much content do you plan to have?',
          options: [
            { text: 'Website 1 page', value: '1-page' },
            { text: 'Website 3-5 pages', value: '3-5-pages' },
            { text: 'Website 8+ pages', value: '8plus-pages' },
            { text: 'Platform (large database)', value: 'platform' }
          ]
        },
        {
          id: 3,
          question: 'How often will you update content?',
          options: [
            { text: 'Rarely - few times a year', value: 'rarely' },
            { text: 'Occasionally - few times a month', value: 'occasionally' },
            { text: 'Often - every day/week', value: 'often' },
            { text: 'Constantly - adding products', value: 'constantly' }
          ]
        },
        {
          id: 4,
          question: 'What is your budget?',
          options: [
            { text: '300 - 800€', value: '300-800' },
            { text: '800 - 2000€', value: '800-2000' },
            { text: '2000 - 5000€', value: '2000-5000' },
            { text: 'More than 5000€', value: '5000plus' }
          ]
        }
      ],
      results: {
        title: 'Thank you for your time! 🎉',
        subtitle: 'Here\'s what you told us:',
        email: {
          title: 'Send this information for a detailed quote',
          placeholder: 'your@email.com',
          button: 'Send'
        }
      }
    }
  };

  const qt = quizContent[language];
  const questions = qt.questions;
  const totalQuestions = questions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  // Track quiz start kada komponenta mountuje (samo jednom)
  useEffect(() => {
    trackQuizStart(language);
  }, []); // Prazan dependency array = samo pri mountovanju

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [currentQuestion]: value });
    
    // Track svaki odgovor
    trackQuizAnswer(currentQuestion + 1, value, language);
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const getAnswerText = (questionIndex: number) => {
    const answer = answers[questionIndex];
    const question = questions[questionIndex];
    const option = question.options.find(opt => opt.value === answer);
    return option ? option.text : '';
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Submit to HubSpot
      const result = await submitQuizForm({
        name: name || 'User',
        email: email,
        phone: phone,
        answers: answers,
      });

      if (result.success) {
        trackQuizComplete(name || 'User', email, answers, language);
        navigate(`/thank-you?name=${encodeURIComponent(name || 'User')}&source=quiz&lang=${language}`);
      } else {
        throw new Error(result.message || 'HubSpot submission failed');
      }
    } catch (error) {
      navigate(`/thank-you?name=${encodeURIComponent(name || 'User')}&source=quiz&lang=${language}`);
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <SEOHelmet
        title={language === 'sr' ? 'Kviz - Pronađite Ideal website rešenje | AISajt' : 'Quiz - Find Your Ideal Website Solution | AISajt'}
        description={language === 'sr' ? 'Odgovorite na nekoliko pitanja i otkrijte koje web rešenje najbolje odgovara vašim potrebama. Besplatna procena i konsultacije za izradu sajta.' : 'Answer a few questions and discover which web solution best fits your needs. Free estimate and consultation for website development.'}
        keywords="web kviz, procena sajta, izrada sajta kviz, web development quiz, aisajt kviz"
        canonicalUrl="https://aisajt.com/resources/quiz"
      />
      
      <Navbar />
      
      {/* Top Navigation Bar - Full navbar kao na HomePage */}
      <nav className="fixed w-full z-50 bg-white/98 shadow-md backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-20 md:h-24">
            <Link 
              to="/" 
              className="flex items-center group py-2"
              aria-label="AI Sajt - Početna stranica"
            >
              <img 
                src="/images/providna2.png" 
                alt="AiSajt Logo" 
                className="h-12 md:h-16 lg:h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
              <NavLink onClick={() => navigateToSection('services-detailed', navigate, location.pathname)}>{t.services}</NavLink>
              <NavLink onClick={() => navigateToSection('portfolio', navigate, location.pathname)}>{t.portfolio}</NavLink>
              <NavLink onClick={() => navigateToSection('video-section', navigate, location.pathname)}>{t.aboutUs}</NavLink>
              <NavLink onClick={() => navigate('/resources')}>{t.resources}</NavLink>
              
              <button
                onClick={() => navigate('/contact')}
                className="bg-gray-900 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-white hover:text-gray-900 border-2 border-gray-900 transition-all duration-300 text-sm uppercase tracking-wide"
                aria-label="Kontaktirajte nas"
              >
                {t.contact}
              </button>
              
              {/* Language Switcher Toggle */}
              <div className="flex gap-1 border-2 border-gray-900 rounded-full p-1">
                <button
                  onClick={() => setLanguage('sr')}
                  className={`w-10 h-10 rounded-full text-xs font-bold transition-all duration-300 ${
                    language === 'sr'
                      ? 'bg-gray-900 text-white shadow-md'
                      : 'bg-transparent text-gray-700 hover:text-gray-900'
                  }`}
                >
                  SR
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`w-10 h-10 rounded-full text-xs font-bold transition-all duration-300 ${
                    language === 'en'
                      ? 'bg-gray-900 text-white shadow-md'
                      : 'bg-transparent text-gray-700 hover:text-gray-900'
                  }`}
                >
                  EN
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-900 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label={isMenuOpen ? 'Zatvori meni' : 'Otvori meni'}
            >
              {isMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden absolute w-full bg-white/95 backdrop-blur-md shadow-xl transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? 'opacity-100 translate-y-0 visible'
              : 'opacity-0 -translate-y-4 invisible'
          }`}
        >
          <div className="container mx-auto px-4 py-4 space-y-4">
            <MobileNavLink onClick={() => {
              navigateToSection('services-detailed', navigate, location.pathname);
              setIsMenuOpen(false);
            }}>{t.services}</MobileNavLink>
            <MobileNavLink onClick={() => {
              navigateToSection('portfolio', navigate, location.pathname);
              setIsMenuOpen(false);
            }}>{t.portfolio}</MobileNavLink>
            <MobileNavLink onClick={() => {
              navigateToSection('video-section', navigate, location.pathname);
              setIsMenuOpen(false);
            }}>{t.aboutUs}</MobileNavLink>
            <MobileNavLink onClick={() => {
              navigate('/resources');
              setIsMenuOpen(false);
            }}>{t.resources}</MobileNavLink>
            
            {/* Language Switcher Toggle - Mobile */}
            <div className="px-4 py-2 flex justify-center">
              <div className="flex gap-1 bg-gray-700 rounded-full p-1">
                <button
                  onClick={() => setLanguage('sr')}
                  className={`w-12 h-12 rounded-full text-sm font-bold transition-all duration-300 ${
                    language === 'sr'
                      ? 'bg-white text-gray-700 shadow-md'
                      : 'bg-transparent text-gray-300 hover:text-white'
                  }`}
                >
                  SR
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`w-12 h-12 rounded-full text-sm font-bold transition-all duration-300 ${
                    language === 'en'
                      ? 'bg-white text-gray-700 shadow-md'
                      : 'bg-transparent text-gray-300 hover:text-white'
                  }`}
                >
                  EN
                </button>
              </div>
            </div>
            
            <button
              onClick={() => {
                navigate('/contact');
                setIsMenuOpen(false);
              }}
              className="w-full bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 border-2 border-gray-900 transition-all duration-300"
              aria-label="Kontaktirajte nas - Mobilni meni"
            >
              {t.contact}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-12 md:pt-40 md:pb-28 min-h-screen relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-violet-50/30 to-white" />
        
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-gradient-to-br from-violet-400 to-pink-500 rounded-full opacity-10 blur-3xl animate-blob" />
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-full opacity-10 blur-3xl animate-blob animation-delay-2000" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto">
            
            {!showResults ? (
              <>
                {/* Header */}
                <div className="text-center mb-6 md:mb-12">
                  <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4 leading-tight animate-fade-in-up animation-delay-200 px-2">
                    {qt.hero}
                  </h1>

                  <p className="text-base md:text-lg text-gray-600 animate-fade-in-up animation-delay-400 px-2">
                    {qt.subtitle}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="mb-4 md:mb-8 animate-fade-in-up animation-delay-600">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs md:text-sm font-semibold text-gray-700">
                      {language === 'sr' ? 'Pitanje' : 'Question'} {currentQuestion + 1}/{totalQuestions}
                    </span>
                    <span className="text-xs md:text-sm font-semibold text-violet-600">{progress.toFixed(0)}%</span>
                  </div>
                  <div className="w-full h-2 md:h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-violet-600 to-pink-600 transition-all duration-500 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Question Card */}
                <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-8 lg:p-12 border-2 border-gray-200 shadow-xl animate-fade-in-up animation-delay-800">
                  <div className="flex items-start md:items-center gap-2 md:gap-3 mb-4 md:mb-6">
                    <HelpCircle className="w-6 h-6 md:w-8 md:h-8 text-violet-600 flex-shrink-0 mt-1 md:mt-0" />
                    <h2 className="text-lg md:text-2xl lg:text-3xl font-bold text-gray-900 leading-snug">
                      {questions[currentQuestion].question}
                    </h2>
                  </div>

                  <div className="space-y-2 md:space-y-3 mb-4 md:mb-8">
                    {questions[currentQuestion].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswer(option.value)}
                        className={`w-full text-left px-3 py-2.5 md:px-6 md:py-4 rounded-xl md:rounded-2xl border-2 transition-all duration-300 ${
                          answers[currentQuestion] === option.value
                            ? 'border-violet-500 bg-violet-50 shadow-lg'
                            : 'border-gray-200 hover:border-violet-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm md:text-lg font-medium text-gray-900 pr-2">{option.text}</span>
                          {answers[currentQuestion] === option.value && (
                            <Check className="w-5 h-5 md:w-6 md:h-6 text-violet-600 flex-shrink-0" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex gap-2 md:gap-3">
                    {currentQuestion > 0 && (
                      <button
                        onClick={handlePrev}
                        className="px-4 py-2.5 md:px-6 md:py-3 border-2 border-gray-900 text-gray-900 rounded-full font-semibold hover:bg-gray-900 hover:text-white transition-all flex items-center gap-1 md:gap-2 text-sm md:text-base"
                      >
                        <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
                        {qt.prevButton}
                      </button>
                    )}
                    
                    <button
                      onClick={handleNext}
                      disabled={!answers[currentQuestion]}
                      className={`flex-1 px-4 py-2.5 md:px-6 md:py-3 rounded-full font-semibold transition-all flex items-center justify-center gap-1 md:gap-2 text-sm md:text-base ${
                        answers[currentQuestion]
                          ? 'bg-gradient-to-r from-violet-600 to-pink-600 text-white hover:scale-[1.02] shadow-lg'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {currentQuestion === totalQuestions - 1 
                        ? (language === 'sr' ? 'Vidi Rezultat' : 'See Result')
                        : qt.nextButton
                      }
                      <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Results - prikazuje samo odgovore */}
                <div className="text-center mb-4 md:mb-8 animate-fade-in">
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 md:mb-4 px-2">
                    {qt.results.title}
                  </h1>
                  <p className="text-base md:text-lg text-gray-600 mb-4 md:mb-6 px-2">
                    {qt.results.subtitle}
                  </p>
                </div>

                <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-8 lg:p-12 border-2 border-violet-200 shadow-2xl animate-scale-in">
                  {/* Prikaži sve odgovore - kompaktnije na mobilnom */}
                  <div className="space-y-2 md:space-y-4 mb-4 md:mb-8">
                    {questions.map((q, index) => (
                      <div key={index} className="bg-gradient-to-r from-violet-50 via-indigo-50 to-pink-50 rounded-lg md:rounded-xl p-2.5 md:p-4 border border-violet-100">
                        <p className="font-semibold text-gray-900 mb-1 md:mb-2 text-xs md:text-base">{q.question}</p>
                        <p className="text-violet-600 text-sm md:text-lg font-medium">→ {getAnswerText(index)}</p>
                      </div>
                    ))}
                  </div>

                  {/* Email Capture - kompaktnije dizajnirano za mobilne */}
                  <div className="mt-4 md:mt-8 border-t-2 border-gradient-to-r from-violet-300 to-pink-300 pt-4 md:pt-8">
                    <h3 className="text-base md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-violet-600 via-indigo-600 to-pink-600 bg-clip-text text-transparent mb-2 md:mb-3 text-center leading-tight px-2">
                      {qt.results.email.title}
                    </h3>
                    
                    <p className="text-xs md:text-sm text-gray-500 text-center mb-3 md:mb-4">
                      {language === 'sr' ? (
                        <>
                          Saznajte više o našim uslugama na{' '}
                          <Link to="/" className="text-violet-600 hover:text-violet-700 font-semibold underline">
                            početnoj stranici
                          </Link>.
                        </>
                      ) : (
                        <>
                          Learn more about our services on our{' '}
                          <Link to="/" className="text-violet-600 hover:text-violet-700 font-semibold underline">
                            homepage
                          </Link>.
                        </>
                      )}
                    </p>
                    
                    <form onSubmit={handleEmailSubmit} className="space-y-2.5 md:space-y-4 max-w-md mx-auto mt-3 md:mt-6">
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={language === 'sr' ? 'Vaše ime' : 'Your name'}
                        className="w-full px-3 py-2.5 md:px-5 md:py-4 border-2 border-gray-300 rounded-xl focus:border-gray-900 focus:outline-none transition-colors text-sm md:text-lg"
                      />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={qt.results.email.placeholder}
                        className="w-full px-3 py-2.5 md:px-5 md:py-4 border-2 border-gray-300 rounded-xl focus:border-gray-900 focus:outline-none transition-colors text-sm md:text-lg"
                      />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder={language === 'sr' ? 'Broj telefona' : 'Phone number'}
                        className="w-full px-3 py-2.5 md:px-5 md:py-4 border-2 border-gray-300 rounded-xl focus:border-gray-900 focus:outline-none transition-colors text-sm md:text-lg"
                      />
                      <button
                        type="submit"
                        className="w-full group px-6 py-3 md:px-8 md:py-4 bg-gray-900 text-white rounded-full font-bold text-sm md:text-lg hover:bg-white hover:text-gray-900 border-2 border-gray-900 transition-all duration-300 flex items-center justify-center gap-2 shadow-xl uppercase tracking-wide"
                      >
                        {qt.results.email.button}
                        <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-2 transition-transform" />
                      </button>
                    </form>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      </div>

      {/* Footer - puni footer kao na HomePage */}
      <footer className="relative text-gray-900 py-12 md:py-16 border-t border-violet-200/30">
        {/* Smooth layered gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/40 via-violet-50/35 to-pink-50/40"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-violet-50/20 via-transparent to-indigo-50/25"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <Link 
                to="/"
                className="flex items-center hover:opacity-80 transition-opacity duration-300 group"
              >
                <img 
                  src="/images/providna2.png" 
                  alt="AiSajt Logo" 
                  className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </Link>
              <p className="text-gray-600">
                {t.footerDesc}
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">{t.services}</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-600 hover:text-violet-600 transition-colors duration-300">{t.professionalAiWebDesign.split(' ')[0] + ' ' + t.professionalAiWebDesign.split(' ')[1]}</Link></li>
                <li><Link to="/" className="text-gray-600 hover:text-indigo-600 transition-colors duration-300">{language === 'sr' ? 'Baze Podataka' : 'Database Management'}</Link></li>
                <li><Link to="/" className="text-gray-600 hover:text-pink-600 transition-colors duration-300">Online Marketing</Link></li>
                <li><Link to="/" className="text-gray-600 hover:text-violet-600 transition-colors duration-300">E-commerce</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">{t.company}</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-600 hover:text-violet-600 transition-colors duration-300">{t.aboutUs}</Link></li>
                <li><Link to="/" className="text-gray-600 hover:text-indigo-600 transition-colors duration-300">{t.portfolio}</Link></li>
                <li><Link to="/resources" className="text-gray-600 hover:text-violet-600 transition-colors duration-300">{t.resources}</Link></li>
                <li><Link to="/faq" className="text-gray-600 hover:text-violet-600 transition-colors duration-300">FAQ</Link></li>
                <li><Link to="/contact" className="text-gray-600 hover:text-pink-600 transition-colors duration-300">{t.contact}</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">{t.contact}</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-violet-600" aria-hidden="true" />
                  <a 
                    href="mailto:office@aisajt.com"
                    className="text-gray-600 hover:text-violet-600 transition-colors duration-300"
                    aria-label={language === 'sr' ? 'Pošaljite email na office@aisajt.com' : 'Send email to office@aisajt.com'}
                  >
                    office@aisajt.com
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-indigo-600" aria-hidden="true" />
                  <a 
                    href="tel:+381613091583"
                    className="text-gray-600 hover:text-indigo-600 transition-colors duration-300"
                    aria-label={language === 'sr' ? 'Pozovite na broj +381 61 3091583' : 'Call +381 61 3091583'}
                  >
                    +381 61 3091583
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-pink-600" aria-hidden="true" />
                  <span className="text-gray-600">{language === 'sr' ? 'Beograd, Srbija' : 'Belgrade, Serbia'}</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-violet-200 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-600">
                &copy; {new Date().getFullYear()} AiSajt.com | {t.professionalWebDevDesc.split(' ')[0] + ' ' + (language === 'sr' ? 'izrada web sajtova' : 'web development')}
              </p>
              <div className="flex gap-6">
                <Link 
                  to="/privacy" 
                  className="text-sm text-gray-600 hover:text-violet-600 transition-colors duration-300"
                  aria-label={language === 'sr' ? 'Politika privatnosti' : 'Privacy Policy'}
                >
                  {language === 'sr' ? 'Privatnost' : 'Privacy'}
                </Link>
                <Link 
                  to="/terms" 
                  className="text-sm text-gray-600 hover:text-violet-600 transition-colors duration-300"
                  aria-label={language === 'sr' ? 'Uslovi korišćenja' : 'Terms of Service'}
                >
                  {language === 'sr' ? 'Uslovi korišćenja' : 'Terms of Service'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <Footer />
    </div>
  );
}
