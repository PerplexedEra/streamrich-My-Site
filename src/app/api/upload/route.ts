import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ContentType, PlatformType } from '@prisma/client';
import { statSync, existsSync } from 'fs';
import mime from 'mime-types';

// Configure upload directory
const UPLOAD_DIR = process.env.UPLOAD_DIR || './public/uploads';
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

// Ensure upload directory exists
const ensureUploadDir = async () => {
  try {
    await mkdir(UPLOAD_DIR, { recursive: true });
  } catch (error) {
    console.error('Failed to create upload directory:', error);
    throw new Error('Failed to initialize upload directory');
  }
};

// Validate file size and type
const validateFile = (file: File) => {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds the limit of ${MAX_FILE_SIZE / 1024 / 1024}MB`);
  }

  // Check MIME type
  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/webp', 'image/gif',
    'audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/x-m4a',
    'video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'
  ];
  
  if (!allowedTypes.includes(file.type) && !file.type.startsWith('audio/') && !file.type.startsWith('video/') && !file.type.startsWith('image/')) {
    throw new Error('Invalid file type. Please upload an image, audio, or video file.');
  }
};

// Extract file extension from MIME type
const getFileExtension = (mimeType: string) => {
  const extension = mime.extension(mimeType);
  return extension || 'bin';
};

// Process and save the uploaded file
const processUpload = async (file: File) => {
  await ensureUploadDir();
  
  const fileExt = getFileExtension(file.type);
  const filename = `${uuidv4()}.${fileExt}`;
  const filePath = join(process.cwd(), UPLOAD_DIR, filename);
  
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  await writeFile(filePath, buffer);
  
  // Verify file was written
  if (!existsSync(filePath)) {
    throw new Error('Failed to save file');
  }
  
  const stats = statSync(filePath);
  if (stats.size === 0) {
    throw new Error('Uploaded file is empty');
  }
  
  return {
    filename,
    filePath,
    size: stats.size,
    mimeType: file.type,
    url: `/uploads/${filename}`
  };
};

export async function POST(req: NextRequest) {
  try {
    // Verify admin access
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Parse form data
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return new NextResponse('No file provided', { status: 400 });
    }

    // Validate file
    try {
      validateFile(file);
    } catch (error: any) {
      return new NextResponse(error.message, { status: 400 });
    }

    // Process file upload
    let fileInfo;
    try {
      fileInfo = await processUpload(file);
    } catch (error: any) {
      console.error('File upload error:', error);
      return new NextResponse('Failed to process file upload', { status: 500 });
    }

    // Parse form data
    const title = formData.get('title') as string;
    const description = formData.get('description') as string || '';
    const type = formData.get('type') as ContentType || 'MUSIC';
    const platform = formData.get('platform') as PlatformType || 'OTHER';
    const isPublic = formData.get('isPublic') === 'true';
    const isFeatured = formData.get('isFeatured') === 'true';
    const isTopListed = formData.get('isTopListed') === 'true';
    const pointsAwarded = parseInt(formData.get('pointsAwarded') as string) || 1;
    const duration = parseInt(formData.get('duration') as string) || 0;
    const planId = formData.get('planId') as string || null;

    // Validate required fields
    if (!title) {
      return new NextResponse('Title is required', { status: 400 });
    }

    // Save to database
    const content = await prisma.content.create({
      data: {
        title,
        description,
        url: fileInfo.url,
        thumbnail: fileInfo.mimeType.startsWith('image/') ? fileInfo.url : null,
        type,
        platform,
        duration,
        isPublic,
        isFeatured,
        isTopListed,
        pointsAwarded,
        userId: session.user.id,
        planId: planId || undefined,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Log the upload
    console.log(`New content uploaded by ${session.user.email}: ${content.title} (${content.id})`);

    return NextResponse.json({
      success: true,
      content: {
        id: content.id,
        title: content.title,
        url: content.url,
        type: content.type,
        createdAt: content.createdAt,
      },
    });

  } catch (error) {
    console.error('Upload error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// Add OPTIONS handler for CORS preflight
// This is important for file uploads from the browser
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
