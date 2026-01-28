import React from 'react';
import { Navbar } from '../layout/Navbar';
import { Footer } from '../layout/Footer';
import { SEOHelmet } from '../seo/SEOHelmet';

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHelmet
        title="Politika Privatnosti | AiSajt"
        description="Politika privatnosti AI Sajt-a. Saznajte kako prikupljamo, koristimo i štitimo vaše lične podatke."
        keywords="politika privatnosti, privacy policy, zaštita podataka, GDPR"
        canonicalUrl="https://aisajt.com/privacy"
      />
      <Navbar />

      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">Politika Privatnosti</h1>
          
          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-900">1. Uvod</h2>
              <p>
                AI Sajt je posvećen zaštiti vaše privatnosti. Ova politika privatnosti objašnjava kako prikupljamo, koristimo i štitimo vaše lične podatke.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-900">2. Koje podatke prikupljamo</h2>
              <p>Prikupljamo sledeće podatke:</p>
              <ul className="list-disc list-inside mt-2 space-y-2">
                <li>Ime i prezime</li>
                <li>Email adresa</li>
                <li>Broj telefona</li>
                <li>Informacije o projektu</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-900">3. Kako koristimo vaše podatke</h2>
              <p>Vaše podatke koristimo za:</p>
              <ul className="list-disc list-inside mt-2 space-y-2">
                <li>Komunikaciju u vezi sa vašim projektom</li>
                <li>Pružanje usluga izrade web sajta</li>
                <li>Slanje važnih obaveštenja</li>
                <li>Unapređenje naših usluga</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-900">4. Zaštita podataka</h2>
              <p>
                Primenjujemo stroge mere zaštite kako bismo osigurali bezbednost vaših podataka. Vaši podaci se čuvaju na sigurnim serverima i pristup njima imaju samo ovlašćena lica.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-900">5. Kolačići (Cookies)</h2>
              <p>
                Naš sajt koristi kolačiće kako bi poboljšao vaše korisničko iskustvo. Možete podesiti svoj pretraživač da odbije kolačiće, ali to može uticati na funkcionalnost sajta.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-900">6. Vaša prava</h2>
              <p>Imate pravo da:</p>
              <ul className="list-disc list-inside mt-2 space-y-2">
                <li>Pristupite svojim podacima</li>
                <li>Ispravite netačne podatke</li>
                <li>Zatražite brisanje podataka</li>
                <li>Povučete saglasnost za obradu podataka</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-900">7. Kontakt</h2>
              <p>
                Za sva pitanja u vezi sa zaštitom privatnosti, možete nas kontaktirati na email: office@aisajt.com
              </p>
            </section>

            <div className="mt-8 pt-8 border-t border-gray-300">
              <p className="text-sm text-gray-500">
                Poslednje ažuriranje: 15. Februar 2024.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
