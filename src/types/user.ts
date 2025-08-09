// User related types
export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  coverImageUrl?: string;
  bio?: string;
  location?: string;
  website?: string;
  isVerified: boolean;
  isActive: boolean;
  role: 'user' | 'creator' | 'admin' | 'moderator';
  createdAt: string;
  updatedAt: string;
  stats?: UserStats;
  preferences?: UserPreferences;
  socialLinks?: UserSocialLinks;
  wallet?: UserWallet;
  subscription?: UserSubscription;
}

export interface UserStats {
  totalVideos: number;
  totalPlaylists: number;
  totalLikes: number;
  totalDislikes: number;
  totalComments: number;
  totalViews: number;
  totalWatchTime: number;
  totalSubscribers: number;
  totalSubscriptions: number;
  totalEarned: number;
  totalSpent: number;
  totalWithdrawn: number;
  totalAvailable: number;
  last30Days: {
    views: number;
    watchTime: number;
    subscribers: number;
    earnings: number;
    spendings: number;
  };
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  playbackQuality: 'auto' | '144p' | '240p' | '360p' | '480p' | '720p' | '1080p' | '1440p' | '2160p';
  autoplay: boolean;
  captions: boolean;
  annotations: boolean;
  playbackSpeed: number;
  defaultVolume: number;
  videoLoop: boolean;
  keyboardShortcuts: boolean;
  restrictedMode: boolean;
}

export interface UserSocialLinks {
  youtube?: string;
  twitter?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  twitch?: string;
  linkedin?: string;
  github?: string;
  discord?: string;
  patreon?: string;
  website?: string;
}

export interface UserWallet {
  balance: number;
  totalEarned: number;
  totalSpent: number;
  totalWithdrawn: number;
  currency: string;
  paymentMethods: PaymentMethod[];
  transactions: Transaction[];
  withdrawalHistory: Withdrawal[];
}

export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'paypal' | 'bank_account' | 'crypto';
  details: Record<string, any>;
  isDefault: boolean;
  createdAt: string;
}

// Import Transaction from api to extend it
import { Transaction as ApiTransaction } from './api';

export interface Transaction extends Omit<ApiTransaction, 'userId' | 'metadata'> {
  // Add any user-specific transaction properties here
}

export interface Withdrawal {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  paymentMethod: PaymentMethod;
  fee: number;
  netAmount: number;
  processedAt?: string;
  completedAt?: string;
  createdAt: string;
}

export interface UserSubscription {
  id: string;
  plan: 'free' | 'basic' | 'pro' | 'premium';
  status: 'active' | 'cancelled' | 'expired' | 'paused' | 'pending';
  startDate: string;
  endDate?: string;
  autoRenew: boolean;
  paymentMethod?: PaymentMethod;
  nextBillingDate?: string;
  price: number;
  currency: string;
  features: string[];
  cancellationReason?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
}
