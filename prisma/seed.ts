import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clean existing data
  await prisma.completion.deleteMany()
  await prisma.item.deleteMany()
  await prisma.invite.deleteMany()
  await prisma.pairMember.deleteMany()
  await prisma.pair.deleteMany()
  await prisma.user.deleteMany()

  // Create demo users
  const hashedPassword = await bcrypt.hash('password123', 12)

  const user1 = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      name: 'Alice',
      passwordHash: hashedPassword,
    },
  })

  const user2 = await prisma.user.create({
    data: {
      email: 'bob@example.com',
      name: 'Bob',
      passwordHash: hashedPassword,
    },
  })

  // Create a pair
  const pair = await prisma.pair.create({
    data: {
      members: {
        create: [
          { userId: user1.id, role: 'member' },
          { userId: user2.id, role: 'member' },
        ],
      },
    },
  })

  // Create sample bucket list items
  const items = [
    {
      title: 'Watch sunrise from a mountain peak',
      notes: 'Find a beautiful mountain location and wake up early to catch the sunrise together',
      position: 0,
    },
    {
      title: 'Learn to cook a cuisine from another country',
      notes: 'Pick a country and master at least 3 traditional dishes',
      position: 1,
    },
    {
      title: 'Take a hot air balloon ride',
      notes: 'Experience the world from above - maybe over wine country or a beautiful landscape',
      position: 2,
    },
    {
      title: 'Visit all 7 continents',
      notes: 'The ultimate travel goal - one continent at a time',
      dueDate: new Date('2030-12-31'),
      position: 3,
    },
    {
      title: 'Learn a new language together',
      notes: 'Spanish or French would be fun for traveling',
      position: 4,
    },
    {
      title: 'Go on a digital detox weekend',
      notes: 'No phones, no internet - just us and nature',
      position: 5,
    },
    {
      title: 'Take a dance class',
      notes: 'Salsa, tango, or swing dancing',
      position: 6,
    },
    {
      title: 'Build something together',
      notes: 'Could be a piece of furniture, a garden, or even a tiny house',
      position: 7,
    },
  ]

  for (const item of items) {
    await prisma.item.create({
      data: {
        ...item,
        pairId: pair.id,
      },
    })
  }

  // Complete one item as an example
  const completedItem = await prisma.item.findFirst({
    where: { pairId: pair.id, title: 'Go on a digital detox weekend' },
  })

  if (completedItem) {
    await prisma.item.update({
      where: { id: completedItem.id },
      data: { completedAt: new Date() },
    })

    await prisma.completion.create({
      data: {
        itemId: completedItem.id,
        userId: user1.id,
        photoPath: '/uploads/sample-completion.jpg',
        caption: 'Amazing weekend in the mountains with no distractions! 🏔️',
      },
    })
  }

  console.log('✅ Database seeded successfully!')
  console.log(`👤 Created users: ${user1.email}, ${user2.email}`)
  console.log(`💑 Created pair with ${items.length} bucket list items`)
  console.log(`🔑 Password for both users: password123`)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
