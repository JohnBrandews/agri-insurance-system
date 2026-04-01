import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function debugStats() {
  const agents = await prisma.agent.findMany({
    where: {
      farmersRegistered: {
        some: {}
      }
    },
    include: {
      user: true,
      farmersRegistered: {
        include: {
          user: true,
          farms: true,
          enrollments: true
        }
      }
    }
  })

  if (agents.length === 0) {
    console.log("No agents with farmers found")
    return
  }

  const agent = agents.find(a => a.farmersRegistered.length === 2) || agents[0]

  console.log(`Agent: ${agent.id} (Region: ${agent.region})`)
  console.log(`Total Farmers Registered by Agent: ${agent.farmersRegistered.length}`)

  agent.farmersRegistered.forEach(farmer => {
    console.log(`\nFarmer: ${farmer.user.name} (ID: ${farmer.id})`)
    console.log(`  Farms: ${farmer.farms.length}`)
    farmer.farms.forEach((farm, i) => {
      console.log(`    ${i + 1}. Farm ID: ${farm.id}, Location: ${farm.locationName}, Created: ${farm.createdAt}`)
    })
    console.log(`  Enrollments: ${farmer.enrollments.length}`)
  })
}

debugStats()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
