import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getStoredConsent, storeConsent } from '../../utils/consent';

declare global {
  interface Window {
    __aisajtLoadGA4?: () => void;
    __aisajtLoadPixel?: () => void;
    __aisajtLoadHubspot?: () => void;
  }
}

// Client-only overlay — mounts after hydration on top of the already-visible
// prerendered page, so it never blocks or delays content render. Defaults to
// hidden; only shows when no consent choice has been stored yet, and firing
// analytics/marketing trackers only ever happens from the "Prihvati" handler
// below or from root.tsx's own load-if-already-accepted check — never as a
// side effect of merely rendering this component.
export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    if (getStoredConsent() === null) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    storeConsent('accepted');
    window.__aisajtLoadGA4?.();
    window.__aisajtLoadHubspot?.();
    // Meta Pixel se namerno ne pali odavde: vozi samo /izrada-sajta-detalji,
    // pa ga useMetaPixel() na toj stranici pali — i pri učitavanju i ovde,
    // preko 'aisajt:consent' događaja ispod, ako pristanak stigne u toku posete.
    window.dispatchEvent(new Event('aisajt:consent'));
    setVisible(false);
  };

  const handleReject = () => {
    storeConsent('rejected');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Saglasnost za kolačiće"
      className="fixed inset-x-0 bottom-0 z-[9999] p-3 sm:p-6 pointer-events-none"
    >
      {/* Na telefonu je ovaj baner pokrivao donju polovinu ekrana — hero video
          player upada tacno u tu zonu, pa mu tap nikad nije stizao: korisnik
          vidi dugme, pritiska ga, i nista se ne desi dok ne skroluje toliko da
          player izadje iznad banera. Zato je mobilni raspored zbijen (tekst i
          dugmad dele red, detalji su iza „Detalji"), visina je tvrdo
          ogranicena, a omotac je pointer-events-none da ni njegov padding ne
          jede tapove pored kartice. Ako se tekst ikad prosiruje, meri visinu
          na 375x667 — baner ne sme da predje polovinu ekrana. */}
      <div className="pointer-events-auto mx-auto max-w-3xl max-h-[38vh] overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-2xl p-3 sm:p-6 flex flex-row items-center gap-3 sm:gap-4">
        <div className="text-xs sm:text-sm text-gray-700 leading-snug sm:leading-relaxed flex-1 min-w-0 space-y-1">
          <p className="font-semibold text-gray-900">Kolačići na ovom sajtu</p>
          <p>
            Analitiku, marketing i obrasce ne aktiviramo dok se ne saglasite.{' '}
            <button
              type="button"
              onClick={() => setDetailsOpen((o) => !o)}
              className="underline text-violet-600 hover:text-violet-700 font-medium"
              aria-expanded={detailsOpen}
            >
              {detailsOpen ? 'Sakrij detalje' : 'Detalji'}
            </button>
          </p>
          {detailsOpen && (
            <p>
              Neophodni kolačići za rad sajta se uvek koriste. Kolačiće za <strong>analitiku</strong> (Google
              Analytics), <strong>marketing</strong> (Meta Pixel) i <strong>funkcionalnost obrazaca</strong>{' '}
              (HubSpot) ne aktiviramo dok se ne saglasite. Svoj izbor kasnije možete promeniti brisanjem
              kolačića/podataka sajta u podešavanjima pretraživača. Detalje o obradi podataka potražite u našoj{' '}
              <Link to="/privacy" className="underline text-violet-600 hover:text-violet-700 font-medium">
                Politici privatnosti
              </Link>
              .
            </p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={handleReject}
            className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-gray-800 text-white text-xs sm:text-sm font-semibold hover:bg-gray-900 transition-colors"
          >
            Odbij
          </button>
          <button
            type="button"
            onClick={handleAccept}
            className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs sm:text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Prihvati
          </button>
        </div>
      </div>
    </div>
  );
}
