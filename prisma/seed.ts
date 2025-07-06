import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create brands
  const brand1 = await prisma.brand.upsert({
    where: { name: 'GreenLeaf Collective' },
    update: {},
    create: {
      name: 'GreenLeaf Collective',
      description: 'A legacy California cannabis brand known for eco-friendly packaging.'
    },
  });
  const brand2 = await prisma.brand.upsert({
    where: { name: '420 Originals' },
    update: {},
    create: {
      name: '420 Originals',
      description: 'Classic cannabis branding from the early 2000s.'
    },
  });

  // Create tags
  const tag1 = await prisma.tag.upsert({
    where: { name: 'Sativa' },
    update: {},
    create: { name: 'Sativa' },
  });
  const tag2 = await prisma.tag.upsert({
    where: { name: 'Indica' },
    update: {},
    create: { name: 'Indica' },
  });

  // Create items
  await prisma.item.create({
    data: {
      brandId: brand1.id,
      product: 'Eco Pre-Roll Pack',
      year: 2022,
      date: '2022-08-15',
      description: 'Sustainably packaged pre-rolls with recycled paper and soy ink.',
      image: '/placeholder.jpg',
      tags: { connect: [{ id: tag1.id }] },
    },
  });
  await prisma.item.create({
    data: {
      brandId: brand2.id,
      product: 'Classic OG Jar',
      year: 2019,
      date: '2019-04-20',
      description: 'Iconic glass jar with retro 420 branding.',
      image: '/placeholder.jpg',
      tags: { connect: [{ id: tag2.id }] },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
