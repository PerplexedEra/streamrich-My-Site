'use client';

import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

interface PayPalButtonProps {
  productId: string;
  amount: number;
  buttonText?: string;
  className?: string;
  onSuccess?: () => void;
}

export function PayPalButton({
  productId,
  amount,
  buttonText = 'Pay with PayPal',
  className = '',
  onSuccess,
}: PayPalButtonProps) {
  const router = useRouter();
  const [{ isPending, isResolved }] = usePayPalScriptReducer();
  const [isProcessing, setIsProcessing] = useState(false);

  const createOrder = async () => {
    try {
      const response = await fetch('/api/payments/paypal/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          amount,
        }),
      });

      const orderData = await response.json();

      if (!response.ok) {
        throw new Error(orderData.error || 'Failed to create PayPal order');
      }

      return orderData.id;
    } catch (error) {
      console.error('Error creating PayPal order:', error);
      toast({
        title: 'Error',
        description: 'Failed to create PayPal order. Please try again.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const onApprove = async (data: { orderID: string }) => {
    try {
      setIsProcessing(true);
      
      const response = await fetch('/api/payments/paypal/capture-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: data.orderID,
          productId,
        }),
      });

      const captureData = await response.json();

      if (!response.ok) {
        throw new Error(captureData.error || 'Failed to capture payment');
      }

      toast({
        title: 'Success',
        description: 'Payment successful! Thank you for your purchase.',
      });

      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/payment/success');
      }
    } catch (error) {
      console.error('Error capturing PayPal payment:', error);
      toast({
        title: 'Error',
        description: 'Failed to process payment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const onError = (err: Record<string, unknown>) => {
    console.error('PayPal error:', err);
    toast({
      title: 'Payment Error',
      description: 'An error occurred with PayPal. Please try another payment method.',
      variant: 'destructive',
    });
  };

  if (isPending || !isResolved) {
    return (
      <Button disabled className={className}>
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        Loading PayPal...
      </Button>
    );
  }

  return (
    <div className={className}>
      <PayPalButtons
        style={{ layout: 'vertical' }}
        createOrder={createOrder}
        onApprove={onApprove}
        onError={onError}
        disabled={isProcessing}
      />
      {isProcessing && (
        <div className="mt-2 text-sm text-muted-foreground flex items-center">
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          Processing your payment...
        </div>
      )}
    </div>
  );
}
