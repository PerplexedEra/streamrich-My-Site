'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Icons } from '@/components/icons';

export default function PaymentVerification() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'cancelled'>('loading');
  const [message, setMessage] = useState('Verifying your payment...');

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams.get('reference');
      
      if (!reference) {
        setStatus('error');
        setMessage('No payment reference found');
        return;
      }

      try {
        const response = await fetch(`/api/payments/verify?reference=${reference}`);
        const data = await response.json();

        if (data.success) {
          setStatus('success');
          setMessage('Payment successful! Thank you for your purchase.');
        } else {
          setStatus('error');
          setMessage(data.error || 'Payment verification failed');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
        setMessage('An error occurred while verifying your payment');
      }
    };

    verifyPayment();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        {status === 'loading' && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <h1 className="text-2xl font-bold mb-2">Processing Payment</h1>
            <p className="text-gray-600">{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Icons.check className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="flex flex-col sm:flex-row gap-4 w-full mt-6">
              <Button asChild className="w-full">
                <Link href="/content">
                  <Icons.playCircle className="mr-2 h-4 w-4" />
                  Start Streaming
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/dashboard">
                  <Icons.dashboard className="mr-2 h-4 w-4" />
                  Go to Dashboard
                </Link>
              </Button>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Icons.x className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Payment Failed</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="flex flex-col sm:flex-row gap-4 w-full mt-6">
              <Button asChild className="w-full">
                <Link href="/store">
                  <Icons.shoppingCart className="mr-2 h-4 w-4" />
                  Back to Store
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/support">
                  <Icons.alertCircle className="mr-2 h-4 w-4" />
                  Contact Support
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
