import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
}

async function main() {
  // Clear optional old data first if needed, passing dependencies
  console.log("Seeding started. Overwriting basic data...")

  // 1. Create Super Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@farmshield.co.ke' },
    update: {
      password: hashPassword('admin'),
    },
    create: {
      email: 'admin@farmshield.co.ke',
      password: hashPassword('admin'),
      role: 'SUPER_ADMIN',
      name: 'FarmShield Admin',
    },
  })
  console.log("Admin seeded:", admin.email)

  // 2. Create an Insurance Company
  const company = await prisma.insuranceCompany.upsert({
    where: { id: 'seed-company-1' },
    update: {},
    create: {
      id: 'seed-company-1',
      name: 'Jubilee Agriculture & Insurance',
      status: 'APPROVED',
    },
  })
  
  // Create Insurer Admin User
  const insurerUser = await prisma.user.upsert({
    where: { email: 'insurer@jubilee.co.ke' },
    update: {
      password: hashPassword('admin'),
    },
    create: {
      email: 'insurer@jubilee.co.ke',
      password: hashPassword('admin'),
      role: 'INSURER',
      name: 'John Jubilee',
      companyId: company.id,
    },
  })
  console.log("Insurer seeded:", insurerUser.email)

  // 3. Create a Dummy Policy for the Company
  const policy = await prisma.policy.upsert({
    where: { id: 'seed-policy-1' },
    update: {},
    create: {
      id: 'seed-policy-1',
      companyId: company.id,
      name: 'Maize Drought Shield 2026',
      cropType: 'Maize',
      region: 'Rift Valley',
      rainfallThreshold: 300, // Pays out if rainfall < 300mm
      premiumRate: 0.05, // 5% fee
      payoutRate: 20000, // 20k per acre payout
      seasonStart: new Date('2026-03-01'),
      seasonEnd: new Date('2026-08-30'),
      status: 'ACTIVE',
    },
  })

  // 4. Create an Agent for this company
  const agentUser = await prisma.user.upsert({
    where: { email: 'agent@jubilee.co.ke' },
    update: {
      password: hashPassword('admin'),
    },
    create: {
      email: 'agent@jubilee.co.ke',
      password: hashPassword('admin'),
      role: 'AGENT',
      name: 'Mark The Agent',
      companyId: company.id,
    },
  })

  const agent = await prisma.agent.upsert({
    where: { userId: agentUser.id },
    update: {},
    create: {
      userId: agentUser.id,
      companyId: company.id,
      region: 'Nakuru',
      status: 'ACTIVE',
    },
  })
  console.log("Agent seeded:", agentUser.email)

  // 5. Create a Farmer enrolled by the Agent
  // Use a phone number for OTP tests
  const farmerUser = await prisma.user.upsert({
    where: { email: 'farmer@0712345678.local' }, // Dummy unique ID
    update: {},
    create: {
      email: 'farmer@0712345678.local',
      password: 'n/a',
      role: 'FARMER',
      name: 'Grace Wanjiku',
    },
  })

  const farmer = await prisma.farmer.upsert({
    where: { userId: farmerUser.id },
    update: {},
    create: {
      userId: farmerUser.id,
      phone: '0712345678', // This is what she uses to login later
      agentId: agent.id,
    },
  })
  console.log("Farmer seeded with phone number:", farmer.phone)

  // Create Farmer's Farm
  const farm = await prisma.farm.upsert({
    where: { id: 'seed-farm-1' },
    update: {},
    create: {
      id: 'seed-farm-1',
      farmerId: farmer.id,
      locationName: 'Subukia Maize Plot A',
      acreage: 2.5,
      cropType: 'Maize',
      // Dummy mapping coordinates stringified
      polygonCoordinates: JSON.stringify([
        { lat: -0.1, lng: 36.1 },
        { lat: -0.1, lng: 36.2 },
        { lat: -0.2, lng: 36.2 },
        { lat: -0.2, lng: 36.1 }
      ]),
      status: 'HEALTHY',
    },
  })

  // 6. Enroll the Farmer into the Policy
  await prisma.enrollment.upsert({
    where: { id: 'seed-enrollment-1' },
    update: {},
    create: {
      id: 'seed-enrollment-1',
      farmerId: farmer.id,
      policyId: policy.id,
      farmId: farm.id,
      status: 'ACTIVE',
    },
  })
  console.log("Enrollment and policy mapped.")

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
