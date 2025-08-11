'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { EnhancedFileUploader } from '@/components/admin/EnhancedFileUploader';

export default function AdminUploadPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Check if user is admin
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || session.user?.role !== 'ADMIN') {
      router.push('/');
    }
  }, [session, status, router]);

  if (status === 'loading' || !session || session.user?.role !== 'ADMIN') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Icons.loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Upload Content</h1>
          <p className="text-muted-foreground">Upload new content to the platform</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          <Icons.arrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload New Content</CardTitle>
        </CardHeader>
        <CardContent>
          <EnhancedFileUploader />
        </CardContent>
      </Card>
    </div>
  );
}
