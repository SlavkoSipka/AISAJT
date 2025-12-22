import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Language } from '../../types/language';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  language: Language;
}

const faqData: Record<Language, FAQItem[]> = {
  sr: [
    {
      question: "Koliko košta izrada sajta? Koja je cena izrade web sajta?",
      answer: "Cena izrade sajta zavisi od kompleksnosti projekta i vaših potreba. Izrada web sajta počinje od 150€ za osnovne sajtove (landing page, prezentacioni sajt). Web sajt izrada sa naprednim funkcionalnostima (e-commerce, custom aplikacije) može koštati od 500€ do 2000€. Besplatna konsultacija i transparentna ponuda - bez skrivenih troškova."
    },
    {
      question: "Koliko traje izrada web sajta?",
      answer: "Izrada web sajta standardno traje 7-14 dana od početka do lansiranja. Za hitne projekte nudimo ekspresnu web sajt izradu gde sajt može biti spreman za 24-48 sati. Kompleksniji projekti sa e-commerce funkcionalnošću ili custom razvojem mogu trajati 3-4 nedelje. Rok zavisi od obima projekta i dostupnosti vašeg sadržaja (tekstovi, slike)."
    },
    {
      question: "Da li nudite održavanje sajta nakon izrade?",
      answer: "Da, nudimo kompletno održavanje web sajtova koje uključuje redovne backup-ove, security update-e, dodavanje novog sadržaja i tehničku podršku. Održavanje možete plaćati mesečno ili godišnje uz povoljnije uslove."
    },
    {
      question: "Da li će sajt biti prilagođen mobilnim telefonima?",
      answer: "Apsolutno! Svaki sajt koji kreiramo je potpuno responzivan i optimizovan za sve uređaje - mobilne telefone, tablete i desktop računare. Preko 60% korisnika danas pristupa internetu preko mobilnih uređaja, tako da je mobilna optimizacija obavezna."
    },
    {
      question: "Da li sajt dolazi sa SEO optimizacijom?",
      answer: "Da, svaki sajt koji pravimo je tehnički SEO optimizovan od prvog dana - brzo učitavanje, mobilna prilagođenost, pravilna struktura, meta tagovi, sitemap i sve što je potrebno za dobar start na Google-u. Za napredni SEO i content marketing nudimo dodatne pakete."
    },
    {
      question: "Šta ako mi treba specifična funkcionalnost ili integracija?",
      answer: "Možemo integrisati bilo koju funkcionalnost - od booking sistema, online plaćanja, integracije sa CRM-om, do custom funkcionalnosti po vašoj želji. Razgovaramo o vašim potrebama i nudimo najbolje tehničko rešenje."
    },
    {
      question: "Radite li izradu web sajtova za klijente van Beograda?",
      answer: "Da! Izrada web sajta je moguća za klijente širom Srbije i regiona. Iako smo bazirani u Beogradu, naša web sajt izrada pokriva Novi Sad, Niš, Kragujevac i sve gradove. Kompletan proces od konsultacija do predaje projekta može se odvijati online. Komuniciramo putem email-a, telefona, Zoom-a ili vašeg željenog kanala."
    }
  ],
  en: [
    {
      question: "How much does a website cost?",
      answer: "The cost of website development depends on project complexity. Basic websites start from €150, while more complex projects with advanced features may cost more. We evaluate each project individually to provide you with the best solution for your budget."
    },
    {
      question: "How long does website development take?",
      answer: "We develop standard websites in 7-14 days. For urgent projects, we offer express service where the site can be ready in 24-48 hours. More complex projects with e-commerce functionality or custom development may take 3-4 weeks."
    },
    {
      question: "Do you offer website maintenance after development?",
      answer: "Yes, we offer complete website maintenance including regular backups, security updates, adding new content, and technical support. Maintenance can be paid monthly or annually with better terms."
    },
    {
      question: "Will the website be mobile-friendly?",
      answer: "Absolutely! Every website we create is fully responsive and optimized for all devices - mobile phones, tablets, and desktop computers. Over 60% of users access the internet via mobile devices today, so mobile optimization is mandatory."
    },
    {
      question: "Can I update the website content myself?",
      answer: "Yes, if you want a CMS (Content Management System) like WordPress, you'll be able to easily add and change content without programming knowledge. We provide training and documentation on how to use the CMS after project delivery."
    },
    {
      question: "Does the website come with SEO optimization?",
      answer: "Yes, every website we build is technically SEO optimized from day one - fast loading, mobile responsiveness, proper structure, meta tags, sitemap, and everything needed for a good start on Google. For advanced SEO and content marketing, we offer additional packages."
    },
    {
      question: "What if I need specific functionality or integration?",
      answer: "We can integrate any functionality - from booking systems, online payments, CRM integration, to custom features as you wish. We discuss your needs and offer the best technical solution."
    },
    {
      question: "Do you develop websites for clients outside Belgrade and Serbia?",
      answer: "Yes! Although we're based in Belgrade, we work on projects for clients throughout Serbia and the region. The entire process from consultation to project delivery can be done online. We communicate via email, phone, Zoom, or your preferred channel."
    }
  ]
};

export function FAQ({ language }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const items = faqData[language];

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-gradient-to-b from-white via-gray-50/50 to-white" id="faq">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 -left-20 w-80 h-80 bg-gradient-to-br from-violet-400 to-indigo-500 rounded-full opacity-5 blur-3xl animate-blob"></div>
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-pink-400 to-violet-500 rounded-full opacity-5 blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {language === 'sr' ? 'Pitanja o Izradi Web Sajtova' : 'Questions About Website Development'}
          </h2>
          
          <p className="text-lg text-gray-600">
            {language === 'sr' 
              ? 'Odgovori na najčešća pitanja o procesu, cenama i uslugama izrade web sajtova'
              : 'Answers to the most common questions about the process, pricing, and website development services'
            }
          </p>
        </div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full px-6 md:px-8 py-5 md:py-6 flex items-start justify-between gap-4 text-left transition-colors duration-300 hover:bg-gray-50"
              >
                <span className="text-lg md:text-xl font-semibold text-gray-900 flex-1">
                  {item.question}
                </span>
                <ChevronDown
                  className={`w-6 h-6 text-violet-600 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              <div
                className={`transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 md:px-8 pb-5 md:pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="max-w-3xl mx-auto text-center mt-12">
          <p className="text-gray-600 mb-4">
            {language === 'sr' 
              ? 'Imate dodatno pitanje? Kontaktirajte nas i rado ćemo vam pomoći!'
              : 'Have an additional question? Contact us and we\'ll be happy to help!'
            }
          </p>
        </div>
      </div>

      {/* FAQ Schema JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": items.map(item => ({
              "@type": "Question",
              "name": item.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer
              }
            }))
          })
        }}
      />
    </section>
  );
}

