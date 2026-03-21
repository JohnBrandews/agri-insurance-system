import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/session"
import { RegisterClient } from "./RegisterClient"
import { Policy } from "@prisma/client"

export default async function RegisterFarmerPage() {
  const session = await requireRole(["AGENT"])

  const agent = await prisma.agent.findUnique({ where: { userId: session.id } })

  let policies: Policy[] = []
  if (agent) {
    policies = await prisma.policy.findMany({
      where: { companyId: agent.companyId, status: "ACTIVE" }
    })
  }

  return <RegisterClient policies={policies} />
}
