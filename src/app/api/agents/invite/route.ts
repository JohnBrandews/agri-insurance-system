import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateSetupToken, sendSetupEmail } from "@/lib/auth-utils"

export async function POST(req: Request) {
  try {
    const { name, email, region, companyId } = await req.json()

    if (!name || !email || !region || !companyId) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // 1. Create the Agent User
    const user = await prisma.user.create({
      data: {
        email,
        password: "N/A", // They must set it up
        name,
        role: "AGENT",
        companyId
      }
    })

    // 2. Create the Agent Profile
    await prisma.agent.create({
      data: {
        userId: user.id,
        companyId,
        region,
        status: "ACTIVE"
      }
    })

    // 3. Generate Setup Token (Expires in 24 hours)
    const setupToken = generateSetupToken()
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: setupToken,
        role: "AGENT",
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
      }
    })

    // 4. Send Mock Email
    await sendSetupEmail(email, setupToken, "agent")

    return NextResponse.json({ success: true, message: "Agent invited successfully. Email sent." })

  } catch (error: any) {
    console.error("Agent Invite Error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
