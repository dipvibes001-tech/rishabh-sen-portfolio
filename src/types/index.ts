export interface AdminUser {
  id: string;
  email: string;
  name: string;
  mustChangePassword?: boolean;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  tag: string;
  active: boolean;
  order: number;
}

export type PortfolioCategory =
  | 'Weddings'
  | 'Pre-Weddings'
  | 'Cinematography'
  | 'Events'
  | 'Portraits'
  | 'Commercial';

export interface PortfolioItem {
  id: string;
  title: string;
  category: PortfolioCategory;
  description: string;
  imageUrl: string;
  client?: string;
  year?: string;
  aspect?: 'landscape' | 'portrait' | 'square';
  featured?: boolean;
  active: boolean;
  order: number;
}

export interface Film {
  id: string;
  title: string;
  youtubeUrl: string;
  youtubeId: string;
  thumbnail: string;
  category: string;
  description: string;
  clientName?: string;
  duration?: string;
  featured?: boolean;
  published: boolean;
  order: number;
  createdAt: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  eventType: string;
  review: string;
  rating: number;
  date: string;
  avatarUrl?: string;
  location: string;
}

export interface EnquiryItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: string;
  message: string;
  status: 'unread' | 'read';
  createdAt: string;
}

export interface SiteSettings {
  hero: {
    headline: string;
    subheadline: string;
    tagline: string;
    primaryCtaText: string;
    primaryCtaLink: string;
    secondaryCtaText: string;
    secondaryCtaLink: string;
    backgroundImageUrl: string;
  };
  about: {
    name: string;
    role: string;
    experienceYears: string;
    introduction: string;
    story: string;
    philosophy: string;
    portraitUrl: string;
    stats: Array<{ label: string; value: string; suffix: string }>;
  };
  highlights: Array<{
    id: string;
    title: string;
    subtitle: string;
    description: string;
    icon: string;
  }>;
  featuredStory: {
    title: string;
    subtitle: string;
    location: string;
    description: string;
    fullStory: string;
    imageUrl: string;
    filmDuration?: string;
  };
  contact: {
    email: string;
    phone: string;
    location: string;
    workingHours: string;
    instagram: string;
    youtube: string;
    facebook: string;
    whatsapp: string;
  };
  seo: {
    siteTitle: string;
    metaDescription: string;
    keywords: string;
    ogImage: string;
  };
  footer: {
    bio: string;
    copyrightText: string;
  };
}

export interface PublicContentResponse {
  siteSettings: SiteSettings;
  services: ServiceItem[];
  portfolio: PortfolioItem[];
  films: Film[];
  testimonials: TestimonialItem[];
}

export interface DashboardStats {
  totalPortfolio: number;
  activePortfolio: number;
  totalServices: number;
  activeServices: number;
  totalFilms?: number;
  publishedFilms?: number;
  featuredFilms?: number;
  filmCategories?: string[];
  totalTestimonials: number;
  totalEnquiries: number;
  unreadEnquiries: number;
  recentEnquiries: EnquiryItem[];
}
