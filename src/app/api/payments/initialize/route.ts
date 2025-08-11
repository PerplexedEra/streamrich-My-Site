import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { initializePayment } from '@/lib/paystack';
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

    const { amount, productId } = await req.json();

    if (!amount || !productId) {
      return NextResponse.json(
        { error: 'Amount and product ID are required' },
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

    // Generate a unique reference for this transaction
    const reference = `STRM-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Initialize payment with PayStack
    const paymentData = await initializePayment({
      email: session.user.email,
      amount: amount * 100, // Convert to kobo
      reference,
      metadata: {
        productId,
        userId: session.user.id,
        productName: product.name,
      },
      callback_url: `${process.env.NEXTAUTH_URL}/payment/verify`,
    });

    if (!paymentData.success) {
      return NextResponse.json(
        { error: 'Failed to initialize payment' },
        { status: 500 }
      );
    }

    // Create a transaction record in the database
    await prisma.transaction.create({
      data: {
        amount,
        type: 'CONTENT_PROMOTION',
        status: 'PENDING',
        userId: session.user.id,
        paymentId: reference, // Store the PayStack reference as paymentId
        metadata: {
          productId,
          productName: product.name,
          paymentMethod: 'PAYSTACK'
        }
      },
    });

    return NextResponse.json({
      authorizationUrl: paymentData.data.authorization_url,
      reference,
    });
  } catch (error) {
    console.error('Payment initialization error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
