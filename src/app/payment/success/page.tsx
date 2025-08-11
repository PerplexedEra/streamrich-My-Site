'use client';

import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get('paymentId');
  const status = searchParams.get('status');
  const reference = searchParams.get('reference');

  useEffect(() => {
    // Show success message if this is a redirect from a payment
    if (status === 'success' && (paymentId || reference)) {
      toast({
        title: 'Payment Successful',
        description: 'Thank you for your purchase! Your payment was processed successfully.',
      });
    }
  }, [paymentId, status, reference]);

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icons.checkCircle className="h-10 w-10 text-green-600" />
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Thank You!</h1>
        <p className="text-muted-foreground mb-8">
          Your payment was successful. You'll receive a confirmation email with your order details shortly.
        </p>

        <div className="space-y-4">
          <Button asChild className="w-full">
            <a href="/content">
              <Icons.playCircle className="mr-2 h-4 w-4" />
              Start Watching
            </a>
          </Button>
          
          <Button variant="outline" asChild className="w-full">
            <a href="/profile/purchases">
              <Icons.package className="mr-2 h-4 w-4" />
              View Purchase History
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
