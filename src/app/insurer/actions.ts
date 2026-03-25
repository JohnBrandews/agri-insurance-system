"use server"

import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/session"
import { revalidatePath } from "next/cache"
import { sendAgentSuspensionEmail, sendAgentReinstatementEmail, sendPolicyDeletionEmail } from "@/lib/auth-utils"

export async function updateAgentStatus(id: string, status: "ACTIVE" | "SUSPENDED") {
  await requireRole(["INSURER"])
  
  const agent = await prisma.agent.update({
    where: { id },
    data: { status },
    include: { user: true }
  })

  if (status === "SUSPENDED") {
    await sendAgentSuspensionEmail(agent.user.email, agent.user.name)
  } else if (status === "ACTIVE") {
    await sendAgentReinstatementEmail(agent.user.email, agent.user.name)
  }

  revalidatePath("/insurer/agents")
}

export async function approveAgent(id: string) {
  await requireRole(["INSURER"])
  await prisma.agent.update({
    where: { id },
    data: { status: "ACTIVE" }
  })
  revalidatePath("/insurer/agents")
}

export async function updateAgentDetails(agentId: string, data: {
  name?: string
  email?: string
  phone?: string
  idNumber?: string
  region?: string
}) {
  await requireRole(["INSURER"])
  
  const agent = await prisma.agent.findUnique({
    where: { id: agentId },
    include: { user: true }
  })

  if (!agent) throw new Error("Agent not found")

  // Update user details
  if (data.name || data.email) {
    await prisma.user.update({
      where: { id: agent.userId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.email && { email: data.email })
      }
    })
  }

  // Update agent details
  await prisma.agent.update({
    where: { id: agentId },
    data: {
      ...(data.phone && { phone: data.phone }),
      ...(data.idNumber && { idNumber: data.idNumber }),
      ...(data.region && { region: data.region })
    }
  })

  revalidatePath("/insurer/agents")
}

import { generateSetupToken, sendSetupEmail } from "@/lib/auth-utils"

export async function resendInvitation(agentId: string) {
  const session = await requireRole(["INSURER"])
  
  const agent = await prisma.agent.findUnique({
    where: { id: agentId },
    include: { user: true }
  })

  if (!agent) throw new Error("Agent not found")

  const token = generateSetupToken()
  const expires = new Date(Date.now() + 24 * 60 * 60000) // 24 hours

  await prisma.verificationToken.create({
    data: {
      identifier: agent.user.email,
      token,
      expires,
      role: "AGENT"
    }
  })

  await sendSetupEmail(agent.user.email, token, "AGENT")
  return { success: true }
}

export async function createPolicy(data: {
  name: string
  cropType: string
  region: string
  rainfallThreshold: number
  premiumRate: number
  payoutRate: number
  seasonStart: string
  seasonEnd: string
}) {
  const session = await requireRole(["INSURER"])
  
  await prisma.policy.create({
    data: {
      ...data,
      companyId: session.companyId!,
      seasonStart: new Date(data.seasonStart),
      seasonEnd: new Date(data.seasonEnd),
      status: "ACTIVE"
    }
  })

  revalidatePath("/insurer/policies")
}

export async function removeAgent(agentId: string) {
  const session = await requireRole(["INSURER"])
  
  const agent = await prisma.agent.findUnique({
    where: { id: agentId },
    include: { user: true, company: true }
  })

  if (!agent) throw new Error("Agent not found")
  
  // Verify the agent belongs to this insurer
  if (agent.companyId !== session.companyId) {
    throw new Error("Unauthorized")
  }

  // Delete the user as well to allow re-inviting the same agent
  await prisma.user.delete({
    where: { id: agent.userId }
  })

  revalidatePath("/insurer/agents")
}

export async function deletePolicy(policyId: string) {
  const session = await requireRole(["INSURER"])

  // Get policy details and related agents/admins
  const policy = await prisma.policy.findUnique({
    where: { id: policyId, companyId: session.companyId! },
    include: {
      company: true,
      enrollments: {
        include: {
          farmer: {
            include: {
              agent: {
                include: { user: true }
              }
            }
          }
        }
      }
    }
  })

  if (!policy) throw new Error("Policy not found")

  // Get unique agents and admins to notify
  const agents = new Set<string>()
  const admins = new Set<string>()

  policy.enrollments.forEach(enrollment => {
    if (enrollment.farmer.agent?.user.email) {
      agents.add(enrollment.farmer.agent.user.email)
    }
  })

  // Get all super admins
  const superAdmins = await prisma.user.findMany({
    where: { role: "SUPER_ADMIN" }
  })
  superAdmins.forEach(admin => admins.add(admin.email))

  // Send emails
  const emailPromises = [
    ...Array.from(agents).map(email => sendPolicyDeletionEmail(email, policy.name, policy.company.name)),
    ...Array.from(admins).map(email => sendPolicyDeletionEmail(email, policy.name, policy.company.name))
  ]

  await Promise.all(emailPromises)

  // Delete the policy (this will cascade delete enrollments and payouts)
  await prisma.policy.delete({
    where: { id: policyId }
  })

  revalidatePath("/insurer/policies")
}
