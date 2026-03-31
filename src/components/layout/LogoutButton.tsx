"use client"

import { useRouter } from "next/navigation"
import { ReactNode, useTransition } from "react"

type LogoutButtonProps = {
  children: ReactNode
  className?: string
}

export default function LogoutButton({ children, className }: LogoutButtonProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleLogout = () => {
    startTransition(async () => {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/")
      router.refresh()
    })
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isPending}
      className={className}
    >
      {children}
    </button>
  )
}
