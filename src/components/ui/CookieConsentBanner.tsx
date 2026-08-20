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

  useEffect(() => {
    if (getStoredConsent() === null) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    storeConsent('accepted');
    window.__aisajtLoadGA4?.();
    window.__aisajtLoadPixel?.();
    window.__aisajtLoadHubspot?.();
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
      className="fixed inset-x-0 bottom-0 z-[9999] p-4 sm:p-6"
    >
      <div className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white shadow-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="text-sm text-gray-700 leading-relaxed flex-1 space-y-1.5">
          <p className="font-semibold text-gray-900">Kolačići na ovom sajtu</p>
          <p>
            Neophodni kolačići za rad sajta se uvek koriste. Kolačiće za <strong>analitiku</strong> (Google Analytics),{' '}
            <strong>marketing</strong> (Meta Pixel) i <strong>funkcionalnost obrazaca</strong> (HubSpot) ne aktiviramo
            dok se ne saglasite — birate da li ih prihvatate ili odbijate.
          </p>
          <p>
            Svoj izbor kasnije možete promeniti brisanjem kolačića/podataka sajta u podešavanjima pretraživača. Detalje
            o obradi podataka potražite u našoj{' '}
            <Link to="/privacy" className="underline text-violet-600 hover:text-violet-700 font-medium">
              Politici privatnosti
            </Link>
            .
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto shrink-0">
          <button
            type="button"
            onClick={handleReject}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-full bg-gray-800 text-white text-sm font-semibold hover:bg-gray-900 transition-colors"
          >
            Odbij
          </button>
          <button
            type="button"
            onClick={handleAccept}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Prihvati
          </button>
        </div>
      </div>
    </div>
  );
}
