import { NextRequest, NextResponse } from "next/server"
import { runDailyTriggerCheck } from "@/lib/triggerChecker"

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization")

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const summary = await runDailyTriggerCheck()
    return NextResponse.json({ success: true, summary })
  } catch (error) {
    console.error("Cron job failed:", error)
    return NextResponse.json({ error: "Trigger check failed" }, { status: 500 })
  }
}
