import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Fetch active plans
    const plans = await prisma.plan.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        duration: true,
      },
      orderBy: {
        price: 'asc',
      },
    });

    return NextResponse.json(plans);
  } catch (error) {
    console.error('Failed to fetch plans:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
