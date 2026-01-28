export type BlogCategory = 
  | 'seo'
  | 'izrada-sajtova'
  | 'web-dizajn'
  | 'web-shop'
  | 'case-studies';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  titleEn: string;
  excerpt: string;
  excerptEn: string;
  content: string;
  contentEn: string;
  category: BlogCategory;
  tags?: string[];
  author: {
    name: string;
    image: string;
  };
  coverImage: string;
  publishedAt: string;
  updatedAt: string;
  readTime: number; // minutes
  featured?: boolean;
  // SEO
  metaTitle: string;
  metaTitleEn: string;
  metaDescription: string;
  metaDescriptionEn: string;
  // Internal linking
  relatedPosts?: string[]; // post IDs
  pillarPageLink?: {
    url: string;
    anchor: string;
    anchorEn: string;
  };
}

export interface BlogCategory {
  id: BlogCategory;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  slug: string;
  metaTitle: string;
  metaTitleEn: string;
  metaDescription: string;
  metaDescriptionEn: string;
  icon?: string;
}

export interface TableOfContentsItem {
  id: string;
  text: string;
  level: number; // 2 for H2, 3 for H3
}

