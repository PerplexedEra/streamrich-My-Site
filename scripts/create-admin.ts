import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

// This script creates an admin user with email admin@streamrich.com and password admin123

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@streamrich.com';
  const password = 'admin123';
  const name = 'Admin User';

  try {
    // Check if admin already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
      include: { profile: true }
    });

    if (existingUser) {
      // Update existing user to admin if needed
      if (existingUser.role !== 'ADMIN') {
        await prisma.user.update({
          where: { email },
          data: { 
            role: 'ADMIN',
            // Ensure required fields are present
            name: existingUser.name || name,
            emailVerified: existingUser.emailVerified || new Date(),
          },
        });
        console.log('✅ Updated existing user to admin role');
      } else {
        console.log('ℹ️ Admin user already exists:');
      }
      console.log('Email:', email);
      console.log('Role: ADMIN');
      return;
    }

    // Create the admin user with minimal required fields
    const user = await prisma.user.create({
      data: {
        email,
        name,
        emailVerified: new Date(),
        role: 'ADMIN',
        // Create minimal profile
        profile: {
          create: {
            displayName: name,
            bio: 'Site Administrator'
          }
        },
        // Create two-factor auth (required relation)
        twoFactorAuth: {
          create: {
            secret: uuidv4(),
            isEnabled: false
          }
        }
      },
      include: {
        profile: true
      }
    });
    
    // Set the password directly in the database
    await prisma.$executeRaw`
      UPDATE "User" 
      SET "password" = ${await hash(password, 12)}
      WHERE "id" = ${user.id}
    `;

    console.log('✅ Admin user created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Role: ADMIN');
    console.log('\n⚠️ IMPORTANT: Change this password after first login!');
    
    // Create a credentials account for the user
    await prisma.account.create({
      data: {
        userId: user.id,
        type: 'credentials',
        provider: 'credentials',
        providerAccountId: user.id,
      },
    });
    
    console.log('\n✅ Credentials account created for admin user');
    
  } catch (error) {
    console.error('❌ Error creating admin user:');
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
