'use client';

import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { ReactNode } from 'react';

const paypalOptions = {
  'client-id': process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
  currency: 'USD', // You can make this dynamic based on user's location
  intent: 'capture',
  components: 'buttons',
};

interface PayPalProviderProps {
  children: ReactNode;
}

export function PayPalProvider({ children }: PayPalProviderProps) {
  return (
    <PayPalScriptProvider options={paypalOptions}>
      {children}
    </PayPalScriptProvider>
  );
}
