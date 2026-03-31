import { prisma } from "@/lib/prisma"
import { fetchRainfallData } from "@/lib/open-meteo"
import { sendEmailMessage, sendSMSMessage } from "@/lib/auth-utils"

const MONITORING_PERIOD_DAYS = 30

function extractCenterFromPolygon(polygonCoordinates: string): { lat: number; lng: number } | null {
  try {
    const coordinates = JSON.parse(polygonCoordinates) as { lat: number; lng: number }[]
    if (!coordinates || coordinates.length === 0) return null

    const lat = coordinates.reduce((sum, coordinate) => sum + coordinate.lat, 0) / coordinates.length
    const lng = coordinates.reduce((sum, coordinate) => sum + coordinate.lng, 0) / coordinates.length
    return { lat, lng }
  } catch {
    return null
  }
}

function getSeverity(totalMm: number, thresholdMm: number): "WARNING" | "SEVERE" {
  const percentage = thresholdMm === 0 ? 0 : (totalMm / thresholdMm) * 100
  return percentage <= 50 ? "SEVERE" : "WARNING"
}

function getFarmStatus(totalMm: number, thresholdMm: number): "HEALTHY" | "RISK" | "TRIGGERED" {
  const percentage = thresholdMm === 0 ? 0 : (totalMm / thresholdMm) * 100
  if (percentage <= 60) return "TRIGGERED"
  if (percentage <= 80) return "RISK"
  return "HEALTHY"
}

