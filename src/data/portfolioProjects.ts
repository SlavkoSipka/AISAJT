export interface PortfolioProject {
  id: string;
  slug: string;
  title: string;
  description: { sr: string; en: string };
  longDescription: { sr: string; en: string };
  image: string;
  gallery?: string[];
  tags: { sr: string[]; en: string[] };
  link: string;
  category: 'web-sajt' | 'e-commerce' | 'seo';
  technologies: string[];
  year: number;
  clientIndustry: { sr: string; en: string };
  features: { sr: string[]; en: string[] };
}

export const portfolioProjects: PortfolioProject[] = [
  {
    id: 'kralj-residence',
    slug: 'kralj-residence',
    title: 'Kralj Residence',
    description: {
      sr: 'Moderan web sajt za apartmane i hotele',
      en: 'Modern website for apartments and hotels',
    },
    longDescription: {
      sr: 'Kompletna izrada web sajta za Kralj Residence – luksuzne apartmane u srcu grada. Sajt je dizajniran da pruži elegantno korisničko iskustvo sa sistemom za online rezervacije, galerijom apartmana, i potpuno responzivnim dizajnom koji se savršeno prilagođava svim uređajima.',
      en: 'Complete website development for Kralj Residence – luxury apartments in the heart of the city. The site is designed to provide an elegant user experience with an online reservation system, apartment gallery, and fully responsive design that adapts perfectly to all devices.',
    },
    image: 'https://res.cloudinary.com/dij7ynio3/image/upload/w_600,f_webp,q_auto:good/v1739663014/kralj12_um1xrk',
    tags: {
      sr: ['Web Sajt', 'Responzivan'],
      en: ['Website', 'Responsive'],
    },
    link: 'https://kraljresidence.rs',
    category: 'web-sajt',
    technologies: ['React', 'Tailwind CSS', 'Node.js'],
    year: 2025,
    clientIndustry: {
      sr: 'Turizam i Ugostiteljstvo',
      en: 'Tourism & Hospitality',
    },
    features: {
      sr: [
        'Responzivan dizajn za sve uređaje',
        'Galerija apartmana sa detaljima',
        'Online sistem za rezervacije',
        'SEO optimizacija',
        'Brzo učitavanje stranica',
      ],
      en: [
        'Responsive design for all devices',
        'Apartment gallery with details',
        'Online reservation system',
        'SEO optimization',
        'Fast page loading',
      ],
    },
  },
  {
    id: 'bn-autofolije',
    slug: 'bn-autofolije',
    title: 'BN Autofolije',
    description: {
      sr: 'Profesionalni web sajt za auto folije i detailing',
      en: 'Professional website for car wraps and detailing',
    },
    longDescription: {
      sr: 'Profesionalan web sajt za BN Autofolije – specijalizovanu firmu za auto folije, zaštitne folije i detailing usluge. Sajt je optimizovan za SEO kako bi privukao lokalne klijente, sa detaljnim prikazom usluga, galerijom radova i jednostavnim kontakt formularom.',
      en: 'Professional website for BN Autofolije – a specialized company for car wraps, protective films, and detailing services. The site is SEO optimized to attract local clients, with detailed service descriptions, a work gallery, and a simple contact form.',
    },
    image: 'https://res.cloudinary.com/dij7ynio3/image/upload/w_600,f_webp,q_auto:good/v1740502433/pozadina-min_gfbxfp',
    tags: {
      sr: ['Web Sajt', 'Auto Detailing', 'SEO'],
      en: ['Website', 'Auto Detailing', 'SEO'],
    },
    link: 'https://bnautofolije.com/',
    category: 'web-sajt',
    technologies: ['React', 'Tailwind CSS', 'SEO'],
    year: 2025,
    clientIndustry: {
      sr: 'Auto Industrija',
      en: 'Automotive Industry',
    },
    features: {
      sr: [
        'SEO optimizacija za lokalne pretrage',
        'Galerija radova sa filterima',
        'Kontakt formular za upit',
        'Responzivan dizajn',
        'Brzo učitavanje i optimizovane slike',
      ],
      en: [
        'SEO optimization for local searches',
        'Work gallery with filters',
        'Contact form for inquiries',
        'Responsive design',
        'Fast loading and optimized images',
      ],
    },
  },
  {
    id: 'prestige-gradnja',
    slug: 'prestige-gradnja',
    title: 'Prestige Gradnja',
    description: {
      sr: 'Moderan web sajt za nekretnine i apartmane',
      en: 'Modern website for real estate and apartments',
    },
    longDescription: {
      sr: 'Elegantna web prezentacija za Prestige Gradnja – kompaniju koja se bavi izgradnjom i prodajom luksuznih nekretnina. Sajt je dizajniran da prezentuje projekte na profesionalan način, sa interaktivnom galerijom, detaljnim opisima i kontakt sekcijom.',
      en: 'Elegant web presentation for Prestige Gradnja – a company specializing in the construction and sale of luxury real estate. The site is designed to present projects in a professional manner, with an interactive gallery, detailed descriptions, and a contact section.',
    },
    image: 'https://aislike.rs/aisajt/prestige-min.png',
    tags: {
      sr: ['Web Sajt'],
      en: ['Website'],
    },
    link: 'https://prestigegradnja.rs',
    category: 'web-sajt',
    technologies: ['React', 'Tailwind CSS'],
    year: 2025,
    clientIndustry: {
      sr: 'Nekretnine i Gradnja',
      en: 'Real Estate & Construction',
    },
    features: {
      sr: [
        'Prezentacija projekata i nekretnina',
        'Interaktivna galerija',
        'Moderan i elegantan dizajn',
        'Responzivan za sve uređaje',
        'Kontakt sekcija',
      ],
      en: [
        'Project and property presentation',
        'Interactive gallery',
        'Modern and elegant design',
        'Responsive for all devices',
        'Contact section',
      ],
    },
  },
  {
    id: 'custom-rc-parts',
    slug: 'custom-rc-parts',
    title: 'Custom RC Parts',
    description: {
      sr: 'Ecommerce web sajt',
      en: 'Ecommerce website',
    },
    longDescription: {
      sr: 'Kompletna e-commerce platforma za Custom RC Parts – specijalizovanu online prodavnicu za RC delove i opremu. Web shop uključuje katalog proizvoda, korpu za kupovinu, sistem za plaćanje i praćenje narudžbina.',
      en: 'Complete e-commerce platform for Custom RC Parts – a specialized online store for RC parts and equipment. The web shop includes a product catalog, shopping cart, payment system, and order tracking.',
    },
    image: 'https://aislike.rs/aisajt/rc-min.png',
    tags: {
      sr: ['E-commerce', 'Web Shop'],
      en: ['E-commerce', 'Online Store'],
    },
    link: 'https://customrc.parts',
    category: 'e-commerce',
    technologies: ['React', 'Node.js', 'Stripe', 'MongoDB'],
    year: 2025,
    clientIndustry: {
      sr: 'E-commerce / Hobi',
      en: 'E-commerce / Hobby',
    },
    features: {
      sr: [
        'Katalog proizvoda sa filterima',
        'Korpa za kupovinu',
        'Sistem za online plaćanje',
        'Praćenje narudžbina',
        'Admin panel za upravljanje',
      ],
      en: [
        'Product catalog with filters',
        'Shopping cart',
        'Online payment system',
        'Order tracking',
        'Admin panel for management',
      ],
    },
  },
  {
    id: 'white-club',
    slug: 'white-club',
    title: 'White Club',
    description: {
      sr: 'Online rezervacije',
      en: 'Online reservations',
    },
    longDescription: {
      sr: 'Web sajt za White Club sa integrisanim sistemom za online rezervacije. Moderan dizajn koji odražava premium brend kluba, sa jednostavnim procesom rezervacije i informacijama o događajima.',
      en: 'Website for White Club with an integrated online reservation system. Modern design reflecting the premium club brand, with a simple reservation process and event information.',
    },
    image: 'https://aislike.rs/aisajt/white-min.png',
    tags: {
      sr: ['Web Sajt', 'Rezervacije'],
      en: ['Website', 'Reservations'],
    },
    link: 'https://whiteclub.rs',
    category: 'web-sajt',
    technologies: ['React', 'Tailwind CSS', 'Booking API'],
    year: 2025,
    clientIndustry: {
      sr: 'Ugostiteljstvo i Zabava',
      en: 'Hospitality & Entertainment',
    },
    features: {
      sr: [
        'Online sistem za rezervacije',
        'Prikaz događaja i programa',
        'Premium dizajn',
        'Responzivan za sve uređaje',
        'Integracija sa booking sistemom',
      ],
      en: [
        'Online reservation system',
        'Event and program display',
        'Premium design',
        'Responsive for all devices',
        'Booking system integration',
      ],
    },
  },
  {
    id: 'pokloni-portret',
    slug: 'pokloni-portret',
    title: 'Pokloni Portret',
    description: {
      sr: 'Personalizovani portreti kao poklon',
      en: 'Personalized portraits as gifts',
    },
    longDescription: {
      sr: 'Kreativna web prezentacija za Pokloni Portret – uslugu izrade personalizovanih portreta kao unikatnih poklona. Sajt prikazuje galeriju radova, omogućava naručivanje i pruža inspiraciju za savršen poklon.',
      en: 'Creative web presentation for Pokloni Portret – a personalized portrait service offering unique gifts. The site showcases a gallery of works, enables ordering, and provides inspiration for the perfect gift.',
    },
    image: 'https://aislike.rs/aisajt/pokloniportret-min.png',
    tags: {
      sr: ['Web Sajt', 'Umetnost'],
      en: ['Website', 'Art'],
    },
    link: 'https://pokloniportret.rs',
    category: 'web-sajt',
    technologies: ['React', 'Tailwind CSS'],
    year: 2025,
    clientIndustry: {
      sr: 'Umetnost i Pokloni',
      en: 'Art & Gifts',
    },
    features: {
      sr: [
        'Galerija portreta i radova',
        'Sistem za naručivanje',
        'Kreativni dizajn',
        'Responzivan za sve uređaje',
        'Kontakt formular',
      ],
      en: [
        'Portrait and work gallery',
        'Ordering system',
        'Creative design',
        'Responsive for all devices',
        'Contact form',
      ],
    },
  },
  {
    id: 'in-stan',
    slug: 'in-stan',
    title: 'IN-STAN',
    description: {
      sr: 'Stolarija i nameštaj po meri',
      en: 'Custom carpentry and furniture',
    },
    longDescription: {
      sr: 'Profesionalan web sajt za IN-STAN – stolarski studio specijalizovan za nameštaj po meri. Sajt prezentuje portfolio radova, proces izrade i omogućava klijentima da lako stupe u kontakt za konsultacije.',
      en: 'Professional website for IN-STAN – a carpentry studio specializing in custom furniture. The site presents a work portfolio, manufacturing process, and enables clients to easily get in touch for consultations.',
    },
    image: 'https://aislike.rs/aisajt/instan-min.png',
    tags: {
      sr: ['Web Sajt', 'Stolarija'],
      en: ['Website', 'Carpentry'],
    },
    link: 'https://in-stan.rs',
    category: 'web-sajt',
    technologies: ['React', 'Tailwind CSS'],
    year: 2025,
    clientIndustry: {
      sr: 'Stolarija i Nameštaj',
      en: 'Carpentry & Furniture',
    },
    features: {
      sr: [
        'Portfolio radova sa galerijom',
        'Prikaz procesa izrade',
        'Kontakt formular za konsultacije',
        'Responzivan dizajn',
        'Moderan i čist dizajn',
      ],
      en: [
        'Work portfolio with gallery',
        'Manufacturing process display',
        'Contact form for consultations',
        'Responsive design',
        'Modern and clean design',
      ],
    },
  },
];

export const getProjectBySlug = (slug: string): PortfolioProject | undefined => {
  return portfolioProjects.find((p) => p.slug === slug);
};

export const getProjectsByCategory = (category: PortfolioProject['category']): PortfolioProject[] => {
  return portfolioProjects.filter((p) => p.category === category);
};
