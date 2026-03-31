import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/session"
import { RegisterClient } from "./RegisterClient"
import { Policy } from "@prisma/client"
import { parseRegion } from "@/lib/kenya-locations"

export default async function RegisterFarmerPage() {
  const session = await requireRole(["AGENT"])

  const agent = await prisma.agent.findUnique({ where: { userId: session.id } })
  const { county, constituency } = parseRegion(agent?.region)

  let policies: Policy[] = []
  if (agent) {
    policies = await prisma.policy.findMany({
      where: { companyId: agent.companyId, status: "ACTIVE" }
    })
  }

  return <RegisterClient policies={policies} defaultCounty={county} defaultConstituency={constituency} />
}