export async function runDailyTriggerCheck() {
  console.log(`\n[TriggerChecker] Starting - ${new Date().toISOString()}`)

  const now = new Date()
  const today = new Date(now.toDateString())

  const enrollments = await prisma.enrollment.findMany({
    where: {
      status: "ACTIVE",
      policy: {
        status: "ACTIVE",
        seasonStart: { lte: now },
        seasonEnd: { gte: now },
      },
    },
    include: {
      farm: true,
      farmer: {
        include: {
          user: true,
        },
      },
      policy: {
        include: {
          company: {
            include: {
              users: {
                where: { role: "INSURER" },
              },
            },
          },
        },
      },
    },
  })

  console.log(`[TriggerChecker] Processing ${enrollments.length} active enrollments`)

  let triggeredCount = 0
  let atRiskCount = 0
  let errorCount = 0

  for (const enrollment of enrollments) {
    try {
      const farm = enrollment.farm
      const policy = enrollment.policy

      let lat = farm.latitude
      let lng = farm.longitude

      if (typeof lat !== "number" || typeof lng !== "number") {
        const center = extractCenterFromPolygon(farm.polygonCoordinates)
        if (!center) {
          console.warn(`[TriggerChecker] No coordinates for farm ${farm.id} - skipping`)
          continue
        }

        lat = center.lat
        lng = center.lng

        await prisma.farm.update({
          where: { id: farm.id },
          data: { latitude: lat, longitude: lng },
        })
      }

      const rainfallData = await fetchRainfallData(lat, lng, MONITORING_PERIOD_DAYS)

      if (rainfallData.dailyRainfall.length === 0) {
        console.warn(`[TriggerChecker] No rainfall data for farm ${farm.id} - skipping`)
        errorCount++
        continue
      }

      const todayRainfall = rainfallData.dailyRainfall[rainfallData.dailyRainfall.length - 1] ?? 0
      const totalMm = rainfallData.totalMm
      const thresholdMm = policy.rainfallThreshold

      await prisma.rainfallReading.upsert({
        where: {
          farmId_date: {
            farmId: farm.id,
            date: today,
          },
        },
        update: {
          dailyMm: todayRainfall,
          cumulativeMm: totalMm,
          periodDays: MONITORING_PERIOD_DAYS,
        },
        create: {
          farmId: farm.id,
          date: today,
          dailyMm: todayRainfall,
          cumulativeMm: totalMm,
          periodDays: MONITORING_PERIOD_DAYS,
        },
      })

      const newStatus = getFarmStatus(totalMm, thresholdMm)
      const previousStatus = farm.status

      await prisma.farm.update({
        where: { id: farm.id },
        data: {
          status: newStatus,
          updatedAt: new Date(),
        },
      })

      console.log(
        `[TriggerChecker] Farm ${farm.id} (${farm.locationName}) - Rainfall: ${totalMm}mm / ${thresholdMm}mm - Status: ${previousStatus} -> ${newStatus}`
      )

      if (newStatus === previousStatus) continue

      if (newStatus === "RISK") {
        atRiskCount++

        if (enrollment.farmer.phone) {
          await sendSMSMessage(
            enrollment.farmer.phone,
            `FarmShield Warning: Rainfall on your ${farm.cropType} farm in ${farm.locationName} is below normal (${totalMm.toFixed(0)}mm recorded). Monitor your crops closely and contact your agent if needed.`
          )
        }

        for (const insurerUser of policy.company.users) {
          await sendEmailMessage({
            to: insurerUser.email,
            subject: `At Risk Alert - ${farm.locationName} (${farm.cropType})`,
            body: `Early warning for a farm under your policy "${policy.name}".\n\nFarmer: ${enrollment.farmer.user.name}\nFarm: ${farm.locationName}\nCrop: ${farm.cropType}\nAcreage: ${farm.acreage} acres\n\nRainfall recorded (${MONITORING_PERIOD_DAYS} days): ${totalMm.toFixed(1)}mm\nPolicy threshold: ${thresholdMm}mm\nStatus: AT RISK\n\nNo payout has been triggered yet. This is an early warning.`,
          })
        }
      }

      if (newStatus === "TRIGGERED") {
        const existingTrigger = await prisma.triggerEvent.findFirst({
          where: {
            enrollmentId: enrollment.id,
            status: { in: ["PENDING_APPROVAL", "APPROVED"] },
          },
        })

        if (existingTrigger) {
          console.log(`[TriggerChecker] Trigger already exists for enrollment ${enrollment.id} - skipping`)
          continue
        }

        triggeredCount++

        const severity = getSeverity(totalMm, thresholdMm)
        const payoutAmount = Number((farm.acreage * policy.payoutRate).toFixed(2))

        const triggerEvent = await prisma.triggerEvent.create({
          data: {
            policyId: policy.id,
            farmId: farm.id,
            enrollmentId: enrollment.id,
            rainfallRecorded: totalMm,
            thresholdMm,
            payoutAmount,
            severity,
            status: "PENDING_APPROVAL",
            dateTriggered: new Date(),
          },
        })

        await prisma.payout.create({
          data: {
            enrollmentId: enrollment.id,
            amount: payoutAmount,
            status: "PENDING",
          },
        })

        if (enrollment.farmer.phone) {
          await sendSMSMessage(
            enrollment.farmer.phone,
            `FarmShield Alert: A drought trigger has been detected on your ${farm.cropType} farm in ${farm.locationName}. Rainfall of ${totalMm.toFixed(0)}mm was recorded against a threshold of ${thresholdMm}mm. A payout of KES ${payoutAmount.toLocaleString()} is pending insurer approval.`
          )
        }

        for (const insurerUser of policy.company.users) {
          await sendEmailMessage({
            to: insurerUser.email,
            subject: `Payout Trigger - ${farm.locationName} (${severity})`,
            body: `A drought trigger has been detected for a farm under your policy "${policy.name}".\n\nFarmer: ${enrollment.farmer.user.name}\nPhone: ${enrollment.farmer.phone ?? "N/A"}\nFarm: ${farm.locationName}\nCrop: ${farm.cropType}\nAcreage: ${farm.acreage} acres\nSeverity: ${severity}\n\nRainfall recorded (${MONITORING_PERIOD_DAYS} days): ${totalMm.toFixed(1)}mm\nPolicy threshold: ${thresholdMm}mm\nPayout amount: KES ${payoutAmount.toLocaleString()}\n\nAction required: review and approve this payout.\nTrigger ID: ${triggerEvent.id}`,
          })
        }
      }
    } catch (error) {
      console.error(`[TriggerChecker] Error processing enrollment ${enrollment.id}:`, error)
      errorCount++
      continue
    }
  }

  const summary = {
    totalProcessed: enrollments.length,
    triggered: triggeredCount,
    atRisk: atRiskCount,
    errors: errorCount,
    completedAt: new Date().toISOString(),
  }

  console.log("[TriggerChecker] Complete:", summary)
  return summary
}
