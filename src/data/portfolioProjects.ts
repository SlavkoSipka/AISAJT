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
  /** When true the outbound client link is rendered rel="nofollow" so page authority isn't passed on. */
  nofollow?: boolean;
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
    id: 'zipa-photo',
    slug: 'zipa-photo',
    title: 'ZIPA Photo',
    description: {
      sr: 'Foto agencija sa bazom fotografija',
      en: 'Photo agency with a searchable image database',
    },
    longDescription: {
      sr: 'Web platforma za ZIPA Photo – foto agenciju sa velikom bazom novinskih i dokumentarnih fotografija. Sajt uključuje naprednu pretragu sa detaljnim filterima, organizaciju po kategorijama i galerijama, korisničke naloge, vodeni žig na fotografijama i dvojezični interfejs za tržišta Srbije i regiona.',
      en: 'Web platform for ZIPA Photo – a photo agency with a large database of news and documentary photography. The site includes advanced search with detailed filters, organization by categories and galleries, user accounts, image watermarking, and a bilingual interface for the Serbian and regional markets.',
    },
    image: '/images/portfolio/zipaphoto.webp',
    tags: {
      sr: ['Platforma', 'Foto Agencija', 'Pretraga'],
      en: ['Platform', 'Photo Agency', 'Search'],
    },
    link: 'https://zipaphoto.net',
    nofollow: true,
    category: 'web-sajt',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'SEO'],
    year: 2026,
    clientIndustry: {
      sr: 'Mediji i Fotografija',
      en: 'Media & Photography',
    },
    features: {
      sr: [
        'Napredna pretraga baze fotografija',
        'Kategorije, galerije i tematske celine',
        'Korisnički nalozi i registracija',
        'Vodeni žig i zaštita fotografija',
        'Dvojezični interfejs',
      ],
      en: [
        'Advanced photo database search',
        'Categories, galleries, and themed collections',
        'User accounts and registration',
        'Watermarking and image protection',
        'Bilingual interface',
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
    image: '/images/portfolio/prestige-gradnja.webp',
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
    image: '/images/portfolio/custom-rc-parts.webp',
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
    id: 'izorv',
    slug: 'izorv',
    title: 'Inicijativa za Održivi Razvoj Vrbovskog',
    description: {
      sr: 'Web sajt za udruženje i lokalnu zajednicu',
      en: 'Website for an association and local community',
    },
    longDescription: {
      sr: 'Web prezentacija za udruženje Inicijativa za održivi razvoj naselja Vrbovski. Sajt objašnjava ciljeve održivog razvoja u skladu sa Agendom 2030, predstavlja projekte i aktivnosti udruženja, saradnju sa institucijama i partnerima, i poziva članove zajednice da se aktivno uključe.',
      en: 'Web presentation for the Initiative for Sustainable Development of the Vrbovski settlement. The site explains sustainable development goals aligned with Agenda 2030, presents the association’s projects and activities, cooperation with institutions and partners, and invites community members to get actively involved.',
    },
    image: '/images/portfolio/izorv.webp',
    tags: {
      sr: ['Web Sajt', 'Udruženje', 'Zajednica'],
      en: ['Website', 'Association', 'Community'],
    },
    link: 'https://izorv.org',
    nofollow: true,
    category: 'web-sajt',
    technologies: ['React', 'Tailwind CSS', 'SEO'],
    year: 2026,
    clientIndustry: {
      sr: 'Neprofitni Sektor i Održivi Razvoj',
      en: 'Nonprofit & Sustainable Development',
    },
    features: {
      sr: [
        'Prezentacija ciljeva održivog razvoja',
        'Sekcija projekata i aktivnosti udruženja',
        'Stranica za saradnju i partnere',
        'Poziv zajednici na uključivanje',
        'Responzivan dizajn za sve uređaje',
      ],
      en: [
        'Presentation of sustainable development goals',
        'Projects and activities section',
        'Cooperation and partners page',
        'Community involvement call to action',
        'Responsive design for all devices',
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
    image: '/images/portfolio/in-stan.webp',
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
  {
    id: 'egic-gradnja',
    slug: 'egic-gradnja',
    title: 'Egić Gradnja',
    description: {
      sr: 'Web sajt za građevinsku firmu iz Subotice',
      en: 'Website for a construction company from Subotica',
    },
    longDescription: {
      sr: 'Kompletna izrada web sajta za Egić Gradnja – građevinsku firmu iz Subotice sa preko 20 godina iskustva u projektovanju, inženjeringu i izvođenju radova. Sajt jasno prikazuje vrste radova na industrijskim, poljoprivrednim, poslovnim i stambenim objektima, proces rada po sistemu „ključ u ruke" i galeriju realizovanih projekata, uz naglašen poziv na traženje ponude.',
      en: 'Complete website development for Egić Gradnja – a construction company from Subotica with over 20 years of experience in design, engineering, and construction works. The site clearly presents work on industrial, agricultural, commercial, and residential buildings, the turnkey process, and a gallery of completed projects, with a prominent request-a-quote call to action.',
    },
    image: '/images/portfolio/egic-gradnja.webp',
    tags: {
      sr: ['Web Sajt', 'Građevina', 'SEO'],
      en: ['Website', 'Construction', 'SEO'],
    },
    link: 'https://egicgradnja.rs',
    nofollow: true,
    category: 'web-sajt',
    technologies: ['React', 'Tailwind CSS', 'SEO'],
    year: 2026,
    clientIndustry: {
      sr: 'Građevinarstvo i Inženjering',
      en: 'Construction & Engineering',
    },
    features: {
      sr: [
        'Prikaz usluga projektovanja i izvođenja radova',
        'Galerija realizovanih objekata',
        'Sekcija „Kako radimo" sa procesom saradnje',
        'Forma za traženje ponude',
        'SEO optimizacija za lokalne pretrage u Subotici',
      ],
      en: [
        'Design and construction services overview',
        'Gallery of completed buildings',
        '"How we work" section with the collaboration process',
        'Request-a-quote form',
        'SEO optimization for local searches in Subotica',
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
    image: '/images/portfolio/white-club.webp',
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
    id: 'komotraks',
    slug: 'komotraks',
    title: 'Komotraks',
    description: {
      sr: 'Komarnici, harmonika vrata i zavese – Beograd',
      en: 'Insect screens, folding doors and blinds – Belgrade',
    },
    longDescription: {
      sr: 'Web sajt za Komotraks – firmu specijalizovanu za ugradnju komarnika, harmonika vrata i zavesa po meri u Beogradu. Sajt je izgrađen kao lead-gen platforma sa jasno istaknutim brojem telefona, formom za zakazivanje besplatnog merenja i lokalnim SEO-om za beogradske opštine – Novi Beograd, Vračar, Zvezdaru, Voždovac i Palilulu.',
      en: 'Website for Komotraks – a company specializing in custom installation of insect screens, folding doors, and blinds in Belgrade. The site is built as a lead-gen platform with a prominent phone number, a free measurement booking form, and local SEO for Belgrade municipalities.',
    },
    image: '/images/portfolio/komotraks.webp',
    tags: {
      sr: ['Web Sajt', 'Lead Gen', 'Lokalni SEO'],
      en: ['Website', 'Lead Gen', 'Local SEO'],
    },
    link: 'https://ugradnja-zavesa-komarnika.com',
    nofollow: true,
    category: 'web-sajt',
    technologies: ['React', 'Tailwind CSS', 'SEO'],
    year: 2026,
    clientIndustry: {
      sr: 'Građevinska Stolarija i Montaža',
      en: 'Building Joinery & Installation',
    },
    features: {
      sr: [
        'Istaknut broj telefona i poziv na akciju',
        'Forma za zakazivanje besplatnog merenja',
        'Lokalni SEO za beogradske opštine',
        'Galerija izvedenih radova',
        'Blog sekcija za organski saobraćaj',
      ],
      en: [
        'Prominent phone number and call to action',
        'Free measurement booking form',
        'Local SEO for Belgrade municipalities',
        'Gallery of completed installations',
        'Blog section for organic traffic',
      ],
    },
  },
  {
    id: 'nicemodels',
    slug: 'nicemodels',
    title: 'NiceModels.ch',
    description: {
      sr: 'Oglasna platforma i direktorijum za Švajcarsku',
      en: 'Listings platform and directory for Switzerland',
    },
    longDescription: {
      sr: 'Kompleksna oglasna platforma i direktorijum za švajcarsko tržište, sa korisničkim nalozima, objavljivanjem i uređivanjem oglasa, premium pozicioniranjem, pretragom po regionu i gradu, brojačima pregleda i višejezičnim interfejsom. Platforma uključuje moderaciju sadržaja, verifikaciju naloga i sistem komentara.',
      en: 'A complex listings platform and directory for the Swiss market, featuring user accounts, listing publishing and editing, premium placement, region and city search, view counters, and a multilingual interface. The platform includes content moderation, account verification, and a comment system.',
    },
    image: '/images/portfolio/nicemodels.webp',
    tags: {
      sr: ['Platforma', 'Direktorijum', 'Višejezično'],
      en: ['Platform', 'Directory', 'Multilingual'],
    },
    link: 'https://nicemodels.ch',
    nofollow: true,
    category: 'web-sajt',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'SEO'],
    year: 2026,
    clientIndustry: {
      sr: 'Online Platforme i Direktorijumi',
      en: 'Online Platforms & Directories',
    },
    features: {
      sr: [
        'Korisnički nalozi i registracija',
        'Objavljivanje i uređivanje oglasa',
        'Premium pozicioniranje oglasa',
        'Pretraga po regionu, gradu i filterima',
        'Višejezični interfejs i moderacija sadržaja',
      ],
      en: [
        'User accounts and registration',
        'Listing publishing and editing',
        'Premium listing placement',
        'Search by region, city, and filters',
        'Multilingual interface and content moderation',
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
    id: 'digital-business-grgic',
    slug: 'digital-business-grgic',
    title: 'Digital Business Grgic',
    description: {
      sr: 'Web sajt za švajcarski digitalni studio',
      en: 'Website for a Swiss digital studio',
    },
    longDescription: {
      sr: 'Moderna web prezentacija za Digital Business Grgic – švajcarski digitalni studio iz Nussbaumena koji radi na nacionalnom i međunarodnom tržištu. Sajt predstavlja usluge izrade sajtova, online prodavnica, oglasnih platformi, automatizacije i digitalnog savetovanja, sa tamnim premium dizajnom, dvojezičnim sadržajem (DE/EN) i sistemom za zakazivanje razgovora.',
      en: 'Modern web presentation for Digital Business Grgic – a Swiss digital studio from Nussbaumen operating nationally and internationally. The site presents website development, online stores, listing platforms, automation, and digital consulting services, with a dark premium design, bilingual content (DE/EN), and a call booking system.',
    },
    image: '/images/portfolio/digital-business.webp',
    tags: {
      sr: ['Web Sajt', 'Dvojezično', 'Premium Dizajn'],
      en: ['Website', 'Bilingual', 'Premium Design'],
    },
    link: 'https://digital-business-mg.com',
    nofollow: true,
    category: 'web-sajt',
    technologies: ['React', 'Tailwind CSS', 'SEO'],
    year: 2026,
    clientIndustry: {
      sr: 'Digitalne Usluge i Konsalting',
      en: 'Digital Services & Consulting',
    },
    features: {
      sr: [
        'Tamni premium dizajn sa animacijama',
        'Dvojezični sadržaj (nemački i engleski)',
        'Detaljan prikaz usluga studija',
        'Sistem za zakazivanje razgovora',
        'Responzivan dizajn i brze performanse',
      ],
      en: [
        'Dark premium design with animations',
        'Bilingual content (German and English)',
        'Detailed service overview',
        'Call booking system',
        'Responsive design and fast performance',
      ],
    },
  },
  {
    id: 'bora-company',
    slug: 'bora-company',
    title: 'Bora Company',
    description: {
      sr: 'Web sajt za CNC obradu i metaloprerađivačku industriju',
      en: 'Website for CNC machining and metalworking',
    },
    longDescription: {
      sr: 'Web sajt za Bora Company – firmu specijalizovanu za preciznu CNC obradu, izradu specijalnih delova i površinsku zaštitu metala (cinkovanje, niklovanje). Sajt je namenjen pre svega nemačkom govornom području, sa dvojezičnim interfejsom (DE/EN), portfolijom izrađenih delova, galerijom mašinskog parka i formom za traženje ponude.',
      en: 'Website for Bora Company – a firm specializing in precision CNC machining, custom part manufacturing, and metal surface treatment (galvanizing, nickel plating). The site targets primarily German-speaking markets, with a bilingual interface (DE/EN), a portfolio of manufactured parts, a machine park gallery, and a quote request form.',
    },
    image: '/images/portfolio/bora-company.webp',
    tags: {
      sr: ['Web Sajt', 'Industrija', 'Dvojezično'],
      en: ['Website', 'Industry', 'Bilingual'],
    },
    link: 'https://boracompany.ch',
    nofollow: true,
    category: 'web-sajt',
    technologies: ['React', 'Tailwind CSS', 'SEO'],
    year: 2026,
    clientIndustry: {
      sr: 'Metaloprerađivačka Industrija',
      en: 'Metalworking Industry',
    },
    features: {
      sr: [
        'Dvojezični interfejs (nemački i engleski)',
        'Portfolio izrađenih delova',
        'Galerija mašinskog parka i procesa',
        'Forma za traženje ponude',
        'Prikaz usluga površinske zaštite',
      ],
      en: [
        'Bilingual interface (German and English)',
        'Portfolio of manufactured parts',
        'Machine park and process gallery',
        'Quote request form',
        'Surface treatment services overview',
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
