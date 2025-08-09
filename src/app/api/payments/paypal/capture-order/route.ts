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

    // Get the payment record
    const payment = await prisma.payment.findFirst({
      where: {
        reference: orderId,
        userId: session.user.id,
        productId,
      },
    });

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
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
      // Update payment status to failed
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'FAILED',
          paymentData: JSON.stringify(captureData),
        },
      });

      return NextResponse.json(
        { error: captureData.message || 'Failed to capture payment' },
        { status: response.status }
      );
    }

    // Update payment status to completed
    const updatedPayment = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'COMPLETED',
        paymentData: JSON.stringify(captureData),
        paidAt: new Date(),
      },
      include: {
        user: true,
        product: true,
      },
    });

    // Create a purchase record
    await prisma.purchase.create({
      data: {
        userId: updatedPayment.userId,
        productId: updatedPayment.productId,
        amount: updatedPayment.amount,
        paymentId: updatedPayment.id,
      },
    });

    // Update product purchase count
    await prisma.product.update({
      where: { id: updatedPayment.productId },
      data: {
        purchaseCount: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({
      success: true,
      status: captureData.status,
      payment: {
        ...updatedPayment,
        paymentData: JSON.parse(updatedPayment.paymentData || '{}'),
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
