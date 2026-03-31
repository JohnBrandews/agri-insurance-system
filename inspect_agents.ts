import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const companyId = 'seed-company-1'
  const company = await prisma.insuranceCompany.findUnique({
    where: { id: companyId },
    include: {
      agents: {
        include: {
          user: true,
          _count: { select: { farmersRegistered: true } }
        }
      }
    }
  })

  if (!company) {
    console.log("Company not found")
    return
  }

  console.log(`Company: ${company.name}`)
  console.log(`Total Agents: ${company.agents.length}`)
  company.agents.forEach((a, i) => {
    console.log(`${i+1}. Agent: ${a.user.name} (${a.user.email}), Farmers: ${a._count.farmersRegistered}`)
  })
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())
