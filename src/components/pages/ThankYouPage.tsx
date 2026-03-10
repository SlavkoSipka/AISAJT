import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowRight, Mail } from 'lucide-react';
import { trackLeadGeneration } from '../../utils/analytics';

declare global {
  interface Window {
    pdfDownloadInProgress?: boolean;
  }
}

export function ThankYouPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showContent, setShowContent] = useState(false);
  const downloadTriggered = useRef(false);
  const leadTracked = useRef(false);

  const userName = searchParams.get('name') || 'Korisnik';
  const source = searchParams.get('source') || 'contact_page';
  const language = searchParams.get('lang') || 'sr';

  useEffect(() => {
    if (leadTracked.current) return;
    leadTracked.current = true;
    trackLeadGeneration(
      source as 'contact_page' | 'home_page' | 'funnel_booking',
      userName,
      language
    );

    window.scrollTo(0, 0);
    setTimeout(() => setShowContent(true), 120);

    const downloadKey = `pdf_downloaded_${source}`;
    if (!downloadTriggered.current && (source === 'guide' || source === 'checklist')) {
      if (!sessionStorage.getItem(downloadKey) && !window.pdfDownloadInProgress) {
        downloadTriggered.current = true;
        window.pdfDownloadInProgress = true;
        sessionStorage.setItem(downloadKey, 'true');

        const timeoutId = setTimeout(() => {
          const link = document.createElement('a');
          if (source === 'guide') {
            link.href = '/downloads/vodic.pdf';
            link.download = 'Vodic-Od-Ideje-Do-Sajta.pdf';
          } else {
            link.href = '/downloads/checklist.pdf';
            link.download = '27-Stvari-Koje-Sajt-Mora-Imati.pdf';
          }
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setTimeout(() => {
            sessionStorage.removeItem(downloadKey);
            window.pdfDownloadInProgress = false;
          }, 5000);
        }, 1500);

        return () => clearTimeout(timeoutId);
      }
    }
  }, []);

  const steps = language === 'sr'
    ? [
        'Naš tim će pregledati vaš zahtev u najkraćem roku',
        'Kontaktiraćemo vas u roku od 24 sata',
        'Proverite vaš email inbox',
      ]
    : [
        'Our team will review your request shortly',
        'We will contact you within 24 hours',
        'Check your email inbox',
      ];

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 relative overflow-hidden">

      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-violet-900/10 rounded-full blur-[100px] pointer-events-none" />

      <div
        className={`max-w-lg w-full relative z-10 transition-all duration-700 ease-out ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        {/* Card */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900 overflow-hidden shadow-2xl shadow-black/60">

          {/* Top stripe */}
          <div className="h-1 w-full bg-violet-600" />

          <div className="p-8 md:p-10">
            {/* Icon */}
            <div className="flex justify-center mb-7">
              <div className="relative">
                <div className="absolute inset-0 bg-violet-600/20 rounded-full blur-xl" />
                <div className="relative bg-violet-600/15 border border-violet-500/30 rounded-full p-5">
                  <CheckCircle className="w-10 h-10 text-violet-400" strokeWidth={1.8} />
                </div>
              </div>
            </div>

            {/* Heading */}
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
                {language === 'sr' ? `Hvala vam, ${userName}!` : `Thank you, ${userName}!`}
              </h1>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                {language === 'sr'
                  ? 'Vaša poruka je uspešno poslata. Javićemo vam se uskoro!'
                  : 'Your message has been sent successfully. We will get back to you soon!'}
              </p>
            </div>

            {/* Steps */}
            <div className="rounded-xl border border-gray-800 bg-gray-800/40 p-5 mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Mail className="w-4 h-4 text-violet-400 flex-shrink-0" />
                <span className="text-white text-sm font-semibold">
                  {language === 'sr' ? 'Šta je sledeće?' : "What's next?"}
                </span>
              </div>
              <ol className="space-y-3">
                {steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 text-[11px] font-bold">
                      {i + 1}
                    </span>
                    <span className="text-gray-300 text-sm leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* CTA */}
            <button
              onClick={() => navigate('/')}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-all duration-200 shadow-[0_2px_16px_rgba(139,92,246,0.35)] hover:shadow-[0_4px_24px_rgba(139,92,246,0.5)] hover:scale-[1.01] active:scale-[0.99]"
            >
              {language === 'sr' ? 'Nazad na početnu' : 'Back to Home'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-gray-600 text-xs mt-5">
          AISajt.com &mdash; {language === 'sr' ? 'Profesionalna izrada web sajtova' : 'Professional web development'}
        </p>
      </div>
    </div>
  );
}
