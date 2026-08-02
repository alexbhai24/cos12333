export type PortfolioCategory =
  | 'Web Development'
  | 'UI/UX'
  | 'AI Projects'
  | 'Robotics'
  | 'Design'
  | 'Writing'
  | 'Video'
  | 'Research'
  | 'Other';

export interface ResourceLink {
  label: string;
  url: string;
  type?: 'github' | 'demo' | 'figma' | 'document' | 'website' | 'other';
}

export interface PortfolioProject {
  id: string;
  title: string;
  shortDescription: string;
  fullDetails: string;
  category: PortfolioCategory;
  skills: string[];
  price?: number;
  deliveryTime?: string; // e.g. "3 Days", "2 Weeks"
  coverImage: string;
  galleryImages: string[];
  videoEmbedUrl?: string; // Sanitized YouTube or Vimeo embed URL
  links: ResourceLink[];
  whatsIncluded?: string[];
  featured?: boolean;
  createdAt: string;
}

export interface ServiceTier {
  tierLevel: 'starter' | 'standard' | 'advanced';
  name: string;
  price: number;
  deliveryTime: string;
  revisions: string;
  features: string[];
  description: string;
}

export interface ContactMethods {
  whatsapp?: string;
  phone?: string;
  email?: string;
  website?: string;
  github?: string;
  linkedin?: string;
  instagram?: string;
}

export interface ContactVisibility {
  whatsapp: 'public' | 'hidden';
  phone: 'public' | 'hidden';
  email: 'public' | 'hidden';
  website: 'public' | 'hidden';
  github: 'public' | 'hidden';
  linkedin: 'public' | 'hidden';
  instagram: 'public' | 'hidden';
}

export interface PortfolioProfile {
  id: string;
  ownerId: string;
  fullName: string;
  publicRoleLabel: string; // e.g. "Class 12 Student", "NEET Aspirant", "TGT (Middle School)", "PGT (Senior Secondary)"
  headline: string;
  bio: string;
  avatarUrl: string;
  profileEffect?: string;
  skills: string[];
  category: PortfolioCategory;
  projects: PortfolioProject[];
  serviceTiers?: ServiceTier[];
  contacts: ContactMethods;
  contactVisibility: ContactVisibility;
  status: 'draft' | 'published';
  achievementBadge?: 'Rising Talent' | 'Top Rated' | 'Featured';
  rating?: number;
  reviewCount?: number;
  viewsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioFilters {
  search: string;
  category: string;
  skills: string[];
  minPrice: number | null;
  maxPrice: number | null;
  deliveryTime: string; // 'Any', '24 Hours', 'Under 7 Days', 'Under 21 Days'
  talentDetails: string[]; // e.g. badges, top rated
  sortBy: 'most_recent' | 'most_popular' | 'highest_rated' | 'lowest_price';
}
