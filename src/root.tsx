import type { ReactNode } from 'react';
import { Meta, Links, Outlet, Scripts, ScrollRestoration } from 'react-router';
import type { MetaFunction } from 'react-router';
import { buildPageMeta } from './utils/pageMeta';
import { LanguageProvider } from './contexts/LanguageContext';
import { SITE_URL } from './lib/site-config';
import { BusinessSchema } from './components/seo/BusinessSchema';
import { BreadcrumbSchema } from './components/seo/BreadcrumbSchema';
import { CookieConsentBanner } from './components/ui/CookieConsentBanner';
import { CONSENT_STORAGE_KEY } from './utils/consent';
import './index.css';

// react-helmet-async's HelmetProvider was removed from here in Sub-step 2C:
// its only remaining consumer (BlogPostSchema.tsx) was migrated to a raw
// JSX <script> tag (react-helmet-async's <Helmet> never made it into
// prerendered output anyway — nothing extracts/injects its context server-
// side under Framework Mode). The package itself is still installed because
// the dead (unused, pending Sub-step 2D removal) src/main.tsx still imports
// it; full package removal happens alongside that cleanup.

// Same conditional-load pattern as the old index.html scripts: skip on localhost.
const HOSTNAME_GUARD = `window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' && window.location.hostname !== '[::1]'`;

// Non-essential trackers only fire once the visitor has accepted the cookie
// banner (see CookieConsentBanner.tsx). Each script defines a
// window.__aisajtLoadX loader (idempotent) instead of firing unconditionally,
// so the exact same loader can be invoked either here — on page load, if
// consent was already granted in a previous visit — or from the banner's
// "Prihvati" button when the visitor consents in the current session.
// Rejecting (or not yet answering) means neither path ever runs: default is
// no tracking.
const HAS_CONSENT = `(function(){ try { return localStorage.getItem('${CONSENT_STORAGE_KEY}') === 'accepted'; } catch (e) { return false; } })()`;

const GA4_SCRIPT = `
window.__aisajtLoadGA4 = function() {
  if (window.__aisajtGA4Loaded) return;
  window.__aisajtGA4Loaded = true;
  var script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-6C046QS9HG';
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-6C046QS9HG');
};
if (${HOSTNAME_GUARD} && ${HAS_CONSENT}) {
  window.__aisajtLoadGA4();
}
`;

const META_PIXEL_SCRIPT = `
window.__aisajtLoadPixel = function() {
  if (window.__aisajtPixelLoaded) return;
  window.__aisajtPixelLoaded = true;
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '1206162938252666');
  fbq('track', 'PageView');
};
if (${HOSTNAME_GUARD} && ${HAS_CONSENT}) {
  window.__aisajtLoadPixel();
}
`;

const HUBSPOT_SCRIPT = `
window.__aisajtLoadHubspot = function() {
  if (window.__aisajtHubspotLoaded) return;
  window.__aisajtHubspotLoaded = true;
  var hubspotScript = document.createElement('script');
  hubspotScript.type = 'text/javascript';
  hubspotScript.id = 'hs-script-loader';
  hubspotScript.async = true;
  hubspotScript.defer = true;
  hubspotScript.src = '//js-eu1.hs-scripts.com/147390341.js';
  document.head.appendChild(hubspotScript);

  var hubspotFormsScript = document.createElement('script');
  hubspotFormsScript.src = 'https://js-eu1.hsforms.net/forms/embed/147390341.js';
  hubspotFormsScript.defer = true;
  document.head.appendChild(hubspotFormsScript);
};
if (${HOSTNAME_GUARD} && ${HAS_CONSENT}) {
  window.__aisajtLoadHubspot();
}
`;

// Site-wide default meta — a fallback for any route without its own meta()
// export. As of Phase 3, every one of the 27 marketing routes has its own
// (see src/thankYou.tsx), so this has no live consumer today; kept correct
// and de-stuffed anyway (Phase 3 audit) rather than left as dead-but-wrong.
export const meta: MetaFunction = () => buildPageMeta({
  title: 'Izrada Sajta i SEO Optimizacija | AiSajt Beograd',
  description: 'Profesionalna izrada web sajtova i SEO optimizacija za firme u Beogradu i širom Srbije. Transparentne cene, besplatna konsultacija.',
  keywords: 'izrada web sajta, izrada sajtova, izrada sajta cena, web sajt izrada, cena izrade sajta, izrada web sajta cena, izrada web sajta novi sad',
  canonical: SITE_URL,
});

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="sr">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/images/favicon/android-chrome-512x512.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/favicon/apple-touch-icon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* TODO(owner): add real Google Search Console verification meta tag here (property > Settings > Ownership verification > HTML tag). Removed placeholder value that verified nothing. */}
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        {/* TODO(owner): add real Yandex Webmaster verification meta tag here if Yandex traffic matters. Removed placeholder value that verified nothing. */}
        <meta name="author" content="AiSajt" />
        <meta name="theme-color" content="#1F2937" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400;600;700;900&family=Playfair+Display:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
          media="print"
          // eslint-disable-next-line react/no-unknown-property
          onLoad={(e) => { (e.currentTarget as HTMLLinkElement).media = 'all'; }}
        />
        <link rel="dns-prefetch" href="https://www.youtube.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />

        <script dangerouslySetInnerHTML={{ __html: GA4_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: META_PIXEL_SCRIPT }} />
        <BusinessSchema />
        <script dangerouslySetInnerHTML={{ __html: HUBSPOT_SCRIPT }} />

        <Meta />
        <Links />
      </head>
      <body>
        {/* No <noscript> Meta Pixel fallback here on purpose: it can't be
            consent-gated (no JS = no way to check localStorage or show the
            banner), and firing it unconditionally would defeat the
            default-to-no-tracking-before-consent requirement. */}
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return (
    <LanguageProvider>
      <BreadcrumbSchema />
      <Outlet />
      <CookieConsentBanner />
    </LanguageProvider>
  );
}
