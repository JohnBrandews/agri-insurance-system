import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
}

async function main() {
  console.log("Seeding started. Ensuring super admin access...")

  const admin = await prisma.user.upsert({
    where: { email: 'farmshield28@gmail.com' },
    update: {
      password: hashPassword('Lil bendy86$'),
      role: 'SUPER_ADMIN',
      name: 'FarmShield Admin',
    },
    create: {
      email: 'farmshield28@gmail.com',
      password: hashPassword('Lil bendy86$'),
      role: 'SUPER_ADMIN',
      name: 'FarmShield Admin',
    },
  })
  console.log("Super admin seeded:", admin.email)
  console.log("Seeding complete.")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
