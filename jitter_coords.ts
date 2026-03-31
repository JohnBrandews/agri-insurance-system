import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Farmer 2, 3, 4 are currently stacked at [-0.12, 36.15]
  // Let's give them slightly different locations in the same general area (Nakuru region)

  const updates = [
    { 
      email: 'farmer2@makueni.local', // Wait, script says Farmer 2 is lilian muli in Nakuru area?
      // Actually, let's just find them by Name to be safe as per my previous inspect_db output
      name: 'lilian muli', 
      coords: [
        { lat: -0.1245, lng: 36.1512 },
        { lat: -0.1255, lng: 36.1522 },
        { lat: -0.1265, lng: 36.1512 },
        { lat: -0.1255, lng: 36.1502 }
      ]
    },
    { 
      name: 'mary doni', 
      coords: [
        { lat: -0.1310, lng: 36.1620 },
        { lat: -0.1320, lng: 36.1630 },
        { lat: -0.1330, lng: 36.1620 },
        { lat: -0.1320, lng: 36.1610 }
      ]
    },
    { 
      name: 'kichwa lukula', 
      coords: [
        { lat: -0.1150, lng: 36.1450 },
        { lat: -0.1160, lng: 36.1460 },
        { lat: -0.1170, lng: 36.1450 },
        { lat: -0.1160, lng: 36.1440 }
      ]
    }
  ]

  for (const update of updates) {
    const user = await prisma.user.findFirst({ where: { name: update.name }, include: { farmerProfile: { include: { farms: true } } } })
    if (user?.farmerProfile?.farms[0]) {
      const farm = user.farmerProfile.farms[0]
      await prisma.farm.update({
        where: { id: farm.id },
        data: { polygonCoordinates: JSON.stringify(update.coords) }
      })
      console.log(`Updated coordinates for ${update.name}`)
    } else {
      console.log(`Could not find farm for ${update.name}`)
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())
