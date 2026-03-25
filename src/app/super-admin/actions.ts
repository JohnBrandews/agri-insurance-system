"use server"

import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/session"
import { revalidatePath } from "next/cache"
import { sendSuspensionEmail, sendDeletionEmail } from "@/lib/auth-utils"

export async function updateInsurerStatus(id: string, status: "APPROVED" | "REJECTED") {
  await requireRole(["SUPER_ADMIN"])
  
  const insurer = await prisma.insuranceCompany.update({
    where: { id },
    data: { status },
    include: { users: true }
  })

  if (status === "REJECTED" && insurer.users.length > 0) {
    // Send suspension/rejection email to the first user (admin)
    await sendSuspensionEmail(insurer.users[0].email, insurer.name)
  }

  revalidatePath("/super-admin/insurers")
}

export async function deleteInsurer(id: string) {
  await requireRole(["SUPER_ADMIN"])

  const insurer = await prisma.insuranceCompany.findUnique({
    where: { id },
    include: { users: true, agents: { include: { user: true } } }
  })

  if (!insurer) throw new Error("Insurer not found")

  // Notify Admin
  if (insurer.users.length > 0) {
    await sendDeletionEmail(insurer.users[0].email, insurer.users[0].name, "ADMIN")
  }

  // Notify Agents
  for (const agent of insurer.agents) {
    await sendDeletionEmail(agent.user.email, agent.user.name, "AGENT")
  }

  // Delete the company (cascades handle the rest)
  await prisma.insuranceCompany.delete({
    where: { id }
  })

  revalidatePath("/super-admin/insurers")
}

export async function updateInsurer(id: string, data: { name: string }) {
  await requireRole(["SUPER_ADMIN"])
  await prisma.insuranceCompany.update({
    where: { id },
    data
  })
  revalidatePath("/super-admin/insurers")
}
