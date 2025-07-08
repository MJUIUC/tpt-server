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
  const item1 = await prisma.item.create({
    data: {
      brandId: brand1.id,
      product: 'Eco Pre-Roll Pack',
      year: 2022,
      date: '2022-08-15',
      description: 'Sustainably packaged pre-rolls with recycled paper and soy ink.',
      image: 'http://localhost:9000/tpt-gallery/IMG_7498.JPG', // deprecated, but keep for fallback
      tags: { connect: [{ id: tag1.id }] },
    },
  });
  const item2 = await prisma.item.create({
    data: {
      brandId: brand2.id,
      product: 'Classic OG Jar',
      year: 2019,
      date: '2019-04-20',
      description: 'Iconic glass jar with retro 420 branding.',
      image: 'http://localhost:9000/tpt-gallery/IMG_7501.JPG', // deprecated, but keep for fallback
      tags: { connect: [{ id: tag2.id }] },
    },
  });

  // Seed images and associate with items (using MinIO URLs)
  await prisma.image.createMany({
    data: [
      {
        url: 'http://localhost:9000/tpt-gallery/IMG_7498.JPG',
        filename: 'IMG_7498.JPG',
        mimetype: 'image/jpeg',
        size: 3500000, // example size in bytes
        width: 3000,
        height: 4000,
        itemId: item1.id,
      },
      {
        url: 'http://localhost:9000/tpt-gallery/IMG_7501.JPG',
        filename: 'IMG_7501.JPG',
        mimetype: 'image/jpeg',
        size: 3400000,
        width: 3000,
        height: 4000,
        itemId: item1.id,
      },
      {
        url: 'http://localhost:9000/tpt-gallery/IMG_7506.JPG',
        filename: 'IMG_7506.JPG',
        mimetype: 'image/jpeg',
        size: 3300000,
        width: 3000,
        height: 4000,
        itemId: item1.id,
      },
      {
        url: 'http://localhost:9000/tpt-gallery/IMG_7524.JPG',
        filename: 'IMG_7524.JPG',
        mimetype: 'image/jpeg',
        size: 3200000,
        width: 3000,
        height: 4000,
        itemId: item2.id,
      },
    ]
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
