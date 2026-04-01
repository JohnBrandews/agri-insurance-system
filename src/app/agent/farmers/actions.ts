"use server"

import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/session"
import { revalidatePath } from "next/cache"

export async function deleteFarmer(farmerId: string) {
  const session = await requireRole(["AGENT"])

  const agent = await prisma.agent.findUnique({
    where: { userId: session.id }
  })

  if (!agent) throw new Error("Agent profile not found")

  // 1. Verify the farmer belongs to this agent
  const farmer = await prisma.farmer.findFirst({
    where: {
      id: farmerId,
      agentId: agent.id
    },
    include: {
      enrollments: {
        select: { id: true }
      }
    }
  })

  if (!farmer) {
    throw new Error("Farmer not found or you don't have permission to delete them.")
  }

  const enrollmentIds = farmer.enrollments.map(e => e.id)

  await prisma.$transaction(async (tx) => {
    // 2. Delete Payouts manually as they don't have cascade delete in schema
    if (enrollmentIds.length > 0) {
      await tx.payout.deleteMany({
        where: {
          enrollmentId: { in: enrollmentIds }
        }
      })
    }

    // 3. Delete the User record. 
    // This will cascade to Farmer -> Farm -> Enrollment -> TriggerEvent -> RainfallReading
    await tx.user.delete({
      where: { id: farmer.userId }
    })
  })

  revalidatePath("/agent/farmers")
  revalidatePath("/insurer/farmers")
  revalidatePath("/super-admin/analytics")

  return { success: true }
}
