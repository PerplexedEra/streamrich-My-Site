import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { saveFile } from '@/lib/file-upload';

export async function POST(request: Request) {
  try {
    // Verify admin authentication
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Save the file
    const result = await saveFile(file);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to upload file' },
        { status: 400 }
      );
    }

    // Return file info
    return NextResponse.json({
      success: true,
      filePath: result.filePath,
      fileName: result.fileName,
      fileType: result.fileType,
      fileSize: result.fileSize
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Add this to handle preflight OPTIONS request
// This is necessary for file uploads from the browser
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
