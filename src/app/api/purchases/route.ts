import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse request body
    const { productId } = await request.json();
    
    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Get the user with their account balance
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { account: true },
    });

    if (!user || !user.account) {
      return NextResponse.json(
        { error: 'User account not found' },
        { status: 404 }
      );
    }

    // Get the product
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if user already purchased this product
    const existingPurchase = await prisma.productPurchase.findFirst({
      where: {
        productId,
        userId: user.id,
        status: 'COMPLETED',
      },
    });

    if (existingPurchase) {
      return NextResponse.json(
        { 
          message: 'Product already purchased',
          purchaseId: existingPurchase.id,
        },
        { status: 200 }
      );
    }

    // Check if user has sufficient balance
    if (user.account.balance < product.price) {
      return NextResponse.json(
        { error: 'Insufficient balance' },
        { status: 402 }
      );
    }

    // Start a transaction to ensure data consistency
    const result = await prisma.$transaction(async (prisma) => {
      // Deduct the price from user's account
      const updatedAccount = await prisma.account.update({
        where: { id: user.account.id },
        data: {
          balance: {
            decrement: product.price,
          },
        },
      });

      // Record the transaction
      await prisma.transaction.create({
        data: {
          amount: product.price,
          type: 'PURCHASE',
          status: 'COMPLETED',
          description: `Purchase: ${product.name}`,
          accountId: user.account.id,
        },
      });

      // Create the purchase record
      const purchase = await prisma.productPurchase.create({
        data: {
          userId: user.id,
          productId: product.id,
          amount: product.price,
          status: 'COMPLETED',
          downloadCount: 0,
        },
      });

      // Increment the product's purchase count
      await prisma.product.update({
        where: { id: product.id },
        data: {
          purchaseCount: {
            increment: 1,
          },
        },
      });

      return { purchase, account: updatedAccount };
    });

    return NextResponse.json({
      message: 'Purchase completed successfully',
      purchaseId: result.purchase.id,
      remainingBalance: result.account.balance,
    });

  } catch (error) {
    console.error('Purchase error:', error);
    return NextResponse.json(
      { error: 'Failed to process purchase' },
      { status: 500 }
    );
  }
}
