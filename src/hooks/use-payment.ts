import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';

export function usePayment() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const initiatePayment = async (productId: string, amount: number) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, amount }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initialize payment');
      }

      // Redirect to PayStack payment page
      window.location.href = data.authorizationUrl;
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: 'Payment Error',
        description: error instanceof Error ? error.message : 'Failed to process payment',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    initiatePayment,
    isLoading,
  };
}
