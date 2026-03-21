import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { phone, otp } = await req.json()

    if (!phone || !otp) {
      return NextResponse.json({ success: false, error: "Missing parameters" }, { status: 400 })
    }

    // 1. Find valid non-expired OTP
    const tokenRecord = await prisma.verificationToken.findFirst({
      where: {
        identifier: phone,
        token: otp,
        type: "OTP",
        expires: { gt: new Date() } // Must not be expired
      }
    })

    if (!tokenRecord) {
      return NextResponse.json({ success: false, error: "Invalid or expired OTP." }, { status: 401 })
    }

    // 2. Locate the Farmer
    const farmer = await prisma.farmer.findFirst({
      where: { phone: phone },
      include: { user: true }
    })

    if (!farmer || !farmer.user) {
      return NextResponse.json({ success: false, error: "User not found." }, { status: 404 })
    }

    // 3. Delete OTP record so it can't be reused
    await prisma.verificationToken.delete({
      where: { id: tokenRecord.id }
    })

    // 4. Generate Login session (Mock JWT)
    const mockToken = Buffer.from(JSON.stringify({
      id: farmer.user.id,
      role: farmer.user.role,
      email: farmer.user.email,
      exp: Date.now() + 86400000 // 1 day
    })).toString('base64')

    return NextResponse.json({
      success: true,
      token: mockToken,
      user: {
        id: farmer.user.id,
        name: farmer.user.name,
        role: farmer.user.role
      }
    })

  } catch (error: any) {
    console.error("OTP Verification Error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
