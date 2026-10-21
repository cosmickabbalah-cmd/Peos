export interface MissileAlert {
  id: string;
  timestamp: string;
  type: 'missile' | 'drone' | 'infiltration';
  titleHe: string;
  titleEs: string;
  titleEn: string;
  citiesHe: string[];
  citiesEs: string[];
  zone: string;
  timeToShelterSec: number;
  source: string;
  threatLevel: 'critical' | 'high' | 'medium';
  coordinates: [number, number];
  instructionsEs: string;
}

export interface CommentItem {
  id: string;
  user: string;
  handle: string;
  avatar: string;
  verified?: boolean;
  text: string;
  timestamp: string;
  likes: number;
}

export interface FeedPost {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  verified: boolean;
  badgeType: 'MILITARY' | 'OSINT' | 'GOV' | 'DEFENSE';
  location: string;
  timestamp: string;
  images: string[];
  captionEs: string;
  captionOrig: string;
  langOrig: 'he' | 'en' | 'fa';
  likesCount: number;
  isLiked?: boolean;
  commentsCount: number;
  comments: CommentItem[];
  sharesCount: number;
  isSaved?: boolean;
  tacticalTags: string[];
  threatCategory: 'STRIKE' | 'INTERCEPTION' | 'NAVAL' | 'GEOINT' | 'DIPLOMACY';
  sourceOutlet?: 'mako' | 'i24news' | 'ch13' | 'cnn' | 'foxnews' | 'reuters' | 'telegram';
  sourceUrl?: string;
  headline?: string;
  intelligenceMetrics?: {
    alertZone?: string;
    intercepted?: string;
    weaponSystem?: string;
  };
  analysisEs?: string;
}

export interface StoryItem {
  id: string;
  author: string;
  handle: string;
  avatar: string;
  title: string;
  hasUnseen: boolean;
  priority: 'alert' | 'breaking' | 'intel';
  location: string;
  mediaUrl: string;
  caption: string;
  time: string;
}
