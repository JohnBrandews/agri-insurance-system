"use server"

import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/session"
import { revalidatePath } from "next/cache"

export async function updateInsurerStatus(id: string, status: "APPROVED" | "REJECTED") {
  await requireRole(["SUPER_ADMIN"])
  
  await prisma.insuranceCompany.update({
    where: { id },
    data: { status }
  })

  revalidatePath("/super-admin")
}
