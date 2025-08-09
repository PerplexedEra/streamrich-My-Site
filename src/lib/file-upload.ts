import { writeFile, mkdir, unlink, readFile, stat } from 'fs/promises';
import { join, extname, basename } from 'path';
import { randomBytes } from 'crypto';
import mime from 'mime-types';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';
import { createWriteStream, existsSync } from 'fs';

const UPLOAD_DIR = process.env.UPLOAD_DIR || join(process.cwd(), 'public', 'uploads');
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
// Allow all file types
const ALLOWED_FILE_TYPES: string[] = [];

interface UploadResult {
  success: boolean;
  filePath?: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  error?: string;
}

/**
 * Validates a file based on type and size
 */
function validateFile(file: File | { name: string; size: number; type: string }): { valid: boolean; error?: string; fileType: string } {
  // Get file type or default to application/octet-stream
  const fileType = file.type || mime.lookup(file.name) || 'application/octet-stream';
  
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: 'File is too large. Maximum size is 100MB.',
      fileType
    };
  }
  
  // All file types are allowed
  return { valid: true, fileType };
}

/**
 * Saves a file from a File object (from browser)
 */
export async function saveFile(file: File): Promise<UploadResult> {
  const validation = validateFile(file);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  try {
    // Log upload directory info
    console.log(`Upload directory: ${UPLOAD_DIR}`);
    
    // Create uploads directory if it doesn't exist
    try {
      await mkdir(UPLOAD_DIR, { recursive: true });
      console.log(`Directory created or already exists: ${UPLOAD_DIR}`);
    } catch (error) {
      console.error('Error creating upload directory:', error);
      return {
        success: false,
        error: 'Failed to create upload directory. Please check server permissions.'
      };
    }

    // Generate a unique filename
    const fileExt = file.name.split('.').pop();
    const randomString = randomBytes(8).toString('hex');
    const fileName = `${randomString}-${Date.now()}.${fileExt}`;
    const filePath = join(UPLOAD_DIR, fileName);
    console.log(`Saving file to: ${filePath}`);

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save file
    await writeFile(filePath, buffer);

    // Get the validated file type
    const { fileType: validatedFileType } = validateFile(file);
    
    // Return file info
    return {
      success: true,
      filePath: `/uploads/${fileName}`,
      fileName: file.name,
      fileType: validatedFileType,
      fileSize: file.size
    };
  } catch (error) {
    console.error('Error saving file:', error);
    return {
      success: false,
      error: 'Failed to save file. Please try again.'
    };
  }
}

/**
 * Saves a file from a Buffer or Readable stream
 */
export async function saveBuffer(
  bufferOrStream: Buffer | Readable,
  originalName: string,
  options: { type?: string; size?: number } = {}
): Promise<UploadResult> {
  const fileInfo = {
    name: originalName,
    type: options.type || mime.lookup(originalName) || 'application/octet-stream',
    size: options.size || 0
  };

  const validation = validateFile(fileInfo);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  try {
    // Create uploads directory if it doesn't exist
    await mkdir(UPLOAD_DIR, { recursive: true });

    // Generate a unique filename
    const fileExt = originalName.split('.').pop();
    const randomString = randomBytes(8).toString('hex');
    const fileName = `${randomString}-${Date.now()}.${fileExt}`;
    const filePath = join(UPLOAD_DIR, fileName);
    const publicPath = `/uploads/${fileName}`;

    // Handle Buffer or Readable stream
    if (bufferOrStream instanceof Buffer) {
      await writeFile(filePath, bufferOrStream);
    } else {
      const writeStream = createWriteStream(filePath);
      await pipeline(bufferOrStream, writeStream);
    }

    // Get actual file size
    const stats = await import('fs/promises').then(fs => fs.stat(filePath));
    const fileSize = stats.size;

    return {
      success: true,
      filePath: publicPath,
      fileName: originalName,
      fileType: validation.fileType,
      fileSize
    };
  } catch (error) {
    console.error('Error saving file from buffer/stream:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save file'
    };
  }
}

/**
 * Deletes a file from the filesystem
 */
export async function deleteFile(filePath: string): Promise<boolean> {
  try {
    // If it's a public path (starts with /uploads), convert to filesystem path
    const fullPath = filePath.startsWith('/uploads/')
      ? join(process.cwd(), 'public', filePath)
      : filePath;

    if (!existsSync(fullPath)) {
      console.warn(`File not found: ${fullPath}`);
      return false;
    }

    await unlink(fullPath);
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
}

/**
 * Gets file info without reading the entire file
 */
export async function getFileInfo(filePath: string) {
  try {
    const fs = await import('fs/promises');
    const stats = await fs.stat(filePath);
    
    return {
      exists: true,
      size: stats.size,
      modifiedAt: stats.mtime,
      isFile: stats.isFile(),
      isDirectory: stats.isDirectory(),
      extension: extname(filePath).toLowerCase(),
      name: basename(filePath)
    };
  } catch (error) {
    return { exists: false };
  }
}

/**
 * Reads a file as a Buffer
 */
export async function readFileAsBuffer(filePath: string): Promise<Buffer | null> {
  try {
    return await readFile(filePath);
  } catch (error) {
    console.error('Error reading file:', error);
    return null;
  }
}

/**
 * Creates a Readable stream from a file
 */
export function createFileStream(filePath: string): Readable | null {
  try {
    const fs = require('fs');
    if (!fs.existsSync(filePath)) {
      return null;
    }
    return fs.createReadStream(filePath);
  } catch (error) {
    console.error('Error creating file stream:', error);
    return null;
  }
}
