import { NextResponse } from 'next/server';
import { verifyPayment } from '@/lib/paystack';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const reference = searchParams.get('reference');

    if (!reference) {
      return NextResponse.json(
        { error: 'Reference is required' },
        { status: 400 }
      );
    }

    // Verify payment with PayStack
    const verification = await verifyPayment(reference);
    
    if (!verification.success) {
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      );
    }

    const paymentData = verification.data;
    
    // Update the payment record in the database
    const updatedPayment = await prisma.payment.update({
      where: { reference },
      data: {
        status: paymentData.status === 'success' ? 'COMPLETED' : 'FAILED',
        paymentData: JSON.stringify(paymentData),
        ...(paymentData.status === 'success' && { paidAt: new Date() }),
      },
      include: {
        user: true,
        product: true,
      },
    });

    // If payment was successful, create a purchase record
    if (paymentData.status === 'success' && updatedPayment.status === 'COMPLETED') {
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
    }

    return NextResponse.json({
      success: true,
      status: paymentData.status,
      payment: {
        ...updatedPayment,
        paymentData: JSON.parse(updatedPayment.paymentData || '{}'),
      },
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
