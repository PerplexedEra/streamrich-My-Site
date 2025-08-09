'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

type Plan = {
  id: string;
  name: string;
  price: number;
  features: string[];
};

const PLANS: Plan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 5,
    features: [
      'Basic visibility in content feed',
      'Standard placement',
      'Up to 1000 impressions/day',
    ],
  },
  {
    id: 'featured',
    name: 'Featured',
    price: 10,
    features: [
      'Featured placement in feed',
      'Priority over Basic content',
      'Up to 5000 impressions/day',
      'Highlighted in search results',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 15,
    features: [
      'Top of feed placement',
      'Homepage feature',
      'Unlimited impressions',
      'Priority in search results',
      'Promoted on social media',
    ],
  },
];

export function CreatorDashboard() {
  const [title, setTitle] = useState('');
  const [contentUrl, setContentUrl] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !contentUrl || !selectedPlan) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSuccess(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setTitle('');
      setContentUrl('');
      setSelectedPlan(null);
      setIsSuccess(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Creator Dashboard</h2>
        <p className="text-muted-foreground">Upload and promote your content to reach more viewers</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload Your Content</CardTitle>
          <CardDescription>
            Share your videos or music and choose a promotion plan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Content Title <span className="text-destructive">*</span>
              </label>
              <Input
                id="title"
                placeholder="Enter a descriptive title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="contentUrl" className="text-sm font-medium">
                Content URL <span className="text-destructive">*</span>
              </label>
              <div className="flex gap-2">
                <Input
                  id="contentUrl"
                  type="url"
                  placeholder="Paste YouTube, SoundCloud, or direct media link"
                  value={contentUrl}
                  onChange={(e) => setContentUrl(e.target.value)}
                  className="flex-1"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Supported platforms: YouTube, Vimeo, SoundCloud, direct MP4/MP3 links
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">
                  Choose a Plan <span className="text-destructive">*</span>
                </h3>
                <span className="text-xs text-muted-foreground">
                  {selectedPlan ? 'Selected' : 'Select one'}
                </span>
              </div>
              
              <div className="grid gap-4 md:grid-cols-3">
                {PLANS.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedPlan === plan.id
                        ? 'border-primary ring-2 ring-primary/20 bg-primary/5'
                        : 'hover:border-primary/50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">{plan.name}</h4>
                      <div className="font-bold">${plan.price}</div>
                    </div>
                    <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Icons.check className="h-4 w-4 text-green-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={!title || !contentUrl || !selectedPlan || isSubmitting || isSuccess}
                className="w-full md:w-auto"
              >
                {isSubmitting ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : isSuccess ? (
                  <>
                    <Icons.checkCircle className="mr-2 h-4 w-4" />
                    Content Published!
                  </>
                ) : (
                  <>
                    <Icons.upload className="mr-2 h-4 w-4" />
                    Publish Content
                  </>
                )}
              </Button>
              
              {isSuccess && (
                <p className="mt-2 text-sm text-green-600">
                  Your content has been published successfully and is now being processed.
                </p>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Content Performance</CardTitle>
          <CardDescription>View analytics for your published content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border p-4 text-center">
            <Icons.barChart className="mx-auto h-8 w-8 text-muted-foreground" />
            <h4 className="mt-2 font-medium">No content published yet</h4>
            <p className="text-sm text-muted-foreground">
              Upload your first piece of content to see performance metrics
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
