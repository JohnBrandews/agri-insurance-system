import { cookies } from "next/headers"

export type SessionPayload = {
  id: string
  role: string
  email?: string
  companyId?: string | null
  exp: number
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = cookies()
  const token = cookieStore.get("farmshield_token")?.value

  if (!token) return null

  try {
    // Decode base64 MVP mock token
    const decoded = Buffer.from(token, 'base64').toString('ascii')
    const payload = JSON.parse(decoded) as SessionPayload

    if (Date.now() >= payload.exp) {
      return null // expired
    }

    return payload
  } catch (error) {
    return null
  }
}

export async function requireRole(requiredRoles: string[]) {
  const session = await getSession()
  if (!session || !requiredRoles.includes(session.role)) {
    throw new Error("Unauthorized Access")
  }
  return session
}
