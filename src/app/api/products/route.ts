import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/products - Get all products (public)
export async function GET() {
  try {
    // Fetch all available products (only those in stock)
    const products = await prisma.product.findMany({
      where: { inStock: true },
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
