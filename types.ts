
export enum UserRole {
  CONSUMER = 'CONSUMER',
  SHOP_OWNER = 'SHOP_OWNER'
}

export interface WishlistItem {
  id: string;
  name: string;
  category: string;
  inStock: boolean;
  price: number;
}

export interface FeedbackResponse {
  analysis: string;
  sentiment: 'positive' | 'neutral' | 'constructive';
  strategicAction: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface AppConfig {
  id?: number;
  app_name: string;
  logo_url: string;
  twitter_url: string;
  instagram_url: string;
  linkedin_url: string;
  contact_email: string;
  gemini_api_key?: string;
}

export interface AdminStats {
  waitlistCount: number;
  partnerCount: number;
  communityCount: number;
  feedbackCount: number;
}

export interface RoadmapPhase {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  status: 'completed' | 'active' | 'upcoming';
  date_display: string;
  order_index: number;
  icon_key: string;
}
