'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { Loader2, ExternalLink, Check, X, Trash2 } from 'lucide-react';

type Content = {
  id: string;
  title: string;
  description: string | null;
  url: string;
  type: 'YOUTUBE' | 'SPOTIFY';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  duration: string | null;
  thumbnail: string | null;
  submittedAt: string;
  approvedAt: string | null;
  approvedBy: string | null;
  notes: string | null;
  creator: {
    id: string;
    name: string | null;
    email: string;
  };
};

export function ContentSubmissions() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [content, setContent] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/');
      return;
    }

    fetchContent();
  }, [status, activeTab]);

  const fetchContent = async () => {
    try {
      setIsLoading(true);
      const statusMap = {
        pending: 'PENDING',
        approved: 'APPROVED',
        rejected: 'REJECTED',
      };
      
      const response = await fetch(`/api/content?status=${statusMap[activeTab]}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch content');
      }
      
      const data = await response.json();
      setContent(data.data);
    } catch (error) {
      console.error('Error fetching content:', error);
      toast({
        title: 'Error',
        description: 'Failed to load content',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (contentId: string, newStatus: 'APPROVED' | 'REJECTED', notes?: string) => {
    try {
      setIsProcessing(contentId);
      
      const response = await fetch(`/api/content/${contentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: newStatus,
          notes,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update content status');
      }
      
      toast({
        title: 'Success',
        description: `Content ${newStatus.toLowerCase()} successfully`,
      });
      
      // Refresh the content list
      fetchContent();
      
    } catch (error) {
      console.error('Error updating content status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update content status',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(null);
    }
  };

  const handleDelete = async (contentId: string) => {
    if (!confirm('Are you sure you want to delete this content? This action cannot be undone.')) {
      return;
    }
    
    try {
      setIsProcessing(contentId);
      
      const response = await fetch(`/api/content/${contentId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete content');
      }
      
      toast({
        title: 'Success',
        description: 'Content deleted successfully',
      });
      
      // Refresh the content list
      fetchContent();
      
    } catch (error) {
      console.error('Error deleting content:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete content',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'REJECTED':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    }
  };

  const getContentPreview = (content: Content) => {
    if (content.type === 'YOUTUBE') {
      const videoId = content.url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
      if (!videoId) return null;
      
      return (
        <div className="mt-2">
          <iframe
            width="100%"
            height="200"
            src={`https://www.youtube.com/embed/${videoId}`}
            title={content.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-lg"
          />
        </div>
      );
    } else if (content.type === 'SPOTIFY') {
      const spotifyId = content.url.match(/spotify\..+?\/(track|album)\/([a-zA-Z0-9]+)/)?.[2];
      const type = content.url.includes('/track/') ? 'track' : 'album';
      
      if (!spotifyId) return null;
      
      return (
        <div className="mt-2">
          <iframe
            src={`https://open.spotify.com/embed/${type}/${spotifyId}`}
            width="100%"
            height="200"
            frameBorder="0"
            allow="encrypted-media"
            className="rounded-lg"
          />
        </div>
      );
    }
    
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Content Submissions</h2>
          <p className="text-gray-500">
            Review and manage content submitted by creators
          </p>
        </div>
      </div>

      <Tabs 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as any)}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="pending">Pending Review</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {content.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-500">
                  No {activeTab} content found
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {content.map((item) => (
                <Card key={item.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          {getStatusBadge(item.status)}
                          <span>•</span>
                          <span>{item.type}</span>
                          {item.duration && <span>• {item.duration}</span>}
                        </CardDescription>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => window.open(item.url, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {item.description || 'No description provided'}
                    </p>
                    <div className="text-xs text-gray-500 mt-1">
                      <p>Submitted by: {item.creator.name || item.creator.email}</p>
                      <p>Submitted {formatDistanceToNow(new Date(item.submittedAt), { addSuffix: true })}</p>
                      {item.approvedAt && (
                        <p>Approved {formatDistanceToNow(new Date(item.approvedAt), { addSuffix: true })}</p>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {getContentPreview(item)}
                    
                    {item.status === 'PENDING' && (
                      <div className="flex gap-2 mt-4">
                        <Button 
                          size="sm" 
                          className="flex-1 gap-2"
                          onClick={() => handleStatusUpdate(item.id, 'APPROVED')}
                          disabled={isProcessing === item.id}
                        >
                          {isProcessing === item.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Check className="h-4 w-4" />
                          )}
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 gap-2 text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => {
                            const reason = prompt('Reason for rejection (optional):');
                            if (reason !== null) {
                              handleStatusUpdate(item.id, 'REJECTED', reason);
                            }
                          }}
                          disabled={isProcessing === item.id}
                        >
                          {isProcessing === item.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <X className="h-4 w-4" />
                          )}
                          Reject
                        </Button>
                      </div>
                    )}
                    
                    {item.status === 'APPROVED' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full mt-2 gap-2 text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => handleDelete(item.id)}
                        disabled={isProcessing === item.id}
                      >
                        {isProcessing === item.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        Remove Content
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
