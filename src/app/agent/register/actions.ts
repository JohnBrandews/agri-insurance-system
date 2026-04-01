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
  farmerPhotoUrl?: string | null
  farmPhotoUrl?: string | null
}) {
  const session = await requireRole(["AGENT"])

  const agent = await prisma.agent.findUnique({
    where: { userId: session.id }
  })

  if (!agent) throw new Error("Agent profile not found")

  // Robust validation
  if (!data.fullName?.trim()) throw new Error("Full name is required")
  if (!data.phone?.trim() || data.phone.length < 10) throw new Error("A valid phone number is required")
  if (!data.idNumber?.trim()) throw new Error("National ID number is required")
  if (!data.county) throw new Error("County is required")
  if (!data.constituency) throw new Error("Constituency is required")
  if (!data.policyId) throw new Error("Please select an active policy before submitting")

  if (!data.coordinates || data.coordinates.length < 3) {
    throw new Error("A farm boundary must have at least 3 GPS points")
  }

  if (!Number.isFinite(data.acreage) || data.acreage <= 0) {
    throw new Error("Farm acreage must be a valid number greater than zero. Did you complete the GPS tracking?")
  }

  const centerPoint = getFarmCenter(data.coordinates)
  const normalizedPhone = data.phone.replace(/\s+/g, "")

  await prisma.$transaction(async (tx) => {
    const policy = await tx.policy.findFirst({
      where: {
        id: data.policyId,
        companyId: agent.companyId,
        status: "ACTIVE",
      },
      select: {
        id: true,
        cropType: true,
        region: true,
      },
    })

    if (!policy) {
      throw new Error("The selected policy is no longer available. Please refresh and choose an active policy.")
    }

    let user = await tx.user.findUnique({ where: { email: `${normalizedPhone}@farmshield.local` } })
    if (!user) {
      user = await tx.user.create({
        data: {
          email: `${normalizedPhone}@farmshield.local`,
          password: "N/A",
          name: data.fullName,
          role: "FARMER",
          profileImageUrl: data.farmerPhotoUrl ?? null,
        }
      })
    } else {
      user = await tx.user.update({
        where: { id: user.id },
        data: {
          name: data.fullName,
          profileImageUrl: data.farmerPhotoUrl ?? user.profileImageUrl,
        }
      })
    }

    let farmer = await tx.farmer.findUnique({ where: { userId: user.id } })
    if (!farmer) {
      farmer = await tx.farmer.create({
        data: {
          userId: user.id,
          phone: normalizedPhone,
          agentId: agent.id
        }
      })
    } else {
      farmer = await tx.farmer.update({
        where: { id: farmer.id },
        data: {
          phone: normalizedPhone,
          agentId: agent.id,
        }
      })
    }

    const farm = await tx.farm.create({
      data: {
        farmerId: farmer.id,
        locationName: `${data.constituency}, ${data.county}`,
        acreage: data.acreage,
        cropType: data.cropType || policy.cropType,
        polygonCoordinates: JSON.stringify(data.coordinates),
        latitude: centerPoint.lat,
        longitude: centerPoint.lng,
        imageUrl: data.farmPhotoUrl ?? null,
        status: "HEALTHY"
      }
    })

    await tx.enrollment.create({
      data: {
        farmerId: farmer.id,
        farmId: farm.id,
        policyId: policy.id,
        status: "ACTIVE"
      }
    })
  })

  revalidatePath("/agent")
  revalidatePath("/super-admin")
  revalidatePath("/insurer")

  return { success: true }
}
