import React from 'react';
import { Navbar } from '../layout/Navbar';
import { Footer } from '../layout/Footer';
import { SEOHelmet } from '../seo/SEOHelmet';

export function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHelmet
        title="Uslovi Korišćenja | AiSajt"
        description="Uslovi korišćenja usluga AI Sajt-a. Pročitajte naše uslove za izradu web sajtova, online prodavnica i QR menija."
        keywords="uslovi korišćenja, terms of service, pravila korišćenja"
        canonicalUrl="https://aisajt.com/terms"
      />
      <Navbar />

      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">Uslovi Korišćenja</h1>
          
          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-900">1. Opšte odredbe</h2>
              <p>
                Korišćenjem usluga AI Sajt-a prihvatate ove uslove korišćenja. Molimo vas da ih pažljivo pročitate pre korišćenja naših usluga.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-900">2. Opis usluga</h2>
              <p>
                AI Sajt pruža usluge izrade web sajtova uz pomoć veštačke inteligencije. Naše usluge uključuju:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-2">
                <li>Izradu web sajtova</li>
                <li>Izradu online prodavnica</li>
                <li>Izradu QR menija</li>
                <li>SEO optimizaciju</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-900">3. Cene i plaćanje</h2>
              <p>
                Cene naših usluga su jasno istaknute na sajtu. Plaćanje se vrši prema dogovoru, a može biti:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-2">
                <li>Avansno plaćanje</li>
                <li>Plaćanje po završetku projekta</li>
                <li>Plaćanje u ratama (po dogovoru)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-900">4. Rokovi izrade</h2>
              <p>
                Standardni rok izrade web sajta je 24 časa od trenutka potvrde projekta i primljenih neophodnih materijala. Kompleksniji projekti mogu zahtevati duži period izrade, o čemu ćete biti blagovremeno obavešteni.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-900">5. Garancija i održavanje</h2>
              <p>
                Pružamo garanciju na funkcionalnost izrađenih sajtova u trajanju od 12 meseci. Garancija uključuje:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-2">
                <li>Otklanjanje bagova i grešaka</li>
                <li>Tehničku podršku</li>
                <li>Manje izmene sadržaja</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-900">6. Prava i obaveze</h2>
              <p>
                Klijent zadržava sva prava na dostavljene materijale i sadržaj. AI Sajt zadržava pravo da projekt navede kao referencu u svom portfoliju, osim ako nije drugačije dogovoreno.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-900">7. Privatnost podataka</h2>
              <p>
                Poštujemo vašu privatnost i štitimo vaše lične podatke u skladu sa važećim zakonima o zaštiti podataka. Više informacija možete pronaći u našoj Politici privatnosti.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-900">8. Izmene uslova korišćenja</h2>
              <p>
                Zadržavamo pravo da izmenimo ove uslove korišćenja u bilo kom trenutku. O svim značajnim izmenama bićete obavešteni putem našeg sajta ili email-a.
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
