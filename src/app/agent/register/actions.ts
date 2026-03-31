"use server"

import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/session"
import { revalidatePath } from "next/cache"

function getFarmCenter(coordinates: { lat: number; lng: number }[]) {
  const totals = coordinates.reduce(
    (acc, coordinate) => {
      acc.lat += coordinate.lat
      acc.lng += coordinate.lng
      return acc
    },
    { lat: 0, lng: 0 }
  )

  return {
    lat: totals.lat / coordinates.length,
    lng: totals.lng / coordinates.length,
  }
}

export async function registerFarmer(data: {
  fullName: string
  phone: string
  idNumber: string
  policyId: string
  county: string
  constituency: string
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

  if (data.coordinates.length < 3) {
    throw new Error("A farm boundary must have at least 3 GPS points")
  }

  const centerPoint = getFarmCenter(data.coordinates)

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
      locationName: `${data.constituency}, ${data.county}`,
      acreage: data.acreage,
      cropType: data.cropType,
      polygonCoordinates: JSON.stringify(data.coordinates),
      latitude: centerPoint.lat,
      longitude: centerPoint.lng,
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
