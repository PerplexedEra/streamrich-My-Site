import { PrismaClient, UserRole } from '@prisma/client';
import { hash } from 'bcryptjs';
import * as readline from 'readline';

const prisma = new PrismaClient();

async function promoteToAdmin(email: string) {
  try {
    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true }
    });

    if (!user) {
      console.error(`❌ User with email ${email} not found`);
      return false;
    }

    if (user.role === 'ADMIN') {
      console.log(`ℹ️ User ${email} is already an admin`);
      return true;
    }

    // Update the user to admin
    await prisma.user.update({
      where: { email },
      data: { 
        role: UserRole.ADMIN,
        // Ensure required fields are present
        name: user.name || 'Admin User',
        emailVerified: user.emailVerified || new Date(),
      },
    });

    console.log(`✅ Successfully promoted ${email} to admin`);
    return true;
  } catch (error) {
    console.error('❌ Error promoting user to admin:', error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Get email from command line arguments or prompt user
async function main() {
  let email = process.argv[2];

  if (!email) {
    email = await new Promise<string>((resolve) => {
      rl.question('Enter the email of the user to promote to admin: ', (answer) => {
        resolve(answer.trim());
      });
    });
  }

  if (!email) {
    console.error('❌ No email provided');
    process.exit(1);
  }

  await promoteToAdmin(email);
  rl.close();
}

main().catch(console.error);
