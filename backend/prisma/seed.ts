import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
import { DealStatus, PrismaClient } from '../generated/prisma/client';

const adapter = new PrismaPg(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });

// Sample data for realistic clients and deals
const firstNames = [
  'John',
  'Jane',
  'Michael',
  'Sarah',
  'David',
  'Emily',
  'Robert',
  'Lisa',
  'James',
  'Mary',
  'William',
  'Patricia',
  'Richard',
  'Jennifer',
  'Joseph',
  'Linda',
  'Thomas',
  'Barbara',
  'Charles',
  'Susan',
];

const lastNames = [
  'Smith',
  'Johnson',
  'Williams',
  'Brown',
  'Jones',
  'Garcia',
  'Miller',
  'Davis',
  'Rodriguez',
  'Martinez',
  'Hernandez',
  'Lopez',
  'Gonzalez',
  'Wilson',
  'Anderson',
  'Thomas',
  'Taylor',
  'Moore',
  'Jackson',
  'Martin',
];

const dealTitles = [
  'Website Development',
  'Mobile App Project',
  'Marketing Campaign',
  'Consulting Services',
  'Software Implementation',
  'Data Analysis',
  'Cloud Migration',
  'Security Audit',
  'UI/UX Design',
  'API Integration',
  'Database Optimization',
  'E-commerce Platform',
  'CRM Setup',
  'Training Program',
  'Support Contract',
  'Maintenance Agreement',
  'Research Project',
  'Product Development',
  'System Integration',
  'Infrastructure Upgrade',
];

const domains = [
  'gmail.com',
  'yahoo.com',
  'outlook.com',
  'company.com',
  'business.org',
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateEmail(firstName: string, lastName: string): string {
  const domain = getRandomElement(domains);
  const randomNumber = Math.random() > 0.5 ? getRandomNumber(1, 99) : '';
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomNumber}@${domain}`;
}

function generatePhone(): string {
  const areaCode = getRandomNumber(100, 999);
  const prefix = getRandomNumber(100, 999);
  const lineNumber = getRandomNumber(1000, 9999);
  return `(${areaCode}) ${prefix}-${lineNumber}`;
}

function generateAmount(): number {
  // Generate realistic deal amounts between $1,000 and $100,000
  const ranges = [
    { min: 1000, max: 5000, weight: 0.3 }, // 30% small deals
    { min: 5000, max: 15000, weight: 0.4 }, // 40% medium deals
    { min: 15000, max: 50000, weight: 0.2 }, // 20% large deals
    { min: 50000, max: 100000, weight: 0.1 }, // 10% enterprise deals
  ];

  const random = Math.random();
  let cumulative = 0;

  for (const range of ranges) {
    cumulative += range.weight;
    if (random <= cumulative) {
      return getRandomNumber(range.min, range.max);
    }
  }

  return getRandomNumber(1000, 10000);
}

function generateDealStatus(): DealStatus {
  const statuses: DealStatus[] = [
    DealStatus.NEW,
    DealStatus.IN_PROGRESS,
    DealStatus.WON,
    DealStatus.LOST,
  ];

  // Weighted distribution for realistic scenario
  const weights = [0.25, 0.35, 0.25, 0.15]; // NEW, IN_PROGRESS, WON, LOST
  const random = Math.random();
  let cumulative = 0;

  for (let i = 0; i < statuses.length; i++) {
    cumulative += weights[i];
    if (random <= cumulative) {
      return statuses[i];
    }
  }

  return DealStatus.NEW;
}

async function main() {
  console.log('Starting database seeding...');

  // Clean existing data
  await prisma.deal.deleteMany();
  await prisma.client.deleteMany();
  console.log('Cleared existing data');

  const clients = [];

  // Create 20 clients
  for (let i = 0; i < 20; i++) {
    const firstName = getRandomElement(firstNames);
    const lastName = getRandomElement(lastNames);
    const email = generateEmail(firstName, lastName);
    const phone = Math.random() > 0.3 ? generatePhone() : undefined; // 70% have phone numbers

    const client = await prisma.client.create({
      data: {
        name: `${firstName} ${lastName}`,
        email,
        phone,
      },
    });

    clients.push(client);
    console.log(`Created client ${i + 1}: ${client.name}`);
  }

  // Create random deals (0-5 per client)
  let totalDeals = 0;
  for (const client of clients) {
    const numDeals = getRandomNumber(0, 5);

    for (let i = 0; i < numDeals; i++) {
      const title = getRandomElement(dealTitles);
      const amount = generateAmount();
      const status = generateDealStatus();

      const deal = await prisma.deal.create({
        data: {
          title,
          amount,
          status,
          clientId: client.id,
        },
      });

      totalDeals++;
      console.log(
        `Created deal ${totalDeals}: "${deal.title}" for ${client.name} - $${amount.toLocaleString()} (${status})`,
      );
    }
  }

  console.log(`\nSeeding completed!`);
  console.log(`Created ${clients.length} clients`);
  console.log(`Created ${totalDeals} deals`);

  // Show some statistics
  const dealStats = await prisma.deal.groupBy({
    by: ['status'],
    _count: {
      status: true,
    },
  });

  console.log('\nDeal Status Distribution:');
  dealStats.forEach((stat) => {
    console.log(`  ${stat.status}: ${stat._count.status} deals`);
  });

  const totalValue = await prisma.deal.aggregate({
    _sum: {
      amount: true,
    },
  });

  console.log(
    `\nTotal Deal Value: $${totalValue._sum.amount?.toLocaleString() || 0}`,
  );
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
