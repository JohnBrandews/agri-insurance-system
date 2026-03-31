import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
}

function getFarmCenter(coordinates: { lat: number; lng: number }[]) {
  const totals = coordinates.reduce(
    (acc, coordinate) => {
      acc.lat += coordinate.lat
      acc.lng += coordinate.lng
      return acc
    },
    { lat: 0, lng: 0 }
  )

  return {
    lat: totals.lat / coordinates.length,
    lng: totals.lng / coordinates.length,
  }
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

  // Create Farmer's Farm (Farmer 1 - Nakuru)
  const farmOneCoordinates = [
    { lat: -0.3031, lng: 36.0800 },
    { lat: -0.3041, lng: 36.0810 },
    { lat: -0.3051, lng: 36.0800 },
    { lat: -0.3041, lng: 36.0790 }
  ]
  const farmOneCenter = getFarmCenter(farmOneCoordinates)

  const farm = await prisma.farm.upsert({
    where: { id: 'seed-farm-1' },
    update: {
      polygonCoordinates: JSON.stringify(farmOneCoordinates),
      latitude: farmOneCenter.lat,
      longitude: farmOneCenter.lng,
    },
    create: {
      id: 'seed-farm-1',
      farmerId: farmer.id,
      locationName: 'Subukia Maize Plot A',
      acreage: 2.5,
      cropType: 'Maize',
      polygonCoordinates: JSON.stringify(farmOneCoordinates),
      latitude: farmOneCenter.lat,
      longitude: farmOneCenter.lng,
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

  // 7. Add More Farmers for Map Diversity
  // Farmer 2 - Makueni
  const farmer2User = await prisma.user.upsert({
    where: { email: 'farmer2@makueni.local' },
    update: {},
    create: {
      email: 'farmer2@makueni.local',
      password: 'n/a',
      role: 'FARMER',
      name: 'Peter Musyoka',
    },
  })

  const farmer2 = await prisma.farmer.upsert({
    where: { userId: farmer2User.id },
    update: {},
    create: {
      userId: farmer2User.id,
      phone: '0722000000',
      agentId: agent.id,
    },
  })

  const farmTwoCoordinates = [{ lat: -1.8044, lng: 37.6243 }]
  const farmTwoCenter = getFarmCenter(farmTwoCoordinates)

  const farm2 = await prisma.farm.upsert({
    where: { id: 'seed-farm-2' },
    update: {
      polygonCoordinates: JSON.stringify(farmTwoCoordinates),
      latitude: farmTwoCenter.lat,
      longitude: farmTwoCenter.lng,
    },
    create: {
      id: 'seed-farm-2',
      farmerId: farmer2.id,
      locationName: 'Wote Dryland Plot',
      acreage: 5.0,
      cropType: 'Green Grams',
      polygonCoordinates: JSON.stringify(farmTwoCoordinates),
      latitude: farmTwoCenter.lat,
      longitude: farmTwoCenter.lng,
      status: 'RISK',
    },
  })

  // Farmer 3 - Kisumu
  const farmer3User = await prisma.user.upsert({
    where: { email: 'farmer3@kisumu.local' },
    update: {},
    create: {
      email: 'farmer3@kisumu.local',
      password: 'n/a',
      role: 'FARMER',
      name: 'Jane Otieno',
    },
  })

  const farmer3 = await prisma.farmer.upsert({
    where: { userId: farmer3User.id },
    update: {},
    create: {
      userId: farmer3User.id,
      phone: '0733000000',
      agentId: agent.id,
    },
  })

  const farmThreeCoordinates = [{ lat: -0.1022, lng: 34.7617 }]
  const farmThreeCenter = getFarmCenter(farmThreeCoordinates)

  const farm3 = await prisma.farm.upsert({
    where: { id: 'seed-farm-3' },
    update: {
      polygonCoordinates: JSON.stringify(farmThreeCoordinates),
      latitude: farmThreeCenter.lat,
      longitude: farmThreeCenter.lng,
    },
    create: {
      id: 'seed-farm-3',
      farmerId: farmer3.id,
      locationName: 'Kibos Rice Field',
      acreage: 3.2,
      cropType: 'Rice',
      polygonCoordinates: JSON.stringify(farmThreeCoordinates),
      latitude: farmThreeCenter.lat,
      longitude: farmThreeCenter.lng,
      status: 'TRIGGERED',
    },
  })

  console.log("Additional farmers and farms seeded.")
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
