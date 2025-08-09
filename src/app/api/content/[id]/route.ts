import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// Approve or reject content
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is admin
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { status, notes } = await req.json();

    // Validate status
    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Update the content
    const content = await prisma.content.update({
      where: { id: params.id },
      data: {
        status,
        approvedAt: status === 'APPROVED' ? new Date() : null,
        approvedBy: status === 'APPROVED' ? session.user.id : null,
        notes: notes || null,
      },
    });

    // In a real app, you might want to:
    // 1. Send a notification to the creator
    // 2. Update any related data
    // 3. Log the moderation action

    return NextResponse.json({ 
      success: true, 
      message: `Content ${status.toLowerCase()} successfully`,
      content
    });

  } catch (error) {
    console.error('Error updating content status:', error);
    return NextResponse.json(
      { error: 'Failed to update content status' },
      { status: 500 }
    );
  }
}

// Delete content
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is admin
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Delete the content
    await prisma.content.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Content deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting content:', error);
    return NextResponse.json(
      { error: 'Failed to delete content' },
      { status: 500 }
    );
  }
}
