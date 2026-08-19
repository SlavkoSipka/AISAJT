/**
 * Single source of truth for the site's Name/Address/Phone (NAP) — locked in
 * Phase 1. Every consumer (schema, footer, contact section, forms) should
 * import from here instead of hardcoding these values, so a future change
 * only happens in one place instead of drifting across files.
 */

export const SITE_URL = 'https://aisajt.com';

export const NAP = {
  name: 'AI Sajt',
  legalName: 'AI Sajt - Agencija za Izradu Sajta',
  email: 'office@aisajt.com',
  phone: {
    /** E.164 — for `tel:` hrefs, JSON-LD `telephone`, analytics event params */
    tel: '+381621552156',
    /** Formatted for display in copy/UI */
    display: '+381 62 155 2156',
    /** Local format without the country code — a couple of casual UI spots use this */
    local: '062 155 2156',
  },
  address: {
    streetAddress: 'Maraka Oreskovca 42',
    addressLocality: 'Beograd',
    postalCode: '11000',
    addressCountry: 'RS',
    /** Short display form for UI (no street/postal) */
    display: 'Beograd, Srbija',
    displayEn: 'Belgrade, Serbia',
  },
  hours: 'Mo-Fr 09:00-18:00',
} as const;
