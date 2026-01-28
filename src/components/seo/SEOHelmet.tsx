import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOHelmetProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  canonicalUrl?: string;
  noindex?: boolean;
  includeBusinessSchema?: boolean;
  includeFAQSchema?: boolean;
  faqItems?: Array<{ question: string; answer: string }>;
}

export function SEOHelmet({ 
  title, 
  description, 
  keywords, 
  ogImage = 'https://aisajt.com/images/favicon/android-chrome-512x512.png',
  canonicalUrl,
  noindex = false,
  includeBusinessSchema = false,
  includeFAQSchema = false,
  faqItems = []
}: SEOHelmetProps) {
  const location = useLocation();
  const baseUrl = 'https://aisajt.com';
  const fullUrl = canonicalUrl || `${baseUrl}${location.pathname}`;

  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // Update meta keywords (if provided)
    if (keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', keywords);
    }

    // Update canonical URL
    let linkCanonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.href = fullUrl;

    // Update robots meta
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.setAttribute('name', 'robots');
      document.head.appendChild(metaRobots);
    }
    metaRobots.setAttribute('content', noindex ? 'noindex, nofollow' : 'index, follow');

    // Update Open Graph tags
    const ogTags = [
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: fullUrl },
      { property: 'og:image', content: ogImage },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'AI Sajt' },
      { property: 'og:locale', content: 'sr_RS' }
    ];

    ogTags.forEach(({ property, content }) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    });

    // Update Twitter Card tags
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: ogImage }
    ];

    twitterTags.forEach(({ name, content }) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    });

    // Add LocalBusiness & Organization Schema
    if (includeBusinessSchema) {
      let schemaScript = document.querySelector('script[data-schema="business"]');
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.setAttribute('type', 'application/ld+json');
        schemaScript.setAttribute('data-schema', 'business');
        document.head.appendChild(schemaScript);
      }

      const businessSchema = {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "LocalBusiness",
            "@id": "https://aisajt.com/#organization",
            "name": "AI Sajt - Agencija za Izradu Sajta",
            "alternateName": "AiSajt",
            "url": "https://aisajt.com",
            "telephone": "+381621552156",
            "email": "contact@aisajt.com",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Maraka Oreskovca 42",
              "addressLocality": "Beograd",
              "postalCode": "11000",
              "addressCountry": "RS"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "44.7866",
              "longitude": "20.4489"
            },
            "taxID": "115455769",
            "vatID": "RS115455769",
            "identifier": {
              "@type": "PropertyValue",
              "propertyID": "Matični broj",
              "value": "68380103"
            },
            "priceRange": "€€",
            "openingHours": "Mo-Fr 09:00-18:00",
            "areaServed": {
              "@type": "Place",
              "name": "Srbija",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "RS"
              }
            },
            "sameAs": [
              "https://www.instagram.com/aisajt",
              "https://www.facebook.com/aisajt"
            ],
            "image": "https://aisajt.com/images/favicon/android-chrome-512x512.png",
            "logo": {
              "@type": "ImageObject",
              "url": "https://aisajt.com/images/favicon/android-chrome-512x512.png",
              "width": "512",
              "height": "512"
            },
            "description": "Profesionalna agencija za izradu sajtova i SEO optimizaciju u Beogradu. Specijalizovani za izradu web sajtova, online prodavnica i SEO usluge."
          },
          {
            "@type": "Organization",
            "@id": "https://aisajt.com/#organization",
            "name": "AI Sajt",
            "legalName": "AI Sajt - Agencija za Izradu Sajta",
            "url": "https://aisajt.com",
            "taxID": "115455769",
            "vatID": "RS115455769",
            "identifier": [
              {
                "@type": "PropertyValue",
                "propertyID": "PIB",
                "value": "115455769"
              },
              {
                "@type": "PropertyValue",
                "propertyID": "Matični broj",
                "value": "68380103"
              }
            ],
            "logo": {
              "@type": "ImageObject",
              "url": "https://aisajt.com/images/favicon/android-chrome-512x512.png",
              "width": "512",
              "height": "512"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+381621552156",
              "contactType": "customer service",
              "email": "contact@aisajt.com",
              "areaServed": "RS",
              "availableLanguage": ["sr", "en"]
            },
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Maraka Oreskovca 42",
              "addressLocality": "Beograd",
              "postalCode": "11000",
              "addressCountry": "RS"
            }
          }
        ]
      };

      schemaScript.textContent = JSON.stringify(businessSchema);
    }

    // Add FAQ Schema
    if (includeFAQSchema && faqItems.length > 0) {
      let faqSchemaScript = document.querySelector('script[data-schema="faq"]');
      if (!faqSchemaScript) {
        faqSchemaScript = document.createElement('script');
        faqSchemaScript.setAttribute('type', 'application/ld+json');
        faqSchemaScript.setAttribute('data-schema', 'faq');
        document.head.appendChild(faqSchemaScript);
      }

      const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqItems.map(item => ({
          "@type": "Question",
          "name": item.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.answer
          }
        }))
      };

      faqSchemaScript.textContent = JSON.stringify(faqSchema);
    }
  }, [title, description, keywords, ogImage, fullUrl, noindex, includeBusinessSchema, includeFAQSchema, faqItems]);

  return null; // This is a utility component, doesn't render anything
}

