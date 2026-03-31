import { NextResponse } from "next/server"
import { runDailyTriggerCheck } from "@/lib/triggerChecker"

export async function POST(req: Request) {
  try {
    const summary = await runDailyTriggerCheck()
    return NextResponse.json({ 
      success: true, 
      summary,
    })
    
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
