'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PaymentButton } from './payment-button';
import { PayPalButton } from './paypal-button';
import { Icons } from '@/components/icons';

interface PaymentMethodSelectorProps {
  productId: string;
  amount: number;
  buttonText?: string;
  className?: string;
  onSuccess?: () => void;
}

type PaymentMethod = 'paystack' | 'paypal';

export function PaymentMethodSelector({
  productId,
  amount,
  buttonText = 'Pay Now',
  className = '',
  onSuccess,
}: PaymentMethodProps) {
  const [activeMethod, setActiveMethod] = useState<PaymentMethod>('paystack');

  return (
    <div className={`w-full ${className}`}>
      <Tabs 
        defaultValue="paystack" 
        className="w-full"
        onValueChange={(value) => setActiveMethod(value as PaymentMethod)}
      >
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="paystack" className="flex items-center gap-2">
            <Icons.creditCard className="h-4 w-4" />
            <span>Card (PayStack)</span>
          </TabsTrigger>
          <TabsTrigger value="paypal" className="flex items-center gap-2">
            <Icons.paypal className="h-4 w-4" />
            <span>PayPal</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="paystack" className="mt-0">
          <PaymentButton
            productId={productId}
            amount={amount}
            buttonText={buttonText}
            className="w-full"
            onSuccess={onSuccess}
          />
        </TabsContent>

        <TabsContent value="paypal" className="mt-0">
          <PayPalButton
            productId={productId}
            amount={amount}
            buttonText={buttonText}
            className="w-full"
            onSuccess={onSuccess}
          />
        </TabsContent>
      </Tabs>

      <div className="mt-4 text-xs text-muted-foreground text-center">
        {activeMethod === 'paystack' ? (
          <p>Secure payment powered by PayStack</p>
        ) : (
          <p>You'll be redirected to PayPal to complete your purchase</p>
        )}
      </div>
    </div>
  );
}
