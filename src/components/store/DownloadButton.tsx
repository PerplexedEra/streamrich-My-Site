'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface DownloadButtonProps {
  productId: string;
  price: number;
  disabled?: boolean;
  isPurchased?: boolean;
  onPurchaseSuccess?: () => void;
}

export function DownloadButton({
  productId,
  price,
  disabled = false,
  isPurchased = false,
  onPurchaseSuccess,
}: DownloadButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // If not purchased, initiate purchase first
      if (!isPurchased) {
        const purchaseResponse = await fetch('/api/purchases', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productId }),
        });

        if (!purchaseResponse.ok) {
          const errorData = await purchaseResponse.json();
          throw new Error(errorData.error || 'Failed to process purchase');
        }

        if (onPurchaseSuccess) {
          onPurchaseSuccess();
        }
      }

      // Trigger the download
      const downloadResponse = await fetch(`/api/products/${productId}/download`);
      
      if (!downloadResponse.ok) {
        const errorData = await downloadResponse.json();
        throw new Error(errorData.error || 'Failed to download file');
      }

      // Get the blob and create a download link
      const blob = await downloadResponse.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      // Extract filename from content-disposition header or use product ID
      const contentDisposition = downloadResponse.headers.get('content-disposition');
      let filename = `product-${productId}`;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '');
        }
      }
      
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
    } catch (err) {
      console.error('Download error:', err);
      setError(err instanceof Error ? err.message : 'Failed to download file');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Button disabled className="w-full">
        <Icons.loader2 className="mr-2 h-4 w-4 animate-spin" />
        {isPurchased ? 'Preparing download...' : 'Processing...'}
      </Button>
    );
  }

  if (error) {
    return (
      <div className="text-center text-sm text-red-600">
        {error}
      </div>
    );
  }

  return (
    <Button 
      onClick={handleDownload}
      disabled={disabled}
      className="w-full"
    >
      {isPurchased ? (
        <>
          <Icons.download className="mr-2 h-4 w-4" />
          Download
        </>
      ) : (
        `Buy Now - $${price.toFixed(2)}`
      )}
    </Button>
  );
}
