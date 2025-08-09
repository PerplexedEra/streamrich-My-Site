'use client';

import { useState, KeyboardEvent } from 'react';
import { Icons } from '@/components/icons';

type Creator = {
  name: string;
  avatar: string;
};

type Video = {
  id: string;
  title: string;
  artist: string;
  description: string;
  thumbnail: string;
  type: 'VIDEO' | 'MUSIC';
  views: string;
  likes: string;
  creator: Creator;
};

type Track = {
  id: string;
  title: string;
  artist: string;
  url: string;
};

// Featured videos data
const featuredVideos: Video[] = [
  {
    id: '8xg3vE8Ie_E',
    title: 'Love Story',
    artist: 'Taylor Swift',
    description: 'Official music video for "Love Story" by Taylor Swift',
    thumbnail: 'https://img.youtube.com/vi/8xg3vE8Ie_E/maxresdefault.jpg',
    type: 'VIDEO',
    views: '1.2M',
    likes: '95K',
    creator: {
      name: 'Taylor Swift',
      avatar: '/avatars/taylor-swift.jpg',
    },
  },
  {
    id: 'gcImhcAGhi0',
    title: 'See Through',
    artist: 'Chris Brown',
    description: 'Official music video for "See Through" by Chris Brown',
    thumbnail: 'https://img.youtube.com/vi/gcImhcAGhi0/maxresdefault.jpg',
    type: 'VIDEO',
    views: '45.7M',
    likes: '1.2M',
    creator: {
      name: 'Chris Brown',
      avatar: '/avatars/chris-brown.jpg',
    },
  },
  {
    id: 'y7CTlBUsmHs',
    title: 'Houstatlantavegas',
    artist: 'Drake',
    description: 'Official music video for "Houstatlantavegas" by Drake',
    thumbnail: 'https://img.youtube.com/vi/y7CTlBUsmHs/maxresdefault.jpg',
    type: 'VIDEO',
    views: '32.5M',
    likes: '850K',
    creator: {
      name: 'Drake',
      avatar: '/avatars/drake.jpg',
    },
  },
];

// Spotify tracks data
const spotifyTracks: Track[] = [
  {
    id: '36OY6n5JeZVJH6uNr5iSkW',
    title: "Life's a Party",
    artist: 'Luwbayne',
    url: 'https://open.spotify.com/track/36OY6n5JeZVJH6uNr5iSkW?si=7q_GfxQpQ1Oq4i0OpV-oNQ&context=spotify%3Aalbum%3A2CcEmmD7YTkdKPV4BRfVD3',
  },
  {
    id: '3PFaFVWq5wucLu6s4baj9D',
    title: 'Girl',
    artist: 'The Internet',
    url: 'https://open.spotify.com/track/3PFaFVWq5wucLu6s4baj9D?si=tuO99vTSSP6SMWlYiBCKYA',
  },
  {
    id: '0y60itmpH0aPKsFiGxmtnh',
    title: 'Wait A Minute',
    artist: 'Willow Smith',
    url: 'https://open.spotify.com/track/0y60itmpH0aPKsFiGxmtnh?si=20huTPYgTfCDREVkxIjdqg',
  },
  {
    id: '4osgfFTICMkcGbbigdsa53',
    title: 'Novacane',
    artist: 'Frank Ocean',
    url: 'https://open.spotify.com/track/4osgfFTICMkcGbbigdsa53?si=z2zqP_E4S2CK98qchusatg',
  },
];

// Subcomponent for Featured Video
function FeaturedVideo({ video }: { video: Video }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      <div className="aspect-w-16 aspect-h-9 bg-black">
        <iframe
          className="w-full h-[400px] md:h-[500px]"
          src={`https://www.youtube.com/embed/${video.id}?autoplay=0&rel=0`}
          title={video.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
      <div className="p-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{video.title}</h3>
          <p className="text-gray-600 dark:text-gray-300">{video.description}</p>
        </div>
        <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
          <span>{video.views} views</span>
          <span className="mx-2">•</span>
          <span>{video.likes} likes</span>
        </div>
      </div>
    </div>
  );
}

// Subcomponent for Spotify Track Card
function SpotifyTrackCard({ track }: { track: Track }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">{track.title}</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm">{track.artist}</p>
        <a
          href={track.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          Listen on Spotify
          <Icons.externalLink className="w-4 h-4 ml-1" />
        </a>
      </div>
    </div>
  );
}

// Subcomponent for Video Thumbnail (clickable, keyboard accessible)
function VideoThumbnail({
  video,
  isSelected,
  onSelect,
  index,
}: {
  video: Video;
  isSelected: boolean;
  onSelect: (index: number) => void;
  index: number;
}) {
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(index);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      onClick={() => onSelect(index)}
      onKeyDown={handleKeyDown}
      className={`group cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-lg ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
    >
      <div className="relative aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
        <img
          src={video.thumbnail}
          alt={`${video.title} thumbnail`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/400x225';
          }}
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="bg-white/90 dark:bg-gray-900/90 p-3 rounded-full">
            <svg
              className="w-8 h-8 text-red-500"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              focusable="false"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>
      <div className="mt-2">
        <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2">{video.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{video.creator.name}</p>
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>{video.views} views</span>
          <span className="mx-1">•</span>
          <span>{video.likes} likes</span>
        </div>
      </div>
    </div>
  );
}

export default function ContentPage() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="pt-16 pb-20 md:pb-4">
        <div className="container mx-auto px-4 py-6">
          {/* Featured Video Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Featured</h2>
            <FeaturedVideo video={featuredVideos[currentVideoIndex]} />
          </section>

          {/* Music Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Featured Music</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {spotifyTracks.map((track) => (
                <SpotifyTrackCard key={track.id} track={track} />
              ))}
            </div>
          </section>

          {/* Video Grid Section */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recommended Videos</h2>
              <div className="flex space-x-2">
                <button 
                  aria-label="Grid view" 
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Icons.grid className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
                <button 
                  aria-label="Filter videos" 
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Icons.filter className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredVideos.map((video, index) => (
                <VideoThumbnail
                  key={video.id}
                  video={video}
                  index={index}
                  isSelected={currentVideoIndex === index}
                  onSelect={setCurrentVideoIndex}
                />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

// Add missing Icons interface
declare module '@/components/icons' {
  interface Icons {
    grid: React.ComponentType<{ className?: string }>;
    filter: React.ComponentType<{ className?: string }>;
    externalLink: React.ComponentType<{ className?: string }>;
    play: React.ComponentType<{ className?: string }>;
  }
}
