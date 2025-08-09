import { User } from './user';

// Video related types
export interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnailUrl: string;
  duration: number; // in seconds
  views: number;
  likes: number;
  dislikes: number;
  commentCount: number;
  isPublished: boolean;
  isMonetized: boolean;
  isPremium: boolean;
  price?: number;
  category: string;
  tags: string[];
  privacy: 'public' | 'private' | 'unlisted';
  status: 'processing' | 'processed' | 'failed' | 'pending';
  userId: string;
  user: Pick<User, 'id' | 'username' | 'avatarUrl'>;
  createdAt: string;
  updatedAt: string;
  metadata?: VideoMetadata;
}

export interface VideoMetadata {
  width: number;
  height: number;
  format: string;
  size: number; // in bytes
  duration: number; // in seconds
  aspectRatio: string;
  hasAudio: boolean;
  hasVideo: boolean;
  codec: string;
  frameRate: number;
  bitrate: number;
}

export interface VideoUploadData {
  title: string;
  description?: string;
  file: File;
  thumbnail?: File;
  category: string;
  tags?: string[];
  isMonetized: boolean;
  isPremium: boolean;
  price?: number;
  privacy: 'public' | 'private' | 'unlisted';
  license?: 'standard' | 'creative-commons' | 'custom';
  allowComments?: boolean;
  allowEmbedding?: boolean;
  notifySubscribers?: boolean;
  schedulePublish?: string; // ISO date string
  endScreen?: {
    type: 'video' | 'playlist' | 'subscribe' | 'link';
    data: any;
  };
  cards?: Array<{
    type: 'video' | 'playlist' | 'link';
    title: string;
    url: string;
    teaserText?: string;
    callToAction?: string;
    startTime: number; // in seconds
    endTime: number; // in seconds
  }>;
}

export interface VideoUpdateData {
  title?: string;
  description?: string;
  thumbnail?: File;
  category?: string;
  tags?: string[];
  isMonetized?: boolean;
  isPremium?: boolean;
  price?: number;
  privacy?: 'public' | 'private' | 'unlisted';
  allowComments?: boolean;
  allowEmbedding?: boolean;
  endScreen?: {
    type: 'video' | 'playlist' | 'subscribe' | 'link';
    data: any;
  } | null;
  cards?: Array<{
    type: 'video' | 'playlist' | 'link';
    title: string;
    url: string;
    teaserText?: string;
    callToAction?: string;
    startTime: number;
    endTime: number;
  }> | null;
}

export interface VideoAnalytics {
  // Core metrics
  videoId: string;
  totalViews: number;
  watchTime: number; // in minutes
  averageViewDuration: number; // in seconds
  averageWatchPercentage: number; // 0-100
  uniqueViewers: number;
  subscribersGained: number;
  subscribersLost: number;
  likes: number;
  dislikes: number;
  comments: number;
  shares: number;
  impressions: number;
  impressionClickThroughRate: number; // 0-100

  // Monetization data
  monetization: {
    estimatedRevenue: number;
    rpm: number; // Revenue per 1000 views
    cpm: number; // Cost per 1000 impressions
    playbackBasedCpm: number;
  };

  // Traffic sources data
  trafficSources: Array<{
    source: 'direct' | 'external' | 'search' | 'suggested' | 'playlist' | 'channel' | 'other';
    views: number;
    watchTime: number;
    averageViewDuration: number;
  }>;

  // Device data
  devices: Array<{
    device: 'desktop' | 'mobile' | 'tablet' | 'tv' | 'console' | 'other';
    views: number;
    watchTime: number;
  }>;

  // Browser data
  browsers: Array<{
    browser: string;
    views: number;
    watchTime: number;
  }>;

  // Operating systems data
  operatingSystems: Array<{
    os: string;
    views: number;
    watchTime: number;
    averageViewDuration: number;
  }>;

  // Geographic data
  geographics: Array<{
    country: string;
    countryCode: string;
    views: number;
    watchTime: number;
    averageViewDuration: number;
  }>;

  // Date-based analytics
  dates: Array<{
    date: string; // YYYY-MM-DD
    views: number;
    watchTime: number;
    averageViewDuration: number;
  }>;

  // Audience retention data
  audienceRetention: Array<{
    second: number;
    retentionPercentage: number; // 0-100
    views: number;
  }>;

  // Top performing content
  topVideos: Array<{
    videoId: string;
    title: string;
    views: number;
    watchTime: number;
    averageViewDuration: number;
  }>;

  topPlaylists: Array<{
    playlistId: string;
    title: string;
    views: number;
    watchTime: number;
  }>;

  // Card and annotation data
  topCards: Array<{
    cardId: string;
    type: 'video' | 'playlist' | 'link' | 'subscribe';
    title: string;
    clicks: number;
    clickThroughRate: number; // 0-100
  }>;

  endScreens: Array<{
    elementType: 'video' | 'playlist' | 'subscribe' | 'link';
    clicks: number;
    clickThroughRate: number;
  }>;

  annotations: Array<{
    annotationId: string;
    type: 'card' | 'endScreen' | 'infoCard';
    title: string;
    clicks: number;
    clickThroughRate: number;
  }>;

  // Revenue data
  revenueSources: Array<{
    source: 'advertising' | 'subscriptions' | 'superChat' | 'superStickers' | 'merchandise' | 'donations' | 'other';
    amount: number;
    percentage: number; // 0-100
  }>;

  // Ad performance data
  adPerformance: {
    totalImpressions: number;
    totalRevenue: number;
    cpm: number;
    fillRate: number; // 0-100
    monetizedPlaybacks: number;
    playbackBasedCpm: number;
    adTypes: {
      skippableVideoAds: {
        impressions: number;
        revenue: number;
        cpm: number;
        viewRate: number;
        skippableVideoAdFormat: string;
      };
      displayAds: {
        impressions: number;
        revenue: number;
        cpm: number;
        clickThroughRate: number;
      };
      bumperAds: {
        impressions: number;
        revenue: number;
        cpm: number;
        viewRate: number;
      };
      nonSkippableVideoAds: {
        impressions: number;
        revenue: number;
        cpm: number;
        viewRate: number;
      };
    };
  };

  // Engagement metrics
  engagement: {
    averageViewDuration: number;
    averagePercentageViewed: number; // 0-100
    audienceRetention: number; // 0-100
    likes: number;
    dislikes: number;
    comments: number;
    shares: number;
    subscribersGained: number;
    subscribersLost: number;
    favoritesAdded: number;
    favoritesRemoved: number;
  };

  // Playback details
  playbackDetails: {
    autoplay: number;
    clickToPlay: number;
    viewThrough: number;
    embedExternal: number;
    embedInternal: number;
    playlists: number;
    channels: number;
    browseFeatures: number;
    notifications: number;
    endScreen: number;
    cards: number;
    playlistsPage: number;
    channelPage: number;
    watchPage: number;
    other: number;
  };

  // Device type distribution
  deviceTypes: {
    desktop: number;
    mobile: number;
    tablet: number;
    tv: number;
    gameConsole: number;
    unknown: number;
  };
}
