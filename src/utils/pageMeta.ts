import type { MetaDescriptor } from 'react-router';

interface PageMetaInput {
  title: string;
  description: string;
  canonical: string;
  keywords?: string;
  ogImage?: string;
}

const DEFAULT_OG_IMAGE = 'https://aisajt.com/images/favicon/android-chrome-512x512.png';

/**
 * Shared shape for route-module meta() exports — mirrors what SEOHelmet.tsx
 * sets client-side (title/description/keywords/canonical/OG/Twitter), so the
 * same values now ship in the prerendered HTML instead of only appearing
 * after hydration. SEOHelmet keeps running for schema (business/FAQ JSON-LD),
 * which this doesn't touch.
 */
export function buildPageMeta({ title, description, canonical, keywords, ogImage = DEFAULT_OG_IMAGE }: PageMetaInput): MetaDescriptor[] {
  const meta: MetaDescriptor[] = [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: canonical },
    { property: 'og:image', content: ogImage },
    { property: 'og:site_name', content: 'AI Sajt' },
    { property: 'og:locale', content: 'sr_RS' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: ogImage },
    { tagName: 'link', rel: 'canonical', href: canonical },
  ];
  if (keywords) {
    meta.push({ name: 'keywords', content: keywords });
  }
  return meta;
}
