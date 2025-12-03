import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, TrendingUp, DollarSign, Users, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { Navbar } from '../layout/Navbar';
import { Footer } from '../layout/Footer';
import { SEOHelmet } from '../seo/SEOHelmet';

export function ROICalculatorPage() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  
  const [inputs, setInputs] = useState({
    monthlyVisitors: '',
    conversionRate: '',
    avgOrderValue: '',
    hasWebsite: 'no'
  });

  const [email, setEmail] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [showEmailCapture, setShowEmailCapture] = useState(false);

  const content = {
    sr: {
      hero: 'ROI Kalkulator',
      subtitle: 'Izračunajte koliko vam sajt može doneti mesečno',
      form: {
        question1: 'Da li trenutno imate web sajt?',
        yes: 'Da',
        no: 'Ne',
        question2: 'Koliko posetilaca očekujete mesečno?',
        visitors: 'Broj posetilaca',
        question3: 'Koliko % posetilaca postane klijent?',
        conversion: '% Konverzije (1-10%)',
        question4: 'Prosečna zarada po klijentu?',
        avgValue: 'Iznos u €',
        calculate: 'Izračunaj Potencijal',
        hint1: 'Primer: 500 posetilaca',
        hint2: 'Realno: 2-5%',
        hint3: 'Vaša prosečna zarada'
      },
      results: {
        title: 'Vaš Potencijal',
        monthly: 'Mesečni Prihod',
        yearly: 'Godišnji Prihod',
        newClients: 'Novi Klijenti Mesečno',
        roi: 'ROI (Povraćaj Investicije)',
        details: 'Detaljan Report',
        insights: {
          title: 'Šta ovo znači?',
          point1: 'Sa kvalitetnim sajtom privlačite više posetilaca',
          point2: 'Bolja konverzija = više klijenata',
          point3: 'Investicija se vraća za 3-6 meseci'
        },
        email: {
          title: 'Želite detaljan PDF report?',
          subtitle: 'Dobićete personalizovanu analizu i savete kako poboljšati rezultate',
          placeholder: 'vas@email.com',
          button: 'Pošalji Mi Report',
          success: 'Report poslat! Proverite email.'
        }
      }
    },
    en: {
      hero: 'ROI Calculator',
      subtitle: 'Calculate how much your website can earn monthly',
      form: {
        question1: 'Do you currently have a website?',
        yes: 'Yes',
        no: 'No',
        question2: 'How many visitors do you expect monthly?',
        visitors: 'Number of visitors',
        question3: 'What % of visitors become clients?',
        conversion: '% Conversion (1-10%)',
        question4: 'Average revenue per client?',
        avgValue: 'Amount in €',
        calculate: 'Calculate Potential',
        hint1: 'Example: 500 visitors',
        hint2: 'Realistic: 2-5%',
        hint3: 'Your average revenue'
      },
      results: {
        title: 'Your Potential',
        monthly: 'Monthly Revenue',
        yearly: 'Yearly Revenue',
        newClients: 'New Clients Monthly',
        roi: 'ROI (Return on Investment)',
        details: 'Detailed Report',
        insights: {
          title: 'What does this mean?',
          point1: 'With a quality site you attract more visitors',
          point2: 'Better conversion = more clients',
          point3: 'Investment pays back in 3-6 months'
        },
        email: {
          title: 'Want a detailed PDF report?',
          subtitle: 'Get personalized analysis and tips on improving results',
          placeholder: 'your@email.com',
          button: 'Send Me Report',
          success: 'Report sent! Check your email.'
        }
      }
    }
  };

  const t = content[language];

  const calculateROI = () => {
    const visitors = parseFloat(inputs.monthlyVisitors);
    const conversion = parseFloat(inputs.conversionRate) / 100;
    const avgValue = parseFloat(inputs.avgOrderValue);

    if (visitors && conversion && avgValue) {
      const newClients = visitors * conversion;
      const monthlyRevenue = newClients * avgValue;
      const yearlyRevenue = monthlyRevenue * 12;
      
      // Assume website cost is 1500€ (average)
      const websiteCost = 1500;
      const roi = ((yearlyRevenue - websiteCost) / websiteCost) * 100;

      return {
        monthly: monthlyRevenue.toFixed(0),
        yearly: yearlyRevenue.toFixed(0),
        newClients: newClients.toFixed(1),
        roi: roi.toFixed(0)
      };
    }
    
    return null;
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setShowResults(true);
    setTimeout(() => {
      setShowEmailCapture(true);
    }, 2000);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would integrate with your email service
    console.log('Email captured:', email);
    navigate(`/thank-you?name=User&source=roi_calculator&lang=${language}`);
  };

  const results = calculateROI();

  return (
    <div className="min-h-screen bg-white">
      <SEOHelmet
        title={language === 'sr' ? 'ROI Kalkulator | Izračunajte Povrat od Web Sajta | AISajt' : 'ROI Calculator | Calculate Website Return | AISajt'}
        description={language === 'sr' ? 'Besplatni ROI kalkulator za web sajt. Izračunajte koliko možete zaraditi sa novim sajtom i koji je povrat vaše investicije.' : 'Free website ROI calculator. Calculate how much you can earn with a new website and what is your return on investment.'}
        keywords="roi kalkulator, povrat investicije, web roi, kalkulator sajta"
        canonicalUrl="https://aisajt.com/roi-calculator"
      />
      
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-indigo-50/30 to-white" />
        
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-full opacity-10 blur-3xl animate-blob" />
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-gradient-to-br from-violet-400 to-pink-500 rounded-full opacity-10 blur-3xl animate-blob animation-delay-2000" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block mb-6 animate-fade-in">
              <span className="px-6 py-2 bg-gradient-to-r from-indigo-100 via-violet-100 to-pink-100 text-transparent bg-clip-text font-semibold text-sm uppercase tracking-wider border border-indigo-200 rounded-full">
                🧮 {language === 'sr' ? 'Besplatni Kalkulator' : 'Free Calculator'}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight animate-fade-in-up animation-delay-200">
              {t.hero}
            </h1>

            <p className="text-lg md:text-xl text-gray-600 leading-relaxed animate-fade-in-up animation-delay-400">
              {t.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            
            {/* Left: Form */}
            <div className="animate-fade-in-up animation-delay-200">
              <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <Calculator className="w-8 h-8 text-indigo-600" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    {language === 'sr' ? 'Unesite Podatke' : 'Enter Data'}
                  </h2>
                </div>

                <form onSubmit={handleCalculate} className="space-y-6">
                  {/* Has Website */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      {t.form.question1}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setInputs({ ...inputs, hasWebsite: 'yes' })}
                        className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                          inputs.hasWebsite === 'yes'
                            ? 'bg-indigo-600 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {t.form.yes}
                      </button>
                      <button
                        type="button"
                        onClick={() => setInputs({ ...inputs, hasWebsite: 'no' })}
                        className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                          inputs.hasWebsite === 'no'
                            ? 'bg-indigo-600 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {t.form.no}
                      </button>
                    </div>
                  </div>

                  {/* Monthly Visitors */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      {t.form.question2}
                    </label>
                    <input
                      type="number"
                      required
                      value={inputs.monthlyVisitors}
                      onChange={(e) => setInputs({ ...inputs, monthlyVisitors: e.target.value })}
                      placeholder={t.form.visitors}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                    />
                    <p className="text-xs text-gray-500 mt-1">{t.form.hint1}</p>
                  </div>

                  {/* Conversion Rate */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      {t.form.question3}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={inputs.conversionRate}
                      onChange={(e) => setInputs({ ...inputs, conversionRate: e.target.value })}
                      placeholder={t.form.conversion}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                    />
                    <p className="text-xs text-gray-500 mt-1">{t.form.hint2}</p>
                  </div>

                  {/* Average Order Value */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      {t.form.question4}
                    </label>
                    <input
                      type="number"
                      required
                      value={inputs.avgOrderValue}
                      onChange={(e) => setInputs({ ...inputs, avgOrderValue: e.target.value })}
                      placeholder={t.form.avgValue}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                    />
                    <p className="text-xs text-gray-500 mt-1">{t.form.hint3}</p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full group px-6 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold text-lg hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <TrendingUp className="w-5 h-5" />
                    {t.form.calculate}
                  </button>
                </form>
              </div>
            </div>

            {/* Right: Results */}
            <div className="animate-fade-in-up animation-delay-400">
              {showResults && results ? (
                <div className="bg-gradient-to-br from-indigo-50 via-violet-50 to-pink-50 rounded-3xl p-8 border-2 border-indigo-100 shadow-xl animate-scale-in">
                  <div className="flex items-center gap-3 mb-6">
                    <Sparkles className="w-8 h-8 text-indigo-600" />
                    <h2 className="text-2xl font-bold text-gray-900">
                      {t.results.title}
                    </h2>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white rounded-2xl p-4 text-center">
                      <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-2" />
                      <p className="text-xs text-gray-600 mb-1">{t.results.monthly}</p>
                      <p className="text-2xl font-bold text-gray-900">{results.monthly}€</p>
                    </div>

                    <div className="bg-white rounded-2xl p-4 text-center">
                      <TrendingUp className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                      <p className="text-xs text-gray-600 mb-1">{t.results.yearly}</p>
                      <p className="text-2xl font-bold text-gray-900">{results.yearly}€</p>
                    </div>

                    <div className="bg-white rounded-2xl p-4 text-center">
                      <Users className="w-6 h-6 text-violet-600 mx-auto mb-2" />
                      <p className="text-xs text-gray-600 mb-1">{t.results.newClients}</p>
                      <p className="text-2xl font-bold text-gray-900">{results.newClients}</p>
                    </div>

                    <div className="bg-white rounded-2xl p-4 text-center">
                      <Calculator className="w-6 h-6 text-pink-600 mx-auto mb-2" />
                      <p className="text-xs text-gray-600 mb-1">{t.results.roi}</p>
                      <p className="text-2xl font-bold text-gray-900">{results.roi}%</p>
                    </div>
                  </div>

                  {/* Insights */}
                  <div className="bg-white rounded-2xl p-6 mb-6">
                    <h3 className="font-bold text-gray-900 mb-3">{t.results.insights.title}</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>{t.results.insights.point1}</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>{t.results.insights.point2}</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>{t.results.insights.point3}</span>
                      </li>
                    </ul>
                  </div>

                  {/* Email Capture */}
                  {showEmailCapture && (
                    <div className="bg-white rounded-2xl p-6 animate-fade-in-up">
                      <h3 className="font-bold text-gray-900 mb-2">{t.results.email.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">{t.results.email.subtitle}</p>
                      
                      <form onSubmit={handleEmailSubmit} className="space-y-3">
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={t.results.email.placeholder}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                        />
                        <button
                          type="submit"
                          className="w-full group px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                        >
                          {t.results.email.button}
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-3xl p-8 border-2 border-gray-200 h-full flex items-center justify-center">
                  <div className="text-center">
                    <Calculator className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                      {language === 'sr' 
                        ? 'Popunite formular da vidite vaš potencijal'
                        : 'Fill the form to see your potential'
                      }
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

