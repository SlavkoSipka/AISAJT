import { useEffect, useState } from 'react';
import { Phone, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Language } from '../../types/language';
import { NAP } from '../../lib/site-config';
import { rafThrottle } from '../../utils/performance';
import { trackPhoneClick, trackCTAClick } from '../../utils/analytics';

interface StickyCallBarProps {
  language: Language;
}

/**
 * Lead-gen sticky CTA: na mobilnom fiksiran bar na dnu ekrana (Pozovi +
 * Besplatna ponuda), na desktopu plutajuća "Pozovi" pilula dole desno.
 * Pojavljuje se tek kada korisnik skroluje ispod hero sekcije.
 */
export function StickyCallBar({ language }: StickyCallBarProps) {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = rafThrottle(() => {
      setVisible(window.scrollY > 550);
    });
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const hiddenClass = visible ? '' : ' lg-hidden-bar';

  return (
    <>
      {/* Mobile: full-width bottom bar */}
      <div
        className={`lg-sticky-bar md:hidden fixed bottom-0 inset-x-0 z-40 px-3 pt-3 bg-white/95 backdrop-blur-lg border-t border-gray-200/80 shadow-[0_-8px_30px_-12px_rgba(17,12,34,0.25)]${hiddenClass}`}
      >
        <div className="grid grid-cols-2 gap-3">
          <a
            href={`tel:${NAP.phone.tel}`}
            onClick={() => trackPhoneClick(NAP.phone.tel, 'sticky_bar_mobile', language)}
            className="flex items-center justify-center gap-2 py-3.5 rounded-full bg-gray-900 text-white font-semibold text-sm"
          >
            <span className="lg-phone-ring inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500">
              <Phone className="w-3.5 h-3.5 text-white" />
            </span>
            {language === 'sr' ? 'Pozovi nas' : 'Call us'}
          </a>
          <button
            onClick={() => {
              trackCTAClick('Besplatna Ponuda', 'sticky_bar_mobile', language);
              navigate('/izrada-sajta-detalji');
            }}
            className="lg-btn-primary flex items-center justify-center gap-2 py-3.5 rounded-full text-white font-semibold text-sm"
          >
            {language === 'sr' ? 'Besplatna ponuda' : 'Free quote'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Desktop: floating call pill bottom-right */}
      <a
        href={`tel:${NAP.phone.tel}`}
        onClick={() => trackPhoneClick(NAP.phone.tel, 'sticky_pill_desktop', language)}
        className={`lg-call-pill hidden md:flex fixed bottom-6 right-6 z-40 items-center gap-3 pl-3 pr-6 py-3 rounded-full bg-gray-900 text-white shadow-2xl${hiddenClass}`}
      >
        <span className="lg-phone-ring inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-500">
          <Phone className="w-5 h-5 text-white" />
        </span>
        <span className="leading-tight">
          <span className="block text-[11px] uppercase tracking-wider text-gray-300">
            {language === 'sr' ? 'Pozovite nas odmah' : 'Call us now'}
          </span>
          <span className="block font-bold">{NAP.phone.display}</span>
        </span>
      </a>
    </>
  );
}
