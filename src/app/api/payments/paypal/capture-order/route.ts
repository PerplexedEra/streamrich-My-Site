import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'You must be signed in to complete this action' },
        { status: 401 }
      );
    }

    const { orderId, productId } = await req.json();

    if (!orderId || !productId) {
      return NextResponse.json(
        { error: 'Order ID and Product ID are required' },
        { status: 400 }
      );
    }

    // Get the transaction record
    const transaction = await prisma.transaction.findFirst({
      where: {
        paymentId: orderId,
        userId: session.user.id,
        metadata: {
          path: ['productId'],
          equals: productId
        }
      },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    // Call PayPal API to capture the order
    const response = await fetch(
      `${process.env.PAYPAL_API_BASE_URL}/v2/checkout/orders/${orderId}/capture`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(
            `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
          ).toString('base64')}`,
        },
      }
    );

    const captureData = await response.json();

    if (!response.ok) {
      // Update transaction status to FAILED
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: 'FAILED',
          metadata: {
            ...transaction.metadata as object,
            paymentData: captureData,
            error: captureData.message || 'Failed to capture payment'
          }
        },
      });

      return NextResponse.json(
        { error: captureData.message || 'Failed to capture payment' },
        { status: response.status }
      );
    }

    // Update transaction status to COMPLETED
    const updatedTransaction = await prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        status: 'COMPLETED',
        processedAt: new Date(),
        metadata: {
          ...transaction.metadata as object,
          paymentData: captureData,
          completedAt: new Date().toISOString()
        }
      },
      include: {
        user: true
      },
    });

    // Product model doesn't exist in the schema, so we'll just log the purchase
    console.log(`Purchase completed for product ${productId} by user ${session.user.id}`);

    return NextResponse.json({
      success: true,
      status: captureData.status,
      transaction: {
        ...updatedTransaction,
        metadata: updatedTransaction.metadata || {}
      },
    });
  } catch (error) {
    console.error('Capture order error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
