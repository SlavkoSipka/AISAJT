import { BlogCategory, BlogCategoryInfo } from '../types/blog';

export const blogCategories: BlogCategoryInfo[] = [
  {
    id: 'seo',
    name: 'SEO',
    nameEn: 'SEO',
    description: 'Sve o SEO optimizaciji, strategijama i tehnikama za bolje rangiranje na Google-u',
    descriptionEn: 'Everything about SEO optimization, strategies and techniques for better Google rankings',
    slug: 'seo',
    metaTitle: 'SEO Blog | Strategije i Saveti za Optimizaciju | AiSajt',
    metaTitleEn: 'SEO Blog | Optimization Strategies & Tips | AiSajt',
    metaDescription: 'Naučite kako da optimizujete svoj sajt za pretraživače. Praktični SEO saveti, case studies i strategije koje donose rezultate.',
    metaDescriptionEn: 'Learn how to optimize your website for search engines. Practical SEO tips, case studies and strategies that deliver results.',
    icon: '🔍'
  },
  {
    id: 'izrada-sajtova',
    name: 'Izrada Sajtova',
    nameEn: 'Website Development',
    description: 'Vodič za izradu profesionalnih sajtova - tehnologije, proces, best practices',
    descriptionEn: 'Guide to building professional websites - technologies, process, best practices',
    slug: 'izrada-sajtova',
    metaTitle: 'Blog o Izradi Sajtova | Tehnologije i Best Practices | AiSajt',
    metaTitleEn: 'Website Development Blog | Technologies & Best Practices | AiSajt',
    metaDescription: 'Sve što treba da znate o izradi profesionalnih web sajtova. Od izbora tehnologije do lansiranja sajta.',
    metaDescriptionEn: 'Everything you need to know about building professional websites. From choosing technology to launching your site.',
    icon: '💻'
  },
  {
    id: 'web-dizajn',
    name: 'Web Dizajn',
    nameEn: 'Web Design',
    description: 'Trendovi, principi i inspiracija za moderan web dizajn',
    descriptionEn: 'Trends, principles and inspiration for modern web design',
    slug: 'web-dizajn',
    metaTitle: 'Web Dizajn Blog | Trendovi i Inspiracija | AiSajt',
    metaTitleEn: 'Web Design Blog | Trends & Inspiration | AiSajt',
    metaDescription: 'Istraži moderne trendove u web dizajnu, UX/UI principe i inspiraciju za kreiranje vizuelno atraktivnih sajtova.',
    metaDescriptionEn: 'Explore modern web design trends, UX/UI principles and inspiration for creating visually attractive websites.',
    icon: '🎨'
  },
  {
    id: 'web-shop',
    name: 'E-Commerce',
    nameEn: 'E-Commerce',
    description: 'Online prodavnice - od planiranja do uspešnog poslovanja',
    descriptionEn: 'Online stores - from planning to successful business',
    slug: 'e-commerce',
    metaTitle: 'E-Commerce Blog | Web Shop Strategije | AiSajt',
    metaTitleEn: 'E-Commerce Blog | Web Shop Strategies | AiSajt',
    metaDescription: 'Vodič za pokretanje i vođenje uspešne online prodavnice. Strategije, alati i praktični saveti.',
    metaDescriptionEn: 'Guide to starting and running a successful online store. Strategies, tools and practical tips.',
    icon: '🛒'
  },
  {
    id: 'case-studies',
    name: 'Case Studies',
    nameEn: 'Case Studies',
    description: 'Realni primeri naših projekata i rezultati koje smo postigli',
    descriptionEn: 'Real examples of our projects and the results we achieved',
    slug: 'case-studies',
    metaTitle: 'Case Studies | Realni Primeri Uspeha | AiSajt',
    metaTitleEn: 'Case Studies | Real Success Stories | AiSajt',
    metaDescription: 'Pogledajte kako smo pomogli našim klijentima da postignu rezultate kroz web sajtove, SEO i digitalni marketing.',
    metaDescriptionEn: 'See how we helped our clients achieve results through websites, SEO and digital marketing.',
    icon: '📊'
  }
];

// Helper function to get category by ID
export const getCategoryById = (id: BlogCategory) => {
  return blogCategories.find(cat => cat.id === id);
};

// Helper function to get category by slug
export const getCategoryBySlug = (slug: string) => {
  return blogCategories.find(cat => cat.slug === slug);
};

