'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

type ContentType = 'YOUTUBE' | 'SPOTIFY' | '';

interface FormData {
  url: string;
  title: string;
  description: string;
  type: ContentType;
  creatorName: string;
  duration: string;
  thumbnail?: string;
}

export default function ContentSubmissionPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    url: '',
    title: '',
    description: '',
    type: '',
    creatorName: session?.user?.name || '',
    duration: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);

  // Extract video ID from YouTube URL
  const extractYoutubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Extract track/album ID from Spotify URL
  const extractSpotifyId = (url: string): string | null => {
    const regExp = /spotify\..+?\/(track|album)\/([a-zA-Z0-9]+)/;
    const match = url.match(regExp);
    return match ? match[2] : null;
  };

  const validateForm = (): boolean => {
    if (!formData.url) {
      toast({
        title: 'Error',
        description: 'Please enter a URL',
        variant: 'destructive',
      });
      return false;
    }

    if (!formData.type) {
      toast({
        title: 'Error',
        description: 'Please select a content type',
        variant: 'destructive',
      });
      return false;
    }

    if (formData.type === 'YOUTUBE' && !extractYoutubeId(formData.url)) {
      toast({
        title: 'Error',
        description: 'Please enter a valid YouTube URL',
        variant: 'destructive',
      });
      return false;
    }

    if (formData.type === 'SPOTIFY' && !extractSpotifyId(formData.url)) {
      toast({
        title: 'Error',
        description: 'Please enter a valid Spotify URL',
        variant: 'destructive',
      });
      return false;
    }

    if (!formData.title) {
      toast({
        title: 'Error',
        description: 'Please enter a title',
        variant: 'destructive',
      });
      return false;
    }

    if (!formData.creatorName) {
      toast({
        title: 'Error',
        description: 'Please enter the creator name',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // In a real app, you would send this to your API
      const response = await fetch('/api/content/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId: session?.user?.id,
          status: 'PENDING',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit content');
      }

      setShowSuccess(true);
      toast({
        title: 'Success',
        description: 'Your content has been submitted for review',
      });
    } catch (error) {
      console.error('Error submitting content:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit content. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTypeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      type: value as ContentType,
    }));
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/auth/signin');
    return null;
  }

  if (showSuccess) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4">Submission Successful!</h2>
          <p className="text-gray-600 mb-8">
            Your content has been submitted for review. You'll be notified once it's approved.
          </p>
          <div className="flex flex-col space-y-3">
            <Button
              onClick={() => {
                setShowSuccess(false);
                setFormData({
                  url: '',
                  title: '',
                  description: '',
                  type: '',
                  creatorName: session?.user?.name || '',
                  duration: '',
                });
              }}
              className="w-full"
            >
              Submit Another
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/creator/dashboard')}
              className="w-full"
            >
              Go to Dashboard
            </Button>
            <Button
              variant="ghost"
              onClick={() => router.push('/content')}
              className="w-full"
            >
              Browse Content
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Submit Content</h1>
        <p className="text-gray-600">Share your YouTube or Spotify content with the community</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="type">Content Type</Label>
          <Select onValueChange={handleTypeChange} value={formData.type}>
            <SelectTrigger>
              <SelectValue placeholder="Select content type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="YOUTUBE">YouTube Video</SelectItem>
              <SelectItem value="SPOTIFY">Spotify Track/Album</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="url">
            {formData.type === 'YOUTUBE' 
              ? 'YouTube URL' 
              : formData.type === 'SPOTIFY'
                ? 'Spotify URL'
                : 'Content URL'}
          </Label>
          <Input
            id="url"
            name="url"
            type="url"
            placeholder={
              formData.type === 'YOUTUBE' 
                ? 'https://www.youtube.com/watch?v=...' 
                : formData.type === 'SPOTIFY'
                  ? 'https://open.spotify.com/track/... or https://open.spotify.com/album/...'
                  : 'Paste your content URL here'
            }
            value={formData.url}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            placeholder="Enter the title of your content"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="creatorName">Creator Name</Label>
          <Input
            id="creatorName"
            name="creatorName"
            placeholder="Enter the creator's name"
            value={formData.creatorName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Duration (MM:SS)</Label>
          <Input
            id="duration"
            name="duration"
            placeholder="e.g. 03:45"
            value={formData.duration}
            onChange={handleInputChange}
            pattern="^([0-9]+:)?[0-5]?[0-9]:[0-5][0-9]$"
            title="Please enter duration in MM:SS or HH:MM:SS format"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Tell us about this content..."
            rows={4}
            value={formData.description}
            onChange={handleInputChange}
          />
        </div>

        <div className="pt-2">
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit for Review'}
          </Button>
        </div>
      </form>
    </div>
  );
}
