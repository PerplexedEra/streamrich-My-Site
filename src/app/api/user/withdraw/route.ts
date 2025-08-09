import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Minimum withdrawal amount in cents ($10.00)
const MIN_WITHDRAWAL_AMOUNT = 1000;

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json(
      { message: 'Not authenticated' },
      { status: 401 }
    );
  }

  try {
    const { amount } = await request.json();
    const amountInCents = Math.round(amount * 100); // Convert dollars to cents for precision

    // Validate amount
    if (isNaN(amountInCents) || amountInCents <= 0) {
      return NextResponse.json(
        { message: 'Invalid amount' },
        { status: 400 }
      );
    }

    if (amountInCents < MIN_WITHDRAWAL_AMOUNT) {
      return NextResponse.json(
        { message: `Minimum withdrawal amount is $${(MIN_WITHDRAWAL_AMOUNT / 100).toFixed(2)}` },
        { status: 400 }
      );
    }

    // In a real app, we would:
    // 1. Get the user's available balance from the database
    // 2. Verify they have sufficient funds
    // 3. Create a withdrawal record
    // 4. Update their balance
    // 5. Process the withdrawal through a payment processor

    // For this example, we'll simulate a successful withdrawal
    const withdrawal = {
      id: `wd_${Math.random().toString(36).substring(2, 10)}`,
      amount: amountInCents,
      status: 'pending',
      createdAt: new Date().toISOString(),
      processedAt: null,
      method: 'bank_transfer', // or 'paypal', etc.
    };

    // In a real app, we would save this to the database
    // await prisma.withdrawal.create({
    //   data: {
    //     userId: session.user.id,
    //     amount: withdrawal.amount,
    //     status: withdrawal.status,
    //     method: withdrawal.method,
    //   },
    // });

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({
      success: true,
      message: 'Withdrawal request received',
      withdrawal: {
        ...withdrawal,
        amount: withdrawal.amount / 100, // Convert back to dollars for display
      },
    });
  } catch (error) {
    console.error('Withdrawal error:', error);
    return NextResponse.json(
      { 
        success: false,
        message: error instanceof Error ? error.message : 'Failed to process withdrawal' 
      },
      { status: 500 }
    );
  }
}
