import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { token, password, role } = await req.json()

    if (!token || !password) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // 1. Verify token exists & hasn't expired
    const setupToken = await prisma.verificationToken.findUnique({
      where: { token }
    })

    if (!setupToken || setupToken.type !== "SETUP" || setupToken.expires < new Date()) {
      return NextResponse.json({ success: false, error: "Invalid or expired setup token" }, { status: 400 })
    }

    // 2. Optional extra check: role matches
    if (setupToken.role !== role) {
      return NextResponse.json({ success: false, error: "Role mismatch for this token" }, { status: 403 })
    }

    // 3. Update the user's password (by locating the user via email)
    const user = await prisma.user.update({
      where: { email: setupToken.identifier },
      data: { password } // Update directly for MVP
    })

    // 4. Delete token
    await prisma.verificationToken.delete({ where: { id: setupToken.id } })

    return NextResponse.json({ success: true, message: "Password setup gracefully." })

  } catch (error: any) {
    console.error("Setup Password Error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
