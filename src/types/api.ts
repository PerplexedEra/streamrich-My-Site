import { User, UserStats } from './user';

// Base API response type
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  statusCode: number;
  timestamp: string;
  path: string;
}

// Pagination type for paginated responses
export interface PaginatedResponse<T> extends Omit<ApiResponse<T[]>, 'data'> {
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

// Error response type
export interface ApiError {
  message: string;
  statusCode: number;
  error: string;
  timestamp: string;
  path: string;
  validationErrors?: Array<{
    field: string;
    message: string;
    code: string;
  }>;
}

// Common query parameters for API requests
export interface QueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  [key: string]: any; // For additional query parameters
}

// Authentication types
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData extends LoginCredentials {
  username: string;
  fullName: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// User interface is now imported from './user'
// UserStats interface is now imported from './user'
export interface UserUpdateData {
  fullName?: string;
  bio?: string;
  location?: string;
  website?: string;
  avatarFile?: File;
  coverFile?: File;
}

// Video interface is now imported from './video'
// Import types from video.ts to avoid duplicates
import type { Video, VideoMetadata } from './video';

// VideoUploadData interface is now imported from './video'
// Comment types
export interface Comment {
  id: string;
  content: string;
  userId: string;
  videoId: string;
  parentId: string | null;
  likes: number;
  dislikes: number;
  isEdited: boolean;
  user: Pick<User, 'id' | 'username' | 'avatarUrl'>;
  replies?: Comment[];
  repliesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentData {
  content: string;
  videoId: string;
  parentId?: string;
}

// Playlist types
export interface Playlist {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  isPublic: boolean;
  videoCount: number;
  viewCount: number;
  userId: string;
  user: Pick<User, 'id' | 'username' | 'avatarUrl'>;
  videos: Array<{
    id: string;
    title: string;
    thumbnailUrl: string;
    duration: number;
    views: number;
    user: Pick<User, 'id' | 'username'>;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePlaylistData {
  title: string;
  description?: string;
  isPublic: boolean;
  videoIds?: string[];
}

// Subscription types
export interface Subscription {
  id: string;
  userId: string;
  channelId: string;
  channel: Pick<User, 'id' | 'username' | 'avatarUrl'>;
  isNotificationEnabled: boolean;
  createdAt: string;
}

// Transaction types
export interface Transaction {
  id: string;
  userId: string;
  type: 'earn' | 'spend' | 'withdrawal' | 'deposit' | 'purchase' | 'refund' | 'bonus';
  amount: number;
  currency: 'SRC' | 'USD';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  description: string;
  metadata?: Record<string, any>;
  referenceId?: string;
  createdAt: string;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'reply' | 'subscription' | 'mention' | 'system' | 'earnings' | 'withdrawal';
  title: string;
  message: string;
  isRead: boolean;
  data?: Record<string, any>;
  createdAt: string;
}

// Search types
export interface SearchResults {
  videos: Video[];
  users: User[];
  playlists: Playlist[];
  total: {
    videos: number;
    users: number;
    playlists: number;
  };
}

// Report types
export interface Report {
  id: string;
  reporterId: string;
  reporter: Pick<User, 'id' | 'username'>;
  targetType: 'video' | 'comment' | 'user' | 'channel' | 'playlist';
  targetId: string;
  reason: string;
  status: 'pending' | 'reviewing' | 'resolved' | 'rejected';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReportData {
  targetType: 'video' | 'comment' | 'user' | 'channel' | 'playlist';
  targetId: string;
  reason: string;
  additionalInfo?: string;
}

// Withdrawal types
export interface WithdrawalRequest {
  id: string;
  userId: string;
  amount: number;
  paymentMethod: 'bank' | 'paypal' | 'crypto';
  paymentDetails: Record<string, any>;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  adminNotes?: string;
  processedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWithdrawalRequestData {
  amount: number;
  paymentMethod: 'bank' | 'paypal' | 'crypto';
  paymentDetails: Record<string, any>;
}

// Settings types
export interface UserSettings {
  id: string;
  userId: string;
  notifications: {
    email: {
      general: boolean;
      newFollower: boolean;
      newComment: boolean;
      newReply: boolean;
      videoProcessed: boolean;
      earningsUpdate: boolean;
      newsletter: boolean;
    };
    push: {
      general: boolean;
      newFollower: boolean;
      newComment: boolean;
      newReply: boolean;
      videoProcessed: boolean;
      earningsUpdate: boolean;
    };
  };
  privacy: {
    showSubscriptions: boolean;
    showLikedVideos: boolean;
    showPlaylists: boolean;
    allowMessages: 'everyone' | 'followers' | 'none';
    allowComments: 'everyone' | 'followers' | 'none';
  };
  playback: {
    autoplay: boolean;
    defaultQuality: 'auto' | '144p' | '240p' | '360p' | '480p' | '720p' | '1080p' | '1440p' | '2160p';
    defaultSpeed: number;
    defaultVolume: number;
    loop: boolean;
    captions: boolean;
  };
  billing: {
    defaultPaymentMethod?: string;
    autoRecharge: boolean;
    autoRechargeAmount?: number;
    autoRechargeThreshold?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserSettingsData {
  notifications?: Partial<UserSettings['notifications']>;
  privacy?: Partial<UserSettings['privacy']>;
  playback?: Partial<UserSettings['playback']>;
  billing?: Partial<UserSettings['billing']>;
}

// Analytics types
export interface AnalyticsOverview {
  totalViews: number;
  totalWatchTime: number; // in minutes
  totalEarnings: number;
  subscribers: {
    total: number;
    change: number;
  };
  topVideos: Array<{
    id: string;
    title: string;
    views: number;
    watchTime: number;
    earnings: number;
    thumbnailUrl: string;
  }>;
  viewsByDay: Array<{
    date: string;
    views: number;
    watchTime: number;
  }>;
  trafficSources: Array<{
    source: string;
    views: number;
    percentage: number;
  }>;
  audience: {
    topCountries: Array<{
      country: string;
      code: string;
      views: number;
      percentage: number;
    }>;
    ageGroups: Array<{
      group: string;
      percentage: number;
    }>;
    gender: {
      male: number;
      female: number;
      other: number;
    };
  };
}
