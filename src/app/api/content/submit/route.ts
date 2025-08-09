import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json(
        { error: 'You must be signed in to submit content' },
        { status: 401 }
      );
    }

    // Check if user has CREATOR role
    if (session.user.role !== 'CREATOR' && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only creators can submit content' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { 
      url, 
      title, 
      description = '', 
      type, 
      creatorName, 
      duration = '',
      thumbnail = '',
      status = 'PENDING'
    } = body;

    // Basic validation
    if (!url || !title || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate content type
    if (!['YOUTUBE', 'SPOTIFY'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid content type' },
        { status: 400 }
      );
    }

    // Create the content submission
    const content = await prisma.content.create({
      data: {
        title,
        description,
        url,
        type,
        status,
        duration,
        thumbnail,
        creator: {
          connect: { id: session.user.id }
        },
        // If admin is submitting, auto-approve
        ...(session.user.role === 'ADMIN' && status === 'APPROVED' ? {
          approvedAt: new Date(),
          approvedBy: session.user.id
        } : {})
      }
    });

    // In a real app, you might want to:
    // 1. Send a notification to admins about the new submission
    // 2. Process the thumbnail if not provided
    // 3. Validate the URL and extract metadata

    return NextResponse.json({ 
      success: true, 
      contentId: content.id,
      message: status === 'APPROVED' 
        ? 'Content published successfully' 
        : 'Content submitted for review'
    });

  } catch (error) {
    console.error('Error submitting content:', error);
    return NextResponse.json(
      { error: 'Failed to submit content' },
      { status: 500 }
    );
  }
}
