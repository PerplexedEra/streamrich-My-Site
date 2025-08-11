import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

type ProductData = {
  id?: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  fileUrl?: string;
  fileType?: string;
  fileSize?: number;
  category: string;
  inStock: boolean;
  downloadCount?: number;
};

// GET /api/admin/products - Get all products
export async function GET() {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Fetch all products
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/admin/products - Create a new product
export async function POST(request: Request) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { 
      name, 
      description, 
      price, 
      imageUrl, 
      fileUrl, 
      fileType, 
      fileSize, 
      category, 
      inStock 
    } = body as ProductData;

    // Validate required fields
    if (!name || !description || price === undefined || !imageUrl || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('Creating product with data:', {
      name,
      description,
      price: parseFloat(price.toString()),
      imageUrl,
      fileUrl: fileUrl || null,
      fileType: fileType || null,
      fileSize: fileSize ? parseInt(fileSize.toString()) : null,
      category,
      inStock: Boolean(inStock),
    });

    // Create new product
    try {
      // Debug: Log prisma object to check if it's defined
      console.log('Prisma client:', prisma);
      console.log('Prisma models:', Object.keys(prisma));
      
      // Ensure all required fields are provided and have correct types
      const productData = {
        name: String(name),
        description: String(description),
        price: parseFloat(price.toString()),
        imageUrl: String(imageUrl),
        fileUrl: fileUrl || null,
        fileType: fileType || null,
        fileSize: fileSize ? parseInt(fileSize.toString()) : null,
        category: category as any, // Type assertion since we've validated the category
        inStock: Boolean(inStock),
        downloadCount: 0
      };
      
      console.log('Creating product with data:', productData);
      
      // List all tables in PostgreSQL
      const tables = await prisma.$queryRaw`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `;
      console.log('Available tables:', tables);
      
      // Try to create the product
      const product = await prisma.product.create({
        data: productData,
      });
      
      console.log('Product created successfully:', product);
      return NextResponse.json(product, { status: 201 });
    } catch (error) {
      console.error('Prisma error creating product:', error);
      // Return more detailed error information
      return NextResponse.json(
        { 
          error: 'Failed to create product',
          details: error instanceof Error ? error.message : 'Unknown error',
          stack: process.env.NODE_ENV === 'development' ? (error as Error).stack : undefined
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Failed to create product:', error);
    // Return more detailed error information
    return NextResponse.json(
      { 
        error: 'Failed to create product',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? (error as Error).stack : undefined
      },
      { status: 500 }
    );
  }
}

// PUT /api/admin/products/[id] - Update a product
export async function PUT(request: Request) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get product ID from URL
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { 
      name, 
      description, 
      price, 
      imageUrl, 
      fileUrl, 
      fileType, 
      fileSize, 
      category, 
      inStock 
    } = body as ProductData;

    // Validate required fields
    if (!name || !description || price === undefined || !imageUrl || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Update product
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price: parseFloat(price.toString()),
        imageUrl,
        fileUrl: fileUrl || null,
        fileType: fileType || null,
        fileSize: fileSize ? parseInt(fileSize.toString()) : null,
        category: category as 'BEATS' | 'PRESETS' | 'SOFTWARE' | 'SAMPLE_PACK' | 'MIDI' | 'OTHER',
        inStock: Boolean(inStock),
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Failed to update product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/products/[id] - Delete a product
export async function DELETE(request: Request) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get product ID from URL
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Delete product
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
