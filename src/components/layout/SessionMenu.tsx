"use client"

import Link from "next/link"
import { useState } from "react"
import LogoutButton from "./LogoutButton"

type SessionMenuProps = {
  name: string
  imageUrl?: string | null
  dashboardHref: string
}

export default function SessionMenu({ name, imageUrl, dashboardHref }: SessionMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-2 py-2 text-white backdrop-blur-md"
      >
        <div className="h-9 w-9 overflow-hidden rounded-full border border-white/40 bg-white/20 flex items-center justify-center text-sm font-bold">
          {imageUrl ? (
            <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
          ) : (
            <span>{initials}</span>
          )}
        </div>
        <span className="hidden sm:block text-sm font-semibold max-w-32 truncate">{name}</span>
      </button>

      {isOpen && (
        <div className="absolute left-0 sm:left-auto sm:right-0 mt-3 w-48 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl z-50">
          <Link
            href={dashboardHref}
            onClick={() => setIsOpen(false)}
            className="block px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Back to Dashboard
          </Link>
          <LogoutButton className="block w-full px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50">
            Log Out
          </LogoutButton>
        </div>
      )}
    </div>
  )
}
