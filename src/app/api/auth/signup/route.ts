import { NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

// Type for the signup request body
type SignupData = {
  name: string;
  email: string;
  password: string;
  role?: 'USER' | 'CREATOR';
};

// Extend the Prisma client to include the createUserWithPassword function
const customPrisma = new PrismaClient().$extends({
  model: {
    user: {
      async createWithPassword({ name, email, password, role = 'USER' }: {
        name: string;
        email: string;
        password: string;
        role?: 'USER' | 'CREATOR';
      }) {
        const hashedPassword = await hash(password, 12);
        
        // Create user with email provider account
        return prisma.user.create({
          data: {
            name,
            email: email.toLowerCase().trim(),
            emailVerified: new Date(),
            role,
            accounts: {
              create: {
                type: 'credentials',
                provider: 'credentials',
                providerAccountId: email.toLowerCase().trim(),
                // Store the hashed password in the account
                refresh_token: hashedPassword,
                access_token: '', // Required by schema but not used for credentials
              },
            },
          },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        });
      },
    },
  },
});

export async function POST(req: Request) {
  console.log('Signup request received');
  try {
    const body = await req.json();
    console.log('Request body:', JSON.stringify(body, null, 2));
    
    const { name, email, password, role = 'USER' } = body as Partial<SignupData>;
    
    // Input validation
    if (!email || !email.includes('@')) {
      console.log('Invalid email format');
      return NextResponse.json(
        { message: 'Please provide a valid email address' },
        { status: 400 }
      );
    }
    
    if (!name || name.trim().length < 2) {
      console.log('Name too short');
      return NextResponse.json(
        { message: 'Name must be at least 2 characters long' },
        { status: 400 }
      );
    }
    
    if (!password || password.length < 6) {
      console.log('Password too short');
      return NextResponse.json(
        { message: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
    
    if (existingUser) {
      console.log('User already exists:', email);
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 400 }
      );
    }

    if (existingUser) {
      console.log('Signup attempt with existing email:', email);
      return NextResponse.json(
        { message: 'User already exists with this email' },
        { status: 400 }
      );
    }

    console.log('Creating user with email:', email);
    
    // Create the user with password
    console.log('Creating user with role:', role);
    const user = await customPrisma.user.createWithPassword({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: role as 'USER' | 'CREATOR',
    });

    console.log('User created successfully, creating profile...');
    
    try {
      // Create the user's profile with only the required fields
      const profile = await prisma.profile.create({
        data: {
          userId: user.id,
          displayName: name.trim(),
        },
      });
      console.log('Profile created successfully:', profile);
    } catch (profileError) {
      console.error('Error creating profile:', profileError);
      // If profile creation fails, we still return success since the user was created
      // The profile can be created later if needed
    }
    
    return NextResponse.json(
      { 
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }, 
        message: 'User created successfully' 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
}
