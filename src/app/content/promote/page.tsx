'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/icons';
import { toast } from '@/components/ui/use-toast';

export default function PromoteContentPage() {
  const [contentUrl, setContentUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contentUrl.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a valid URL',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Success!',
        description: 'Your content is being processed. We\'ll notify you once it\'s ready.',
      });
      
      // Redirect to content page after successful submission
      router.push('/content');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit content. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Promote Your Content</h1>
          <p className="mt-2 text-muted-foreground">
            Share a link to your video or song to reach a wider audience
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="content-url" className="mb-2 block text-sm font-medium">
                Content URL
              </label>
              <div className="flex gap-2">
                <Input
                  id="content-url"
                  type="url"
                  placeholder="https://youtube.com/watch?v=... or https://soundcloud.com/..."
                  value={contentUrl}
                  onChange={(e) => setContentUrl(e.target.value)}
                  className="flex-1"
                  required
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Icons.upload className="mr-2 h-4 w-4" />
                  )}
                  Submit
                </Button>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                We support YouTube, SoundCloud, and direct video/audio links
              </p>
            </div>
          </form>

          <div className="mt-8 rounded-md border p-4">
            <h3 className="mb-2 font-medium">How it works</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Icons.checkCircle className="mt-0.5 h-4 w-4 text-green-500" />
                <span>Paste the URL of your content from supported platforms</span>
              </li>
              <li className="flex items-start gap-2">
                <Icons.checkCircle className="mt-0.5 h-4 w-4 text-green-500" />
                <span>We'll process and optimize your content for our platform</span>
              </li>
              <li className="flex items-start gap-2">
                <Icons.checkCircle className="mt-0.5 h-4 w-4 text-green-500" />
                <span>Earn money when users engage with your content</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
