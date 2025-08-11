import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import type { PrismaClient } from '@prisma/client';

// Helper function to calculate earnings by content type
async function getEarningsByContentType(userId: string, prisma: PrismaClient) {
  // Get all completed transactions for the user
  const transactions = await prisma.transaction.findMany({
    where: { 
      userId,
      status: 'COMPLETED',
      type: { in: ['CONTENT_PROMOTION', 'BONUS'] } // Only include income transactions
    },
    include: {
      content: true // Include content to determine type
    }
  });

  // Initialize result with default values
  const result = {
    music: 0,
    video: 0,
    other: 0,
  };

  // Sum up amounts by content type
  transactions.forEach(tx => {
    const amount = tx.amount || 0;
    const contentType = tx.content?.type?.toLowerCase() || 'other';
    
    if (contentType in result) {
      result[contentType as keyof typeof result] += Math.abs(amount); // Use absolute value since amounts might be negative
    } else {
      result.other += Math.abs(amount);
    }
  });

  return result;
}

// Helper function to get recent payouts
async function getRecentPayouts(userId: string, prisma: PrismaClient) {
  return prisma.withdrawal.findMany({
    where: { 
      userId,
      status: { in: ['COMPLETED', 'PENDING', 'PROCESSING'] } // Only show relevant statuses
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: {
      id: true,
      amount: true,
      status: true,
      method: true,
      createdAt: true,
    },
  });
}


export async function GET() {
  console.log('Profile API: GET request received');
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    console.log('Profile API: No session or email found');
    return NextResponse.json(
      { message: 'Not authenticated' },
      { status: 401 }
    );
  }

  console.log('Profile API: Session found for user', session.user.email);
  
  try {
    // First, get the user with their ID
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        profile: true,
        twoFactorAuth: true,
      },
    });

    if (!user) {
      console.log('Profile API: User not found in database');
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    console.log('Profile API: Found user in database', user.id);

    // Get data with individual try-catch blocks to prevent one failed query from breaking everything
    let totalStreams = 0;
    let totalEarnings: { _sum: { amount: number | null } } = { _sum: { amount: 0 } };
    let availableBalance = null;
    let earningsByType = { music: 0, video: 0, other: 0 };
    let recentPayouts: Array<{
      id: string;
      amount: number;
      status: string;
      method: string;
      createdAt: Date;
    }> = [];
    
    try {
      // Count content views as streams
      totalStreams = await prisma.contentView.count({
        where: { userId: user.id },
      });
    } catch (error) {
      console.error('Error fetching total streams:', error);
    }
    
    try {
      // Calculate total earnings from completed transactions
      totalEarnings = await prisma.transaction.aggregate({
        _sum: { amount: true },
        where: { 
          userId: user.id,
          status: 'COMPLETED',
          type: { in: ['CONTENT_PROMOTION', 'BONUS'] } // Only count income transactions
        },
      });
    } catch (error) {
      console.error('Error fetching total earnings:', error);
    }
    
    try {
      const profile = await prisma.profile.findUnique({
        where: { userId: user.id },
        select: { availableCash: true },
      });
      availableBalance = profile?.availableCash || 0;
    } catch (error) {
      console.error('Error fetching available balance:', error);
      availableBalance = 0;
    }
    
    try {
      earningsByType = await getEarningsByContentType(user.id, prisma);
    } catch (error) {
      console.error('Error fetching earnings by type:', error);
    }
    
    try {
      recentPayouts = await getRecentPayouts(user.id, prisma);
    } catch (error) {
      console.error('Error fetching recent payouts:', error);
    }



    // Create a profile if it doesn't exist
    let profile = user.profile;
    if (!profile) {
      profile = await prisma.profile.create({
        data: {
          userId: user.id,
          displayName: user.name || '',
          avatar: user.image || null,
        },
      });
    }

    return NextResponse.json({
      ...profile,
      role: user.role,
      twoFactorAuth: user.twoFactorAuth,
      name: user.name,
      email: user.email,
      image: user.image,
      stats: {
        totalStreams,
        totalEarnings: totalEarnings._sum.amount || 0,
        currentBalance: availableBalance || 0,
        earningsByType: {
          music: earningsByType.music,
          video: earningsByType.video,
          other: earningsByType.other,
        },
        recentPayouts: recentPayouts.map(payout => ({
          id: payout.id,
          amount: payout.amount,
          date: payout.createdAt.toISOString(),
          status: payout.status.toLowerCase() as 'completed' | 'pending' | 'failed',
        })),
      },
    });
  } catch (error) {
    console.error('Error in profile API:', error);
    return NextResponse.json(
      { 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json(
      { message: 'Not authenticated' },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const bio = formData.get('bio') as string;
    const avatarFile = formData.get('avatar') as File | null;

    let avatarUrl = '';

    // Handle file upload if avatar is provided
    if (avatarFile) {
      const bytes = await avatarFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Create uploads directory if it doesn't exist
      const uploadsDir = join(process.cwd(), 'public', 'uploads', 'avatars');
      if (!existsSync(uploadsDir)) {
        mkdirSync(uploadsDir, { recursive: true });
      }
      
      // Generate unique filename
      const timestamp = Date.now();
      const ext = avatarFile.name.split('.').pop();
      const filename = `avatar_${session.user.email}_${timestamp}.${ext}`;
      const path = join(uploadsDir, filename);
      
      // Save file
      await writeFile(path, buffer);
      
      // Set the URL for the avatar
      avatarUrl = `/uploads/avatars/${filename}`;
    }

    // Update the user and profile
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        profile: {
          upsert: {
            create: {
              displayName: name,
              bio,
              ...(avatarUrl && { avatar: avatarUrl }),
            },
            update: {
              displayName: name,
              bio,
              ...(avatarUrl && { avatar: avatarUrl }),
            },
          },
        },
      },
      include: {
        profile: true,
      },
    });

    return NextResponse.json(updatedUser.profile);
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { message: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
