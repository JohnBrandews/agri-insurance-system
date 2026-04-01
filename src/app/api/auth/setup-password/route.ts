import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hashPassword } from "@/lib/auth-utils"

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
    
    const now = new Date()
    console.log(`[SETUP-PASSWORD]: Token verification for ${token.slice(0, 8)}...`)
    
    if (!setupToken) {
      console.error(`[SETUP-PASSWORD]: Token not found in database. (Search: ${token})`)
      return NextResponse.json({ success: false, error: "Setup token not found. It may have already been used or deleted." }, { status: 400 })
    }

    if (setupToken.type !== "SETUP") {
      console.warn(`[SETUP-PASSWORD]: Token found but type is ${setupToken.type}, not SETUP.`)
      return NextResponse.json({ success: false, error: "Invalid token type." }, { status: 400 })
    }

    if (setupToken.expires < now) {
      console.error(`[SETUP-PASSWORD]: Token expired at ${setupToken.expires.toISOString()} (Current time: ${now.toISOString()})`)
      return NextResponse.json({ success: false, error: "This setup link has expired. Please request a new invitation." }, { status: 400 })
    }

    // 2. Optional extra check: role matches
    if (setupToken.role && setupToken.role.toUpperCase() !== role.toUpperCase()) {
      console.warn(`[SETUP-PASSWORD]: Role mismatch. Expected ${setupToken.role}, received ${role}`)
      return NextResponse.json({ success: false, error: "Role mismatch for this token." }, { status: 403 })
    }

    // 3. Update the user's password
    const hashedPassword = hashPassword(password)
    const normalizedEmail = setupToken.identifier.toLowerCase().trim()
    
    await prisma.user.update({
      where: { email: normalizedEmail },
      data: { 
        password: hashedPassword
      }
    })

    // 4. Delete token
    await prisma.verificationToken.delete({ where: { id: setupToken.id } })

    return NextResponse.json({ success: true, message: "Password setup successfully." })

  } catch (error: any) {
    console.error("Setup Password Error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
