import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'You must be signed in to make a payment' },
        { status: 401 }
      );
    }

    const { productId, amount } = await req.json();

    if (!productId || !amount) {
      return NextResponse.json(
        { error: 'Product ID and amount are required' },
        { status: 400 }
      );
    }

    // Verify the product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Create a transaction record in the database
    const transaction = await prisma.transaction.create({
      data: {
        amount,
        type: 'CONTENT_PROMOTION',
        status: 'PENDING',
        userId: session.user.id,
        metadata: {
          productId,
          paymentMethod: 'PAYPAL',
          productName: product.name
        },
      },
    });

    // Call PayPal API to create an order
    const response = await fetch(`${process.env.PAYPAL_API_BASE_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(
          `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
        ).toString('base64')}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: transaction.id,
            amount: {
              currency_code: 'USD', // Can be made dynamic
              value: amount.toString(),
            },
            description: product.name,
          },
        ],
        application_context: {
          brand_name: 'StreamRich',
          landing_page: 'NO_PREFERENCE',
          user_action: 'PAY_NOW',
          return_url: `${process.env.NEXTAUTH_URL}/payment/verify?transactionId=${transaction.id}`,
          cancel_url: `${process.env.NEXTAUTH_URL}/store?canceled=true`,
        },
      }),
    });

    const order = await response.json();

    if (!response.ok) {
      // Update transaction status to FAILED
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: 'FAILED',
          metadata: {
            ...(transaction.metadata as object || {}),
            paymentData: order,
            error: order.message || 'Failed to create PayPal order'
          }
        },
      });

      return NextResponse.json(
        { error: order.message || 'Failed to create PayPal order' },
        { status: response.status }
      );
    }

    // Update transaction with PayPal order ID
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        paymentId: order.id,
        metadata: {
          ...(transaction.metadata as object || {}),
          paymentData: order
        }
      },
    });

    return NextResponse.json({
      id: order.id,
      status: order.status,
      links: order.links,
    });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
