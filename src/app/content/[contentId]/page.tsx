'use client';

import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';

// Dynamically import client components with SSR disabled
const ContentPlayer = dynamic(
  () => import('@/components/content/content-player'),
  { ssr: false }
);

const ContentDetails = dynamic(
  () => import('@/components/content/content-details'),
  { ssr: false }
);

const RelatedContent = dynamic(
  () => import('@/components/content/related-content'),
  { ssr: false }
);

// Mock data - in a real app, this would be fetched from your database
const getContent = (id: string) => {
  // In a real app, this would be an API call
  return {
    id: id,
    title: 'Amazing Beats Mix',
    description: 'Chill beats to relax and study to. Perfect background music for coding, reading, or just relaxing after a long day.',
    url: 'https://example.com/beats.mp3',
    thumbnail: '/thumbnails/beats.jpg',
    duration: '2:45:30',
    views: '1.2K',
    likes: '856',
    type: 'AUDIO',
    creator: {
      id: '1',
      name: 'DJ StreamRich',
      avatar: '/avatars/creator1.jpg',
      subscribers: '15.2K',
    },
    tags: ['lofi', 'beats', 'chill', 'study', 'relax'],
    uploadDate: '2023-10-15',
  };
};

const getRelatedContent = (excludeId: string) => {
  return [
    {
      id: '2',
      title: 'Mountain Adventure Vlog',
      thumbnail: '/thumbnails/mountain.jpg',
      duration: '12:45',
      views: '5.7K',
      type: 'VIDEO',
      creator: {
        name: 'Adventure Time',
      },
    },
    // Add more related content as needed
  ];
};

export default function ContentPage() {
  const params = useParams();
  const [content, setContent] = useState<any>(null);
  const [relatedContent, setRelatedContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Simulate API calls
        const contentData = getContent(params.contentId as string);
        const relatedData = getRelatedContent(params.contentId as string);
        
        setContent(contentData);
        setRelatedContent(relatedData);
      } catch (error) {
        console.error('Error loading content:', error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [params.contentId]);

  if (loading || !content) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <ContentPlayer content={content} />
          <ContentDetails content={content} />
        </div>
        
        <div className="lg:col-span-1">
          <RelatedContent items={relatedContent} />
        </div>
      </div>
    </div>
  );
}
