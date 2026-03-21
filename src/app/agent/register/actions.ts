"use server"

import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/session"
import { revalidatePath } from "next/cache"

export async function registerFarmer(data: {
  fullName: string
  phone: string
  idNumber: string
  policyId: string
  acreage: number
  cropType: string
  coordinates: { lat: number, lng: number }[]
}) {
  const session = await requireRole(["AGENT"])

  // 1. Get Agent details
  const agent = await prisma.agent.findUnique({
    where: { userId: session.id }
  })

  if (!agent) throw new Error("Agent profile not found")

  // 2. Create Farmer User
  let user = await prisma.user.findUnique({ where: { email: `${data.phone}@farmshield.local` } })
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: `${data.phone}@farmshield.local`,
        password: "N/A", // Uses OTP
        name: data.fullName,
        role: "FARMER"
      }
    })
  }

  // 3. Create Farmer Profile
  let farmer = await prisma.farmer.findUnique({ where: { userId: user.id } })
  if (!farmer) {
    farmer = await prisma.farmer.create({
      data: {
        userId: user.id,
        phone: data.phone,
        agentId: agent.id
      }
    })
  }

  // 4. Create Farm
  const farm = await prisma.farm.create({
    data: {
      farmerId: farmer.id,
      locationName: `Farm - ${data.idNumber}`,
      acreage: data.acreage,
      cropType: data.cropType,
      polygonCoordinates: JSON.stringify(data.coordinates),
      status: "HEALTHY"
    }
  })

  // 5. Enroll in Policy
  await prisma.enrollment.create({
    data: {
      farmerId: farmer.id,
      farmId: farm.id,
      policyId: data.policyId,
      status: "ACTIVE"
    }
  })

  revalidatePath("/agent")
  revalidatePath("/super-admin")
  revalidatePath("/insurer")

  return { success: true }
}
