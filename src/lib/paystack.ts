import Paystack from 'paystack';

// Initialize PayStack with secret key from environment variables
const paystack = Paystack(process.env.PAYSTACK_SECRET_KEY!);

export interface PaymentLinkParams {
  email: string;
  amount: number; // amount in kobo (smallest currency unit)
  metadata?: Record<string, any>;
  reference?: string;
  callback_url?: string;
  currency?: string;
}

export const initializePayment = async (params: PaymentLinkParams) => {
  try {
    const response = await paystack.transaction.initialize({
      email: params.email,
      amount: params.amount,
      metadata: params.metadata || {},
      reference: params.reference,
      callback_url: params.callback_url || `${process.env.NEXTAUTH_URL}/payment/verify`,
      currency: params.currency || 'NGN', // Default to Naira
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Error initializing payment:', error);
    return {
      success: false,
      error: 'Failed to initialize payment',
    };
  }
};

export const verifyPayment = async (reference: string) => {
  try {
    const response = await paystack.transaction.verify(reference);
    return {
      success: response.data.status === 'success',
      data: response.data,
    };
  } catch (error) {
    console.error('Error verifying payment:', error);
    return {
      success: false,
      error: 'Failed to verify payment',
    };
  }
};

export default paystack;
