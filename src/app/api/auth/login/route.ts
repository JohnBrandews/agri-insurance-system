import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateOTP, sendSMS, hashPassword } from "@/lib/auth-utils"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // 1. Farmer Login Flow (OTP Generation)
    if (body.phone) {
      const farmer = await prisma.farmer.findFirst({
        where: { phone: body.phone },
        include: { user: true }
      })

      if (!farmer) {
        return NextResponse.json({ success: false, error: "Phone number not registered." }, { status: 404 })
      }

      // Generate 4-digit OTP
      const otp = generateOTP()
      
      // Store OTP in DB (expires in 10 minutes)
      await prisma.verificationToken.upsert({
        where: { token: otp },
        update: {
          identifier: body.phone,
          role: "FARMER",
          expires: new Date(Date.now() + 10 * 60000)
        },
        create: {
          identifier: body.phone,
          token: otp,
          role: "FARMER",
          expires: new Date(Date.now() + 10 * 60000) // 10 minutes
        }
      })

      // Send SMS via mock
      await sendSMS(body.phone, otp)

      return NextResponse.json({
        success: true,
        message: "OTP sent successfully."
      })
    }

    // 2. Admin / Insurer / Agent Login Flow (Password)
    if (body.email && body.password) {
      const user = await prisma.user.findUnique({
        where: { email: body.email }
      })

      // Hashing the comparison password
      const hashedPassword = hashPassword(body.password)

      if (!user || user.password !== hashedPassword) {
        return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 })
      }

      // In production, sign a secure JWT. For MVP, base64 encode minimal payload.
      const mockToken = Buffer.from(JSON.stringify({
        id: user.id,
        role: user.role,
        email: user.email,
        companyId: user.companyId,
        exp: Date.now() + 86400000 // 1 day
      })).toString('base64')

      return NextResponse.json({
        success: true,
        token: mockToken,
        user: {
          id: user.id,
          name: user.name,
          role: user.role
        }
      })
    }

    return NextResponse.json({ success: false, error: "Invalid request payload" }, { status: 400 })
    
  } catch (error: any) {
    console.error("Login API Error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
