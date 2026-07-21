export enum ArticleStatus {
  DRAFT = "DRAFT",
  REVIEW_EDITOR = "REVIEW_EDITOR",
  REVISION = "REVISION",
  REVIEW_REDAKTUR = "REVIEW_REDAKTUR",
  PEMRED_APPROVAL = "PEMRED_APPROVAL",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
}

export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  PEMILIK = "PEMILIK",
  PEMIMPIN_REDAKSI = "PEMIMPIN_REDAKSI",
  REDAKTUR = "REDAKTUR",
  EDITOR = "EDITOR",
  WARTAWAN = "WARTAWAN",
  KONTRIBUTOR = "KONTRIBUTOR",
  FOTOGRAFER = "FOTOGRAFER",
  VIDEOGRAFER = "VIDEOGRAFER",
  SOCIAL_MEDIA_ADMIN = "SOCIAL_MEDIA_ADMIN",
  IKLAN = "IKLAN",
  KEUANGAN = "KEUANGAN",
}

export interface SEOData {
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
}

export interface GPSCoords {
  lat: number;
  lng: number;
}

export interface Article {
  id: string;
  title: string;
  subTitle?: string;
  summary: string;
  content: string; // HTML format
  bodyJson?: any; // ProseMirror/Tiptap JSON format
  coverImage: string;
  galleryImages: string[];
  videoUrl?: string; // YouTube Embed URL or uploaded MP4
  audioUrl?: string; // For text-to-speech audio
  author: string;
  editor: string;
  photographer?: string;
  videographer?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  location: string;
  gpsCoords?: GPSCoords;
  category: string;
  subCategory?: string;
  tags: string[];
  views: number;
  shares: number;
  likes: number;
  bookmarks: number;
  isBreaking: boolean;
  isHeadline: boolean;
  isTrending: boolean;
  isEditorialChoice: boolean;
  isFeatured: boolean;
  isSticky: boolean;
  status: ArticleStatus;
  scheduledPublish?: string; // Date String YYYY-MM-DDTHH:mm
  seo: SEOData;
}

export interface Comment {
  id: string;
  articleId: string;
  user: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  reported: boolean;
  sentiment?: "positive" | "neutral" | "negative";
  isModerated: boolean; // Managed by AI Auto-moderation
  replies: Comment[];
}

export interface AdBanner {
  id: string;
  title: string;
  position: "header" | "sidebar" | "center" | "footer" | "popup" | "floating" | "sticky";
  type: "adsense" | "manager" | "internal" | "html" | "video";
  adUrl: string;
  imageUrl?: string;
  htmlContent?: string;
  views: number;
  clicks: number;
  active: boolean;
}

export interface AuditLog {
  id: string;
  userId: string;
  userEmail: string;
  role: UserRole;
  action: string;
  details: string;
  timestamp: string;
}

export interface MediaItem {
  id: string;
  name: string;
  type: "photo" | "video" | "audio" | "pdf" | "document" | "zip";
  url: string;
  size: string;
  folder: string;
  tags: string[];
  created_at: string;
}

export interface InternalNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  category: "workflow" | "deadline" | "system";
  read: boolean;
}

export interface Poll {
  id: string;
  question: string;
  options: { id: string; text: string; votes: number }[];
  totalVotes: number;
  active: boolean;
}

export interface ThemeSettings {
  primaryColor: string; // hex
  fontFamily: string;
  layoutDensity: "compact" | "normal" | "spacious";
}

export interface ValasRate {
  code: string;
  rate: string;
  change: string;
}

export type OpeningBannerPosition = "center" | "bottom_right" | "bottom_left" | "fullscreen";
export type OpeningBannerAnimation = "fade" | "zoom" | "slide_up" | "bounce";
export type OpeningBannerPageTarget = "home" | "dashboard" | "all" | "article";
export type OpeningBannerInterval = "always" | "1h" | "6h" | "12h" | "24h";

export interface OpeningBanner {
  id: string;
  title: string;
  subtitle?: string;
  subTitle?: string;
  imageUrl: string;
  buttonText: string;
  buttonLink: string;
  isActive: boolean;
  status?: "published" | "draft";
  startDate?: string | null;
  endDate?: string | null;
  displayPosition?: OpeningBannerPosition;
  animation?: OpeningBannerAnimation;
  animationDuration?: number;
  animationStyle?: "zoom" | "fade" | "slide";
  shadowStyle?: "soft" | "medium" | "glow";
  overlayColor?: string;
  overlayOpacity?: number;
  displayInterval?: OpeningBannerInterval;
  displayFrequency?: "once_per_session" | "always" | "once_per_day";
  displayDelaySeconds?: number;
  autoCloseSeconds?: number;
  blurBackdrop?: boolean;
  showOnce?: boolean;
  pageTarget?: OpeningBannerPageTarget;
  targetPages?: ("home" | "dashboard" | "all" | "article")[];
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

