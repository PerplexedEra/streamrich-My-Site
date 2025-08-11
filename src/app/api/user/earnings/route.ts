import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Mock data generator for transactions
const generateMockTransactions = (count: number, period: string) => {
  const now = new Date();
  let startDate = new Date();
  
  // Set start date based on period
  if (period === 'week') {
    startDate.setDate(now.getDate() - 7);
  } else if (period === 'month') {
    startDate.setMonth(now.getMonth() - 1);
  } else if (period === 'year') {
    startDate.setFullYear(now.getFullYear() - 1);
  } else {
    // All time - set to a distant past date
    startDate = new Date(2020, 0, 1);
  }

  const transactionTypes = ['credit', 'debit'];
  const statuses = ['completed', 'pending', 'failed'] as const;
  const descriptions = [
    'Video Earnings',
    'Music Stream',
    'Withdrawal',
    'Referral Bonus',
    'Bonus Credit',
    'Ad Revenue',
    'Sponsorship',
  ];

  return Array.from({ length: count }, (_, i) => {
    const randomDaysAgo = Math.floor(
      Math.random() * (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const date = new Date(now);
    date.setDate(date.getDate() - randomDaysAgo);
    
    const type = transactionTypes[Math.floor(Math.random() * transactionTypes.length)] as 'credit' | 'debit';
    const amount = parseFloat((Math.random() * 100).toFixed(2));
    
    return {
      id: `tx_${i + 1}`,
      amount,
      type,
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      date: date.toISOString(),
      reference: `REF-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    };
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json(
      { message: 'Not authenticated' },
      { status: 401 }
    );
  }

  try {
    // Get user with profile
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { profile: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Get period from query params
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'month';

    // Generate mock transactions based on period
    const transactions = generateMockTransactions(10, period);

    // Calculate totals from transactions (in a real app, this would come from the database)
    const totalEarnings = transactions
      .filter(tx => tx.type === 'credit' && tx.status === 'completed')
      .reduce((sum, tx) => sum + tx.amount, 0);

    const pendingPayout = transactions
      .filter(tx => tx.type === 'credit' && tx.status === 'pending')
      .reduce((sum, tx) => sum + tx.amount, 0);

    // In a real app, these would come from the user's profile or a separate earnings table
    const availableBalance = Math.max(0, totalEarnings * 0.7 - pendingPayout); // Assuming 30% platform fee
    const lifetimeEarnings = totalEarnings * 1.5; // Some multiplier for demo

    return NextResponse.json({
      totalEarnings: Math.round(totalEarnings * 100), // Convert to cents for precision
      availableBalance: Math.round(availableBalance * 100),
      pendingPayout: Math.round(pendingPayout * 100),
      lifetimeEarnings: Math.round(lifetimeEarnings * 100),
      transactions,
    });
  } catch (error) {
    console.error('Error fetching earnings data:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
