import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const farmers = await prisma.farmer.findMany({
    include: {
      user: true,
      farms: true,
      enrollments: true,
      agent: { include: { company: true, user: true } }
    }
  })

  console.log(`Total Farmers: ${farmers.length}`)
  farmers.forEach((f, i) => {
    console.log(`${i+1}. Name: ${f.user.name}, Agent: ${f.agent?.user?.email || 'NONE'}, Company: ${f.agent?.company?.name || 'NONE'} (ID: ${f.agent?.companyId || 'NONE'}), Enrollments: ${f.enrollments.length}`)
    console.log(`   Farms: ${f.farms.length}`)
    f.farms.forEach((farm, j) => {
      console.log(`   - Farm ${j+1}: ${farm.locationName}, Coords: ${farm.polygonCoordinates}`)
    })
  })
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())
