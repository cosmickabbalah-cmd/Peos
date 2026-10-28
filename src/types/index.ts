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

export type AppLanguage = 'es' | 'en' | 'fr' | 'he';

export interface FeedPost {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  verified: boolean;
  badgeType: 'MILITARY' | 'OSINT' | 'GOV' | 'DEFENSE';
  location: string;
  timestamp: string;
  createdAt?: number;
  images: string[];
  captionEs: string;
  captionEn?: string;
  captionFr?: string;
  captionHe?: string;
  captionOrig: string;
  langOrig: 'he' | 'en' | 'fa';
  likesCount: number;
  isLiked?: boolean;
  commentsCount: number;
  comments: CommentItem[];
  sharesCount: number;
  isSaved?: boolean;
  tacticalTags: string[];
  threatCategory: 'STRIKE' | 'INTERCEPTION' | 'NAVAL' | 'GEOINT' | 'DIPLOMACY' | 'POLITICS' | 'SOCIETY' | 'TECH' | 'ECONOMY' | 'CULTURE' | 'SPORTS' | 'ADVOCACY' | 'REGIONS' | 'DEFENSE' | string;
  regionTag?: 'north' | 'center' | 'jerusalem' | 'south' | 'national' | 'international' | string;
  sourceOutlet?: 'mako' | 'i24news' | 'ch13' | 'standwithus' | 'iran' | 'internacional' | 'international' | 'bbc' | 'cnn' | 'foxnews' | 'reuters' | 'telegram' | string;
  sourceUrl?: string;
  whatsappUrl?: string;
  headline?: string;
  headlineEs?: string;
  headlineEn?: string;
  headlineFr?: string;
  headlineHe?: string;
  intelligenceMetrics?: {
    alertZone?: string;
    intercepted?: string;
    weaponSystem?: string;
  };
  analysisEs?: string;
  analysisEn?: string;
  analysisFr?: string;
}

export interface StoryItem {
  id: string;
  author: string;
  handle: string;
  avatar: string;
  title: string;
  titleEs?: string;
  titleEn?: string;
  titleFr?: string;
  titleHe?: string;
  hasUnseen: boolean;
  priority: 'alert' | 'breaking' | 'intel';
  location: string;
  mediaUrl: string;
  caption: string;
  captionEs?: string;
  captionEn?: string;
  captionFr?: string;
  captionHe?: string;
  time: string;
  whatsappUrl?: string;
  sourceUrl?: string;
}

export interface ChannelCheckReport {
  channelId: string;
  channelName: string;
  icon: string;
  checkedAt: string;
  hasNew: boolean;
  statusMessage: string;
  newPostId?: string;
  newHeadline?: string;
}

export interface NewsUpdateResult {
  hasNew: boolean;
  newCount: number;
  newPosts: FeedPost[];
  latestUpdateTimestamp: string;
  channelsReport: ChannelCheckReport[];
  checkedCount: number;
  unchangedChannelsCount: number;
  auditSummary: string;
}
