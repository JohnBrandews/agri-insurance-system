import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { generateSetupToken, sendSetupEmail } from "@/lib/auth-utils"

export async function POST(req: Request) {
  try {
    const { name, email } = await req.json()
    const normalizedName = typeof name === "string" ? name.trim() : ""
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : ""

    if (!normalizedName || !normalizedEmail) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "A user with this email already exists" },
        { status: 409 }
      )
    }

    // Keep company/user/token creation atomic so we do not create a company if user creation fails.
    const setupToken = generateSetupToken()
    await prisma.$transaction(async (tx) => {
      const company = await tx.insuranceCompany.create({
        data: {
          name: normalizedName,
          status: "APPROVED"
        }
      })

      await tx.user.create({
        data: {
          email: normalizedEmail,
          password: "N/A",
          name: `Admin of ${normalizedName}`,
          role: "INSURER",
          companyId: company.id
        }
      })

      await tx.verificationToken.create({
        data: {
          identifier: normalizedEmail,
          token: setupToken,
          role: "INSURER",
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
        }
      })
    })

    await sendSetupEmail(normalizedEmail, setupToken, "insurer")

    return NextResponse.json({ success: true, message: "Insurer invited successfully. Email sent." })
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(
        { success: false, error: "A user with this email already exists" },
        { status: 409 }
      )
    }

    console.error("Insurer Invite Error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
