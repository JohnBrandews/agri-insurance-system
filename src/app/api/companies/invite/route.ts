import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateSetupToken, sendSetupEmail } from "@/lib/auth-utils"

export async function POST(req: Request) {
  try {
    const { name, email } = await req.json()

    if (!name || !email) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // 1. Create Insurance Company
    const company = await prisma.insuranceCompany.create({
      data: {
        name,
        status: "APPROVED" // Pre-approved when admin invites them
      }
    })

    // 2. Create the Insurer User (without password initially)
    const user = await prisma.user.create({
      data: {
        email,
        password: "N/A", // They must set it up
        name: `Admin of ${name}`,
        role: "INSURER",
        companyId: company.id
      }
    })

    // 3. Generate Setup Token (Expires in 24 hours)
    const setupToken = generateSetupToken()
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: setupToken,
        role: "INSURER",
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
      }
    })

    // 4. Send Mock Email (Brevo integration placeholder)
    await sendSetupEmail(email, setupToken, "insurer")

    return NextResponse.json({ success: true, message: "Insurer invited successfully. Email sent." })

  } catch (error: any) {
    console.error("Insurer Invite Error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
