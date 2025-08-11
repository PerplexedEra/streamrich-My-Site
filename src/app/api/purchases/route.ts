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
      include: { 
        accounts: true, // Changed from 'account' to 'accounts' to match Prisma schema
      },
    });

    if (!user || !user.accounts || user.accounts.length === 0) {
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

    // Get the user's profile to check their available cash
    const userProfile = await prisma.profile.findUnique({
      where: { userId: user.id },
    });

    if (!userProfile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    // Check if user has sufficient available cash
    if (userProfile.availableCash < product.price) {
      return NextResponse.json(
        { error: 'Insufficient balance' },
        { status: 402 }
      );
    }

    // Start a transaction to ensure data consistency
    const result = await prisma.$transaction(async (prisma) => {
      // Deduct the price from user's available cash in their profile
      await prisma.profile.update({
        where: { userId: user.id },
        data: {
          availableCash: {
            decrement: product.price,
          },
        },
      });

      // Record the transaction
      await prisma.transaction.create({
        data: {
          amount: product.price,
          type: 'CONTENT_PROMOTION', // Using CONTENT_PROMOTION as the transaction type
          status: 'COMPLETED',
          userId: user.id, // Using userId since Transaction model relates to User
          // Description can be stored in metadata if needed
          metadata: {
            description: `Purchase: ${product.name}`
          }
        },
      });

      // Generate a secure download key
      const downloadKey = Array.from(crypto.getRandomValues(new Uint8Array(16)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      
      // Create the purchase record
      const purchase = await prisma.productPurchase.create({
        data: {
          userId: user.id,
          productId: product.id,
          amount: product.price,
          status: 'COMPLETED',
          downloadKey: downloadKey, // Add the generated download key
          downloadCount: 0,
        },
      });

      // Update the product's download count
      await prisma.product.update({
        where: { id: product.id },
        data: {
          downloadCount: {
            increment: 1,
          },
        },
      });

      // Return the purchase details
      return { purchase };
    });

    return NextResponse.json({
      message: 'Purchase completed successfully',
      purchaseId: result.purchase.id,
    });

  } catch (error) {
    console.error('Purchase error:', error);
    return NextResponse.json(
      { error: 'Failed to process purchase' },
      { status: 500 }
    );
  }
}
