import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function cleanupFarms() {
  console.log("Starting farm cleanup...")

  // Find all farms that are NOT associated with any enrollment
  const orphanFarms = await prisma.farm.findMany({
    where: {
      enrollments: {
        none: {}
      }
    },
    select: {
      id: true,
      locationName: true,
      farmer: {
        select: {
          user: {
            select: { name: true }
          }
        }
      }
    }
  })

  console.log(`Found ${orphanFarms.length} orphan farms to remove.`)

  if (orphanFarms.length > 0) {
    const idsToDelete = orphanFarms.map(f => f.id)
    
    // Also need to clean up related RainfallReadings or TriggerEvents if they exist (schema says they cascade, but let's be safe)
    // Actually, prisma will handle cascades if configured in schema. 
    // Schema says RainfallReading and TriggerEvent cascade on farmId.
    
    const count = await prisma.farm.deleteMany({
      where: {
        id: { in: idsToDelete }
      }
    })

    console.log(`Successfully deleted ${count.count} orphan farms.`)
    
    orphanFarms.forEach((f, i) => {
      console.log(`  Deleted farm for: ${f.farmer.user.name} (${f.locationName})`)
    })
  } else {
    console.log("No orphan farms found.")
  }
}

cleanupFarms()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
