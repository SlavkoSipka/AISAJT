import { NAP, SITE_URL, SOCIAL_PROFILES } from '../../lib/site-config';

// Single authoritative business schema (Phase 4 — consolidates what used to
// be two overlapping, partially-conflicting blocks: root.tsx's prerendered
// ProfessionalService and SEOHelmet.tsx's useEffect-only LocalBusiness+
// Organization pair, which never reached prerendered HTML at all).
//
// One node instead of two: schema.org's ProfessionalService extends
// LocalBusiness, which itself extends Organization — so a single
// ProfessionalService node can legitimately carry every property this site
// needs (address/geo/openingHours/priceRange from LocalBusiness, taxID/
// vatID/identifier/founder from Organization) without the artificial split
// Phase 1 kept for lack of a better option. One node also makes the old
// "two nodes sharing one @id" malformation structurally impossible.
export const BUSINESS_ID = `${SITE_URL}/#business`;

const BUSINESS_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': BUSINESS_ID,
  // "AiSajt" is the primary entity name; the legal name and NAP short form
  // live in alternateName instead, so the homepage-facing entity identity
  // doesn't itself carry the "izrada sajta" phrase the /izrada-sajta pillar
  // page now owns.
  name: 'AiSajt',
  alternateName: [NAP.name, 'AiSajt.com'],
  url: SITE_URL,
  logo: `${SITE_URL}/images/providna2.png`,
  image: `${SITE_URL}/images/favicon/android-chrome-512x512.png`,
  description: 'Digitalna agencija iz Beograda: web razvoj, SEO optimizacija, Meta reklame i održavanje sajtova za firme širom Srbije. Transparentne cene, besplatna konsultacija.',
  telephone: NAP.phone.tel,
  email: NAP.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: NAP.address.streetAddress,
    addressLocality: NAP.address.addressLocality,
    postalCode: NAP.address.postalCode,
    addressCountry: NAP.address.addressCountry,
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '44.7866',
    longitude: '20.4489',
  },
  openingHours: NAP.hours,
  areaServed: [
    { '@type': 'City', name: 'Beograd' },
    { '@type': 'Country', name: 'Srbija' },
  ],
  // Qualitative, not a fabricated numeric range — real starting prices
  // across the four service pages run 250€-499€ (see ServiceSchema usages),
  // "€€" (mid, not budget/not premium) is an honest summary of that.
  priceRange: '€€',
  taxID: '115455769',
  vatID: 'RS115455769',
  identifier: [
    { '@type': 'PropertyValue', propertyID: 'Matični broj', value: '68380103' },
  ],
  // Only a verified real profile — see site-config.ts's comment on why
  // Facebook is deliberately excluded.
  sameAs: SOCIAL_PROFILES,
  // Matches the "Meet the Team" section on /izrada-sajta-detalji exactly (name + role) —
  // Marko is listed there as an employee, not a co-owner, so he's typed
  // accordingly rather than lumped into founder.
  founder: [
    { '@type': 'Person', name: 'Bogdan Gradjanin', jobTitle: 'Suvlasnik, specijalizovani programer' },
    { '@type': 'Person', name: 'Strahinja Zekanovic', jobTitle: 'Suvlasnik, dizajner i poslovanje' },
  ],
  employee: [
    { '@type': 'Person', name: 'Marko Devedzic', jobTitle: 'SEO i održavanje sajtova' },
  ],
  // The four real, routed services (matches Navbar exactly) — trimmed from
  // the pre-Phase-4 version, which also listed "Baze podataka" and "Online
  // marketing": neither corresponds to a real page or routed service today
  // (grep-confirmed; "Online marketing" only appeared in the orphaned,
  // unrouted ONamaPage.tsx). Each provider now references this node's own
  // @id instead of a disconnected anonymous Organization stub.
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Usluge digitalnog razvoja',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Web razvoj',
          description: 'Profesionalan web razvoj za firme. Cena od 299€.',
          provider: { '@id': BUSINESS_ID },
          areaServed: { '@type': 'City', name: 'Beograd' },
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Web dizajn',
          description: 'Moderan i responzivan web dizajn prilagođen svim uređajima.',
          provider: { '@id': BUSINESS_ID },
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'SEO optimizacija',
          description: 'Tehnički SEO i optimizacija web sajta za Google pretraživače. Cena od 250€.',
          provider: { '@id': BUSINESS_ID },
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Izrada web shopa',
          description: 'Izrada online prodavnice (WooCommerce, Shopify). Cena od 499€.',
          provider: { '@id': BUSINESS_ID },
        },
      },
    ],
  },
};

export function BusinessSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(BUSINESS_SCHEMA) }}
    />
  );
}
