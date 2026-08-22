import type { MetaDescriptor } from 'react-router';
import { NAP, SITE_URL } from '../lib/site-config';

interface PageMetaInput {
  title: string;
  description: string;
  canonical: string;
  keywords?: string;
  ogImage?: string;
}

// TODO(owner): this is still the 512x512 square favicon, not a proper
// 1200x630 branded OG share image — see PHASE_3_REPORT.md §3.3. Swap this
// default once a real one exists; every route inherits it automatically.
const DEFAULT_OG_IMAGE = `${SITE_URL}/images/favicon/android-chrome-512x512.png`;

/**
 * Shared shape for route-module meta() exports — mirrors what SEOHelmet.tsx
 * sets client-side (title/description/keywords/canonical/OG/Twitter), so the
 * same values now ship in the prerendered HTML instead of only appearing
 * after hydration. SEOHelmet keeps running for schema (business/FAQ JSON-LD),
 * which this doesn't touch.
 */
export function buildPageMeta({ title, description, canonical, keywords, ogImage = DEFAULT_OG_IMAGE }: PageMetaInput): MetaDescriptor[] {
  // Social crawlers reject relative og:image/twitter:image paths, so a
  // site-root path gets promoted to an absolute URL here.
  const absoluteOgImage = ogImage.startsWith('/') ? `${SITE_URL}${ogImage}` : ogImage;
  const meta: MetaDescriptor[] = [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: canonical },
    { property: 'og:image', content: absoluteOgImage },
    { property: 'og:site_name', content: NAP.name },
    { property: 'og:locale', content: 'sr_RS' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: absoluteOgImage },
    { tagName: 'link', rel: 'canonical', href: canonical },
  ];
  if (keywords) {
    meta.push({ name: 'keywords', content: keywords });
  }
  return meta;
}
