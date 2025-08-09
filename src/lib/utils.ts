import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.substring(0, length) + '...';
}

export function getYouTubeVideoId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export function getSpotifyTrackId(url: string): string | null {
  const regExp = /spotify:track:([a-zA-Z0-9]+)|open\.spotify\.com\/track\/([a-zA-Z0-9]+)/;
  const match = url.match(regExp);
  return match ? (match[1] || match[2]) : null;
}

export function getEmbedUrl(url: string): string | null {
  const youtubeId = getYouTubeVideoId(url);
  if (youtubeId) {
    return `https://www.youtube.com/embed/${youtubeId}`;
  }
  
  const spotifyId = getSpotifyTrackId(url);
  if (spotifyId) {
    return `https://open.spotify.com/embed/track/${spotifyId}`;
  }
  
  return null;
}

export function getPlatformType(url: string): 'youtube' | 'spotify' | 'other' {
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  if (url.includes('spotify.com') || url.startsWith('spotify:track:')) return 'spotify';
  return 'other';
}

export function calculateEarnings(points: number): number {
  // 1000 points = $5
  return parseFloat((points * 0.005).toFixed(2));
}

export function calculatePointsNeeded(amount: number): number {
  // $1 = 200 points
  return Math.ceil(amount * 200);
}

export function isExternalUrl(url: string): boolean {
  return /^https?:\/\//.test(url);
}

export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

export function formatPercentage(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100);
}
