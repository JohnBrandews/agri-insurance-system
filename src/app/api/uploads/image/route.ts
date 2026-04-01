import crypto from "crypto"
import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"

const FOLDERS = {
  farmer: "agri-insurance-system/farmers",
  farm: "agri-insurance-system/farms",
} as const

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json({ success: false, error: "Cloudinary is not configured" }, { status: 500 })
    }

    const formData = await request.formData()
    const file = formData.get("file")
    const kind = formData.get("kind")

    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, error: "No image file provided" }, { status: 400 })
    }

    if (kind !== "farmer" && kind !== "farm") {
      return NextResponse.json({ success: false, error: "Invalid upload type" }, { status: 400 })
    }

    const folder = FOLDERS[kind]
    const timestamp = Math.floor(Date.now() / 1000)
    const publicId = `${kind}-${session.id}-${timestamp}`
    const signaturePayload = `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}${apiSecret}`
    const signature = crypto.createHash("sha1").update(signaturePayload).digest("hex")

    const uploadFormData = new FormData()
    uploadFormData.append("file", file)
    uploadFormData.append("api_key", apiKey)
    uploadFormData.append("timestamp", String(timestamp))
    uploadFormData.append("folder", folder)
    uploadFormData.append("public_id", publicId)
    uploadFormData.append("signature", signature)

    const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: uploadFormData,
    })

    const uploadResult = await uploadResponse.json()
    if (!uploadResponse.ok) {
      return NextResponse.json(
        { success: false, error: uploadResult?.error?.message ?? "Cloudinary upload failed" },
        { status: 500 }
      )
    }

    const imageUrl = uploadResult.secure_url as string | undefined
    if (!imageUrl) {
      return NextResponse.json({ success: false, error: "Upload completed without image URL" }, { status: 500 })
    }

    return NextResponse.json({ success: true, imageUrl })
  } catch (error) {
    console.error("Image upload error:", error)
    return NextResponse.json({ success: false, error: "Failed to upload image" }, { status: 500 })
  }
}
