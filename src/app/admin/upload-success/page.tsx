'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';

export default function UploadSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [content, setContent] = useState<{
    id: string;
    title: string;
    url: string;
    type: string;
  } | null>(null);

  useEffect(() => {
    // Check if we have content data in the URL (for direct access)
    const contentParam = searchParams.get('content');
    if (contentParam) {
      try {
        setContent(JSON.parse(decodeURIComponent(contentParam)));
      } catch (error) {
        console.error('Failed to parse content data:', error);
      }
    } else {
      // Check session storage for content data
      const savedContent = sessionStorage.getItem('uploadedContent');
      if (savedContent) {
        setContent(JSON.parse(savedContent));
        // Clear the session storage after reading
        sessionStorage.removeItem('uploadedContent');
      } else {
        // No content data found, redirect to upload page
        router.push('/admin');
      }
    }
  }, [router, searchParams]);

  if (!content) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900">
              <Icons.check className="h-6 w-6 text-green-600 dark:text-green-300" />
            </div>
            <h2 className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">
              Upload Successful!
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Your {content.type.toLowerCase()} has been successfully uploaded.
            </p>
          </div>

          <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {content.title}
            </h3>
            <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Icons.file className="flex-shrink-0 mr-1.5 h-5 w-5" />
              <span>{content.type}</span>
              <span className="mx-2">•</span>
              <Icons.link className="flex-shrink-0 mr-1.5 h-5 w-5" />
              <a 
                href={content.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                View {content.type.toLowerCase()}
              </a>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
            <Button
              onClick={() => router.push('/admin')}
              className="w-full sm:w-auto"
            >
              <Icons.plus className="mr-2 h-4 w-4" />
              Upload Another
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/content')}
              className="w-full sm:w-auto"
            >
              <Icons.play className="mr-2 h-4 w-4" />
              View in Content Library
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
