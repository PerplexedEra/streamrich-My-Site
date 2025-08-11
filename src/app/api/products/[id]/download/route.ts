import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;
    
    // Get user session
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Find the product
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if user has purchased the product
    const purchase = await prisma.productPurchase.findFirst({
      where: {
        productId,
        user: { email: session.user.email },
        status: 'COMPLETED',
      },
    });

    if (!purchase) {
      return NextResponse.json(
        { error: 'Purchase not found or not completed' },
        { status: 403 }
      );
    }

    // Verify the file exists
    if (!product.fileUrl) {
      return NextResponse.json(
        { error: 'File not available for download' },
        { status: 404 }
      );
    }

    // Get the file path (remove leading slash from fileUrl if present)
    const filePath = product.fileUrl.startsWith('/')
      ? product.fileUrl.substring(1)
      : product.fileUrl;
    
    const fullPath = join(process.cwd(), 'public', filePath);
    
    try {
      // Read the file
      const fileContent = readFileSync(fullPath);
      
      // Get the file extension
      const fileExt = product.fileUrl.split('.').pop() || '';
      let contentType = 'application/octet-stream';
      
      // Set appropriate content type based on file extension
      if (['mp3', 'wav'].includes(fileExt)) {
        contentType = `audio/${fileExt}`;
      } else if (fileExt === 'zip') {
        contentType = 'application/zip';
      }
      
      // Update download count
      await prisma.product.update({
        where: { id: productId },
        data: {
          downloadCount: { increment: 1 },
        },
      });

      await prisma.productPurchase.update({
        where: { id: purchase.id },
        data: {
          downloadCount: { increment: 1 },
          // lastDownloadedAt field removed as it's not in the model
        },
      });

      // Return the file
      return new NextResponse(fileContent, {
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `attachment; filename="${product.name}.${fileExt}"`,
          'Content-Length': fileContent.length.toString(),
        },
      });
      
    } catch (error) {
      console.error('Error reading file:', error);
      return NextResponse.json(
        { error: 'Error reading file' },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Failed to process download' },
      { status: 500 }
    );
  }
}
