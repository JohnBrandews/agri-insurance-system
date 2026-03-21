import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { fetchRainfallData } from "@/lib/open-meteo"

// Mock mapping polygon coordinate parsing (center logic)
function getCenterPoint(polygonJson: string) {
  // Mock logic assuming realistic JSON
  return { lat: -0.3, lon: 36.0 } // Nakuru default
}

export async function POST(req: Request) {
  try {
    // 1. Fetch all active enrollments that correspond to a policy
    const enrollments = await prisma.enrollment.findMany({
      where: { status: "ACTIVE" },
      include: {
        policy: true,
      }
    })

    let triggersCreated = 0

    // 2. Iterate and check weather
    for (const enrollment of enrollments) {
      if (!enrollment.policy) continue
      
      const farm = await prisma.farm.findUnique({ where: { id: enrollment.farmId } })
      if (!farm) continue

      const { lat, lon } = getCenterPoint(farm.polygonCoordinates)
      const rainfall = await fetchRainfallData(lat, lon)
      
      // Calculate deficit: A policy pays out if rainfall is BELOW the threshold
      if (rainfall < enrollment.policy.rainfallThreshold) {
        
        // Mark farm as triggered
        await prisma.farm.update({
          where: { id: farm.id },
          data: { status: "TRIGGERED" }
        })

        // Create Trigger Event
        await prisma.triggerEvent.create({
          data: {
            policyId: enrollment.policyId,
            rainfallRecorded: rainfall,
            severity: rainfall === 0 ? "SEVERE" : "WARNING",
          }
        })

        // Generate Payout
        const payoutAmount = farm.acreage * enrollment.policy.payoutRate
        await prisma.payout.create({
          data: {
            enrollmentId: enrollment.id,
            amount: payoutAmount,
            status: "PENDING"
          }
        })
        
        triggersCreated++
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Weather cron executed. Generated ${triggersCreated} triggers.`
    })
    
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
