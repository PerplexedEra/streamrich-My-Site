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
    
    // First find the transaction by paymentId (which is the reference from PayStack)
    const transaction = await prisma.transaction.findFirst({
      where: { paymentId: reference },
      include: {
        user: true,
      },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    // Now update the transaction using its ID
    const updatedTransaction = await prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        status: paymentData.status === 'success' ? 'COMPLETED' : 'FAILED',
        ...(paymentData.status === 'success' && { processedAt: new Date() }),
        metadata: {
          ...(transaction.metadata as object || {}),
          paymentData: paymentData,
          verifiedAt: new Date().toISOString()
        },
      },
      include: {
        user: true,
      },
    });

    // Safely extract productId from metadata if it exists
    const metadata = updatedTransaction.metadata as Record<string, unknown> | null;
    const productId = metadata && typeof metadata === 'object' && 'productId' in metadata 
      ? metadata.productId 
      : null;
    
    // If payment was successful, log the successful transaction
    if (paymentData.status === 'success' && updatedTransaction.status === 'COMPLETED') {
      console.log(`Payment successful for transaction ${updatedTransaction.id} by user ${updatedTransaction.userId}`);
      
      // Log product ID if available
      if (productId) {
        console.log(`Product ID: ${productId}`);
      }
      
      // Additional success logic can be added here if needed
      // For example, sending confirmation emails, updating user points, etc.
    }

    return NextResponse.json({
      success: true,
      status: paymentData.status,
      transaction: {
        ...updatedTransaction,
        metadata: updatedTransaction.metadata || {}
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
