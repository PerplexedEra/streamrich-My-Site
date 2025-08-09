import { PrismaClient, UserRole, Plan } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create default plans
  console.log('🔄 Creating default plans...');
  const basicPlan = await prisma.plan.upsert({
    where: { name: 'Basic' },
    update: {},
    create: {
      name: 'Basic',
      description: 'Basic content visibility',
      price: 5.00,
      duration: 30, // 30 days
      features: [
        'Standard placement in content feed',
        'Basic analytics',
        '30-day visibility'
      ],
      isActive: true,
    },
  });

  const featuredPlan = await prisma.plan.upsert({
    where: { name: 'Featured' },
    update: {},
    create: {
      name: 'Featured',
      description: 'Enhanced content visibility',
      price: 10.00,
      duration: 30, // 30 days
      features: [
        'Priority placement in content feed',
        'Featured badge',
        'Enhanced analytics',
        '30-day visibility'
      ],
      isActive: true,
    },
  });

  const premiumPlan = await prisma.plan.upsert({
    where: { name: 'Premium' },
    update: {},
    create: {
      name: 'Premium',
      description: 'Maximum content visibility',
      price: 15.00,
      duration: 30, // 30 days
      features: [
        'Top placement in content feed',
        'Premium badge',
        'Homepage placement',
        'Priority support',
        'Advanced analytics',
        '30-day visibility'
      ],
      isActive: true,
    },
  });

  // Create admin user if not exists
  console.log('🔄 Creating admin user...');
  const adminEmail = 'admin@streamrich.com';
  const adminPassword = await hash('admin123', 12);
  
  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Admin',
      role: UserRole.ADMIN,
      profile: {
        create: {
          displayName: 'Admin',
          bio: 'System Administrator',
          points: 0,
          totalEarned: 0,
          availableCash: 0,
          totalWithdrawn: 0,
        },
      },
    },
    include: {
      profile: true,
    },
  });

  // Create a sample creator user
  console.log('🔄 Creating sample creator user...');
  const creatorEmail = 'creator@example.com';
  const creatorPassword = await hash('creator123', 12);
  
  const creatorUser = await prisma.user.upsert({
    where: { email: creatorEmail },
    update: {},
    create: {
      email: creatorEmail,
      name: 'Content Creator',
      role: UserRole.CREATOR,
      profile: {
        create: {
          displayName: 'Music Producer',
          bio: 'Creating amazing music content',
          points: 0,
          totalEarned: 0,
          availableCash: 0,
          totalWithdrawn: 0,
        },
      },
    },
    include: {
      profile: true,
    },
  });

  // Create a sample streamer user
  console.log('🔄 Creating sample streamer user...');
  const streamerEmail = 'streamer@example.com';
  const streamerPassword = await hash('streamer123', 12);
  
  const streamerUser = await prisma.user.upsert({
    where: { email: streamerEmail },
    update: {},
    create: {
      email: streamerEmail,
      name: 'Music Lover',
      role: UserRole.STREAMER,
      profile: {
        create: {
          displayName: 'Music Explorer',
          bio: 'Love discovering new music',
          points: 250,
          totalEarned: 1.25,
          availableCash: 1.25,
          totalWithdrawn: 0,
        },
      },
    },
    include: {
      profile: true,
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log('\n🔑 Admin credentials:');
  console.log(`📧 Email: ${adminEmail}`);
  console.log(`🔑 Password: admin123\n`);
  
  console.log('👥 Test users created:');
  console.log(`👨‍💻 Creator: ${creatorEmail} (password: creator123)`);
  console.log(`👩‍🎤 Streamer: ${streamerEmail} (password: streamer123)\n`);
  
  console.log('📊 Plans created:');
  console.log(`- ${basicPlan.name}: $${basicPlan.price} (${basicPlan.duration} days)`);
  console.log(`- ${featuredPlan.name}: $${featuredPlan.price} (${featuredPlan.duration} days)`);
  console.log(`- ${premiumPlan.name}: $${premiumPlan.price} (${premiumPlan.duration} days)`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
