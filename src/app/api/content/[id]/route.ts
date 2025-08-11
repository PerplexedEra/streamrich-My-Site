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

    const { notes } = await req.json();

    // Update the content with the provided notes
    const content = await prisma.content.update({
      where: { id: params.id },
      data: {
        // Add any other fields that need to be updated
        // For now, we're just updating the notes if provided
        ...(notes && { notes })
      },
    });

    // In a real app, you might want to:
    // 1. Send a notification to the creator
    // 2. Update any related data
    // 3. Log the moderation action

    return NextResponse.json({ 
      success: true, 
      message: 'Content updated successfully',
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
